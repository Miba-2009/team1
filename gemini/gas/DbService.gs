/**
 * DB操作をaction別に振り分ける。値はJSONとしてスプレッドシートへ保存する。
 * @param {string} action 例: 'add'
 * @param {Object} payload 例: {namespace:'team-a',key:'score',value:10}
 * @returns {Object} 操作結果例: {key:'score',value:10}
 * @throws {ApiError} 未対応action、入力不正、DB処理失敗の場合。
 */
function handleDbRequest_(action, payload) {
  const namespace = normalizeNamespace_(payload.namespace);
  if (action === 'list') return dbList_(namespace, payload.prefix || '', payload.limit);
  if (action === 'keys') return dbKeys_(namespace);
  const key = requireString_(payload.key, 'key', CONFIG.MAX_KEY_LENGTH);
  if (action === 'add') return dbWrite_(namespace, key, payload.value, false);
  if (action === 'set') return dbWrite_(namespace, key, payload.value, true);
  if (action === 'get') return dbGet_(namespace, key);
  if (action === 'remove') return dbRemove_(namespace, key);
  throw new ApiError_('UNKNOWN_ACTION', '未対応のDB actionです: ' + action);
}

/**
 * namespaceを検証して返す。
 * @param {string|undefined} namespace 例: 'team-a'
 * @returns {string} 例: 'team-a'。省略時は'default'。
 * @throws {ApiError} 100文字超、空白のみの場合（code: INVALID_ARGUMENT）。
 */
function normalizeNamespace_(namespace) {
  return namespace === undefined ? 'default' : requireString_(namespace, 'namespace', 100);
}

/**
 * DBに新規追加または上書きする。
 * @param {string} namespace 例: 'team-a'
 * @param {string} key 例: 'score'
 * @param {*} value 例: {point:10}
 * @param {boolean} overwrite 例: false（add）、true（set）
 * @returns {{key:string,value:*,createdAt:string,updatedAt:string}} 例: {key:'score',value:{point:10},createdAt:'2026-07-17T00:00:00.000Z',updatedAt:'...'}
 * @throws {ApiError} undefined、JSON化不能、長すぎる値、add時の重複、ロック失敗の場合。
 */
function dbWrite_(namespace, key, value, overwrite) {
  if (value === undefined) throw new ApiError_('INVALID_ARGUMENT', 'valueを指定してください。');
  let valueJson;
  try { valueJson = JSON.stringify(value); } catch (error) {
    throw new ApiError_('INVALID_ARGUMENT', 'valueをJSONに変換できません。');
  }
  if (valueJson === undefined || valueJson.length > CONFIG.MAX_VALUE_CHARS) {
    throw new ApiError_('INVALID_ARGUMENT', 'valueはJSON換算で' + CONFIG.MAX_VALUE_CHARS + '文字以下にしてください。');
  }
  return withDbLock_(function() {
    const sheet = getDbSheet_();
    const row = findDbRow_(sheet, namespace, key);
    if (row && !overwrite) throw new ApiError_('ALREADY_EXISTS', '同じkeyが既に存在します。setで上書きできます。');
    const now = new Date().toISOString();
    const createdAt = row ? String(sheet.getRange(row, 4).getValue()) : now;
    const values = [[namespace, key, valueJson, createdAt, now]];
    const target = row ? sheet.getRange(row, 1, 1, 5) : sheet.getRange(sheet.getLastRow() + 1, 1, 1, 5);
    target.setNumberFormat('@').setValues(values);
    return { key: key, value: value, createdAt: createdAt, updatedAt: now };
  });
}

/**
 * DBから1件取得する。
 * @param {string} namespace 例: 'team-a'
 * @param {string} key 例: 'score'
 * @returns {{key:string,value:*,createdAt:string,updatedAt:string}|null} 存在例: {key:'score',value:10,...}、不存在例: null
 * @throws {ApiError} 保存JSONが破損、またはDBロックを取得できない場合（code: DB_DATA_ERROR/DB_BUSY）。
 */
function dbGet_(namespace, key) {
  return withDbLock_(function() {
    const sheet = getDbSheet_();
    const row = findDbRow_(sheet, namespace, key);
    return row ? rowToRecord_(sheet.getRange(row, 1, 1, 5).getValues()[0]) : null;
  });
}

/**
 * DBから1件削除する。
 * @param {string} namespace 例: 'team-a'
 * @param {string} key 例: 'score'
 * @returns {{removed:boolean,key:string}} 削除例: {removed:true,key:'score'}
 * @throws {ApiError} DBロックを取得できない場合（code: DB_BUSY）。
 */
function dbRemove_(namespace, key) {
  return withDbLock_(function() {
    const sheet = getDbSheet_();
    const row = findDbRow_(sheet, namespace, key);
    if (row) sheet.deleteRow(row);
    return { removed: Boolean(row), key: key };
  });
}

/**
 * namespace内をprefixで絞って一覧取得する。
 * @param {string} namespace 例: 'team-a'
 * @param {string} prefix 例: 'user-'
 * @param {number|undefined} requestedLimit 例: 50
 * @returns {{items:Array,total:number}} 例: {items:[{key:'user-1',value:'Aoi'}],total:1}
 * @throws {ApiError} limitが1〜100の整数でない、保存JSON破損、またはDBロックを取得できない場合。
 */
function dbList_(namespace, prefix, requestedLimit) {
  const limit = requestedLimit === undefined ? CONFIG.MAX_LIST_LIMIT : Number(requestedLimit);
  if (!Number.isInteger(limit) || limit < 1 || limit > CONFIG.MAX_LIST_LIMIT) {
    throw new ApiError_('INVALID_ARGUMENT', 'limitは1〜' + CONFIG.MAX_LIST_LIMIT + 'の整数にしてください。');
  }
  return withDbLock_(function() {
    const sheet = getDbSheet_();
    if (sheet.getLastRow() < 2) return { items: [], total: 0 };
    const rows = sheet.getRange(2, 1, sheet.getLastRow() - 1, 5).getValues();
    const matching = rows.filter(function(row) {
      return String(row[0]) === namespace && String(row[1]).indexOf(String(prefix)) === 0;
    });
    return { items: matching.slice(0, limit).map(rowToRecord_), total: matching.length };
  });
}

/**
 * namespace内に保存されたキーだけを、文字列の配列として取得する。
 * @param {string} namespace 例: 'chat-archives'
 * @returns {{keys:Array<string>,total:number}} 例: {keys:['1784688000123','1784688000456'],total:2}
 * @throws {ApiError} DBロックを取得できない場合（code: DB_BUSY）。
 */
function dbKeys_(namespace) {
  return withDbLock_(function() {
    const sheet = getDbSheet_();
    if (sheet.getLastRow() < 2) return { keys: [], total: 0 };
    const rows = sheet.getRange(2, 1, sheet.getLastRow() - 1, 2).getValues();
    const keys = rows
      .filter(function(row) { return String(row[0]) === namespace; })
      .map(function(row) { return String(row[1]); });
    return { keys: keys, total: keys.length };
  });
}

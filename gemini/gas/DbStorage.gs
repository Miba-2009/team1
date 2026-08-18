/**
 * DB用スプレッドシートとシートを取得し、未作成なら自動作成する。
 * @returns {GoogleAppsScript.Spreadsheet.Sheet} 例: 名前が'HackathonDB'のシート。
 * @throws {ApiError} 指定IDを開けない、または作成権限がない場合（code: DB_SETUP_ERROR）。
 */
function getDbSheet_() {
  const properties = PropertiesService.getScriptProperties();
  let spreadsheetId = properties.getProperty('DB_SPREADSHEET_ID');
  let spreadsheet;
  try {
    if (spreadsheetId) {
      spreadsheet = SpreadsheetApp.openById(spreadsheetId);
    } else {
      spreadsheet = SpreadsheetApp.create('Hackathon Web App Database');
      spreadsheetId = spreadsheet.getId();
      properties.setProperty('DB_SPREADSHEET_ID', spreadsheetId);
    }
  } catch (error) {
    throw new ApiError_('DB_SETUP_ERROR', 'DBスプレッドシートを開けません。DB_SPREADSHEET_IDを確認してください。');
  }
  let sheet = spreadsheet.getSheetByName(CONFIG.DB_SHEET_NAME);
  if (!sheet) {
    sheet = spreadsheet.insertSheet(CONFIG.DB_SHEET_NAME);
    sheet.getRange(1, 1, 1, 5).setValues([['namespace', 'key', 'valueJson', 'createdAt', 'updatedAt']]);
    sheet.setFrozenRows(1);
  } else if (sheet.getLastRow() === 0) {
    sheet.getRange(1, 1, 1, 5).setValues([['namespace', 'key', 'valueJson', 'createdAt', 'updatedAt']]);
    sheet.setFrozenRows(1);
  }
  return sheet;
}

/**
 * ログ用DBスプレッドシートとシートを取得し、未作成なら自動作成する。
 * @returns {GoogleAppsScript.Spreadsheet.Sheet} 例: 名前が'HackathonDB'のシート。
 * @throws {ApiError} 指定IDを開けない、または作成権限がない場合（code: DB_SETUP_ERROR）。
 */
function getLogSheet_(){
  const properties = PropertiesService.getScriptProperties();
  let spreadsheetId = properties.getProperty('DB_SPREADSHEET_ID');
  let spreadsheet;
  try {
    if (spreadsheetId) {
      spreadsheet = SpreadsheetApp.openById(spreadsheetId);
    } else {
      spreadsheet = SpreadsheetApp.create('Hackathon Web App Database');
      spreadsheetId = spreadsheet.getId();
      properties.setProperty('DB_SPREADSHEET_ID', spreadsheetId);
    }
  } catch (error) {
    throw new ApiError_('DB_SETUP_ERROR', 'DBスプレッドシートを開けません。DB_SPREADSHEET_IDを確認してください。');
  }
  let sheet = spreadsheet.getSheetByName(CONFIG.DB_LOG_SHEET_NAME);
  if (!sheet) {
    sheet = spreadsheet.insertSheet(CONFIG.DB_LOG_SHEET_NAME);
    sheet.getRange(1, 1, 1, 3).setValues([['logLevel', 'valueJson', 'At']]);
    sheet.setFrozenRows(1);
  } else if (sheet.getLastRow() === 0) {
    sheet.getRange(1, 1, 1, 3).setValues([['logLevel', 'valueJson', 'At']]);
    sheet.setFrozenRows(1);
  }
  return sheet;
}

/**
 * namespaceとkeyが一致する行番号を探す。
 * @param {GoogleAppsScript.Spreadsheet.Sheet} sheet 例: getDbSheet_()の返り値
 * @param {string} namespace 例: 'team-a'
 * @param {string} key 例: 'score'
 * @returns {number|null} 発見例: 2、不存在例: null
 * @throws シート読み取り権限がない場合はApps Script例外。
 */
function findDbRow_(sheet, namespace, key) {
  const lastRow = sheet.getLastRow();
  if (lastRow < 2) return null;
  const pairs = sheet.getRange(2, 1, lastRow - 1, 2).getValues();
  for (let index = 0; index < pairs.length; index += 1) {
    if (String(pairs[index][0]) === namespace && String(pairs[index][1]) === key) return index + 2;
  }
  return null;
}

/**
 * スプレッドシート1行をAPI用レコードへ変換する。
 * @param {Array} row 例: ['team-a','score','10','2026-07-17T00:00:00.000Z','2026-07-17T00:00:00.000Z']
 * @returns {{key:string,value:*,createdAt:string,updatedAt:string}} 例: {key:'score',value:10,createdAt:'...',updatedAt:'...'}
 * @throws {ApiError} valueJsonが壊れている場合（code: DB_DATA_ERROR）。
 */
function rowToRecord_(row) {
  try {
    return { key: String(row[1]), value: JSON.parse(String(row[2])), createdAt: String(row[3]), updatedAt: String(row[4]) };
  } catch (error) {
    throw new ApiError_('DB_DATA_ERROR', '保存データのJSONが壊れています。key: ' + row[1]);
  }
}

/**
 * DB更新処理を排他ロック内で実行する。
 * @param {Function} task 例: function(){ return {saved:true}; }
 * @returns {*} taskの返り値例: {saved:true}
 * @throws {ApiError} 10秒以内にロックできない場合（code: DB_BUSY）。task内の例外もそのまま返す。
 */
function withDbLock_(task) {
  const lock = LockService.getScriptLock();
  if (!lock.tryLock(10000)) throw new ApiError_('DB_BUSY', 'DBが混み合っています。少し待って再試行してください。');
  try {
    return task();
  } finally {
    lock.releaseLock();
  }
}

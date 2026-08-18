/**
 * 値をJSONレスポンスとして返す。
 * @param {*} value 例: {ok:true,data:{status:'ready'}}
 * @returns {GoogleAppsScript.Content.TextOutput} Content-Typeがapplication/jsonのレスポンス。
 * @throws {TypeError} 循環参照などJSON.stringifyできない値の場合。
 */
function jsonOutput_(value) {
  return ContentService.createTextOutput(JSON.stringify(value))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * 必須文字列を検証し、前後空白を除いて返す。
 * @param {*} value 例: '  score  '
 * @param {string} name 例: 'key'
 * @param {number} maxLength 例: 200
 * @returns {string} 例: 'score'
 * @throws {ApiError} 空文字、文字列以外、長すぎる場合（code: INVALID_ARGUMENT）。
 */
function requireString_(value, name, maxLength) {
  if (typeof value !== 'string' || !value.trim()) {
    throw new ApiError_('INVALID_ARGUMENT', name + 'は空でない文字列にしてください。');
  }
  const trimmed = value.trim();
  if (trimmed.length > maxLength) {
    throw new ApiError_('INVALID_ARGUMENT', name + 'は' + maxLength + '文字以下にしてください。');
  }
  return trimmed;
}

/**
 * Base64文字列のおおよその元バイト数を求める。
 * @param {string} base64 例: 'SGVsbG8='
 * @returns {number} 例: 5
 * @throws {TypeError} base64が文字列でない場合。
 */
function base64ByteLength_(base64) {
  if (typeof base64 !== 'string') throw new TypeError('base64は文字列で指定してください。');
  const padding = (base64.match(/=*$/) || [''])[0].length;
  return Math.floor(base64.length * 3 / 4) - padding;
}

/**
 * 受信したrole名をGemini用へ変換する。
 * @param {string} role 例: 'assistant'
 * @returns {string} 例: 'model'
 * @throws {ApiError} user/assistant/model以外の場合（code: INVALID_ARGUMENT）。
 */
function normalizeRole_(role) {
  if (role === 'assistant' || role === 'model') return 'model';
  if (role === 'user') return 'user';
  throw new ApiError_('INVALID_ARGUMENT', 'roleはuserまたはassistantにしてください。');
}
/**
 * ログをスプレッドシートに記述する。例外は握りつぶされます。
 * @param {string} ログ内容 例 "get content !"
 * @param {string} ログのレベル 例外"normal",1
 * @return 記述に成功したか  例:{ok:false,error:"valueをJSONに変換できません。"}
 */
function addLog(stringValue,logLevel){
  if (stringValue === undefined) return {ok:false,error:"stringValue is undefinded"};
  if (stringValue === null) return {ok:false,error:"stringValue is null"};
  let valueJson;
  if(typeof stringValue === 'string'){
    valueJson = stringValue;
  }
  else{
    try { valueJson = JSON.stringify(value); } catch (error) {
    return {ok:false,error:'INVALID_ARGUMENT valueをJSONに変換できません。'};
    }
  }
  
  if (valueJson === undefined || valueJson.length > CONFIG.MAX_VALUE_CHARS) {
    return {ok:false,error:'INVALID_ARGUMENT valueはJSON換算で' + CONFIG.MAX_VALUE_CHARS + '文字以下にしてください。'};
  }
  return withDbLock_(function() {
    const logSheet = getLogSheet_();
    const now = new Date().toISOString();
    const values = [[logLevel, valueJson, now]];
    const target = logSheet.getRange(logSheet.getLastRow() + 1, 1, 1, 3);
    target.setNumberFormat('@').setValues(values);
    return { ok:true,error:""};
  });
}

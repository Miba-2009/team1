/**
 * 運営者向け設定。APIキーなどの秘密情報はここへ直接書かず、
 * GASの「プロジェクトの設定 > スクリプト プロパティ」に保存する。
 * 必須: GEMINI_API_KEY
 * 任意: GEMINI_MODEL, DB_SPREADSHEET_ID, ACCESS_TOKEN
 */
const CONFIG = Object.freeze({
  API_VERSION: 1,
  DEFAULT_AI_PROVIDER: 'gemini',
  DEFAULT_GEMINI_MODEL: 'gemini-3.5-flash',
  DB_SHEET_NAME: 'HackathonDB',
  DB_LOG_SHEET_NAME:'HackathonLogDB',
  MAX_KEY_LENGTH: 200,
  MAX_VALUE_CHARS: 40000,
  MAX_LIST_LIMIT: 100,
  MAX_INLINE_FILE_BYTES: 20 * 1024 * 1024
});

/**
 * API向けのcode付きエラーを作る。
 * @param {string} code 例: 'NOT_FOUND'
 * @param {string} message 例: 'データがありません。'
 * @returns {Error} 例: Errorにcode='NOT_FOUND'が追加されたもの。
 * @throws 通常は例外を発生させない（newを付けずに呼んでも動作）。
 */
function ApiError_(code, message) {
  const error = new Error(message);
  error.name = 'ApiError';
  error.code = code;
  return error;
}

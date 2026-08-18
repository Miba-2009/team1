/**
 * GitHub PagesなどからのPOSTを受け取る入口。
 * @param {GoogleAppsScript.Events.DoPost} e 例: {postData:{contents:'{"service":"db","action":"get","payload":{"key":"name"}}'}}
 * @returns {GoogleAppsScript.Content.TextOutput} JSON例: {"ok":true,"data":{"key":"name","value":"Aoi"}}
 * @throws 例外は外へ投げず、入力不正や各サービス失敗をok:falseのJSONとして返す。
 */
function doPost(e) {
  try {
    const request = parseRequest_(e);
    verifyRequest_(request);
    verifyToken_(request.token);
    const data = routeRequest_(request);
    return jsonOutput_({ ok: true, data: data });
  } catch (error) {
    console.error(error.stack || error);
    return jsonOutput_({
      ok: false,
      error: { code: error.code || 'INTERNAL_ERROR', message: error.message || '処理に失敗しました。' }
    });
  }
}

/**
 * ブラウザでURLを開いたときに稼働状態を返す。
 * @param {GoogleAppsScript.Events.DoGet} e 例: {parameter:{}}
 * @returns {GoogleAppsScript.Content.TextOutput} JSON例: {"ok":true,"data":{"status":"ready"}}
 * @throws 通常は例外を発生させない。
 */
function doGet(e) {
  return jsonOutput_({ ok: true, data: { status: 'ready', apiVersion: CONFIG.API_VERSION } });
}

/**
 * serviceを見てAIまたはDB処理へ振り分ける。
 * @param {{service:string,action:string,payload:Object}} request 例: {service:'ai',action:'chat',payload:{messages:[]}}
 * @returns {*} サービスの結果例: {text:'こんにちは'}
 * @throws {ApiError} 未対応serviceの場合（code: UNKNOWN_SERVICE）。
 */
function routeRequest_(request) {
  const routes = {
    ai: handleAiRequest_,
    db: handleDbRequest_
  };
  const handler = routes[request.service];
  if (!handler) throw new ApiError_('UNKNOWN_SERVICE', '未対応のserviceです: ' + request.service);
  return handler(request.action, request.payload || {});
}

/**
 * 受信イベントからJSONを取り出す。
 * @param {GoogleAppsScript.Events.DoPost} e 例: {postData:{contents:'{"service":"db","action":"list"}'}}
 * @returns {Object} 解析結果例: {service:'db',action:'list'}
 * @throws {ApiError} 本文なし、JSON構文エラーの場合（code: INVALID_JSON）。
 */
function parseRequest_(e) {
  if (!e || !e.postData || !e.postData.contents) {
    throw new ApiError_('INVALID_JSON', 'リクエスト本文がありません。');
  }
  try {
    return JSON.parse(e.postData.contents);
  } catch (error) {
    throw new ApiError_('INVALID_JSON', 'JSONの形式が正しくありません。');
  }
}

/**
 * 共通リクエスト項目を検証する。
 * @param {Object} request 例: {version:1,service:'db',action:'get'}
 * @returns {void} 成功例: undefined
 * @throws {ApiError} version、service、actionが不正な場合（code: INVALID_REQUEST/UNSUPPORTED_VERSION）。
 */
function verifyRequest_(request) {
  if (!request || typeof request.service !== 'string' || typeof request.action !== 'string') {
    throw new ApiError_('INVALID_REQUEST', 'serviceとactionが必要です。');
  }
  if ((request.version || 1) !== CONFIG.API_VERSION) {
    throw new ApiError_('UNSUPPORTED_VERSION', '未対応のAPIバージョンです。');
  }
}

/**
 * ACCESS_TOKENが設定されている場合だけ合言葉を照合する。
 * @param {string|undefined} suppliedToken 例: 'hackathon-2026'
 * @returns {void} 一致時の例: undefined
 * @throws {ApiError} 不一致の場合（code: UNAUTHORIZED）。
 */
function verifyToken_(suppliedToken) {
  const expected = PropertiesService.getScriptProperties().getProperty('ACCESS_TOKEN');
  if (expected && suppliedToken !== expected) throw new ApiError_('UNAUTHORIZED', '合言葉が正しくありません。');
}

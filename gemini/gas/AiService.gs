/**
 * AI操作をaction別に振り分ける。
 * @param {string} action 例: 'chat'
 * @param {Object} payload 例: {messages:[{role:'user',content:'こんにちは'}]}
 * @returns {{text:string,provider:string,model:string,usage:Object}} 例: {text:'こんにちは！',provider:'gemini',model:'gemini-3.5-flash',usage:{}}
 * @throws {ApiError} 未対応action/provider、入力不正、外部API失敗の場合。
 */
function handleAiRequest_(action, payload) {
  const providerName = payload.provider || CONFIG.DEFAULT_AI_PROVIDER;
  const provider = getAiProvider_(providerName);
  if (action === 'chat') return provider.chat(payload);
  if (action === 'transcript') return provider.transcript(payload);
  throw new ApiError_('UNKNOWN_ACTION', '未対応のAI actionです: ' + action);
}

/**
 * AIプロバイダー名から実装を返す。今後AIを増やす場合はこの表へ追加する。
 * @param {string} name 例: 'gemini'
 * @returns {{chat:Function,transcript:Function}} 例: {chat:geminiChat_,transcript:geminiTranscript_}
 * @throws {ApiError} 未登録名の場合（code: UNKNOWN_PROVIDER）。
 */
function getAiProvider_(name) {
  const providers = {
    gemini: { chat: geminiChat_, transcript: geminiTranscript_ }
    // 追加例: openai: { chat: openAiChat_, transcript: openAiTranscript_ }
  };
  if (!providers[name]) throw new ApiError_('UNKNOWN_PROVIDER', '未対応のAI providerです: ' + name);
  return providers[name];
}

/**
 * Geminiへ会話履歴を送る。
 * @param {{messages:Array,model?:string,generationConfig?:Object,systemInstruction?:string}} payload 例: {messages:[{role:'user',content:'空はなぜ青い？'}]}
 * @returns {{text:string,provider:string,model:string,usage:Object}} 例: {text:'光の散乱が…',provider:'gemini',model:'gemini-3.5-flash',usage:{promptTokenCount:10}}
 * @throws {ApiError} messages不正、APIキーなし、Gemini API失敗の場合。
 */
function geminiChat_(payload) {
  if (!Array.isArray(payload.messages) || payload.messages.length === 0) {
    throw new ApiError_('INVALID_ARGUMENT', 'messagesを1件以上指定してください。');
  }
  const body = {
    contents: payload.messages.map(function(message) {
      return { role: normalizeRole_(message.role), parts: [{ text: requireString_(message.content, 'content', 30000) }] };
    })
  };
  if (payload.systemInstruction) body.systemInstruction = { parts: [{ text: String(payload.systemInstruction) }] };
  if (payload.generationConfig) body.generationConfig = sanitizeGenerationConfig_(payload.generationConfig);
  return callGemini_(payload.model, body);
}

/**
 * GeminiへBase64音声を送り、日本語の文字起こしを依頼する。
 * @param {{data:string,mimeType:string,prompt?:string,model?:string}} payload 例: {data:'UklGR...',mimeType:'audio/webm'}
 * @returns {{text:string,provider:string,model:string,usage:Object}} 例: {text:'こんにちは',provider:'gemini',model:'gemini-3.5-flash',usage:{}}
 * @throws {ApiError} 音声なし、20MB超、MIME不正、Gemini API失敗の場合。
 */
function geminiTranscript_(payload) {
  const data = requireString_(payload.data, 'data', 28000000);
  const mimeType = requireString_(payload.mimeType, 'mimeType', 100);
  if (mimeType.indexOf('audio/') !== 0) throw new ApiError_('INVALID_ARGUMENT', '音声のMIMEタイプを指定してください。');
  if (base64ByteLength_(data) > CONFIG.MAX_INLINE_FILE_BYTES) {
    throw new ApiError_('PAYLOAD_TOO_LARGE', '音声は20MB以下にしてください。');
  }
  const body = {
    contents: [{ role: 'user', parts: [
      { text: payload.prompt || 'この音声を、聞こえた言語のまま正確に文字起こししてください。文字起こし本文だけを返してください。' },
      { inlineData: { mimeType: mimeType, data: data } }
    ] }]
  };
  return callGemini_(payload.model, body);
}

/**
 * Gemini generateContent REST APIを呼び出す共通処理。
 * @param {string|undefined} requestedModel 例: 'gemini-3.5-flash'
 * @param {Object} body 例: {contents:[{role:'user',parts:[{text:'こんにちは'}]}]}
 * @returns {{text:string,provider:string,model:string,usage:Object}} 例: {text:'こんにちは！',provider:'gemini',model:'gemini-3.5-flash',usage:{}}
 * @throws {ApiError} APIキーなし、HTTP失敗、回答本文なしの場合。
 */
function callGemini_(requestedModel, body) {
  const properties = PropertiesService.getScriptProperties();
  const apiKey = properties.getProperty('GEMINI_API_KEY');
  if (!apiKey) throw new ApiError_('NOT_CONFIGURED', 'GEMINI_API_KEYが設定されていません。');
  const model = requestedModel || properties.getProperty('GEMINI_MODEL') || CONFIG.DEFAULT_GEMINI_MODEL;
  const url = 'https://generativelanguage.googleapis.com/v1beta/models/' + encodeURIComponent(model) + ':generateContent';
  const response = UrlFetchApp.fetch(url, {
    method: 'post', contentType: 'application/json', payload: JSON.stringify(body),
    headers: { 'x-goog-api-key': apiKey }, muteHttpExceptions: true
  });
  const status = response.getResponseCode();
  let result;
  try { result = JSON.parse(response.getContentText()); } catch (error) {
    throw new ApiError_('AI_BAD_RESPONSE', 'AIから解析できない応答が返りました。');
  }
  if (status < 200 || status >= 300) {
    throw new ApiError_('AI_API_ERROR', (result.error && result.error.message) || 'AI APIでエラーが発生しました。');
  }
  const parts = result.candidates && result.candidates[0] && result.candidates[0].content && result.candidates[0].content.parts;
  const text = (parts || []).map(function(part) { return part.text || ''; }).join('').trim();
  if (!text) throw new ApiError_('AI_EMPTY_RESPONSE', 'AIから回答本文が返りませんでした。');
  return { text: text, provider: 'gemini', model: model, usage: result.usageMetadata || {} };
}

/**
 * 利用者が渡した生成設定から許可項目だけをコピーする。
 * @param {Object} config 例: {temperature:0.7,maxOutputTokens:800,unknown:'ignored'}
 * @returns {Object} 例: {temperature:0.7,maxOutputTokens:800}
 * @throws {ApiError} configがオブジェクトでない場合（code: INVALID_ARGUMENT）。
 */
function sanitizeGenerationConfig_(config) {
  if (!config || typeof config !== 'object' || Array.isArray(config)) {
    throw new ApiError_('INVALID_ARGUMENT', 'generationConfigはオブジェクトにしてください。');
  }
  const allowed = ['temperature', 'topP', 'topK', 'maxOutputTokens', 'stopSequences', 'responseMimeType'];
  return allowed.reduce(function(result, key) {
    if (config[key] !== undefined) result[key] = config[key];
    return result;
  }, {});
}

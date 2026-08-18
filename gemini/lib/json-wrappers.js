/**
 * GASへ送るJSONのラッパークラス。
 * 利用者がservice/action/payloadの構造を暗記しなくてもリクエストを作れる。
 */
"use strict";

class GASRequest {
  /**
   * GAS用の送信JSONを作る。
   * @param {string} service 例: "ai"
   * @param {string} action 例: "chat"
   * @param {Object} [payload] 例: {messages:[{role:"user",content:"こんにちは"}]}
   * @param {number} [version] 例: 1
   * @returns {GASRequest} 例: new GASRequest("db", "get", {key:"score"})
   * @throws {TypeError} service/actionが空、payloadが通常のオブジェクトでない、versionが正の整数でない場合。
   */
  constructor(service, action, payload = {}, version = 1) {
    if (typeof service !== "string" || !service.trim()) throw new TypeError("serviceを指定してください。");
    if (typeof action !== "string" || !action.trim()) throw new TypeError("actionを指定してください。");
    if (!payload || typeof payload !== "object" || Array.isArray(payload)) throw new TypeError("payloadはオブジェクトにしてください。");
    if (!Number.isInteger(version) || version < 1) throw new TypeError("versionは正の整数にしてください。");
    this.version = version;
    this.service = service.trim();
    this.action = action.trim();
    this.payload = { ...payload };
    Object.freeze(this.payload);
    Object.freeze(this);
  }

  /**
   * AIチャット用リクエストを作る。
   * @param {string|Array<{role:string,content:string}>} contentOrMessages 例: "量子コンピューターとは？"
   * @param {{provider?:string,model?:string,systemInstruction?:string,generationConfig?:Object}} [options] 例: {model:"gemini-3.5-flash",generationConfig:{temperature:0.6}}
   * @returns {GASRequest} 例: GASRequest.aiChat("こんにちは")
   * @throws {TypeError} 文章が空、または会話履歴が空の場合。
   */
  static aiChat(contentOrMessages, options = {}) {
    const messages = typeof contentOrMessages === "string"
      ? [{ role: "user", content: contentOrMessages.trim() }]
      : contentOrMessages;
    if (!Array.isArray(messages) || messages.length === 0 || messages.some((item) => !item || typeof item.content !== "string" || !item.content.trim())) {
      throw new TypeError("質問または1件以上の会話履歴を指定してください。");
    }
    return new GASRequest("ai", "chat", { ...options, messages });
  }

  /**
   * AI音声文字起こし用リクエストを作る。
   * @param {string} base64Data 例: "UklGRiQAAABXRUJQ..."
   * @param {string} mimeType 例: "audio/webm"
   * @param {{provider?:string,model?:string,prompt?:string}} [options] 例: {prompt:"日本語で文字起こしして"}
   * @returns {GASRequest} 例: GASRequest.aiTranscript("UklGR...", "audio/webm")
   * @throws {TypeError} Base64またはMIMEタイプが空の場合。
   */
  static aiTranscript(base64Data, mimeType, options = {}) {
    if (typeof base64Data !== "string" || !base64Data) throw new TypeError("音声のBase64データを指定してください。");
    if (typeof mimeType !== "string" || !mimeType.startsWith("audio/")) throw new TypeError("音声のMIMEタイプを指定してください。");
    return new GASRequest("ai", "transcript", { ...options, data: base64Data, mimeType });
  }

  /**
   * DBへ新規追加するリクエストを作る。
   * @param {string} key 例: "score"
   * @param {*} value 例: 100
   * @param {string} [namespace] 例: "team-a"
   * @returns {GASRequest} 例: GASRequest.dbAdd("score", 100)
   * @throws {TypeError} keyが空の場合。
   */
  static dbAdd(key, value, namespace = "default") { return GASRequest.dbWrite_("add", key, value, namespace); }

  /**
   * DBへ追加または上書きするリクエストを作る。
   * @param {string} key 例: "score"
   * @param {*} value 例: 120
   * @param {string} [namespace] 例: "team-a"
   * @returns {GASRequest} 例: GASRequest.dbSet("score", 120)
   * @throws {TypeError} keyが空の場合。
   */
  static dbSet(key, value, namespace = "default") { return GASRequest.dbWrite_("set", key, value, namespace); }

  /**
   * DBから1件取得するリクエストを作る。
   * @param {string} key 例: "score"
   * @param {string} [namespace] 例: "team-a"
   * @returns {GASRequest} 例: GASRequest.dbGet("score")
   * @throws {TypeError} keyが空の場合。
   */
  static dbGet(key, namespace = "default") { return GASRequest.dbKeyAction_("get", key, namespace); }

  /**
   * DBから1件削除するリクエストを作る。
   * @param {string} key 例: "score"
   * @param {string} [namespace] 例: "team-a"
   * @returns {GASRequest} 例: GASRequest.dbRemove("score")
   * @throws {TypeError} keyが空の場合。
   */
  static dbRemove(key, namespace = "default") { return GASRequest.dbKeyAction_("remove", key, namespace); }

  /**
   * DB一覧取得リクエストを作る。
   * @param {string} [prefix] 例: "user-"
   * @param {number} [limit] 例: 50
   * @param {string} [namespace] 例: "team-a"
   * @returns {GASRequest} 例: GASRequest.dbList("user-", 50)
   * @throws {TypeError} limitが1〜100の整数でない場合。
   */
  static dbList(prefix = "", limit = 100, namespace = "default") {
    if (!Number.isInteger(limit) || limit < 1 || limit > 100) throw new TypeError("limitは1〜100の整数にしてください。");
    return new GASRequest("db", "list", { namespace, prefix: String(prefix), limit });
  }

  /**
   * 指定namespaceに保存されたDBキーだけを取得するリクエストを作る。
   * @param {string} [namespace] 例: "chat-archives"
   * @returns {GASRequest} 例: GASRequest.dbKeys("chat-archives")
   * @throws {TypeError} namespaceが空の場合はGAS側でINVALID_ARGUMENTになる。
   */
  static dbKeys(namespace = "default") {
    if (typeof namespace !== "string" || !namespace.trim()) throw new TypeError("namespaceを文字列で指定してください。");
    return new GASRequest("db", "keys", { namespace: namespace.trim() });
  }

  /**
   * JSON.stringify用の通常オブジェクトへ変換する。
   * @returns {{version:number,service:string,action:string,payload:Object}} 例: {version:1,service:"db",action:"get",payload:{key:"score",namespace:"default"}}
   * @throws 通常は例外を発生させない。
   */
  toJSON() { return { version: this.version, service: this.service, action: this.action, payload: this.payload }; }

  /**
   * DB書き込みリクエストを作る内部関数。
   * @param {string} action 例: "add"
   * @param {string} key 例: "score"
   * @param {*} value 例: 100
   * @param {string} namespace 例: "default"
   * @returns {GASRequest} 例: GASRequest.dbAdd("score",100)
   * @throws {TypeError} keyが空の場合。
   */
  static dbWrite_(action, key, value, namespace) {
    return new GASRequest("db", action, { namespace, key: GASRequest.requireKey_(key), value });
  }

  /**
   * DBキー操作リクエストを作る内部関数。
   * @param {string} action 例: "get"
   * @param {string} key 例: "score"
   * @param {string} namespace 例: "default"
   * @returns {GASRequest} 例: GASRequest.dbGet("score")
   * @throws {TypeError} keyが空の場合。
   */
  static dbKeyAction_(action, key, namespace) {
    return new GASRequest("db", action, { namespace, key: GASRequest.requireKey_(key) });
  }

  /**
   * DBキーを検証する内部関数。
   * @param {string} key 例: "score"
   * @returns {string} 例: "score"
   * @throws {TypeError} keyが空の場合。
   */
  static requireKey_(key) {
    if (typeof key !== "string" || !key.trim()) throw new TypeError("keyを文字列で指定してください。");
    return key.trim();
  }
}

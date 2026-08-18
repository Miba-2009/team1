/**
 * 初心者向けのAI・DB静的クラス。
 * 利用例: await AI.chat("質問")、await DB.add("key", "value")
 */
"use strict";

const DEFAULT_NAMESPACE = "default";

class Hackathon {
  /**
   * GASの公開URLと任意の合言葉を設定する。
   * @param {string} endpoint 例: "https://script.google.com/macros/s/AKfycbXXX/exec"
   * @param {string} [token] 例: "hackathon-2026"
   * @returns {Object} 例: {endpoint:"https://.../exec",token:"",timeoutMs:30000}
   * @throws {TypeError} endpointが文字列でない場合。
   */
  static configure(endpoint, token = "") {
    return GASClient.configure({ endpoint, token });
  }
}

class AI {
  /**
   * AIへ質問または会話履歴を送る。
   * @param {string|Array<{role:string,content:string}>} content 例: "富士山について教えて"
   * @returns {Promise<string>} 回答例: "富士山は日本で最も高い山です。"
   * @throws {TypeError|Error} 内容が空、GAS未設定、通信失敗、AI API失敗の場合。
   */
  static async chat(content) {
    if (typeof content === "string" && !content.trim()) throw new TypeError("質問内容を入力してください。");
    if (typeof content !== "string" && !Array.isArray(content)) throw new TypeError("質問または会話履歴の配列を指定してください。");
    return (await GASClient.send(GASRequest.aiChat(content))).getText();
  }

  /**
   * 音声ファイルをAIで文字起こしする。
   * @param {Blob} audio 例: document.querySelector("#audio").files[0]
   * @returns {Promise<string>} 文字起こし例: "今日はWebアプリを作ります。"
   * @throws {TypeError|Error} Blobでない、20MB超、通信失敗、AI API失敗の場合。
   */
  static async transcript(audio) {
    if (!(audio instanceof Blob)) throw new TypeError("音声のFileまたはBlobを指定してください。");
    if (audio.size > 20 * 1024 * 1024) throw new Error("音声は20MB以下にしてください。");
    const base64 = await GASClient.blobToBase64(audio);
    const request = GASRequest.aiTranscript(base64, audio.type || "audio/webm");
    return (await GASClient.send(request)).getText();
  }
}

class DB {
  /**
   * 新規データを追加する。
   * @param {string} key 例: "name"
   * @param {*} value 例: "Aoi"
   * @param {string} [namespace] 例: "survey"
   * @returns {Promise<Object>} 例: {key:"name",value:"Aoi"}
   * @throws {TypeError|Error} key不正、重複、通信・保存失敗の場合。
   */
  static add(key, value, namespace = DEFAULT_NAMESPACE) { return DB.request_("add", { key, value, namespace }); }

  /**
   * データを追加または上書きする。
   * @param {string} key 例: "score"
   * @param {*} value 例: 100
   * @param {string} [namespace] 例: "game"
   * @returns {Promise<Object>} 例: {key:"score",value:100}
   * @throws {TypeError|Error} key不正、通信・保存失敗の場合。
   */
  static set(key, value, namespace = DEFAULT_NAMESPACE) { return DB.request_("set", { key, value, namespace }); }

  /**
   * キーから値を取得する。
   * @param {string} key 例: "score"
   * @param {string} [namespace] 例: "game"
   * @returns {Promise<*>} 保存値の例: 100。不在時はnull。
   * @throws {TypeError|Error} key不正、通信・取得失敗の場合。
   */
  static async get(key, namespace = DEFAULT_NAMESPACE) { return (await DB.request_("get", { key, namespace }))?.value ?? null; }

  /**
   * キーのデータを削除する。
   * @param {string} key 例: "score"
   * @param {string} [namespace] 例: "game"
   * @returns {Promise<boolean>} 削除例: true。不在時はfalse。
   * @throws {TypeError|Error} key不正、通信・削除失敗の場合。
   */
  static async remove(key, namespace = DEFAULT_NAMESPACE) { return (await DB.request_("remove", { key, namespace })).removed; }

  /**
   * prefixに一致するデータを取得する。
   * @param {string} [prefix] 例: "user-"
   * @param {string} [namespace] 例: "users"
   * @returns {Promise<Array<{key:string,value:*}>>} 例: [{key:"user-1",value:"Aoi"}]
   * @throws {Error} 通信・取得失敗の場合。
   */
  static async list(prefix = "", namespace = DEFAULT_NAMESPACE) {
    return (await DB.request_("list", { prefix, limit: 100, namespace })).items;
  }

  /**
   * namespace内のキーを取得する。
   * @param {string} [namespace] 例: "survey"
   * @returns {Promise<Array<string>>} 例: ["1","2"]
   * @throws {Error} 通信・取得失敗の場合。
   */
  static async keys(namespace = DEFAULT_NAMESPACE) { return (await DB.request_("keys", { namespace })).keys; }

  /**
   * DB用リクエストを組み立てて送る内部処理。
   * @param {string} action 例: "get"
   * @param {Object} payload 例: {key:"score",namespace:"default"}
   * @returns {Promise<Object>} 例: {key:"score",value:100}
   * @throws {TypeError|Error} action/key不正、通信・DB処理失敗の場合。
   */
  static request_(action, payload) {
    if (!["list", "keys"].includes(action) && (typeof payload.key !== "string" || !payload.key.trim())) {
      throw new TypeError("keyを文字列で指定してください。");
    }
    const namespace = payload.namespace ?? DEFAULT_NAMESPACE;
    const factories = {
      add: () => GASRequest.dbAdd(payload.key, payload.value, namespace),
      set: () => GASRequest.dbSet(payload.key, payload.value, namespace),
      get: () => GASRequest.dbGet(payload.key, namespace),
      remove: () => GASRequest.dbRemove(payload.key, namespace),
      list: () => GASRequest.dbList(payload.prefix, payload.limit, namespace),
      keys: () => GASRequest.dbKeys(namespace)
    };
    if (!factories[action]) throw new TypeError("未対応のDB操作です。");
    return GASClient.send(factories[action]()).then((response) => response.unwrap());
  }
}

/**
 * GAS Webアプリとの通信を担当する静的クラス。
 * インスタンスを作らず、GASClient.configure()のように呼び出す。
 */
"use strict";

class GASClient {
  static settings_ = { endpoint: "", token: "", timeoutMs: 30000 };

  /**
   * 接続設定を変更する。
   * @param {{endpoint:string,token?:string,timeoutMs?:number}} options 例: {endpoint:"https://script.google.com/macros/s/XXX/exec",timeoutMs:20000}
   * @returns {{endpoint:string,token:string,timeoutMs:number}} 例: {endpoint:"https://.../exec",token:"",timeoutMs:20000}
   * @throws {TypeError} endpointが文字列でない、timeoutMsが正の数でない場合。
   */
  static configure(options) {
    if (!options || typeof options.endpoint !== "string") throw new TypeError("endpointを文字列で指定してください。");
    if (options.timeoutMs !== undefined && (!Number.isFinite(options.timeoutMs) || options.timeoutMs <= 0)) {
      throw new TypeError("timeoutMsは正の数で指定してください。");
    }
    GASClient.settings_.endpoint = options.endpoint.trim();
    GASClient.settings_.token = String(options.token || "");
    GASClient.settings_.timeoutMs = options.timeoutMs || GASClient.settings_.timeoutMs;
    return { ...GASClient.settings_ };
  }

  /**
   * GASへラッパークラス形式のリクエストを送る。
   * @param {GASRequest} request 例: GASRequest.dbGet("name")
   * @returns {Promise<GASResponse>} 成功例: new GASResponse({ok:true,data:{key:"name",value:"Aoi"}})
   * @throws {TypeError|Error} 引数不正、未設定、タイムアウト、通信失敗、応答JSON不正の場合。
   */
  static async send(request) {
    const settings = GASClient.settings_;
    if (!settings.endpoint) throw new Error("GASClient.configure()でendpointを設定してください。");
    if (!(request instanceof GASRequest)) throw new TypeError("GASRequestのインスタンスを指定してください。");
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), settings.timeoutMs);
    const body = request.toJSON();
    if (settings.token) body.token = settings.token;

    try {
      // application/jsonはCORSプリフライトになるため、GAS向けにtext/plainで送る。
      const response = await fetch(settings.endpoint, {
        method: "POST",
        headers: { "Content-Type": "text/plain;charset=utf-8" },
        body: JSON.stringify(body),
        signal: controller.signal,
        redirect: "follow"
      });
      if (!response.ok) throw new Error(`通信エラー (${response.status})`);
      return new GASResponse(await response.json());
    } catch (error) {
      if (error.name === "AbortError") throw new Error("通信がタイムアウトしました。");
      throw error;
    } finally {
      clearTimeout(timer);
    }
  }

  /**
   * FileまたはBlobをBase64文字列へ変換する。
   * @param {Blob} blob 例: document.querySelector('input[type=file]').files[0]
   * @returns {Promise<string>} 例: "UklGRiQAAABXRUJQ..."
   * @throws {TypeError|Error} Blobでない、またはブラウザが読み取れない場合。
   */
  static blobToBase64(blob) {
    if (!(blob instanceof Blob)) throw new TypeError("BlobまたはFileを指定してください。");
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result).split(",")[1]);
      reader.onerror = () => reject(new Error("ファイルを読み取れませんでした。"));
      reader.readAsDataURL(blob);
    });
  }
}

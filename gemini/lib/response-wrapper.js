/**
 * GASから受け取るJSONのラッパークラス。
 * 成功判定やAI・DB結果の取り出しをメソッドとして提供する。
 */
"use strict";

class GASResponse {
  /**
   * GASの受信JSONを包む。
   * @param {{ok:boolean,data?:*,error?:{code?:string,message?:string}}} json 例: {ok:true,data:{text:"こんにちは"}}
   * @returns {GASResponse} 例: new GASResponse({ok:true,data:{text:"こんにちは"}})
   * @throws {TypeError} okがbooleanでない、またはJSONがオブジェクトでない場合。
   */
  constructor(json) {
    if (!json || typeof json !== "object" || typeof json.ok !== "boolean") throw new TypeError("GASの応答形式が正しくありません。");
    this.ok = json.ok;
    this.data = json.data ?? null;
    this.error = json.error ? Object.freeze({ code: json.error.code || "GAS_ERROR", message: json.error.message || "GASで処理に失敗しました。" }) : null;
    Object.freeze(this);
  }

  /**
   * 成功データを返し、失敗応答なら例外に変換する。
   * @returns {*} 成功データ例: {text:"こんにちは"}
   * @throws {Error} ok:falseの場合。例外のcodeにGASのエラーコードが入る。
   */
  unwrap() {
    if (this.ok) return this.data;
    const error = new Error(this.error?.message || "GASで処理に失敗しました。");
    error.code = this.error?.code || "GAS_ERROR";
    throw error;
  }

  /**
   * AIチャットまたは文字起こしの本文を取得する。
   * @returns {string} 例: "こんにちは！"
   * @throws {Error|TypeError} GAS処理が失敗、または応答にtextがない場合。
   */
  getText() {
    const data = this.unwrap();
    if (!data || typeof data.text !== "string") throw new TypeError("応答にtextがありません。");
    return data.text;
  }

  /**
   * DB get/add/setの値を取得する。
   * @returns {*} 値の例: {name:"Aoi",score:100}。DB getでデータがない場合はnull。
   * @throws {Error|TypeError} GAS処理が失敗、または応答がDBレコード形式でない場合。
   */
  getValue() {
    const data = this.unwrap();
    if (data === null) return null;
    if (!data || !("value" in data)) throw new TypeError("応答にvalueがありません。");
    return data.value;
  }

  /**
   * DBまたはアーカイブのlist結果から項目一覧を取得する。
   * @returns {Array<{key:string,value:*}>} 例: [{key:"user-1",value:"Aoi"}]
   * @throws {Error|TypeError} GAS処理が失敗、または応答にitems配列がない場合。
   */
  getItems() {
    const data = this.unwrap();
    if (!data || !Array.isArray(data.items)) throw new TypeError("応答にitemsがありません。");
    return data.items;
  }

  /**
   * DBまたはアーカイブのremoveで実際に削除できたか取得する。
   * @returns {boolean} 削除できた例: true、対象がなかった例: false
   * @throws {Error|TypeError} GAS処理が失敗、または応答にremovedがない場合。
   */
  wasRemoved() {
    const data = this.unwrap();
    if (!data || typeof data.removed !== "boolean") throw new TypeError("応答にremovedがありません。");
    return data.removed;
  }

  /**
   * 受信ラッパーを通常のJSONオブジェクトへ戻す。
   * @returns {{ok:boolean,data?:*,error?:Object}} 成功例: {ok:true,data:{text:"こんにちは"}}
   * @throws 通常は例外を発生させない。
   */
  toJSON() { return this.ok ? { ok: true, data: this.data } : { ok: false, error: this.error }; }
}

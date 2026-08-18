/**
 * チャットとアーカイブ一覧の表示を担当する静的クラス。
 * app.jsからChatUI.addMessage()のように呼び出す。
 */
"use strict";

class ChatUI {
  /**
   * GASへの接続状態をヘッダーへ表示する。
   * @param {boolean} ready 例: true
   * @returns {void} 例: undefined
   * @throws {Error} .status要素がHTMLにない場合。
   */
  static setConnectionStatus(ready) {
    const status = document.querySelector(".status");
    if (!status) throw new Error("接続状態の表示欄がありません。");
    status.classList.toggle("connected", ready);
    status.lastChild.textContent = ready ? " GAS 接続済み" : " GAS URLを設定してください";
  }

  /**
   * 会話欄へメッセージを1件追加する。
   * @param {"user"|"assistant"} role 例: "user"
   * @param {string} text 例: "こんにちは"
   * @param {boolean} [scroll] 例: true
   * @returns {HTMLElement} 追加したarticle要素。
   * @throws {TypeError|Error} role/text不正、または#messagesがない場合。
   */
  static addMessage(role, text, scroll = true) {
    if (!["user", "assistant"].includes(role) || typeof text !== "string") throw new TypeError("roleまたはtextが不正です。");
    const messages = document.querySelector("#messages");
    if (!messages) throw new Error("会話の表示欄がありません。");
    const article = document.createElement("article");
    article.className = `message ${role}-message`;
    const avatar = document.createElement("div");
    avatar.className = "avatar";
    avatar.setAttribute("aria-hidden", "true");
    avatar.textContent = role === "user" ? "YOU" : "AI";
    const bubble = document.createElement("div");
    bubble.className = "bubble";
    const paragraph = document.createElement("p");
    paragraph.textContent = text;
    const time = document.createElement("time");
    time.textContent = new Date().toLocaleTimeString("ja-JP", { hour: "2-digit", minute: "2-digit" });
    bubble.append(paragraph, time);
    article.append(avatar, bubble);
    messages.append(article);
    if (scroll) article.scrollIntoView({ behavior: "smooth", block: "end" });
    return article;
  }

  /**
   * AIの返答待ち表示を追加する。
   * @returns {HTMLElement} 後でremove()できる待ち表示要素。
   * @throws {Error} #messages要素がない場合。
   */
  static addTypingIndicator() {
    const article = ChatUI.addMessage("assistant", "");
    article.querySelector("p").innerHTML = '<span class="typing" aria-label="AIが回答中"><i></i><i></i><i></i></span>';
    return article;
  }

  /**
   * 配列の会話履歴で画面を描き直す。
   * @param {Array<{role:string,content:string}>} history 例: [{role:"user",content:"質問"}]
   * @returns {void} 例: undefined
   * @throws {TypeError|Error} history不正、または会話表示欄がない場合。
   */
  static renderConversation(history) {
    if (!Array.isArray(history)) throw new TypeError("会話履歴は配列にしてください。");
    const messages = document.querySelector("#messages");
    if (!messages) throw new Error("会話の表示欄がありません。");
    messages.replaceChildren();
    if (history.length === 0) {
      ChatUI.addMessage("assistant", "こんにちは！質問を入力してください。アイデア出し、文章作成、学習の相談などを手伝えます。", false);
      return;
    }
    history.forEach((message) => ChatUI.addMessage(message.role === "user" ? "user" : "assistant", message.content, false));
    messages.lastElementChild?.scrollIntoView({ block: "end" });
  }

  /**
   * UNIX時刻キーを日本の日時表示へ変換する。
   * @param {string|number} key 例: "1784688000123"
   * @returns {string} 例: "2026/07/22 09:00:00"
   * @throws {TypeError} 日時に変換できない場合。
   */
  static formatArchiveDate(key) {
    const date = new Date(Number(key));
    if (Number.isNaN(date.getTime())) throw new TypeError("アーカイブ日時が正しくありません。");
    return new Intl.DateTimeFormat("ja-JP", {
      year: "numeric", month: "2-digit", day: "2-digit",
      hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false
    }).format(date);
  }

  /**
   * 左側のアーカイブ一覧をボタンとして描画する。
   * @param {Array<{key:string}>} items 例: [{key:"1784688000123"}]
   * @param {Function} onOpen 例: function(key){ console.log(key); }
   * @param {Function} onDelete 例: function(key,label){ console.log(label); }
   * @returns {void} 例: undefined
   * @throws {TypeError|Error} 引数不正、または#archive-listがない場合。
   */
  static renderArchives(items, onOpen, onDelete) {
    if (!Array.isArray(items) || typeof onOpen !== "function" || typeof onDelete !== "function") throw new TypeError("アーカイブ一覧の引数が不正です。");
    const list = document.querySelector("#archive-list");
    if (!list) throw new Error("アーカイブ一覧の表示欄がありません。");
    list.replaceChildren();
    if (items.length === 0) {
      const empty = document.createElement("p");
      empty.className = "archive-empty";
      empty.textContent = "保存した会話はありません";
      list.append(empty);
      return;
    }
    items.forEach((item) => {
      const label = ChatUI.formatArchiveDate(item.key);
      const row = document.createElement("div");
      row.className = "archive-item";
      const openButton = document.createElement("button");
      openButton.type = "button";
      openButton.className = "archive-open";
      openButton.textContent = label;
      openButton.addEventListener("click", () => onOpen(item.key));
      const deleteButton = document.createElement("button");
      deleteButton.type = "button";
      deleteButton.className = "archive-delete";
      deleteButton.setAttribute("aria-label", `${label}のアーカイブを削除`);
      deleteButton.textContent = "×";
      deleteButton.addEventListener("click", () => onDelete(item.key, label));
      row.append(openButton, deleteButton);
      list.append(row);
    });
  }

  /**
   * 画面上部へ短い案内を表示する。
   * @param {string} message 例: "会話を保存しました。"
   * @param {boolean} [isError] 例: false
   * @returns {void} 例: undefined
   * @throws {Error} #archive-feedbackがない場合。
   */
  static showFeedback(message, isError = false) {
    const feedback = document.querySelector("#archive-feedback");
    if (!feedback) throw new Error("案内の表示欄がありません。");
    feedback.textContent = message;
    feedback.classList.toggle("error", isError);
  }

  /**
   * スマートフォン用サイドバーを開閉する。
   * @param {boolean} open 例: true
   * @returns {void} 例: undefined
   * @throws {Error} #archive-sidebarがない場合。
   */
  static setSidebarOpen(open) {
    const sidebar = document.querySelector("#archive-sidebar");
    if (!sidebar) throw new Error("アーカイブサイドバーがありません。");
    sidebar.classList.toggle("open", open);
    document.querySelector("#menu-button")?.setAttribute("aria-expanded", String(open));
  }
}
/**
 * 参加者が主に編集するファイル。
 * GAS_URLを設定すると、AIチャットと会話アーカイブが使える。
 */
const GAS_URL = "";
const GAS_TOKEN = ""; // 運営者から合言葉を指定された場合だけ入力する
const ARCHIVE_NAMESPACE = "chat-archives"; // 通常のDBデータと会話履歴を分ける名前

// アクションを指定するUIを取得する。
const form = document.querySelector("#chat-form");
const input = document.querySelector("#prompt");
const sendButton = document.querySelector("#send-button");

// 人とAIの会話を、送信順に保存する配列。最初の案内文は含めない。
let conversationHistory = [];
let deleteTarget = null;

// チャットフォームにイベントを登録する。
form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const prompt = input.value.trim();
  if (!prompt) return;
  input.value = "";
  input.style.height = "auto";
  sendButton.disabled = true;
  try { await submitChat(prompt); } catch (error) { console.error(error); }
  finally { sendButton.disabled = false; input.focus(); }
});

// イベントを購読する
input.addEventListener("keydown", (event) => {
  if (event.key === "Enter" && !event.shiftKey) { event.preventDefault(); form.requestSubmit(); }
});
input.addEventListener("input", () => {
  input.style.height = "auto";
  input.style.height = `${Math.min(input.scrollHeight, 150)}px`;
});

// テンプレートプロンプトを登録する
document.querySelectorAll("[data-prompt]").forEach((button) => {
  button.addEventListener("click", () => { input.value = button.dataset.prompt; input.focus(); });
});
document.querySelector("#archive-button").addEventListener("click", saveCurrentConversation);
document.querySelector("#menu-button").addEventListener("click", () => ChatUI.setSidebarOpen(true));
document.querySelector("#close-sidebar").addEventListener("click", () => ChatUI.setSidebarOpen(false));
document.querySelector("#cancel-delete").addEventListener("click", () => document.querySelector("#delete-dialog").close());
document.querySelector("#delete-input").addEventListener("input", (event) => {
  document.querySelector("#confirm-delete").disabled = !deleteTarget || event.target.value !== deleteTarget.phrase;
});
document.querySelector("#delete-form").addEventListener("submit", async (event) => {
  event.preventDefault();
  await confirmArchiveDeletion();
});

initialize(GAS_URL);

/**
 * GAS接続と最初の画面を準備する。
 * @param {string} endpoint 例: "https://script.google.com/macros/s/AKfycbXXX/exec"
 * @returns {Promise<boolean>} 接続設定済みの例: true、URL未設定の例: false
 * @throws {TypeError} endpointが文字列でない場合。アーカイブ取得失敗は画面に表示して続行する。
 */
async function initialize(endpoint) {
  if (typeof endpoint !== "string") throw new TypeError("GAS URLは文字列で指定してください。");
  const ready = endpoint.startsWith("https://script.google.com/macros/s/");
  if (ready) Hackathon.configure(endpoint, GAS_TOKEN);
  ChatUI.setConnectionStatus(ready);
  ChatUI.renderConversation(conversationHistory);
  if (ready) await refreshArchives();
  return ready;
}

/**
 * 入力内容と過去の履歴をAIへ送り、回答を画面と配列へ追加する。
 * @param {string} prompt 例: "宇宙について教えて"
 * @returns {Promise<string>} AI回答例: "宇宙は約138億年前に…"
 * @throws {Error} GAS URL未設定、通信失敗、AI API失敗の場合。エラー内容は画面にも表示する。
 */
async function submitChat(prompt) {
  if (!GAS_URL.startsWith("https://script.google.com/macros/s/")) {
    const error = new Error("app.jsのGAS_URLを設定してください。");
    ChatUI.addMessage("assistant", `設定エラー: ${error.message}`);
    throw error;
  }
  const userMessage = { role: "user", content: prompt };
  conversationHistory.push(userMessage);
  ChatUI.addMessage("user", prompt);
  const waiting = ChatUI.addTypingIndicator();
  try {
    const answer = await AI.chat(conversationHistory);
    conversationHistory.push({ role: "assistant", content: answer });
    waiting.remove();
    ChatUI.addMessage("assistant", answer);
    return answer;
  } catch (error) {
    conversationHistory.pop();
    waiting.remove();
    ChatUI.addMessage("assistant", `エラー: ${error.message}`);
    throw error;
  }
}

/**
 * GASからアーカイブキー一覧を読み直し、左側へ表示する。
 * @returns {Promise<Array<{key:string}>>} 例: [{key:"1784688000123"}]
 * @throws 通信失敗は画面へ表示し、空配列を返す。
 */
async function refreshArchives() {
  try {
    const keys = await DB.keys(ARCHIVE_NAMESPACE);
    const items = keys.sort((a, b) => Number(b) - Number(a)).map((key) => ({ key }));
    ChatUI.renderArchives(items, openArchive, askArchiveDeletion);
    return items;
  } catch (error) {
    ChatUI.showFeedback(`一覧を取得できません: ${error.message}`, true);
    ChatUI.renderArchives([], openArchive, askArchiveDeletion);
    return [];
  }
}

/**
 * 現在の会話履歴をGASへ保存し、アーカイブ一覧を更新する。
 * @returns {Promise<Object|null>} 保存例: {key:"1784688000123"}、履歴なし・失敗時はnull
 * @throws 通信・保存失敗は画面へ表示するため、外へは投げない。
 */
async function saveCurrentConversation() {
  if (conversationHistory.length === 0) {
    ChatUI.showFeedback("保存する会話がまだありません。", true);
    return null;
  }
  const button = document.querySelector("#archive-button");
  button.disabled = true;
  const key = String(Date.now());
  try {
    await DB.add(key, conversationHistory, ARCHIVE_NAMESPACE);
    const saved = { key };
    ChatUI.showFeedback(`保存しました: ${ChatUI.formatArchiveDate(key)}`);
    await refreshArchives();
    return saved;
  } catch (error) {
    const message = error.code === "ALREADY_EXISTS"
      ? "同じミリ秒のアーカイブキーが既に存在するため、保存できませんでした。"
      : `保存できません: ${error.message}`;
    ChatUI.showFeedback(message, true);
    return null;
  } finally {
    button.disabled = false;
  }
}

/**
 * 選択したアーカイブを取得し、現在の会話として表示する。
 * @param {string} key 例: "1784688000123"
 * @returns {Promise<Array>} 復元した履歴例: [{role:"user",content:"質問"}]
 * @throws 通信・取得失敗は画面へ表示し、現在の履歴を返す。
 */
async function openArchive(key) {
  try {
    const history = await DB.get(key, ARCHIVE_NAMESPACE);
    if (!Array.isArray(history)) throw new Error("会話履歴が見つかりません。");
    conversationHistory = history;
    ChatUI.renderConversation(conversationHistory);
    ChatUI.showFeedback(`${ChatUI.formatArchiveDate(key)} を表示中`);
    ChatUI.setSidebarOpen(false);
  } catch (error) {
    ChatUI.showFeedback(`会話を開けません: ${error.message}`, true);
  }
  return conversationHistory;
}

/**
 * 削除確認ダイアログを開き、必要な入力文言を設定する。
 * @param {string} key 例: "1784688000123"
 * @param {string} label 例: "2026/07/22 09:00:00"
 * @returns {void} 返り値の例: undefined
 * @throws {Error} ダイアログ要素がHTMLにない場合。
 */
function askArchiveDeletion(key, label) {
  deleteTarget = { key, phrase: `delete ${label}` };
  document.querySelector("#delete-phrase").textContent = deleteTarget.phrase;
  document.querySelector("#delete-input").value = "";
  document.querySelector("#delete-error").textContent = "";
  document.querySelector("#confirm-delete").disabled = true;
  document.querySelector("#delete-dialog").showModal();
  document.querySelector("#delete-input").focus();
}

/**
 * 確認文言が一致したアーカイブを削除する。
 * @returns {Promise<boolean>} 削除できた例: true、不一致または失敗例: false
 * @throws 通信・削除失敗はダイアログまたは画面へ表示するため、外へは投げない。
 */
async function confirmArchiveDeletion() {
  const input = document.querySelector("#delete-input");
  const confirmButton = document.querySelector("#confirm-delete");
  if (!deleteTarget || input.value !== deleteTarget.phrase) {
    document.querySelector("#delete-error").textContent = "入力された文言が一致しません。";
    return false;
  }
  confirmButton.disabled = true;
  try {
    const removed = await DB.remove(deleteTarget.key, ARCHIVE_NAMESPACE);
    document.querySelector("#delete-dialog").close();
    ChatUI.showFeedback(removed ? "アーカイブを削除しました。" : "アーカイブは既に削除されています。");
    deleteTarget = null;
    await refreshArchives();
    return removed;
  } catch (error) {
    document.querySelector("#delete-error").textContent = `削除できません: ${error.message}`;
    confirmButton.disabled = false;
    return false;
  }
}


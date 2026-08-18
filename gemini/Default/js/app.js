"use strict";

/*
  参加者が主に編集するファイルです。
  まずGAS_URL、APP_TITLE、APP_DESCRIPTIONを変更してください。
  TODOと書かれた場所へ、自分たちの機能を追加します。
*/
const GAS_URL = "ここにGASのウェブアプリURLを貼る";
const GAS_TOKEN = "";
const APP_TITLE = "ここにアプリ名を入れる";
const APP_DESCRIPTION = "誰の、どんな困りごとを解決するアプリか書いてください。";
const SAMPLE_NAMESPACE = "default-sample";

const elements = {
  appTitle: document.getElementById("app-title"),
  appDescription: document.getElementById("app-description"),
  connectionStatus: document.getElementById("connection-status"),
  messageList: document.getElementById("message-list"),
  chatForm: document.getElementById("chat-form"),
  questionInput: document.getElementById("question-input"),
  sendButton: document.getElementById("send-button"),
  clearButton: document.getElementById("clear-button"),
  sampleSaveButton: document.getElementById("sample-save-button"),
  saveStatus: document.getElementById("save-status")
};

let conversationHistory = [];

initializeApp();

/**
 * タイトル、GAS接続、ボタン操作を準備する。
 * @returns {void} 例: undefined
 * @throws {Error} 必要なHTML要素がない場合。
 */
function initializeApp() {
  elements.appTitle.textContent = APP_TITLE;
  elements.appDescription.textContent = APP_DESCRIPTION;
  const ready = GAS_URL.startsWith("https://script.google.com/macros/s/");
  if (ready) Hackathon.configure(GAS_URL, GAS_TOKEN);
  elements.connectionStatus.textContent = ready ? "GAS 接続済み" : "app.jsのGAS_URLを設定してください";
  elements.connectionStatus.classList.toggle("connected", ready);
  elements.chatForm.addEventListener("submit", handleChatSubmit);
  elements.clearButton.addEventListener("click", clearConversation);
  elements.sampleSaveButton.addEventListener("click", saveLastAnswer);
}

/**
 * フォームから質問を取り出し、AIへ送る。
 * @param {SubmitEvent} event 例: chat-formを送信したときのイベント
 * @returns {Promise<void>} 例: undefined
 * @throws 通信・AI処理の失敗は画面へ表示するため、外へは投げない。
 */
async function handleChatSubmit(event) {
  event.preventDefault();
  const question = elements.questionInput.value.trim();
  if (!question) return;

  const userMessage = { role: "user", content: question };
  conversationHistory.push(userMessage);
  renderMessage(userMessage);
  elements.questionInput.value = "";
  elements.sendButton.disabled = true;

  try {
    const answer = await AI.chat(conversationHistory);
    const aiMessage = { role: "assistant", content: answer };
    conversationHistory.push(aiMessage);
    renderMessage(aiMessage);

    // TODO: AIの回答を使って、自分たちの画面や機能を更新する。
  } catch (error) {
    renderMessage({ role: "assistant", content: `エラー: ${error.message}` });
  } finally {
    elements.sendButton.disabled = false;
  }
}

/**
 * 会話1件を画面へ表示する。
 * @param {{role:"user"|"assistant",content:string}} message 例: {role:"user",content:"こんにちは"}
 * @returns {HTMLElement} 追加したp要素。
 * @throws {TypeError} roleまたはcontentが不正な場合。
 */
function renderMessage(message) {
  if (!message || !["user", "assistant"].includes(message.role) || typeof message.content !== "string") {
    throw new TypeError("メッセージの形式が正しくありません。");
  }
  elements.messageList.querySelector(".empty-message")?.remove();
  const paragraph = document.createElement("p");
  paragraph.className = `message ${message.role}`;
  paragraph.textContent = message.content;
  elements.messageList.append(paragraph);
  paragraph.scrollIntoView({ behavior: "smooth", block: "end" });
  return paragraph;
}

/**
 * 現在の会話を画面と配列から消す。
 * @returns {void} 例: undefined
 * @throws 通常は例外を発生させない。
 */
function clearConversation() {
  conversationHistory = [];
  elements.messageList.innerHTML = '<p class="empty-message">まだ会話はありません。</p>';
  elements.saveStatus.textContent = "";
}

/**
 * 最後のAI回答をDBへ保存する制作例。
 * @returns {Promise<string|null>} 保存キーの例: "1786675200123"。回答なし・失敗時はnull。
 * @throws 通信・保存失敗は画面へ表示するため、外へは投げない。
 */
async function saveLastAnswer() {
  const lastAnswer = [...conversationHistory].reverse().find((message) => message.role === "assistant");
  if (!lastAnswer) {
    elements.saveStatus.textContent = "先にAIへ質問してください。";
    return null;
  }
  const key = String(Date.now());
  try {
    await DB.add(key, lastAnswer, SAMPLE_NAMESPACE);
    elements.saveStatus.textContent = `DBへ保存しました。key: ${key}`;
    return key;
  } catch (error) {
    elements.saveStatus.textContent = `保存できません: ${error.message}`;
    return null;
  }
}

// TODO: plan_expamle.mdで決めた新しい関数を、この下へ追加しましょう。

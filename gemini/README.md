# AI Webハッカソン テンプレート

HTML/CSSをほぼ触らず、JavaScriptだけでAIチャットと簡易DBを使える静的Webアプリです。Node.jsは不要で、GitHub Pagesにそのまま公開できます。AIの秘密鍵はブラウザへ置かず、Google Apps Script（GAS）からGemini APIを呼び出します。

## ファイル構成

```text
.
├── gas/                   # GASへ貼り付けるサーバー側コード
│   ├── Code.gs
│   ├── Config.gs
│   ├── AiService.gs
│   ├── DbService.gs
│   ├── DbStorage.gs
│   └── Utilities.gs
├── lib/                   # 静的クラスで作られた共通ライブラリ
│   ├── gas-client.js      # GAS通信クライアント
│   ├── json-wrappers.js   # 送信JSONのGASRequestクラス
│   ├── response-wrapper.js # 受信JSONのGASResponseクラス
│   ├── easy-api.js        # 初心者向けAI/DBラッパー
│   └── chat-ui.js         # チャットと一覧の画面部品
├── Default/               # 制作開始用の未完成テンプレート
│   ├── index.html
│   ├── style.css
│   ├── plan_expamle.md
│   └── js/app.js
├── Helper/                # アーカイブ付きAIチャットの完成例
│   ├── index.html
│   ├── style.css
│   └── js/app.js
└── README.md
```

## 1. GASを準備する（運営者）

1. [Google Apps Script](https://script.google.com/)で「新しいプロジェクト」を作ります。
2. `gas` フォルダ内の6ファイルを、同名のスクリプトファイルとして全てコピーします。GASではファイル順に関係なく一つのプロジェクトとして動きます。
3. 左側の「プロジェクトの設定」→「スクリプト プロパティ」に次を追加します。

| プロパティ | 必須 | 内容 |
|---|---:|---|
| `GEMINI_API_KEY` | 必須 | Google AI Studioで作成したAPIキー |
| `GEMINI_MODEL` | 任意 | 既定は `gemini-3.5-flash`。利用可能なモデル名に変更可能 |
| `DB_SPREADSHEET_ID` | 任意 | 保存先シート。空なら初回アクセス時に自動作成 |
| `ACCESS_TOKEN` | 任意 | 誤アクセスを減らす合言葉。本格的な認証ではありません |

4. 「デプロイ」→「新しいデプロイ」→種類「ウェブアプリ」を選びます。
5. 「次のユーザーとして実行」は自分、「アクセスできるユーザー」は参加者が利用できる範囲（一般公開なら「全員」）を選び、デプロイします。
6. 表示された `/exec` で終わるURLを控えます。URLをブラウザで開き、`status: ready` が返れば稼働しています。

コードを変更した後は、デプロイの「管理」から新しいバージョンを反映してください。エディタで保存しただけでは公開版は更新されません。

## 2. Web側を設定する（参加者）

制作を始める場合は `Default/js/app.js` の先頭を書き換えます。

```js
const GAS_URL = "https://script.google.com/macros/s/あなたのID/exec";
const GAS_TOKEN = ""; // 運営者から指定された場合だけ入力
```

`Default/index.html`を開くと制作開始版、`Helper/index.html`を開くと完成例を試せます。GitHubへ全ファイルをpushし、公開したいフォルダの内容をGitHub Pagesの公開元へ配置してください。

両方のHTMLは、`lib`内のライブラリと各フォルダの`js/app.js`を`defer`付きで読み込みます。ライブラリは上から順番に読み込まれ、HTMLの解析後に実行されます。

## 初心者向けの使い方

HTMLでは必要なライブラリを既に読み込んでいるため、参加者は `Default/js/app.js` から次のように使えます。

```js
Hackathon.configure("https://script.google.com/macros/s/あなたのID/exec");

const answer = await AI.chat("しりとりをしよう");
const text = await AI.transcript(audioFile);

await DB.add("name", "Aoi");       // 同じkeyがあるとエラー
await DB.set("score", 100);        // 追加または上書き
const score = await DB.get("score");
const items = await DB.list("user-");
const removed = await DB.remove("score");

// 会話履歴は人とAIの発言を順番に入れた配列
const history = [
  { role: "user", content: "こんにちは" },
  { role: "assistant", content: "こんにちは！" }
];
const archiveKey = String(Date.now());
await DB.add(archiveKey, history, "chat-archives");
const archiveKeys = await DB.keys("chat-archives");
const restored = await DB.get(archiveKey, "chat-archives");
await DB.remove(archiveKey, "chat-archives");
```

## スプレッドシートへ書き込む例

`DB.add()`で保存したデータは、GASが管理するスプレッドシートへ1行ずつ追加されます。次は、アンケートの名前と回答を保存する例です。

```js
/**
 * アンケート回答をスプレッドシートへ保存する。
 * @param {string} name 例: "Aoi"
 * @param {string} answer 例: "AIで勉強を楽しくしたい"
 * @returns {Promise<string>} 保存に使ったキーの例: "1784688000123"
 * @throws {Error} 同じキーが存在する、通信に失敗する、または値を保存できない場合。
 */
async function saveSurveyAnswer(name, answer) {
  // Date.now()は、現在時刻をミリ秒の数字で返す。
  const key = String(Date.now());

  // 第3引数の"survey"は、他のデータと分けるための保存場所の名前。
  await DB.add(key, {
    name: name,
    answer: answer,
    answeredAt: new Date().toISOString()
  }, "survey");

  return key;
}

const savedKey = await saveSurveyAnswer("Aoi", "AIで勉強を楽しくしたい");
console.log("保存したキー:", savedKey);
```

スプレッドシートには、おおよそ次のように保存されます。

| namespace | key | valueJson | createdAt | updatedAt |
|---|---|---|---|---|
| `survey` | `1784688000123` | `{"name":"Aoi","answer":"AIで勉強を楽しくしたい","answeredAt":"..."}` | `2026-07-22T...Z` | `2026-07-22T...Z` |

保存した値は、同じキーとnamespaceを使って読み込めます。

```js
const answer = await DB.get(savedKey, "survey");
console.log(answer.name);       // "Aoi"
console.log(answer.answer);     // "AIで勉強を楽しくしたい"
```

同じキーを上書きしたい場合は`DB.set()`、削除したい場合は`DB.remove()`を使用します。

```js
await DB.set(savedKey, { name: "Aoi", answer: "回答を変更しました" }, "survey");
await DB.remove(savedKey, "survey");
```

## 上級者向けの使い方

JSONを直接書く代わりに、`GASRequest` クラスで送信内容を作ります。`GASClient.send()` の引数は必ず `GASRequest`、返り値は必ず `GASResponse` です。

```js
GASClient.configure({ endpoint: GAS_URL, timeoutMs: 30000 });

const request = GASRequest.aiChat("量子コンピューターとは？", {
  model: "gemini-3.5-flash",
  systemInstruction: "高校生にもわかる言葉で答えてください。",
  generationConfig: { temperature: 0.6, maxOutputTokens: 800 }
});

const response = await GASClient.send(request);

if (response.ok) {
  console.log(response.getText());
} else {
  console.error(response.error.code, response.error.message);
}
```

### 送信ラッパーの作成メソッド

```js
GASRequest.aiChat("質問");
GASRequest.aiChat([{ role: "user", content: "質問" }]);
GASRequest.aiTranscript(base64Audio, "audio/webm");

GASRequest.dbAdd("score", 100);
GASRequest.dbSet("score", 120);
GASRequest.dbGet("score");
GASRequest.dbRemove("score");
GASRequest.dbList("user-", 50);
GASRequest.dbKeys("chat-archives");
```

特殊な機能を追加した場合だけ、汎用コンストラクターを使えます。

```js
const request = new GASRequest("ai", "新しいaction", { option: "value" });
```

### 受信ラッパーの取り出しメソッド

```js
response.ok;           // 成功ならtrue
response.error;        // 失敗時のcodeとmessage
response.getText();    // AIチャット・文字起こし
response.getValue();   // DB get/add/set
response.getItems();   // DB list
response.wasRemoved(); // DB remove
response.unwrap();     // 加工前のdataを取得。失敗時は例外
response.toJSON();     // 通常のJSONオブジェクトへ戻す
```

## 会話アーカイブの仕組み

- `conversationHistory` 配列に、人の発言を `user`、Geminiの回答を `assistant` として順番に保持します。
- 「現在の会話を保存」を押すと、ブラウザの `Date.now()` でミリ秒UNIX時刻のキーを作ります。
- `DB.add(key, conversationHistory, "chat-archives")` で配列全体を保存します。
- GASの `DB.add` 処理はスクリプトロック内で重複キーを確認します。同じキーが既にある場合は再採番や上書きをせず、`ALREADY_EXISTS` エラーを画面へ表示します。
- ページ読み込み時は `DB.keys("chat-archives")` でキーだけを取得し、画面左側へ日本の日時として表示します。
- 日時ボタンでは `DB.get`、削除ボタンでは `DB.remove` を使用します。
- 復元後に質問すると、その履歴を含めてAIへ送信します。
- 削除時は画面に表示された `delete 日時` と完全に同じ文言を入力する必要があります。

ログイン機能はないため、同じGAS URLを使う参加者には全アーカイブが表示されます。個人情報や秘密情報は保存しないでください。

AIを追加する場合は `gas/AiService.gs` の `getAiProvider_()` にプロバイダーを1件追加し、`chat` と `transcript` の関数を実装します。入口やブラウザ側の送信処理は変更不要です。

## APIの共通応答

成功時:

```json
{ "ok": true, "data": { "text": "回答" } }
```

失敗時（GASはブラウザで本文を読めるよう、処理エラーもJSONで返します）:

```json
{ "ok": false, "error": { "code": "INVALID_ARGUMENT", "message": "説明" } }
```

## 運営上の注意

- Gemini APIキーを `app.js`、HTML、GitHubへ書かないでください。必ずGASのスクリプトプロパティへ保存します。
- `ACCESS_TOKEN` は配布するJavaScriptから見えるため、秘密の認証にはなりません。いたずら防止が必要なら、参加者ごとにGASを用意する、Googleアカウント限定公開にする、または本格的な認証基盤を使ってください。
- DBは小規模な作品用です。個人情報・パスワード・秘密情報は保存しないでください。全参加者が同じGASを使う場合、`namespace` をチームごとに分けてもアクセス制御にはなりません。
- API料金・GAS/スプレッドシートの割当量・Geminiの利用規約を運営者が事前に確認し、利用上限を設定してください。
- AIの回答は不正確・不適切な場合があります。作品内に注意表示を残し、重要な判断には使わないでください。

## 動作確認チェックリスト

- GAS URLを開くと `ok: true` が表示される
- チャットを1回送り、回答が画面に表示される
- `DB.add` → `DB.get` → `DB.remove` が順に動く
- スマートフォン幅で入力欄と送信ボタンが収まる
- GitHub PagesのURLでも動く

## APIを使わずブラウザ内でAIを動かす発展案

基本コースはGAS経由のAI APIが最も扱いやすい構成です。発展コースでは、次の方法で推論を利用者のブラウザ内へ移せます。

| 方法 | 特徴 | 注意点 |
|---|---|---|
| [Transformers.js](https://huggingface.co/docs/transformers.js/main/index) | 分類、翻訳、要約、画像・音声認識などの小型モデルをブラウザで実行 | 初回モデルダウンロードと端末性能 |
| [WebLLM](https://webllm.mlc.ai/docs/) | WebGPUでローカルLLMチャットを実行 | 対応GPU、メモリ、モデル容量 |
| [Chrome Built-in AI](https://developer.chrome.com/docs/ai/built-in/overview) | ブラウザ管理の翻訳・要約・文章支援 | APIごとに提供状況や対応環境が異なる |
| [ONNX Runtime Web](https://onnxruntime.ai/docs/tutorials/web/) | ONNX形式の独自モデルをWASMやWebGPUで実行 | 前処理・後処理とモデル知識が必要 |

ブラウザ内AIはAPIキーやサーバー費用を減らせますが、モデルのライセンス、初回ロード時間、学校端末での動作、未対応時のGAS版への切り替えを事前に確認してください。

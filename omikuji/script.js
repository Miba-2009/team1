/* =========================================================
   学びの御神籤 - script.js 完成版
   ・100種類の御神籤
   ・日本語の名言＋偉人名
   ・シークレット対応
   ・御神籤図鑑
   ・達成率
   ・通常クールタイム30分
   ・重複時はクールタイム25分
   ・重複ボーナス表示
   ・応援メッセージはクールタイム中ずっと固定
   ・本日の課題もクールタイム中ずっと固定
   ・設定から応援メッセージを登録可能
========================================================= */

"use strict";


/* =========================================================
   基本設定
========================================================= */

// 通常クールタイム：30分
const COOLDOWN_TIME = 30 * 60 * 1000;

// 重複時クールタイム：25分
const DUPLICATE_COOLDOWN_TIME = 25 * 60 * 1000;


// localStorage
const STORAGE_COLLECTION = "studyOmikujiCollection";
const STORAGE_LAST_DRAW = "studyOmikujiLastDraw";
const STORAGE_COOLDOWN_DURATION = "studyOmikujiCooldownDuration";

const STORAGE_MESSAGES = "studyOmikujiMessages";
const STORAGE_CHALLENGE = "studyOmikujiChallenge";
const STORAGE_SUPPORT = "studyOmikujiCurrentSupport";


/* =========================================================
   デフォルト応援メッセージ
========================================================= */

const defaultSupportMessages = [

    "今日の努力は、未来の自分へのプレゼントです。",

    "少しだけでも大丈夫。まずは一問から始めよう。",

    "昨日の自分より、一歩前に進めば十分です。",

    "分からない問題があるのは、成長するチャンスです。",

    "焦らなくて大丈夫。自分のペースで進もう。",

    "5分だけ頑張ってみよう。その一歩が大切です。",

    "勉強した分だけ、できることは少しずつ増えていきます。",

    "今日ここまで頑張った自分を、ちゃんと褒めてあげよう。",

    "完璧じゃなくて大丈夫。続けることが一番大切です。",

    "未来の自分が、今日のあなたにきっと感謝します。",

    "一問解けば、一歩前進。",

    "できないことより、できるようになったことを見つけよう。",

    "今日の10分が、明日の自信になります。",

    "まず始める。それだけでも十分すごいことです。",

    "休憩も大切。無理せず自分のペースで進もう。"

];


/* =========================================================
   本日の課題
========================================================= */

const challengeTasks = [

    "英単語を10個覚える",

    "数学の問題を3問解く",

    "教科書を5ページ読む",

    "漢字を10個覚える",

    "昨日間違えた問題を3問解き直す",

    "英単語を15分勉強する",

    "数学を15分だけ進める",

    "国語の文章を1つ読む",

    "理科の重要語句を5個覚える",

    "社会の重要語句を5個覚える",

    "苦手な問題を1問だけ解いてみる",

    "学校の宿題を1つ終わらせる",

    "ノートを10分見直す",

    "今日習った内容を復習する",

    "明日の授業の予習を10分する",

    "分からない問題を1つ調べる",

    "英語の文章を1つ音読する",

    "公式を3つ覚える",

    "テスト範囲を10分確認する",

    "机に向かって15分集中する",

    "数学の公式を1つ復習する",

    "英単語を5個使って英文を作る",

    "社会の年号を5個確認する",

    "理科の用語を5個確認する",

    "国語の漢字を5個練習する",

    "今日の授業内容を3つ思い出す",

    "苦手教科を10分だけ勉強する",

    "問題集を2ページ進める",

    "授業で分からなかったことを1つ確認する",

    "明日の持ち物と宿題を確認する"

];


/* =========================================================
   名言データ
========================================================= */

const quotes = [

    ["千里の道も一歩から。", "老子", "大大吉", "『道徳経』"],

    ["学びて時にこれを習う、また説ばしからずや。", "孔子", "大吉", "『論語』"],

    ["知る者は好む者に如かず、好む者は楽しむ者に如かず。", "孔子", "大吉", "『論語』"],

    ["過ちて改めざる、これを過ちという。", "孔子", "大大吉", "『論語』"],

    ["己の欲せざる所、人に施すことなかれ。", "孔子", "中吉", "『論語』"],

    ["学びて思わざれば則ち罔し、思いて学ばざれば則ち殆し。", "孔子", "大吉", "『論語』"],

    ["温故知新。", "孔子", "吉", "『論語』"],

    ["知識への投資は、いつでも最高の利息を生む。", "ベンジャミン・フランクリン", "大吉", "広く知られる言葉"],

    ["失われた時間は、二度と戻らない。", "ベンジャミン・フランクリン", "大吉", "広く帰属される言葉"],

    ["勤勉は幸運の母である。", "ベンジャミン・フランクリン", "中吉", "広く帰属される言葉"],

    ["準備を怠ることは、失敗への準備をすることである。", "ベンジャミン・フランクリン", "大吉", "広く帰属される言葉"],

    ["私たちが恐れるべき唯一のものは、恐怖そのものである。", "フランクリン・D・ルーズベルト", "大吉", "就任演説"],

    ["未来は、自分の夢の美しさを信じる人のものである。", "エレノア・ルーズベルト", "大吉", "広く知られる言葉"],

    ["自分にはできないと思うことを、やってみなさい。", "エレノア・ルーズベルト", "大大吉", "広く知られる言葉"],

    ["何事も、成し遂げるまでは不可能に見える。", "ネルソン・マンデラ", "大吉", "広く知られる言葉"],

    ["教育は、世界を変えるために使える最も強力な武器である。", "ネルソン・マンデラ", "大大吉", "2003年の講演"],

    ["勝者とは、決してあきらめない夢見る人である。", "ネルソン・マンデラ", "大吉", "広く帰属される言葉"],

    ["私は失敗していない。うまくいかない方法を見つけただけだ。", "トーマス・エジソン", "大吉", "広く知られる言葉"],

    ["多くの人がチャンスを逃すのは、それが仕事の姿をしているからだ。", "トーマス・エジソン", "大大吉", "広く知られる言葉"],

    ["天才とは、1パーセントのひらめきと99パーセントの努力である。", "トーマス・エジソン", "大吉", "広く知られる言葉"],

    ["始める方法は、話すことをやめて行動することだ。", "ウォルト・ディズニー", "大吉", "広く知られる言葉"],

    ["夢見ることができるなら、それを実現することもできる。", "ウォルト・ディズニー", "大大吉", "広く帰属される言葉"],

    ["勇気を持って追いかければ、夢は実現できる。", "ウォルト・ディズニー", "大吉", "広く帰属される言葉"],

    ["笑いに時代はなく、想像力に年齢はなく、夢は永遠である。", "ウォルト・ディズニー", "中吉", "広く知られる言葉"],

    ["成功への秘訣は、まず始めることだ。", "マーク・トウェイン", "大吉", "広く帰属される言葉"],

    ["なりたかった自分になるのに、遅すぎることはない。", "ジョージ・エリオット", "大大吉", "広く帰属される言葉"],

    ["情熱なしに偉大なことは何も成し遂げられなかった。", "ラルフ・ワルド・エマーソン", "大吉", "広く知られる言葉"],

    ["道がないところへ行き、道を残しなさい。", "ラルフ・ワルド・エマーソン", "大大吉", "広く帰属される言葉"],

    ["決して、決して、決してあきらめるな。", "ウィンストン・チャーチル", "大大吉", "1941年の演説"],

    ["成功は終わりではなく、失敗は終わりでもない。", "ウィンストン・チャーチル", "大吉", "広く帰属される言葉"],

    ["地獄を通っているなら、そのまま進み続けなさい。", "ウィンストン・チャーチル", "大吉", "広く帰属される言葉"],

    ["大切なのは、疑問を持ち続けることだ。", "アルベルト・アインシュタイン", "大吉", "広く知られる言葉"],

    ["想像力は知識よりも重要である。", "アルベルト・アインシュタイン", "大大吉", "1929年のインタビュー"],

    ["一度も失敗したことがない人は、新しいことを試していない人だ。", "アルベルト・アインシュタイン", "大吉", "広く帰属される言葉"],

    ["人生は自転車に乗るようなものだ。バランスを保つには動き続けなければならない。", "アルベルト・アインシュタイン", "大吉", "1930年の手紙"],

    ["人生において恐れるものは何もない。理解すべきものがあるだけだ。", "マリー・キュリー", "大大吉", "広く知られる言葉"],

    ["未来を予測する最善の方法は、自分で未来をつくることだ。", "ピーター・ドラッカー", "大吉", "広く帰属される言葉"],

    ["何かを信じなければならない。直感、運命、人生、カルマなどを。", "スティーブ・ジョブズ", "大吉", "2005年スタンフォード大学卒業式"],

    ["あなたの時間は限られている。他人の人生を生きるために時間を使ってはいけない。", "スティーブ・ジョブズ", "大大吉", "2005年スタンフォード大学卒業式"],

    ["ハングリーであれ。愚か者であれ。", "スティーブ・ジョブズ", "大吉", "2005年スタンフォード大学卒業式"],

    ["未来は、今日何をするかによって決まる。", "マハトマ・ガンディー", "中吉", "広く帰属される言葉"],

    ["あなたが世界で見たいと思う変化に、あなた自身がなりなさい。", "マハトマ・ガンディー", "大大吉", "広く帰属される言葉"],

    ["力は身体能力から来るのではない。不屈の意志から来る。", "マハトマ・ガンディー", "大吉", "広く帰属される言葉"],

    ["生き残るのは最も強い種ではなく、変化に適応できる種である。", "チャールズ・ダーウィン", "大吉", "広く帰属される言葉"],

    ["学ぶことは、決して心を疲れさせない。", "レオナルド・ダ・ヴィンチ", "大吉", "広く知られる言葉"],

    ["シンプルさは究極の洗練である。", "レオナルド・ダ・ヴィンチ", "大大吉", "広く帰属される言葉"],

    ["天才とは、永遠の忍耐である。", "ミケランジェロ", "大吉", "広く帰属される言葉"],

    ["多くの人にとって最大の危険は、目標が低すぎて達成してしまうことだ。", "ミケランジェロ", "大大吉", "広く帰属される言葉"],

    ["もし私が遠くを見ることができたのなら、巨人の肩の上に立ったからだ。", "アイザック・ニュートン", "大吉", "1675年の手紙"],

    ["人生の幸福は、思考の質に左右される。", "マルクス・アウレリウス", "大吉", "『自省録』"],

    ["あなたの人生は、あなたの思考がつくるものだ。", "マルクス・アウレリウス", "大大吉", "『自省録』"],

    ["困難が行動を妨げることはない。行動することで困難を乗り越える。", "マルクス・アウレリウス", "大吉", "『自省録』"],

    ["経験とは、私たちが失敗につける名前にすぎない。", "オスカー・ワイルド", "大吉", "『ウィンダミア卿夫人の扇』"],

    ["私たちは皆どん底にいる。しかし、星を見上げている者もいる。", "オスカー・ワイルド", "大大吉", "『ウィンダミア卿夫人の扇』"],

    ["創造性は使えば使うほど増えていく。", "マヤ・アンジェロウ", "大大吉", "広く知られる言葉"],

    ["あなたができると思うことから始めなさい。", "ヘンリー・フォード", "大吉", "広く帰属される言葉"],

    ["できると思っても、できないと思っても、どちらも正しい。", "ヘンリー・フォード", "大大吉", "広く帰属される言葉"],

    ["障害とは、目標から目をそらしたときに見えるものだ。", "ヘンリー・フォード", "大吉", "広く帰属される言葉"],

    ["最も重要なのは、行動することだ。", "アメリア・イアハート", "大吉", "広く帰属される言葉"],

    ["最も難しいことは、行動する決断である。", "アメリア・イアハート", "大大吉", "広く帰属される言葉"],

    ["偉大なことを成し遂げるには、行動するだけではなく夢見ることも必要だ。", "アナトール・フランス", "大吉", "広く帰属される言葉"],

    ["一歩ずつ進めば、遠くまで行くことができる。", "日本のことわざ", "大大吉", "ことわざ"],

    ["継続は力なり。", "日本のことわざ", "大吉", "ことわざ"],

    ["雨垂れ石を穿つ。", "日本のことわざ", "吉", "ことわざ"],

    ["失敗は成功のもと。", "日本のことわざ", "大吉", "ことわざ"],

    ["為せば成る、為さねば成らぬ何事も。", "上杉鷹山", "大大吉", "広く知られる言葉"],

    ["初心忘るべからず。", "世阿弥", "大吉", "『花鏡』"],

    ["七転び八起き。", "日本のことわざ", "大大吉", "ことわざ"],

    ["石の上にも三年。", "日本のことわざ", "大吉", "ことわざ"],

    ["努力して結果が出ると、自信になる。", "王貞治", "大吉", "広く知られる言葉"],

    ["小さなことを積み重ねることが、遠くへ行く道になる。", "イチロー", "大吉", "広く知られる言葉"],

    ["特別なことをするために、特別な人間である必要はない。", "イチロー", "大大吉", "広く知られる言葉"],

    ["夢は見るものではなく、かなえるもの。", "大谷翔平", "大吉", "広く知られる言葉"],

    ["自分の可能性を信じることが、最初の一歩だ。", "羽生善治", "大吉", "広く知られる言葉"],

    ["努力を努力と思わないくらい続けることが大切だ。", "羽生善治", "大吉", "広く知られる言葉"],

    ["才能とは、努力を続けられることだ。", "羽生善治", "大大吉", "広く知られる言葉"],

    ["夢なき者に成功なし。", "吉田松陰", "大吉", "広く知られる言葉"],

    ["できることから、まず始めなさい。", "ヨハン・ヴォルフガング・フォン・ゲーテ", "大吉", "広く帰属される言葉"],

    ["今日という日は、二度と戻ってこない。", "ウィリアム・シェイクスピア", "吉", "広く帰属される言葉"],

    ["行動は雄弁である。", "ウィリアム・シェイクスピア", "大吉", "広く帰属される言葉"],

    ["希望は、目覚めている人の夢である。", "アリストテレス", "大吉", "広く帰属される言葉"],

    ["私たちは繰り返し行うことの結果である。", "アリストテレス", "大大吉", "広く帰属される言葉"],

    ["卓越とは一度の行為ではなく、習慣である。", "アリストテレス", "大吉", "広く帰属される言葉"],

    ["学ぶことは人生そのものの一部である。", "プラトン", "大吉", "広く帰属される言葉"],

    ["自分自身を知ることが、知恵の始まりである。", "ソクラテス", "大大吉", "広く帰属される言葉"],

    ["知恵とは、自分が何も知らないと知ることである。", "ソクラテス", "大吉", "広く帰属される言葉"],

    ["疑問を持つことから、学びは始まる。", "ソクラテス", "大吉", "広く帰属される言葉"],

    ["未来は、今この瞬間から変えられる。", "マハトマ・ガンディー", "吉", "広く帰属される言葉"],

    ["努力は必ずしも成功を保証しない。しかし成長を保証する。", "マイケル・ジョーダン", "大吉", "広く知られる言葉"],

    ["私は何度も失敗した。それが成功した理由だ。", "マイケル・ジョーダン", "大大吉", "広く帰属される言葉"],

    ["限界を決めるのは、自分自身だ。", "マイケル・ジョーダン", "大吉", "広く帰属される言葉"],

    ["成功とは、情熱を失わずに失敗から失敗へ進むことである。", "ウィンストン・チャーチル", "大吉", "広く帰属される言葉"],

    ["努力を続ける者に、道は開ける。", "日本のことわざ", "吉", "ことわざ"],

    ["学ぶことをやめたとき、成長も止まる。", "レオナルド・ダ・ヴィンチ", "大吉", "広く帰属される言葉"],

    ["夢を持つことは、未来をつくることだ。", "エレノア・ルーズベルト", "大吉", "広く帰属される言葉"],

    ["今日の小さな一歩が、明日の大きな力になる。", "日本のことわざ", "大大吉", "広く伝わる言葉"],

    /* シークレット */

    ["秘密の扉は、挑戦した者にだけ開かれる。", "学びの御神籤", "シークレット", "特別収録"],

    ["努力の先にある景色は、努力した人にしか見えない。", "学びの御神籤", "シークレット", "特別収録"],

    ["今日の一歩を重ねた者だけが、まだ見ぬ明日へ進める。", "学びの御神籤", "シークレット", "特別収録"],

    ["最後まであきらめなかった人だけが、自分の可能性を知る。", "学びの御神籤", "シークレット", "特別収録"]

];


/* =========================================================
   名言をオブジェクト化
========================================================= */

quotes.forEach((q, i) => {

    q.id = i + 1;

    q.quote = q[0];

    q.author = q[1];

    q.fortune = q[2];

    q.source = q[3];

});


/* =========================================================
   DOM
========================================================= */

let drawButton;

let fortuneElement;
let quoteElement;
let authorElement;

let cooldownElement;
let cooldownMessageElement;

let bookGrid;

let achievementRate;
let achievementCount;
let progressBar;

let modal;
let closeModal;

let modalFortune;
let modalQuote;
let modalAuthor;
let modalSource;

let settingsButton;
let settingsModal;
let closeSettings;

let addMessage;
let saveSettings;
let messageInputs;


/* =========================================================
   状態
========================================================= */

let collected = [];

let lastDraw = 0;

let currentCooldownDuration = COOLDOWN_TIME;

let supportMessages = [];

let currentSupportMessage = "";

let todayChallenge = "";


/* =========================================================
   初期化
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    initialize
);


function initialize() {

    drawButton =
        document.getElementById("drawButton");

    fortuneElement =
        document.getElementById("fortune");

    quoteElement =
        document.getElementById("quote");

    authorElement =
        document.getElementById("author");

    cooldownElement =
        document.getElementById("cooldown");

    cooldownMessageElement =
        document.getElementById("cooldownMessage");

    bookGrid =
        document.getElementById("bookGrid");

    achievementRate =
        document.getElementById("achievementRate");

    achievementCount =
        document.getElementById("achievementCount");

    progressBar =
        document.getElementById("progressBar");


    modal =
        document.getElementById("modal");

    closeModal =
        document.getElementById("closeModal");

    modalFortune =
        document.getElementById("modalFortune");

    modalQuote =
        document.getElementById("modalQuote");

    modalAuthor =
        document.getElementById("modalAuthor");

    modalSource =
        document.getElementById("modalSource");


    settingsButton =
        document.getElementById("settingsButton");

    settingsModal =
        document.getElementById("settingsModal");

    closeSettings =
        document.getElementById("closeSettings");

    addMessage =
        document.getElementById("addMessage");

    saveSettings =
        document.getElementById("saveSettings");

    messageInputs =
        document.getElementById("messageInputs");


    collected =
        loadCollection();


    lastDraw =
        Number(
            localStorage.getItem(
                STORAGE_LAST_DRAW
            )
        ) || 0;


    currentCooldownDuration =
        Number(
            localStorage.getItem(
                STORAGE_COOLDOWN_DURATION
            )
        ) || COOLDOWN_TIME;


    if (
        currentCooldownDuration !==
            COOLDOWN_TIME &&
        currentCooldownDuration !==
            DUPLICATE_COOLDOWN_TIME
    ) {

        currentCooldownDuration =
            COOLDOWN_TIME;

    }


    supportMessages =
        loadMessages();


    todayChallenge =
        localStorage.getItem(
            STORAGE_CHALLENGE
        ) || "";


    currentSupportMessage =
        localStorage.getItem(
            STORAGE_SUPPORT
        ) || "";


    setupEvents();


    updateBook();

    updateAchievement();

    updateCooldown();


    setInterval(
        updateCooldown,
        1000
    );

}


/* =========================================================
   イベント
========================================================= */

function setupEvents() {

    if (drawButton) {

        drawButton.addEventListener(
            "click",
            drawOmikuji
        );

    }


    if (closeModal) {

        closeModal.addEventListener(
            "click",
            closeQuoteModal
        );

    }


    if (modal) {

        modal.addEventListener(
            "click",
            event => {

                if (
                    event.target === modal
                ) {

                    closeQuoteModal();

                }

            }
        );

    }


    if (settingsButton) {

        settingsButton.addEventListener(
            "click",
            openSettings
        );

    }


    if (closeSettings) {

        closeSettings.addEventListener(
            "click",
            closeSettingsModal
        );

    }


    if (settingsModal) {

        settingsModal.addEventListener(
            "click",
            event => {

                if (
                    event.target ===
                    settingsModal
                ) {

                    closeSettingsModal();

                }

            }
        );

    }


    if (addMessage) {

        addMessage.addEventListener(
            "click",
            () => {

                createMessageInput("");

            }
        );

    }


    if (saveSettings) {

        saveSettings.addEventListener(
            "click",
            saveSupportMessages
        );

    }


    document.addEventListener(
        "keydown",
        event => {

            if (event.key === "Escape") {

                closeQuoteModal();

                closeSettingsModal();

            }

        }
    );

}


/* =========================================================
   御神籤を引く
========================================================= */

function drawOmikuji() {

    if (isCooldown()) {

        updateCooldown();

        return;

    }


    if (
        !drawButton ||
        quotes.length === 0
    ) {

        return;

    }


    drawButton.disabled = true;

    drawButton.textContent =
        "🎋 引いています…";


    setTimeout(() => {

        const item =
            getRandomQuote();


        /*
         * 重要
         *
         * 登録前に確認する。
         *
         * これによって、
         * 「すでに持っている名言」
         * なのかを正しく判断できる。
         */

        const isDuplicate =
            collected.includes(item.id);


        /*
         * 結果表示
         */

        showResult(item);


        /*
         * 図鑑登録
         *
         * 重複なら何も追加されない。
         */

        registerQuote(item.id);


        /*
         * クールタイムを決定
         *
         * 初回 → 30分
         * 重複 → 25分
         */

        if (isDuplicate) {

            currentCooldownDuration =
                DUPLICATE_COOLDOWN_TIME;

        } else {

            currentCooldownDuration =
                COOLDOWN_TIME;

        }


        /*
         * クールタイム開始時刻
         */

        lastDraw =
            Date.now();


        /*
         * 保存
         */

        localStorage.setItem(
            STORAGE_LAST_DRAW,
            String(lastDraw)
        );


        localStorage.setItem(
            STORAGE_COOLDOWN_DURATION,
            String(
                currentCooldownDuration
            )
        );


        /*
         * クールタイム中に表示する
         * 課題を決定
         */

        createTodayChallenge();


        /*
         * 学びの神託を1回だけ決定
         */

        chooseSupportMessage();


        /*
         * 画面更新
         */

        updateBook();

        updateAchievement();

        updateCooldown();


        /*
         * 重複だった場合
         * ボーナス表示
         */

        if (isDuplicate) {

            showDuplicateNotification();

        }


        /*
         * レアリティ演出
         */

        playRarityEffect(item);


    }, 500);

}


/* =========================================================
   レアリティ抽選
========================================================= */

function getRandomQuote() {

    const secretQuotes =
        quotes.filter(
            q =>
                q.fortune ===
                "シークレット"
        );


    const normalQuotes =
        quotes.filter(
            q =>
                q.fortune !==
                "シークレット"
        );


    /*
     * シークレット：約2%
     */

    if (
        secretQuotes.length > 0 &&
        Math.random() < 0.02
    ) {

        return secretQuotes[
            Math.floor(
                Math.random() *
                secretQuotes.length
            )
        ];

    }


    return normalQuotes[
        Math.floor(
            Math.random() *
            normalQuotes.length
        )
    ];

}


/* =========================================================
   結果表示
========================================================= */

function showResult(item) {

    if (fortuneElement) {

        fortuneElement.textContent =
            item.fortune;


        fortuneElement.className =
            "";


        fortuneElement.classList.add(
            "rarity-" +
            item.fortune
        );

    }


    if (quoteElement) {

        quoteElement.textContent =
            `「${item.quote}」`;

    }


    if (authorElement) {

        authorElement.textContent =
            `― ${item.author}`;

    }

}


/* =========================================================
   図鑑登録
========================================================= */

function registerQuote(id) {

    /*
     * すでに登録済みなら終了
     *
     * これにより重複時に
     * 達成率が増えない。
     */

    if (
        collected.includes(id)
    ) {

        return;

    }


    collected.push(id);


    collected.sort(
        (a, b) => a - b
    );


    localStorage.setItem(
        STORAGE_COLLECTION,
        JSON.stringify(collected)
    );

}


/* =========================================================
   図鑑表示
========================================================= */

function updateBook() {

    if (!bookGrid) {

        return;

    }


    bookGrid.innerHTML = "";


    quotes.forEach(item => {

        const card =
            document.createElement(
                "div"
            );


        card.className =
            "book-card";


        const unlocked =
            collected.includes(
                item.id
            );


        if (unlocked) {

            card.classList.add(
                "unlocked"
            );


            card.innerHTML = `

                <div class="book-number">
                    No.${String(item.id).padStart(3, "0")}
                </div>

                <div class="book-fortune">
                    ${escapeHTML(item.fortune)}
                </div>

                <div class="book-author">
                    ${escapeHTML(item.author)}
                </div>

            `;


            /*
             * 登録済みの御神籤をクリックすると
             * 名言の詳細を表示
             */

            card.addEventListener(
                "click",
                () => {

                    openQuoteModal(item);

                }
            );

        } else {

            card.classList.add(
                "locked"
            );


            card.innerHTML = `

                <div class="book-number">
                    No.${String(item.id).padStart(3, "0")}
                </div>

                <div class="lock">
                    🔒
                </div>

            `;

        }


        bookGrid.appendChild(card);

    });

}


/* =========================================================
   達成率
========================================================= */

function updateAchievement() {

    const current =
        collected.length;


    const total =
        quotes.length;


    if (total <= 0) {

        return;

    }


    const percentage =
        Math.floor(
            (current / total) *
            100
        );


    if (achievementRate) {

        achievementRate.textContent =
            `${percentage}%`;

    }


    if (achievementCount) {

        achievementCount.textContent =
            `${current} / ${total}`;

    }


    if (progressBar) {

        progressBar.style.width =
            `${percentage}%`;

    }

}


/* =========================================================
   名言モーダル
========================================================= */

function openQuoteModal(item) {

    if (!modal) {

        return;

    }


    if (modalFortune) {

        modalFortune.textContent =
            item.fortune;

    }


    if (modalQuote) {

        modalQuote.textContent =
            `「${item.quote}」`;

    }


    if (modalAuthor) {

        modalAuthor.textContent =
            `― ${item.author}`;

    }


    if (modalSource) {

        modalSource.textContent =
            `出典：${item.source}`;

    }


    modal.classList.add(
        "open"
    );

}


function closeQuoteModal() {

    if (modal) {

        modal.classList.remove(
            "open"
        );

    }

}


/* =========================================================
   クールタイム
========================================================= */

function isCooldown() {

    if (!lastDraw) {

        return false;

    }


    return (
        Date.now() -
        lastDraw <
        currentCooldownDuration
    );

}


/* =========================================================
   残り時間
========================================================= */

function getRemainingTime() {

    if (!lastDraw) {

        return 0;

    }


    return Math.max(

        0,

        currentCooldownDuration -
        (
            Date.now() -
            lastDraw
        )

    );

}


/* =========================================================
   クールタイム表示
========================================================= */

function updateCooldown() {

    const remaining =
        getRemainingTime();


    /*
     * クールタイム終了
     */

    if (remaining <= 0) {

        if (drawButton) {

            drawButton.disabled =
                false;


            drawButton.textContent =
                "🎋 御神籤を引く";

        }


        if (cooldownElement) {

            cooldownElement.textContent =
                "✨ 御神籤を引くことができます";

        }


        finishCooldown();

        return;

    }


    /*
     * クールタイム中
     */

    if (drawButton) {

        drawButton.disabled =
            true;


        drawButton.textContent =
            "⏳ 次の御神籤まで待機";

    }


    const totalSeconds =
        Math.ceil(
            remaining / 1000
        );


    const minutes =
        Math.floor(
            totalSeconds / 60
        );


    const seconds =
        totalSeconds % 60;


    if (cooldownElement) {

        cooldownElement.textContent =
            `次の御神籤まで ${minutes}分 ${String(seconds).padStart(2, "0")}秒`;

    }


    /*
     * 課題はクールタイム中に
     * まだ決まっていなければ決定。
     */

    if (!todayChallenge) {

        createTodayChallenge();

    }


    /*
     * 応援メッセージは
     * クールタイム中に変更しない。
     */

    if (!currentSupportMessage) {

        chooseSupportMessage();

    }


    showCooldownContent();

}


/* =========================================================
   クールタイム終了
========================================================= */

function finishCooldown() {

    todayChallenge = "";

    currentSupportMessage = "";


    localStorage.removeItem(
        STORAGE_CHALLENGE
    );


    localStorage.removeItem(
        STORAGE_SUPPORT
    );


    localStorage.removeItem(
        STORAGE_COOLDOWN_DURATION
    );


    currentCooldownDuration =
        COOLDOWN_TIME;


    if (cooldownMessageElement) {

        cooldownMessageElement.style.display =
            "none";

    }

}


/* =========================================================
   本日の課題
========================================================= */

function createTodayChallenge() {

    /*
     * すでに決まっていたら変更しない。
     */

    if (todayChallenge) {

        return;

    }


    const index =
        Math.floor(
            Math.random() *
            challengeTasks.length
        );


    todayChallenge =
        challengeTasks[index];


    localStorage.setItem(
        STORAGE_CHALLENGE,
        todayChallenge
    );

}


/* =========================================================
   学びの神託
========================================================= */

function chooseSupportMessage() {

    const messages =
        supportMessages.length > 0
            ? supportMessages
            : defaultSupportMessages;


    const index =
        Math.floor(
            Math.random() *
            messages.length
        );


    currentSupportMessage =
        messages[index];


    /*
     * 一度決めたら、
     * クールタイムが終わるまで
     * 変更しない。
     */

    localStorage.setItem(
        STORAGE_SUPPORT,
        currentSupportMessage
    );

}


/* =========================================================
   クールタイム中のコンテンツ
========================================================= */

function showCooldownContent() {

    if (!cooldownMessageElement) {

        return;

    }


    if (!currentSupportMessage) {

        chooseSupportMessage();

    }


    if (!todayChallenge) {

        createTodayChallenge();

    }


    cooldownMessageElement.innerHTML = `

        <div class="support-title">
            🌸 学びの神託
        </div>

        <div class="support-text">
            「${escapeHTML(currentSupportMessage)}」
        </div>

        <div class="today-challenge">

            <div class="challenge-title">
                📚 本日挑戦する課題
            </div>

            <div class="challenge-text">
                ${escapeHTML(todayChallenge)}
            </div>

        </div>

    `;


    cooldownMessageElement.style.display =
        "block";

}


/* =========================================================
   重複ボーナス
========================================================= */

function showDuplicateNotification() {

    let notification =
        document.querySelector(
            ".duplicate-notification"
        );


    /*
     * なければ自動生成
     */

    if (!notification) {

        notification =
            document.createElement(
                "div"
            );


        notification.className =
            "duplicate-notification";


        document.body.appendChild(
            notification
        );

    }


    notification.innerHTML = `

        <div class="duplicate-title">
            ✦ 重複ボーナス
        </div>

        <div class="duplicate-text">
            すでに図鑑に登録されている御神籤です
        </div>

        <div class="duplicate-bonus">
            次のクールタイム −5分
        </div>

    `;


    notification.classList.add(
        "show"
    );


    /*
     * 3秒後に消す
     */

    setTimeout(
        () => {

            notification.classList.remove(
                "show"
            );

        },
        3000
    );

}


/* =========================================================
   レアリティ演出
========================================================= */

function playRarityEffect(item) {

    /*
     * シークレットの場合
     */

    if (
        item.fortune ===
        "シークレット"
    ) {

        document.body.classList.add(
            "secret-effect"
        );


        setTimeout(
            () => {

                document.body.classList.remove(
                    "secret-effect"
                );

            },
            2500
        );


        return;

    }


    /*
     * 大大吉
     */

    if (
        item.fortune ===
        "大大吉"
    ) {

        document.body.classList.add(
            "great-effect"
        );


        setTimeout(
            () => {

                document.body.classList.remove(
                    "great-effect"
                );

            },
            1800
        );

    }

}


/* =========================================================
   設定
========================================================= */

function openSettings() {

    renderMessageInputs();


    if (settingsModal) {

        settingsModal.classList.add(
            "open"
        );

    }

}


function closeSettingsModal() {

    if (settingsModal) {

        settingsModal.classList.remove(
            "open"
        );

    }

}


/* =========================================================
   設定メッセージ表示
========================================================= */

function renderMessageInputs() {

    if (!messageInputs) {

        return;

    }


    messageInputs.innerHTML = "";


    /*
     * まだ設定がない場合
     */

    if (
        supportMessages.length === 0
    ) {

        createMessageInput("");

        return;

    }


    supportMessages.forEach(
        message => {

            createMessageInput(
                message
            );

        }
    );

}


/* =========================================================
   メッセージ入力欄作成
========================================================= */

function createMessageInput(value) {

    if (!messageInputs) {

        return;

    }


    const row =
        document.createElement(
            "div"
        );


    row.className =
        "message-row";


    const input =
        document.createElement(
            "input"
        );


    input.type =
        "text";


    input.placeholder =
        "勉強を応援するメッセージ";


    input.value =
        value || "";


    const deleteButton =
        document.createElement(
            "button"
        );


    deleteButton.type =
        "button";


    deleteButton.className =
        "delete-message";


    deleteButton.textContent =
        "×";


    deleteButton.addEventListener(
        "click",
        () => {

            row.remove();

        }
    );


    row.appendChild(
        input
    );


    row.appendChild(
        deleteButton
    );


    messageInputs.appendChild(
        row
    );

}


/* =========================================================
   設定保存
========================================================= */

function saveSupportMessages() {

    if (!messageInputs) {

        return;

    }


    const inputs =
        messageInputs.querySelectorAll(
            "input"
        );


    supportMessages =
        Array.from(inputs)

            .map(
                input =>
                    input.value.trim()
            )

            .filter(
                message =>
                    message.length > 0
            );


    localStorage.setItem(
        STORAGE_MESSAGES,
        JSON.stringify(
            supportMessages
        )
    );


    /*
     * 現在のクールタイム中の
     * 学びの神託は変更しない。
     *
     * 次回の御神籤から反映される。
     */


    closeSettingsModal();

}


/* =========================================================
   図鑑データ読み込み
========================================================= */

function loadCollection() {

    try {

        const data =
            JSON.parse(
                localStorage.getItem(
                    STORAGE_COLLECTION
                )
            );


        if (
            Array.isArray(data)
        ) {

            return data

                .map(Number)

                .filter(
                    id =>
                        Number.isInteger(id) &&
                        id >= 1 &&
                        id <= quotes.length
                );

        }

    } catch (error) {

        console.error(
            "図鑑データの読み込みに失敗しました。",
            error
        );

    }


    return [];

}


/* =========================================================
   応援メッセージ読み込み
========================================================= */

function loadMessages() {

    try {

        const data =
            JSON.parse(
                localStorage.getItem(
                    STORAGE_MESSAGES
                )
            );


        if (
            Array.isArray(data)
        ) {

            return data

                .filter(
                    message =>
                        typeof message ===
                        "string"
                )

                .map(
                    message =>
                        message.trim()
                )

                .filter(
                    message =>
                        message.length > 0
                );

        }

    } catch (error) {

        console.error(
            "設定データの読み込みに失敗しました。",
            error
        );

    }


    return [];

}


/* =========================================================
   HTMLエスケープ
========================================================= */

function escapeHTML(text) {

    const div =
        document.createElement(
            "div"
        );


    div.textContent =
        String(text);


    return div.innerHTML;

}
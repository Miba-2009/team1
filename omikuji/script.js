"use strict";

/* =========================================================
   学びの御神籤
   script.js 完成版
   ・名言100種類
   ・日本語＋偉人名
   ・吉 / 大吉 / 大大吉 / スーパー大吉 / シークレット
   ・シークレット出現率 2%
   ・30分クールタイム
   ・図鑑＋達成率
   ・図鑑クリックで名言表示
   ・学びの神託
   ・本日の課題
   ・設定した応援メッセージ
   ・重複時5分クールタイム短縮
   ・全100種コンプリート演出
========================================================= */


/* =========================================================
   基本設定
========================================================= */

const COOLDOWN_TIME = 30 * 60 * 1000;
const DUPLICATE_REDUCTION = 5 * 60 * 1000;


/* =========================================================
   名言100種類
========================================================= */

const quotes = [

    { id:1, quote:"成功するまで、失敗を重ね続ければいい。", author:"松下幸之助", rarity:"吉" },
    { id:2, quote:"失敗したところでやめてしまうから失敗になる。成功するまで続ければ、それは成功になる。", author:"松下幸之助", rarity:"大吉" },
    { id:3, quote:"夢なき者に理想なし。理想なき者に計画なし。計画なき者に実行なし。", author:"吉田松陰", rarity:"大大吉" },
    { id:4, quote:"為せば成る。為さねば成らぬ何事も。", author:"上杉鷹山", rarity:"吉" },
    { id:5, quote:"天は人の上に人を造らず、人の下に人を造らず。", author:"福沢諭吉", rarity:"大吉" },
    { id:6, quote:"学問は身を立てるための大切な力である。", author:"福沢諭吉", rarity:"吉" },
    { id:7, quote:"志を立てて、以て万事の源となす。", author:"吉田松陰", rarity:"大吉" },
    { id:8, quote:"人間万事塞翁が馬。", author:"淮南子", rarity:"吉" },
    { id:9, quote:"少年老い易く学成り難し。一寸の光陰軽んずべからず。", author:"朱熹", rarity:"大吉" },
    { id:10, quote:"知ることよりも、実際に行うことのほうが大切である。", author:"王陽明", rarity:"吉" },

    { id:11, quote:"学んで時にこれを習う。亦た説ばしからずや。", author:"孔子", rarity:"大吉" },
    { id:12, quote:"過ちを犯して改めないことこそ、本当の過ちである。", author:"孔子", rarity:"吉" },
    { id:13, quote:"己の欲せざる所、人に施すことなかれ。", author:"孔子", rarity:"大吉" },
    { id:14, quote:"知る者は好む者に及ばず。好む者は楽しむ者に及ばない。", author:"孔子", rarity:"大大吉" },
    { id:15, quote:"学び続ければ、必ず新しい発見がある。", author:"レオナルド・ダ・ヴィンチ", rarity:"吉" },
    { id:16, quote:"鉄は使わなければ錆び、人の知性も使わなければ衰える。", author:"レオナルド・ダ・ヴィンチ", rarity:"大吉" },
    { id:17, quote:"簡潔さは究極の洗練である。", author:"レオナルド・ダ・ヴィンチ", rarity:"吉" },
    { id:18, quote:"障害が大きいほど、それを乗り越えたときの栄光も大きい。", author:"モリエール", rarity:"大吉" },
    { id:19, quote:"偉大なことをするためには、行動しなければならない。", author:"ミケランジェロ", rarity:"吉" },
    { id:20, quote:"まだ学ぶべきことがたくさんある。", author:"ミケランジェロ", rarity:"大大吉" },

    { id:21, quote:"できると思えばできる。できないと思えばできない。", author:"ヘンリー・フォード", rarity:"吉" },
    { id:22, quote:"失敗とは、もう一度始めるための機会である。", author:"ヘンリー・フォード", rarity:"大吉" },
    { id:23, quote:"集まって考えることは始まり、協力することは進歩、共に働くことは成功である。", author:"ヘンリー・フォード", rarity:"吉" },
    { id:24, quote:"成功とは、失敗から失敗へ情熱を失わずに進むことである。", author:"ウィンストン・チャーチル", rarity:"大吉" },
    { id:25, quote:"改善するためには、変わることを恐れてはいけない。", author:"ウィンストン・チャーチル", rarity:"吉" },
    { id:26, quote:"勇気とは、恐れがないことではなく、恐れより大切なものがあることだ。", author:"ネルソン・マンデラ", rarity:"大大吉" },
    { id:27, quote:"教育は世界を変えるために使える最も強力な武器である。", author:"ネルソン・マンデラ", rarity:"大吉" },
    { id:28, quote:"いつも不可能に見えることが、成し遂げられるまでは不可能に見える。", author:"ネルソン・マンデラ", rarity:"吉" },
    { id:29, quote:"未来は、今日何をするかによって決まる。", author:"マハトマ・ガンディー", rarity:"大吉" },
    { id:30, quote:"弱い人は許すことができない。許すことは強さの証である。", author:"マハトマ・ガンディー", rarity:"吉" },

    { id:31, quote:"自分が世界に見たい変化そのものになりなさい。", author:"マハトマ・ガンディー", rarity:"大大吉" },
    { id:32, quote:"偉大な夢を持つ人には、大きな力が宿る。", author:"エレノア・ルーズベルト", rarity:"吉" },
    { id:33, quote:"未来は、自分の夢を信じる人のものである。", author:"エレノア・ルーズベルト", rarity:"大吉" },
    { id:34, quote:"自分にはできないと思った瞬間に、可能性を閉ざしてしまう。", author:"エレノア・ルーズベルト", rarity:"吉" },
    { id:35, quote:"人生で最も重要なのは、挑戦し続けることである。", author:"アルベルト・アインシュタイン", rarity:"大吉" },
    { id:36, quote:"失敗したことがない人は、新しいことに挑戦したことがない人だ。", author:"アルベルト・アインシュタイン", rarity:"大大吉" },
    { id:37, quote:"想像力は知識よりも大切である。", author:"アルベルト・アインシュタイン", rarity:"吉" },
    { id:38, quote:"学ぶことをやめたとき、人は成長することをやめる。", author:"アルベルト・アインシュタイン", rarity:"大吉" },
    { id:39, quote:"一度に一つのことに集中しなさい。", author:"アレクサンダー・グラハム・ベル", rarity:"吉" },
    { id:40, quote:"成功への道は、失敗を恐れず歩き続けることにある。", author:"トーマス・エジソン", rarity:"大吉" },

    { id:41, quote:"私は失敗していない。うまくいかない方法を見つけただけだ。", author:"トーマス・エジソン", rarity:"大大吉" },
    { id:42, quote:"天才とは、一パーセントのひらめきと九十九パーセントの努力である。", author:"トーマス・エジソン", rarity:"吉" },
    { id:43, quote:"機会を待つのではなく、自分で機会を作りなさい。", author:"ジョージ・バーナード・ショー", rarity:"大吉" },
    { id:44, quote:"人生は自分で作るものだ。そうでなければ、誰かに作られてしまう。", author:"ジョージ・バーナード・ショー", rarity:"吉" },
    { id:45, quote:"人生で大切なのは、何を得るかではなく、何になるかである。", author:"ヘンリー・デイヴィッド・ソロー", rarity:"大吉" },
    { id:46, quote:"夢に向かって自信を持って進みなさい。", author:"ヘンリー・デイヴィッド・ソロー", rarity:"吉" },
    { id:47, quote:"前へ進むためには、まず一歩を踏み出さなければならない。", author:"マーティン・ルーサー・キング・ジュニア", rarity:"大吉" },
    { id:48, quote:"正しいことをするために、正しい時を待つ必要はない。", author:"マーティン・ルーサー・キング・ジュニア", rarity:"大大吉" },
    { id:49, quote:"どんなに暗い夜でも、朝は必ずやってくる。", author:"マーティン・ルーサー・キング・ジュニア", rarity:"吉" },
    { id:50, quote:"始めることが、成功への第一歩である。", author:"マーク・トウェイン", rarity:"大吉" },

    { id:51, quote:"二十年後、やらなかったことを後悔するだろう。", author:"マーク・トウェイン", rarity:"吉" },
    { id:52, quote:"努力なしに価値あるものを得ることはできない。", author:"ベンジャミン・フランクリン", rarity:"大吉" },
    { id:53, quote:"知識への投資は、最高の利息を生む。", author:"ベンジャミン・フランクリン", rarity:"大大吉" },
    { id:54, quote:"時間を失うことは、人生の一部を失うことである。", author:"ベンジャミン・フランクリン", rarity:"吉" },
    { id:55, quote:"未来を予測する最善の方法は、自分で未来を作ることだ。", author:"ピーター・ドラッカー", rarity:"大吉" },
    { id:56, quote:"成果を上げる人は、時間を大切にする。", author:"ピーター・ドラッカー", rarity:"吉" },
    { id:57, quote:"最も重要なことから始めなさい。", author:"ピーター・ドラッカー", rarity:"大吉" },
    { id:58, quote:"小さなことを積み重ねることが、とんでもないところへ行くただ一つの道だ。", author:"イチロー", rarity:"大大吉" },
    { id:59, quote:"努力したことは、すぐには結果にならなくても無駄にはならない。", author:"イチロー", rarity:"吉" },
    { id:60, quote:"夢をつかむには、夢を持ち続けることが必要だ。", author:"イチロー", rarity:"大吉" },

    { id:61, quote:"自分の限界を決めるのは、自分自身である。", author:"大谷翔平", rarity:"吉" },
    { id:62, quote:"小さな積み重ねが、大きな結果につながる。", author:"大谷翔平", rarity:"大吉" },
    { id:63, quote:"目標を持つことで、今やるべきことが見えてくる。", author:"大谷翔平", rarity:"吉" },
    { id:64, quote:"自分を信じることが、すべての始まりだ。", author:"本田宗一郎", rarity:"大吉" },
    { id:65, quote:"失敗を恐れてはいけない。失敗から学ぶことが大切だ。", author:"本田宗一郎", rarity:"吉" },
    { id:66, quote:"やってみなければ、何も始まらない。", author:"本田宗一郎", rarity:"大大吉" },
    { id:67, quote:"夢を見ることができるなら、それを実現できる。", author:"ウォルト・ディズニー", rarity:"大吉" },
    { id:68, quote:"すべての夢は、まず小さな一歩から始まる。", author:"ウォルト・ディズニー", rarity:"吉" },
    { id:69, quote:"困難の中にこそ、チャンスがある。", author:"アルベルト・アインシュタイン", rarity:"大吉" },
    { id:70, quote:"人生は自転車に乗るようなものだ。バランスを保つには進み続けなければならない。", author:"アルベルト・アインシュタイン", rarity:"大大吉" },

    { id:71, quote:"知識は力である。", author:"フランシス・ベーコン", rarity:"吉" },
    { id:72, quote:"読むことは人を豊かにし、話すことは人を機敏にし、書くことは人を正確にする。", author:"フランシス・ベーコン", rarity:"大吉" },
    { id:73, quote:"偉大な仕事は、一人の力だけでは成し遂げられない。", author:"アンドリュー・カーネギー", rarity:"吉" },
    { id:74, quote:"成功する人は、失敗してもそこから立ち上がる。", author:"アンドリュー・カーネギー", rarity:"大吉" },
    { id:75, quote:"成功は努力の積み重ねによって生まれる。", author:"ロバート・コリアー", rarity:"吉" },
    { id:76, quote:"始めることを恐れてはいけない。", author:"デール・カーネギー", rarity:"大吉" },
    { id:77, quote:"今日という一日を大切に生きなさい。", author:"デール・カーネギー", rarity:"吉" },
    { id:78, quote:"成功とは、熱意を失わずに失敗から失敗へ進むことである。", author:"ウィンストン・チャーチル", rarity:"大大吉" },
    { id:79, quote:"未来を恐れる必要はない。今日を大切にすればいい。", author:"マハトマ・ガンディー", rarity:"吉" },
    { id:80, quote:"努力する人にとって、できないことは学ぶべき課題である。", author:"アリストテレス", rarity:"大吉" },

    { id:81, quote:"私たちは繰り返し行うことによって、自分自身を作っている。", author:"アリストテレス", rarity:"大大吉" },
    { id:82, quote:"教育の根は苦い。しかし、その果実は甘い。", author:"アリストテレス", rarity:"吉" },
    { id:83, quote:"始めるのに遅すぎるということはない。", author:"カール・ヒルティ", rarity:"吉" },
    { id:84, quote:"人生の価値は、何を得たかではなく、何を与えたかで決まる。", author:"アルベルト・アインシュタイン", rarity:"大吉" },
    { id:85, quote:"自分自身を知ることが、成長の第一歩である。", author:"ソクラテス", rarity:"大大吉" },
    { id:86, quote:"学ぶことは、自分が何も知らないと知ることから始まる。", author:"ソクラテス", rarity:"吉" },
    { id:87, quote:"困難は、人を成長させる教師になる。", author:"セネカ", rarity:"大吉" },
    { id:88, quote:"幸運とは、準備と機会が出会ったときに生まれる。", author:"セネカ", rarity:"吉" },
    { id:89, quote:"最も大切なのは、今この瞬間にできることをすることだ。", author:"マルクス・アウレリウス", rarity:"大吉" },
    { id:90, quote:"人生の幸福は、自分の考え方によって決まる。", author:"マルクス・アウレリウス", rarity:"吉" },

    { id:91, quote:"自分にできることから始めればいい。", author:"フリードリヒ・フォン・シラー", rarity:"大吉" },
    { id:92, quote:"夢を追い続ける勇気こそ、夢を実現する力になる。", author:"パウロ・コエーリョ", rarity:"大大吉" },
    { id:93, quote:"一歩ずつ進めば、遠い道も必ず近づいてくる。", author:"老子", rarity:"吉" },
    { id:94, quote:"千里の道も一歩から始まる。", author:"老子", rarity:"大吉" },
    { id:95, quote:"自分を変えることができれば、世界の見え方も変わる。", author:"レフ・トルストイ", rarity:"吉" },
    { id:96, quote:"できることを、できる場所で、できる限りやりなさい。", author:"セオドア・ルーズベルト", rarity:"大吉" },
    { id:97, quote:"何かを成し遂げたいなら、まず自分自身を信じなさい。", author:"ラルフ・ワルド・エマーソン", rarity:"大大吉" },
    { id:98, quote:"あなたが恐れていることを一つずつ行えば、恐怖は小さくなる。", author:"デール・カーネギー", rarity:"スーパー大吉" },
    { id:99, quote:"あなたの人生を変える力は、あなた自身の中にある。", author:"マハトマ・ガンディー", rarity:"大大吉" },
    { id:100, quote:"学び続ける者には、必ず新しい道が開かれる。", author:"学びの神託", rarity:"シークレット" }

];


if (quotes.length !== 100) {
    console.error(`名言数エラー：${quotes.length}個`);
}


/* =========================================================
   DOM
========================================================= */

const drawButton = document.getElementById("drawButton");
const quoteElement = document.getElementById("quote");
const authorElement = document.getElementById("author");
const fortuneElement = document.getElementById("fortune");
const cooldownElement = document.getElementById("cooldown");
const cooldownMessage = document.getElementById("cooldownMessage");
const bookGrid = document.getElementById("bookGrid");
const achievementRate = document.getElementById("achievementRate");
const achievementCount = document.getElementById("achievementCount");
const progressBar = document.getElementById("progressBar");

const settingsButton = document.getElementById("settingsButton");
const settingsModal = document.getElementById("settingsModal");
const closeSettings = document.getElementById("closeSettings");
const addMessageButton = document.getElementById("addMessage");
const saveSettingsButton = document.getElementById("saveSettings");
const messageInputs = document.getElementById("messageInputs");

const modal = document.getElementById("modal");
const closeModal = document.getElementById("closeModal");
const modalQuote = document.getElementById("modalQuote");
const modalAuthor = document.getElementById("modalAuthor");
const modalFortune = document.getElementById("modalFortune");
const modalSource = document.getElementById("modalSource");


/* =========================================================
   LocalStorage
========================================================= */

const STORAGE_KEYS = {
    collection: "manabiOmikujiCollection",
    cooldown: "manabiOmikujiCooldown",
    messages: "manabiOmikujiMessages",
    currentQuote: "manabiOmikujiCurrentQuote",
    challenge: "manabiOmikujiChallenge",
    cooldownSupport: "manabiOmikujiCooldownSupport",
    completed: "manabiOmikujiCompleted"
};


/* =========================================================
   図鑑
========================================================= */

function getCollection() {

    try {

        const data = JSON.parse(
            localStorage.getItem(
                STORAGE_KEYS.collection
            )
        );

        return Array.isArray(data) ? data : [];

    } catch {

        return [];

    }
}


function saveCollection(collection) {

    localStorage.setItem(
        STORAGE_KEYS.collection,
        JSON.stringify(collection)
    );

}


/* =========================================================
   クールタイム
========================================================= */

function getCooldownEnd() {

    return Number(
        localStorage.getItem(
            STORAGE_KEYS.cooldown
        )
    ) || 0;

}


function setCooldown() {

    const end =
        Date.now() + COOLDOWN_TIME;

    localStorage.setItem(
        STORAGE_KEYS.cooldown,
        String(end)
    );

    return end;

}


function isCooldown() {

    return getCooldownEnd() > Date.now();

}


function reduceCooldown(minutes = 5) {

    const end = getCooldownEnd();

    if (end <= Date.now()) {
        return;
    }

    const newEnd = Math.max(
        Date.now(),
        end - minutes * 60 * 1000
    );

    localStorage.setItem(
        STORAGE_KEYS.cooldown,
        String(newEnd)
    );

}


/* =========================================================
   時間
========================================================= */

function formatTime(ms) {

    if (ms <= 0) {
        return "0:00";
    }

    const seconds =
        Math.ceil(ms / 1000);

    const minutes =
        Math.floor(seconds / 60);

    const remainSeconds =
        seconds % 60;

    return (
        `${minutes}:` +
        `${String(remainSeconds).padStart(2, "0")}`
    );

}


/* =========================================================
   ランダム
========================================================= */

function randomItem(array) {

    if (
        !Array.isArray(array) ||
        array.length === 0
    ) {
        return null;
    }

    return array[
        Math.floor(
            Math.random() * array.length
        )
    ];

}


/* =========================================================
   レアリティ抽選
========================================================= */

function drawQuote() {

    const random = Math.random();

    let rarity;

    if (random < 0.02) {

        rarity = "シークレット";

    } else if (random < 0.07) {

        rarity = "スーパー大吉";

    } else if (random < 0.20) {

        rarity = "大大吉";

    } else if (random < 0.55) {

        rarity = "大吉";

    } else {

        rarity = "吉";

    }

    const candidates =
        quotes.filter(
            quote =>
                quote.rarity === rarity
        );

    return (
        randomItem(candidates) ||
        randomItem(quotes)
    );

}


/* =========================================================
   名言表示
========================================================= */

function displayQuote(item) {

    if (!item) {
        return;
    }

    if (fortuneElement) {
        fortuneElement.textContent =
            item.rarity;
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

function registerQuote(item) {

    const collection =
        getCollection();

    const alreadyCollected =
        collection.includes(item.id);

    if (!alreadyCollected) {

        collection.push(item.id);

        saveCollection(collection);

        showCollectionNotification(item);

    } else {

        /*
         * 同じ御神籤が出た場合
         * クールタイムを5分短縮
         */

        if (isCooldown()) {

            reduceCooldown(5);

            showDuplicateNotification();

        }

    }

    renderBook();

    checkCompletion();

}


/* =========================================================
   達成率
========================================================= */

function updateAchievement() {

    const collection =
        getCollection();

    const count =
        collection.length;

    const rate =
        Math.round(
            count / quotes.length * 100
        );

    if (achievementRate) {
        achievementRate.textContent =
            `${rate}%`;
    }

    if (achievementCount) {
        achievementCount.textContent =
            `${count} / ${quotes.length}`;
    }

    if (progressBar) {
        progressBar.style.width =
            `${rate}%`;
    }

}


/* =========================================================
   図鑑描画
========================================================= */

function renderBook() {

    if (!bookGrid) {
        return;
    }

    const collection =
        getCollection();

    bookGrid.innerHTML = "";

    quotes.forEach(item => {

        const unlocked =
            collection.includes(item.id);

        const card =
            document.createElement("div");

        card.className =
            "book-card";

        if (unlocked) {

            card.classList.add(
                "unlocked"
            );

            card.innerHTML = `
                <div class="book-number">
                    NO.${String(item.id).padStart(3, "0")}
                </div>

                <div class="book-fortune">
                    ${item.rarity}
                </div>

                <div class="book-author">
                    ${item.author}
                </div>
            `;

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
                <div class="lock">
                    🔒
                </div>

                <div class="book-number">
                    NO.${String(item.id).padStart(3, "0")}
                </div>

                <div class="book-author">
                    未登録
                </div>
            `;

        }

        bookGrid.appendChild(card);

    });

    updateAchievement();

}


/* =========================================================
   図鑑詳細
========================================================= */

function openQuoteModal(item) {

    if (!modal) {
        return;
    }

    if (modalFortune) {
        modalFortune.textContent =
            item.rarity;
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
            "図鑑に登録された御神籤";
    }

    modal.classList.add("open");

}


function closeQuoteModal() {

    if (modal) {
        modal.classList.remove("open");
    }

}


/* =========================================================
   通知
========================================================= */

function showCollectionNotification(item) {

    let notification =
        document.querySelector(
            ".collection-effect"
        );

    if (!notification) {

        notification =
            document.createElement("div");

        notification.className =
            "collection-effect";

        document.body.appendChild(
            notification
        );

    }

    notification.textContent =
        `✦ ${item.rarity}を図鑑に登録しました`;

    notification.classList.add("show");

    setTimeout(
        () => {
            notification.classList.remove("show");
        },
        3000
    );

}


function showDuplicateNotification() {

    let notification =
        document.querySelector(
            ".duplicate-notification"
        );

    if (!notification) {

        notification =
            document.createElement("div");

        notification.className =
            "duplicate-notification";

        notification.innerHTML = `
            <div class="duplicate-title">
                ✦ 重複の神託 ✦
            </div>

            <div class="duplicate-text">
                すでに持っている御神籤でした。
            </div>

            <div class="duplicate-bonus">
                クールタイムを5分短縮しました
            </div>
        `;

        document.body.appendChild(
            notification
        );

    }

    notification.classList.add("show");

    setTimeout(
        () => {
            notification.classList.remove("show");
        },
        3500
    );

}


/* =========================================================
   全100種コンプリート判定
========================================================= */

function checkCompletion() {

    const collection =
        getCollection();

    if (collection.length < 100) {
        return;
    }

    if (
        localStorage.getItem(
            STORAGE_KEYS.completed
        ) === "true"
    ) {
        return;
    }

    localStorage.setItem(
        STORAGE_KEYS.completed,
        "true"
    );

    playCompletionEffect();

}


/* =========================================================
   全コンプリート演出
   HTMLを変更せずJavaScriptだけで生成
========================================================= */

function playCompletionEffect() {

    let overlay =
        document.getElementById(
            "completionEffect"
        );

    if (overlay) {
        return;
    }

    overlay =
        document.createElement("div");

    overlay.id =
        "completionEffect";

    overlay.innerHTML = `

        <div class="completion-particles">
            <span>✦</span>
            <span>✧</span>
            <span>✨</span>
            <span>✦</span>
            <span>⛩</span>
            <span>✧</span>
            <span>✨</span>
        </div>

        <div class="completion-inner">

            <div class="completion-torii">
                ⛩
            </div>

            <div class="completion-kamon">
                ✦
            </div>

            <div class="completion-title">
                全100種コンプリート
            </div>

            <div class="completion-subtitle">
                満願成就
            </div>

            <div class="completion-message">
                すべての御神籤を集めました。<br>
                ここまで歩んだ学びの道を、
                どうか誇りにしてください。
            </div>

            <div class="completion-complete">
                100 / 100
            </div>

            <button
                type="button"
                class="completion-close"
            >
                神託を受け取る
            </button>

        </div>
    `;

    document.body.appendChild(
        overlay
    );


    const style =
        document.createElement("style");

    style.id =
        "completionEffectStyle";

    style.textContent = `

        #completionEffect {

            position: fixed;

            inset: 0;

            z-index: 99999;

            display: flex;

            align-items: center;

            justify-content: center;

            padding: 20px;

            background:
                radial-gradient(
                    circle at center,
                    rgba(
                        112,
                        67,
                        25,
                        0.35
                    ),
                    rgba(
                        8,
                        3,
                        2,
                        0.96
                    )
                );

            backdrop-filter:
                blur(10px);

            animation:
                completionFadeIn
                .8s ease both;

            overflow: hidden;
        }


        #completionEffect::before {

            content: "";

            position: absolute;

            width: 75vmin;

            height: 75vmin;

            border-radius: 50%;

            background:
                radial-gradient(
                    circle,
                    rgba(
                        245,
                        223,
                        145,
                        0.30
                    ),
                    transparent 68%
                );

            animation:
                completionGlow
                4s
                ease-in-out
                infinite;
        }


        #completionEffect::after {

            content: "";

            position: absolute;

            inset: 15px;

            border:
                1px solid
                rgba(
                    217,
                    180,
                    91,
                    0.22
                );

            pointer-events: none;
        }


        .completion-inner {

            position: relative;

            z-index: 2;

            width:
                min(680px, 100%);

            padding:
                50px 30px;

            text-align: center;

            color:
                #fff7df;

            border:
                1px solid
                #d9b45b;

            border-radius:
                20px;

            background:
                linear-gradient(
                    145deg,
                    rgba(
                        91,
                        37,
                        25,
                        .98
                    ),
                    rgba(
                        28,
                        11,
                        8,
                        .98
                    )
                );

            box-shadow:

                0 30px 90px
                rgba(
                    0,
                    0,
                    0,
                    .75
                ),

                0 0 55px
                rgba(
                    245,
                    223,
                    145,
                    .28
                ),

                inset 0 0 55px
                rgba(
                    245,
                    223,
                    145,
                    .06
                );

            animation:
                completionRise
                .9s
                cubic-bezier(
                    .2,
                    .8,
                    .2,
                    1
                )
                both;
        }


        .completion-torii {

            font-size:
                clamp(
                    44px,
                    10vw,
                    70px
                );

            color:
                #f5df91;

            filter:
                drop-shadow(
                    0 0 18px
                    rgba(
                        245,
                        223,
                        145,
                        .55
                    )
                );
        }


        .completion-kamon {

            margin:
                8px 0 14px;

            font-size:
                30px;

            color:
                #f5df91;
        }


        .completion-title {

            font-size:
                clamp(
                    1.9rem,
                    7vw,
                    3.5rem
                );

            font-weight:
                bold;

            letter-spacing:
                .12em;

            color:
                #f5df91;

            text-shadow:
                0 0 25px
                rgba(
                    245,
                    223,
                    145,
                    .3
                );
        }


        .completion-subtitle {

            margin-top:
                12px;

            font-size:
                1.3rem;

            letter-spacing:
                .35em;

            color:
                #d9b45b;
        }


        .completion-message {

            margin:
                28px auto 20px;

            line-height:
                2;

            letter-spacing:
                .08em;

            color:
                #fffaf0;
        }


        .completion-complete {

            margin:
                15px 0 28px;

            font-size:
                1.7rem;

            font-weight:
                bold;

            color:
                #f5df91;

            letter-spacing:
                .15em;
        }


        .completion-close {

            padding:
                14px 35px;

            border:
                1px solid
                #d9b45b;

            border-radius:
                9px;

            color:
                #3b1b0f;

            background:
                linear-gradient(
                    135deg,
                    #f5df91,
                    #c69b46
                );

            font:
                inherit;

            font-weight:
                bold;

            letter-spacing:
                .08em;

            cursor:
                pointer;

            box-shadow:
                0 5px 0
                #76521d;

            transition:
                .2s;
        }


        .completion-close:hover {

            filter:
                brightness(1.08);

            transform:
                translateY(-2px);
        }


        .completion-close:active {

            transform:
                translateY(3px);

            box-shadow:
                0 2px 0
                #76521d;
        }


        .completion-particles span {

            position:
                absolute;

            color:
                #f5df91;

            font-size:
                24px;

            animation:
                completionParticle
                3.5s
                ease-in-out
                infinite;
        }


        .completion-particles span:nth-child(1) {
            top: 15%;
            left: 15%;
        }

        .completion-particles span:nth-child(2) {
            top: 25%;
            right: 18%;
            animation-delay: .5s;
        }

        .completion-particles span:nth-child(3) {
            top: 65%;
            left: 12%;
            animation-delay: 1s;
        }

        .completion-particles span:nth-child(4) {
            bottom: 15%;
            right: 14%;
            animation-delay: 1.5s;
        }

        .completion-particles span:nth-child(5) {
            top: 10%;
            left: 50%;
            animation-delay: .8s;
        }

        .completion-particles span:nth-child(6) {
            bottom: 20%;
            left: 28%;
            animation-delay: 1.2s;
        }

        .completion-particles span:nth-child(7) {
            top: 45%;
            right: 8%;
            animation-delay: 1.8s;
        }


        @keyframes completionFadeIn {

            from {
                opacity: 0;
            }

            to {
                opacity: 1;
            }

        }


        @keyframes completionRise {

            from {

                opacity: 0;

                transform:
                    translateY(40px)
                    scale(.94);

            }

            to {

                opacity: 1;

                transform:
                    translateY(0)
                    scale(1);

            }

        }


        @keyframes completionGlow {

            0%,
            100% {

                transform:
                    scale(.85);

                opacity:
                    .45;

            }

            50% {

                transform:
                    scale(1.15);

                opacity:
                    1;

            }

        }


        @keyframes completionParticle {

            0%,
            100% {

                transform:
                    translateY(15px)
                    scale(.7)
                    rotate(0deg);

                opacity:
                    .2;

            }

            50% {

                transform:
                    translateY(-25px)
                    scale(1.3)
                    rotate(180deg);

                opacity:
                    1;

            }

        }


        @media (max-width: 500px) {

            .completion-inner {

                padding:
                    40px 20px;

            }

            .completion-message {

                font-size:
                    .9rem;

            }

            .completion-subtitle {

                font-size:
                    1rem;

            }

        }

    `;

    document.head.appendChild(
        style
    );


    const closeButton =
        overlay.querySelector(
            ".completion-close"
        );

    closeButton.addEventListener(
        "click",
        () => {

            overlay.remove();

            const completionStyle =
                document.getElementById(
                    "completionEffectStyle"
                );

            if (completionStyle) {
                completionStyle.remove();
            }

        }
    );

}


/* =========================================================
   学びの神託
========================================================= */

const defaultSupportMessages = [

    "少しだけでも机に向かえば、それは前進です。",
    "今日の一問が、未来の自分を助けます。",
    "完璧じゃなくて大丈夫。まず一つ終わらせよう。",
    "5分だけ集中してみよう。始めれば流れができます。",
    "昨日の自分より、一歩だけ前へ。",
    "わからない問題は、成長するチャンスです。",
    "今できることを、一つずつ進めよう。",
    "努力はすぐに見えなくても、確実に積み重なっています。",
    "今日の努力は、未来の自分への贈り物です。",
    "焦らなくて大丈夫。自分のペースで進もう。"

];


function getSupportMessages() {

    try {

        const data =
            JSON.parse(
                localStorage.getItem(
                    STORAGE_KEYS.messages
                )
            );

        if (
            Array.isArray(data) &&
            data.length > 0
        ) {

            const valid =
                data.filter(
                    message =>
                        typeof message === "string" &&
                        message.trim() !== ""
                );

            if (valid.length > 0) {
                return valid;
            }

        }

    } catch {}

    return defaultSupportMessages;

}


/* =========================================================
   クールタイム中の神託
========================================================= */

function getCooldownSupport() {

    const cooldownEnd =
        getCooldownEnd();

    try {

        const saved =
            JSON.parse(
                localStorage.getItem(
                    STORAGE_KEYS.cooldownSupport
                )
            );

        if (
            saved &&
            saved.cooldownEnd === cooldownEnd &&
            saved.message
        ) {
            return saved.message;
        }

    } catch {}

    const message =
        randomItem(
            getSupportMessages()
        );

    localStorage.setItem(
        STORAGE_KEYS.cooldownSupport,
        JSON.stringify({
            cooldownEnd,
            message
        })
    );

    return message;

}


function showCooldownSupport() {

    if (!cooldownMessage) {
        return;
    }

    let title =
        cooldownMessage.querySelector(
            ".support-title"
        );

    let text =
        cooldownMessage.querySelector(
            ".support-text"
        );

    if (!title) {

        title =
            document.createElement("div");

        title.className =
            "support-title";

        title.textContent =
            "✦ 学びの神託";

        cooldownMessage.appendChild(
            title
        );

    }

    if (!text) {

        text =
            document.createElement("div");

        text.className =
            "support-text";

        cooldownMessage.appendChild(
            text
        );

    }

    text.textContent =
        getCooldownSupport();

    title.style.display = "block";
    text.style.display = "block";

}


/* =========================================================
   神託・課題を非表示
========================================================= */

function hideCooldownContents() {

    if (!cooldownMessage) {
        return;
    }

    const title =
        cooldownMessage.querySelector(
            ".support-title"
        );

    const text =
        cooldownMessage.querySelector(
            ".support-text"
        );

    const challenge =
        cooldownMessage.querySelector(
            ".today-challenge"
        );

    if (title) {
        title.style.display = "none";
    }

    if (text) {
        text.style.display = "none";
    }

    if (challenge) {
        challenge.style.display = "none";
    }

}


/* =========================================================
   本日の課題
========================================================= */

const studyChallenges = [

    "英単語を10個覚える",
    "数学の問題を3問解く",
    "教科書を5ページ読む",
    "漢字を10個復習する",
    "昨日間違えた問題を3問解き直す",
    "英語の長文を1題読む",
    "理科の用語を10個確認する",
    "社会の重要語句を10個覚える",
    "今日習った内容を5分復習する",
    "苦手な問題を1問だけ解いてみる",
    "ノートを整理する",
    "公式を5個復習する",
    "英単語を発音しながら10個覚える",
    "教科書の重要部分を確認する",
    "小テストの間違いを復習する",
    "問題集を1ページ進める",
    "漢字を5個覚える",
    "歴史の重要人物を5人確認する",
    "理科の図を一つ覚える",
    "今日の授業内容を自分の言葉で説明する"

];


function getTodayKey() {

    const date =
        new Date();

    return (
        `${date.getFullYear()}-` +
        `${String(date.getMonth() + 1).padStart(2, "0")}-` +
        `${String(date.getDate()).padStart(2, "0")}`
    );

}


function getTodayChallenge() {

    const today =
        getTodayKey();

    try {

        const saved =
            JSON.parse(
                localStorage.getItem(
                    STORAGE_KEYS.challenge
                )
            );

        if (
            saved &&
            saved.date === today
        ) {
            return saved.challenge;
        }

    } catch {}

    const challenge =
        randomItem(
            studyChallenges
        );

    localStorage.setItem(
        STORAGE_KEYS.challenge,
        JSON.stringify({
            date: today,
            challenge
        })
    );

    return challenge;

}


function showTodayChallenge() {

    if (!cooldownMessage) {
        return;
    }

    let challenge =
        cooldownMessage.querySelector(
            ".today-challenge"
        );

    if (!challenge) {

        challenge =
            document.createElement("div");

        challenge.className =
            "today-challenge";

        challenge.innerHTML = `
            <div class="challenge-title">
                本日挑戦する課題
            </div>

            <div class="challenge-text"></div>
        `;

        cooldownMessage.appendChild(
            challenge
        );

    }

    challenge.style.display =
        "block";

    const challengeText =
        challenge.querySelector(
            ".challenge-text"
        );

    if (challengeText) {
        challengeText.textContent =
            getTodayChallenge();
    }

}


/* =========================================================
   クールタイム更新
========================================================= */

function updateCooldown() {

    const end =
        getCooldownEnd();

    const remaining =
        end - Date.now();

    if (remaining <= 0) {

        if (drawButton) {

            drawButton.disabled =
                false;

            drawButton.textContent =
                "御神籤を引く";

        }

        if (cooldownElement) {

            cooldownElement.textContent =
                "今すぐ御神籤を引けます";

        }

        hideCooldownContents();

        return;

    }


    if (drawButton) {

        drawButton.disabled =
            true;

        drawButton.textContent =
            "神託を待っています…";

    }


    if (cooldownElement) {

        cooldownElement.textContent =
            `次の御神籤まで ${formatTime(remaining)}`;

    }


    showCooldownSupport();
    showTodayChallenge();

}


/* =========================================================
   御神籤を引く
========================================================= */

function handleDraw() {

    if (isCooldown()) {

        updateCooldown();

        return;

    }

    const item =
        drawQuote();

    if (!item) {
        return;
    }

    displayQuote(item);

    registerQuote(item);

    localStorage.setItem(
        STORAGE_KEYS.currentQuote,
        JSON.stringify(item)
    );

    setCooldown();

    localStorage.removeItem(
        STORAGE_KEYS.cooldownSupport
    );

    getCooldownSupport();

    updateCooldown();

    playRarityEffect(item);

}


/* =========================================================
   レアリティ演出
========================================================= */

function playRarityEffect(item) {

    let overlay =
        document.getElementById(
            "rarityEffect"
        );

    if (!overlay) {

        overlay =
            document.createElement("div");

        overlay.id =
            "rarityEffect";

        document.body.appendChild(
            overlay
        );

    }

    overlay.className =
        "rarity-effect";

    if (item.rarity === "シークレット") {

        overlay.classList.add("secret");

    } else if (
        item.rarity === "スーパー大吉"
    ) {

        overlay.classList.add("super");

    } else if (
        item.rarity === "大大吉"
    ) {

        overlay.classList.add("gold");

    } else {

        overlay.classList.add("normal");

    }


    let symbol = "✦";

    if (item.rarity === "シークレット") {
        symbol = "☾";
    } else if (
        item.rarity === "スーパー大吉"
    ) {
        symbol = "🌟";
    } else if (
        item.rarity === "大大吉"
    ) {
        symbol = "✨";
    }


    overlay.innerHTML = `

        <div class="effect-symbol">
            ${symbol}
        </div>

        <div class="effect-text">
            ${item.rarity}
        </div>

    `;

    overlay.classList.add("show");

    setTimeout(
        () => {
            overlay.classList.remove("show");
        },
        1800
    );

}


/* =========================================================
   設定
========================================================= */

function openSettings() {

    if (!settingsModal) {
        return;
    }

    loadSettingsInputs();

    settingsModal.classList.add("open");

}


function closeSettingsModal() {

    if (settingsModal) {
        settingsModal.classList.remove("open");
    }

}


function loadSettingsInputs() {

    if (!messageInputs) {
        return;
    }

    messageInputs.innerHTML = "";

    let messages = [];

    try {

        messages =
            JSON.parse(
                localStorage.getItem(
                    STORAGE_KEYS.messages
                )
            );

    } catch {

        messages = [];

    }

    if (
        !Array.isArray(messages) ||
        messages.length === 0
    ) {
        messages = [""];
    }

    messages.forEach(
        message => {
            createMessageInput(message);
        }
    );

}


function createMessageInput(value = "") {

    if (!messageInputs) {
        return;
    }

    const row =
        document.createElement("div");

    row.className =
        "message-row";

    row.innerHTML = `

        <input
            type="text"
            maxlength="100"
            placeholder="勉強の応援メッセージ"
        >

        <button
            type="button"
            class="delete-message"
        >
            ×
        </button>

    `;

    const input =
        row.querySelector("input");

    input.value =
        value;

    const deleteButton =
        row.querySelector(
            ".delete-message"
        );

    deleteButton.addEventListener(
        "click",
        () => {
            row.remove();
        }
    );

    messageInputs.appendChild(
        row
    );

}


function saveSettings() {

    if (!messageInputs) {
        return;
    }

    const inputs =
        messageInputs.querySelectorAll(
            "input"
        );

    const messages =
        Array.from(inputs)
            .map(
                input =>
                    input.value.trim()
            )
            .filter(
                message =>
                    message.length > 0
            );


    if (messages.length === 0) {

        localStorage.removeItem(
            STORAGE_KEYS.messages
        );

    } else {

        localStorage.setItem(
            STORAGE_KEYS.messages,
            JSON.stringify(messages)
        );

    }

    closeSettingsModal();

    showSavedNotification();

}


function showSavedNotification() {

    let notification =
        document.querySelector(
            ".settings-saved"
        );

    if (!notification) {

        notification =
            document.createElement("div");

        notification.className =
            "collection-effect settings-saved";

        document.body.appendChild(
            notification
        );

    }

    notification.textContent =
        "✓ 設定を保存しました";

    notification.classList.add("show");

    setTimeout(
        () => {
            notification.classList.remove("show");
        },
        2200
    );

}


/* =========================================================
   現在の名言を復元
========================================================= */

function restoreCurrentQuote() {

    try {

        const saved =
            JSON.parse(
                localStorage.getItem(
                    STORAGE_KEYS.currentQuote
                )
            );

        if (saved && saved.id) {

            const item =
                quotes.find(
                    quote =>
                        quote.id === saved.id
                );

            if (item) {

                displayQuote(item);

                return;

            }

        }

    } catch {}


    if (fortuneElement) {
        fortuneElement.textContent =
            "学びの神託";
    }

    if (quoteElement) {
        quoteElement.textContent =
            "「今日の一歩が、未来を変える。」";
    }

    if (authorElement) {
        authorElement.textContent =
            "― 学びの御神籤";
    }

}


/* =========================================================
   イベント
========================================================= */

if (drawButton) {

    drawButton.addEventListener(
        "click",
        handleDraw
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


if (addMessageButton) {

    addMessageButton.addEventListener(
        "click",
        () => {
            createMessageInput();
        }
    );

}


if (saveSettingsButton) {

    saveSettingsButton.addEventListener(
        "click",
        saveSettings
    );

}


if (closeModal) {

    closeModal.addEventListener(
        "click",
        closeQuoteModal
    );

}


/* =========================================================
   モーダル外クリック
========================================================= */

if (modal) {

    modal.addEventListener(
        "click",
        event => {

            if (event.target === modal) {
                closeQuoteModal();
            }

        }
    );

}


if (settingsModal) {

    settingsModal.addEventListener(
        "click",
        event => {

            if (
                event.target === settingsModal
            ) {
                closeSettingsModal();
            }

        }
    );

}


/* =========================================================
   ESCキー
========================================================= */

document.addEventListener(
    "keydown",
    event => {

        if (event.key === "Escape") {

            closeQuoteModal();
            closeSettingsModal();

        }

    }
);


/* =========================================================
   クールタイム監視
========================================================= */

setInterval(
    updateCooldown,
    1000
);


/* =========================================================
   初期化
========================================================= */

function initialize() {

    console.log(
        `学びの御神籤：${quotes.length}種類`
    );

    renderBook();

    restoreCurrentQuote();

    updateCooldown();

    /*
     * すでに100種類集めていて、
     * まだコンプリート演出を見ていない場合
     */
    checkCompletion();

}


/* =========================================================
   DOM読み込み
========================================================= */

if (
    document.readyState ===
    "loading"
) {

    document.addEventListener(
        "DOMContentLoaded",
        initialize
    );

} else {

    initialize();

}


/* =========================================================
   デバッグ用
========================================================= */

window.ManabiOmikuji = {

    quotes,

    getCollection,

    getCooldownEnd,

    drawQuote,

    renderBook,

    updateAchievement,

    checkCompletion,

    resetCooldown() {

        localStorage.removeItem(
            STORAGE_KEYS.cooldown
        );

        localStorage.removeItem(
            STORAGE_KEYS.cooldownSupport
        );

        updateCooldown();

    },

    resetCollection() {

        localStorage.removeItem(
            STORAGE_KEYS.collection
        );

        localStorage.removeItem(
            STORAGE_KEYS.completed
        );

        renderBook();

    },

    resetAll() {

        Object.values(
            STORAGE_KEYS
        ).forEach(
            key => {
                localStorage.removeItem(
                    key
                );
            }
        );

        location.reload();

    }

};
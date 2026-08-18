"use strict";

/* ================================
   御神籤データ
================================ */

const fortunes = [

    // シークレット
    { id: 1, type: "secret", name: "シークレット", quote: "あなたにしか開けない特別な道がある。", author: "秘密の言葉" },
    { id: 2, type: "secret", name: "シークレット", quote: "今日という日は、特別な一日になる。", author: "秘密の言葉" },

    // スーパー大吉
    { id: 3, type: "super", name: "スーパー大吉", quote: "すべての幸運が、あなたの味方になる。", author: "御神籤の言葉" },
    { id: 4, type: "super", name: "スーパー大吉", quote: "願いが大きく動き出す予感。", author: "御神籤の言葉" },
    { id: 5, type: "super", name: "スーパー大吉", quote: "最高の一歩を踏み出す日。", author: "御神籤の言葉" },
    { id: 6, type: "super", name: "スーパー大吉", quote: "幸運は準備している人のもとへ来る。", author: "御神籤の言葉" },

    // 大大吉
    { id: 7, type: "bigbig", name: "大大吉", quote: "大きな夢に向かう絶好の機会。", author: "今日の言葉" },
    { id: 8, type: "bigbig", name: "大大吉", quote: "勇気を出した先に、幸運が待っている。", author: "今日の言葉" },
    { id: 9, type: "bigbig", name: "大大吉", quote: "今日は何事にも積極的に。", author: "今日の言葉" },
    { id: 10, type: "bigbig", name: "大大吉", quote: "あなたの努力が実を結ぶ日。", author: "今日の言葉" },
    { id: 11, type: "bigbig", name: "大大吉", quote: "思い切った挑戦が幸運を呼ぶ。", author: "今日の言葉" },
    { id: 12, type: "bigbig", name: "大大吉", quote: "素晴らしい出会いに恵まれる予感。", author: "今日の言葉" },

    // 大吉
    { id: 13, type: "big", name: "大吉", quote: "一歩ずつ進めば、道は必ず開ける。", author: "今日の言葉" },
    { id: 14, type: "big", name: "大吉", quote: "努力は未来の自分を助ける。", author: "今日の言葉" },
    { id: 15, type: "big", name: "大吉", quote: "信じて進めば、幸運は近づいてくる。", author: "今日の言葉" },
    { id: 16, type: "big", name: "大吉", quote: "笑顔の先に、良い出会いが待っている。", author: "今日の言葉" },
    { id: 17, type: "big", name: "大吉", quote: "願いは行動によって現実になる。", author: "今日の言葉" },
    { id: 18, type: "big", name: "大吉", quote: "迷ったときこそ、自分を信じよう。", author: "今日の言葉" },
    { id: 19, type: "big", name: "大吉", quote: "あなたの才能が輝く一日。", author: "今日の言葉" },
    { id: 20, type: "big", name: "大吉", quote: "新しいことを始めるのに良い日。", author: "今日の言葉" },
    { id: 21, type: "big", name: "大吉", quote: "小さな勇気が大きな幸運につながる。", author: "今日の言葉" },
    { id: 22, type: "big", name: "大吉", quote: "あなたの一歩が未来を変える。", author: "今日の言葉" },

    // 中吉
    { id: 23, type: "middle", name: "中吉", quote: "継続は力なり。", author: "日本のことわざ" },
    { id: 24, type: "middle", name: "中吉", quote: "初心忘るべからず。", author: "世阿弥" },
    { id: 25, type: "middle", name: "中吉", quote: "焦らず進めば、良い結果に近づく。", author: "今日の言葉" },
    { id: 26, type: "middle", name: "中吉", quote: "小さな努力を積み重ねよう。", author: "今日の言葉" },
    { id: 27, type: "middle", name: "中吉", quote: "今日できることを大切に。", author: "今日の言葉" },
    { id: 28, type: "middle", name: "中吉", quote: "周りの人への感謝を忘れずに。", author: "今日の言葉" },
    { id: 29, type: "middle", name: "中吉", quote: "笑顔が良い運気を呼び込む。", author: "今日の言葉" },
    { id: 30, type: "middle", name: "中吉", quote: "失敗を恐れず挑戦しよう。", author: "今日の言葉" },
    { id: 31, type: "middle", name: "中吉", quote: "人との縁を大切にすると吉。", author: "今日の言葉" },
    { id: 32, type: "middle", name: "中吉", quote: "ゆっくりでも確実に前へ進もう。", author: "今日の言葉" },

    // 吉
    { id: 33, type: "good", name: "吉", quote: "七転び八起き。", author: "日本のことわざ" },
    { id: 34, type: "good", name: "吉", quote: "明日は明日の風が吹く。", author: "日本のことわざ" },
    { id: 35, type: "good", name: "吉", quote: "自分らしく進もう。", author: "今日の言葉" },
    { id: 36, type: "good", name: "吉", quote: "一つの挑戦が新しい道を作る。", author: "今日の言葉" },
    { id: 37, type: "good", name: "吉", quote: "迷ったら、まず一歩踏み出そう。", author: "今日の言葉" },
    { id: 38, type: "good", name: "吉", quote: "今日の出会いを大切に。", author: "今日の言葉" },
    { id: 39, type: "good", name: "吉", quote: "小さな幸せを見つけよう。", author: "今日の言葉" },
    { id: 40, type: "good", name: "吉", quote: "笑顔で過ごせば良いことがある。", author: "今日の言葉" },
    { id: 41, type: "good", name: "吉", quote: "今日の経験は明日の力になる。", author: "今日の言葉" },
    { id: 42, type: "good", name: "吉", quote: "あなたのペースで進めばいい。", author: "今日の言葉" }
];


/* ================================
   設定
================================ */

const COOLDOWN_TIME = 30 * 60 * 1000;


/* ================================
   HTML要素
================================ */

const drawButton = document.getElementById("drawButton");
const bookButton = document.getElementById("bookButton");

const result = document.getElementById("result");
const fortune = document.getElementById("fortune");
const quote = document.getElementById("quote");
const author = document.getElementById("author");
const cooldown = document.getElementById("cooldown");

const book = document.getElementById("book");
const bookGrid = document.getElementById("bookGrid");
const count = document.getElementById("count");


/* ================================
   保存データ
================================ */

let collected = [];

try {
    collected = JSON.parse(
        localStorage.getItem("omikuji_collected_v2")
    ) || [];
} catch (error) {
    collected = [];
}


let lastDraw = Number(
    localStorage.getItem("omikuji_last_draw_v2")
) || 0;


/* ================================
   おみくじを引く
================================ */

drawButton.addEventListener("click", function () {

    const now = Date.now();

    if (now - lastDraw < COOLDOWN_TIME) {
        updateCooldown();
        return;
    }


    drawButton.disabled = true;

    result.classList.add("drawing");

    fortune.textContent = "…";
    quote.textContent = "神様からの言葉を受け取っています";
    author.textContent = "";


    setTimeout(function () {

        const selected = selectFortune();

        showFortune(selected);

        if (!collected.includes(selected.id)) {

            collected.push(selected.id);

            localStorage.setItem(
                "omikuji_collected_v2",
                JSON.stringify(collected)
            );
        }


        lastDraw = Date.now();

        localStorage.setItem(
            "omikuji_last_draw_v2",
            String(lastDraw)
        );


        result.classList.remove("drawing");

        updateBook();
        updateCooldown();

    }, 600);

});


/* ================================
   抽選
================================ */

function selectFortune() {

    const r = Math.random();

    let type;


    if (r < 0.01) {
        type = "secret";

    } else if (r < 0.04) {
        type = "super";

    } else if (r < 0.14) {
        type = "bigbig";

    } else if (r < 0.45) {
        type = "big";

    } else if (r < 0.75) {
        type = "middle";

    } else {
        type = "good";
    }


    const candidates =
        fortunes.filter(function (item) {
            return item.type === type;
        });


    return candidates[
        Math.floor(
            Math.random() * candidates.length
        )
    ];
}


/* ================================
   結果を表示
================================ */

function showFortune(item) {

    fortune.textContent = item.name;

    quote.textContent =
        "「" + item.quote + "」";

    author.textContent =
        "― " + item.author;


    fortune.className = item.type;

    result.classList.remove("show");

    void result.offsetWidth;

    result.classList.add("show");
}


/* ================================
   クールタイム
================================ */

function updateCooldown() {

    const remaining =
        COOLDOWN_TIME -
        (Date.now() - lastDraw);


    if (remaining <= 0) {

        drawButton.disabled = false;

        drawButton.textContent =
            "🎋 おみくじを引く";

        cooldown.textContent =
            "おみくじを引くことができます。";

        return;
    }


    drawButton.disabled = true;

    const minutes =
        Math.floor(
            remaining / 60000
        );

    const seconds =
        Math.floor(
            (remaining % 60000) / 1000
        );


    drawButton.textContent =
        "⏳ 次のおみくじを待っています";

    cooldown.textContent =
        "次のおみくじまで " +
        minutes +
        "分 " +
        String(seconds).padStart(2, "0") +
        "秒";
}


/* ================================
   図鑑ボタン
================================ */

bookButton.addEventListener("click", function () {

    book.classList.toggle("hidden");

    updateBook();

});


/* ================================
   図鑑
================================ */

function updateBook() {

    bookGrid.innerHTML = "";

    count.textContent = collected.length;


    fortunes.forEach(function (item) {

        const card =
            document.createElement("div");

        card.className = "book-item";


        if (collected.includes(item.id)) {

            card.classList.add("open");

            card.innerHTML = `
                <div class="book-number">
                    No.${String(item.id).padStart(2, "0")}
                </div>

                <div class="book-fortune">
                    ${item.name}
                </div>

                <div class="book-number">
                    ${item.author}
                </div>
            `;

        } else {

            card.innerHTML = `
                <div class="book-number">
                    No.${String(item.id).padStart(2, "0")}
                </div>

                <div class="lock">
                    ？
                </div>
            `;
        }


        bookGrid.appendChild(card);

    });
}


/* ================================
   初期化
================================ */

updateBook();
updateCooldown();


/* ================================
   毎秒更新
================================ */

setInterval(function () {
    updateCooldown();
}, 1000);
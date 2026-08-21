"use strict";

/* =====================================================
   名言100種類
===================================================== */

const quotes = [

    {
        id: 1,
        fortune: "大大吉",
        quote: "千里の道も一歩から。",
        author: "老子",
        source: "『道徳経』"
    },
    {
        id: 2,
        fortune: "大吉",
        quote: "よく行うことは、よく語ることに勝る。",
        author: "ベンジャミン・フランクリン",
        source: "Benjamin Franklin"
    },
    {
        id: 3,
        fortune: "大吉",
        quote: "知識への投資は、いつでも最高の利息を生む。",
        author: "ベンジャミン・フランクリン",
        source: "Benjamin Franklin"
    },
    {
        id: 4,
        fortune: "大大吉",
        quote: "あなたが遅れても、時間は待ってくれない。",
        author: "ベンジャミン・フランクリン",
        source: "Benjamin Franklin"
    },
    {
        id: 5,
        fortune: "中吉",
        quote: "努力と粘り強さは、あらゆるものを乗り越える。",
        author: "ベンジャミン・フランクリン",
        source: "Benjamin Franklin"
    },
    {
        id: 6,
        fortune: "大吉",
        quote: "失われた時間は、二度と取り戻せない。",
        author: "ベンジャミン・フランクリン",
        source: "Benjamin Franklin"
    },
    {
        id: 7,
        fortune: "吉",
        quote: "忍耐できる者は、望むものを手にすることができる。",
        author: "ベンジャミン・フランクリン",
        source: "Benjamin Franklin"
    },
    {
        id: 8,
        fortune: "大吉",
        quote: "準備を怠ることは、失敗への準備をすることである。",
        author: "ベンジャミン・フランクリン",
        source: "Benjamin Franklin"
    },
    {
        id: 9,
        fortune: "大大吉",
        quote: "読む価値のあるものを書くか、書く価値のあることを行え。",
        author: "ベンジャミン・フランクリン",
        source: "Benjamin Franklin"
    },
    {
        id: 10,
        fortune: "吉",
        quote: "勤勉は幸運の母である。",
        author: "ベンジャミン・フランクリン",
        source: "Benjamin Franklin"
    },

    {
        id: 11,
        fortune: "大吉",
        quote: "明日を実現するための最大の障害は、今日の疑いである。",
        author: "フランクリン・D・ルーズベルト",
        source: "就任演説"
    },
    {
        id: 12,
        fortune: "大吉",
        quote: "私たちが恐れるべき唯一のものは、恐怖そのものである。",
        author: "フランクリン・D・ルーズベルト",
        source: "就任演説"
    },
    {
        id: 13,
        fortune: "大大吉",
        quote: "幸福とは、達成する喜びと創造する努力のスリルの中にある。",
        author: "フランクリン・D・ルーズベルト",
        source: "Franklin D. Roosevelt"
    },
    {
        id: 14,
        fortune: "中吉",
        quote: "人間と自然は、手を取り合って働かなければならない。",
        author: "フランクリン・D・ルーズベルト",
        source: "Franklin D. Roosevelt"
    },
    {
        id: 15,
        fortune: "吉",
        quote: "自己利益に心を奪われると、美徳は海に流れ込む川のように失われていく。",
        author: "フランクリン・D・ルーズベルト",
        source: "Franklin D. Roosevelt"
    },

    {
        id: 16,
        fortune: "大吉",
        quote: "自分の心が正しいと思うことを行いなさい。",
        author: "エレノア・ルーズベルト",
        source: "Eleanor Roosevelt"
    },
    {
        id: 17,
        fortune: "大大吉",
        quote: "自分にはできないと思うことを、やってみなさい。",
        author: "エレノア・ルーズベルト",
        source: "Eleanor Roosevelt"
    },
    {
        id: 18,
        fortune: "大吉",
        quote: "未来は、自分の夢の美しさを信じる人のものである。",
        author: "エレノア・ルーズベルト",
        source: "Eleanor Roosevelt"
    },
    {
        id: 19,
        fortune: "中吉",
        quote: "あなたの許可なしに、誰もあなたを劣った人間だと思わせることはできない。",
        author: "エレノア・ルーズベルト",
        source: "Eleanor Roosevelt"
    },
    {
        id: 20,
        fortune: "吉",
        quote: "暗闇を呪うより、一本のろうそくに火を灯そう。",
        author: "エレノア・ルーズベルト",
        source: "広く帰属されている言葉"
    },

    {
        id: 21,
        fortune: "大吉",
        quote: "何事も、成し遂げるまでは不可能に見える。",
        author: "ネルソン・マンデラ",
        source: "Nelson Mandela"
    },
    {
        id: 22,
        fortune: "大大吉",
        quote: "教育は、世界を変えるために使える最も強力な武器である。",
        author: "ネルソン・マンデラ",
        source: "2003年の講演"
    },
    {
        id: 23,
        fortune: "大吉",
        quote: "勝者とは、決してあきらめない夢見る人である。",
        author: "ネルソン・マンデラ",
        source: "広く帰属されている言葉"
    },
    {
        id: 24,
        fortune: "中吉",
        quote: "大きな山を登り終えたとき、そこにはさらに多くの山があることに気づく。",
        author: "ネルソン・マンデラ",
        source: "『自由への長い道』"
    },
    {
        id: 25,
        fortune: "吉",
        quote: "より良い世界をつくることは、あなた自身の手に委ねられている。",
        author: "ネルソン・マンデラ",
        source: "Nelson Mandela"
    },
    {
        id: 26,
        fortune: "大吉",
        quote: "人生の最大の栄光は、一度も倒れないことではなく、倒れるたびに立ち上がることにある。",
        author: "ネルソン・マンデラ",
        source: "広く帰属されている言葉"
    },
    {
        id: 27,
        fortune: "大大吉",
        quote: "人は大きな困難を乗り越えることで、さらに強くなる。",
        author: "ネルソン・マンデラ",
        source: "『自由への長い道』"
    },

    {
        id: 28,
        fortune: "大吉",
        quote: "私は失敗していない。うまくいかない方法を一万通り見つけただけだ。",
        author: "トーマス・エジソン",
        source: "広く帰属されている言葉"
    },
    {
        id: 29,
        fortune: "大大吉",
        quote: "多くの人がチャンスを逃すのは、それが仕事の姿をしているからだ。",
        author: "トーマス・エジソン",
        source: "広く帰属されている言葉"
    },
    {
        id: 30,
        fortune: "中吉",
        quote: "天才とは、1パーセントのひらめきと99パーセントの努力である。",
        author: "トーマス・エジソン",
        source: "広く知られるエジソンの言葉"
    },
    {
        id: 31,
        fortune: "大吉",
        quote: "私たちの最大の弱点は、あきらめてしまうことにある。",
        author: "トーマス・エジソン",
        source: "広く帰属されている言葉"
    },
    {
        id: 32,
        fortune: "吉",
        quote: "多くの失敗者は、あきらめたとき成功まであと少しだったことに気づかなかった。",
        author: "トーマス・エジソン",
        source: "広く帰属されている言葉"
    },

    {
        id: 33,
        fortune: "大大吉",
        quote: "始める方法は、話すことをやめて行動することだ。",
        author: "ウォルト・ディズニー",
        source: "広く帰属されている言葉"
    },
    {
        id: 34,
        fortune: "大吉",
        quote: "勇気を持って追いかければ、すべての夢は実現できる。",
        author: "ウォルト・ディズニー",
        source: "広く帰属されている言葉"
    },
    {
        id: 35,
        fortune: "大吉",
        quote: "夢見ることができるなら、それを実現することもできる。",
        author: "ウォルト・ディズニー",
        source: "広く帰属されている言葉"
    },
    {
        id: 36,
        fortune: "中吉",
        quote: "笑いに時代はなく、想像力に年齢はなく、夢は永遠である。",
        author: "ウォルト・ディズニー",
        source: "Walt Disney"
    },

    {
        id: 37,
        fortune: "大吉",
        quote: "成功への秘訣は、まず始めることだ。",
        author: "マーク・トウェイン",
        source: "広く帰属されている言葉"
    },
    {
        id: 38,
        fortune: "吉",
        quote: "成功の秘訣は、自分の仕事を楽しみに変えることだ。",
        author: "マーク・トウェイン",
        source: "広く帰属されている言葉"
    },
    {
        id: 39,
        fortune: "中吉",
        quote: "年齢とは心の問題である。気にしなければ問題ではない。",
        author: "マーク・トウェイン",
        source: "広く帰属されている言葉"
    },
    {
        id: 40,
        fortune: "吉",
        quote: "遅れた完璧さより、継続的な改善のほうが優れている。",
        author: "マーク・トウェイン",
        source: "広く帰属されている言葉"
    },

    {
        id: 41,
        fortune: "大大吉",
        quote: "なりたかった自分になるのに、遅すぎることはない。",
        author: "ジョージ・エリオット",
        source: "広く帰属されている言葉"
    },
    {
        id: 42,
        fortune: "大吉",
        quote: "自分がなりたかった人になるのに、遅すぎることはない。",
        author: "ジョージ・エリオット",
        source: "広く帰属されている言葉"
    },

    {
        id: 43,
        fortune: "大吉",
        quote: "あなたが何者であれ、最高の自分でありなさい。",
        author: "エイブラハム・リンカーン",
        source: "広く帰属されている言葉"
    },
    {
        id: 44,
        fortune: "大大吉",
        quote: "準備をしておこう。いつかチャンスがやってくる。",
        author: "エイブラハム・リンカーン",
        source: "広く帰属されている言葉"
    },
    {
        id: 45,
        fortune: "大吉",
        quote: "木を切り倒すのに6時間あるなら、最初の4時間を斧を研ぐことに使う。",
        author: "エイブラハム・リンカーン",
        source: "広く帰属されている言葉"
    },
    {
        id: 46,
        fortune: "中吉",
        quote: "大切なのは失敗したかどうかではなく、その失敗に満足しているかどうかだ。",
        author: "エイブラハム・リンカーン",
        source: "広く帰属されている言葉"
    },

    {
        id: 47,
        fortune: "大吉",
        quote: "未来を予測する最善の方法は、自分で未来をつくることだ。",
        author: "ピーター・ドラッカー",
        source: "広く帰属されている言葉"
    },
    {
        id: 48,
        fortune: "大吉",
        quote: "知識は常に改善され、挑戦され、増やされなければ消えていく。",
        author: "ピーター・ドラッカー",
        source: "『マネジメント』"
    },

    {
        id: 49,
        fortune: "大大吉",
        quote: "人に何かを教えることはできない。ただ、その人自身の中から見つける手助けができるだけだ。",
        author: "ガリレオ・ガリレイ",
        source: "広く帰属されている言葉"
    },
    {
        id: 50,
        fortune: "大吉",
        quote: "測れるものは測り、測れないものも測れるようにしなさい。",
        author: "ガリレオ・ガリレイ",
        source: "広く帰属されている言葉"
    },

    {
        id: 51,
        fortune: "大吉",
        quote: "人生において恐れるものは何もない。理解すべきものがあるだけだ。",
        author: "マリー・キュリー",
        source: "広く帰属されている言葉"
    },
    {
        id: 52,
        fortune: "大大吉",
        quote: "私たちは、自分には何かに恵まれた才能があると信じなければならない。",
        author: "マリー・キュリー",
        source: "広く帰属されている言葉"
    },
    {
        id: 53,
        fortune: "中吉",
        quote: "人への好奇心を減らし、考えやアイデアへの好奇心を増やしなさい。",
        author: "マリー・キュリー",
        source: "広く帰属されている言葉"
    },

    {
        id: 54,
        fortune: "大吉",
        quote: "大切なのは、疑問を持ち続けることだ。",
        author: "アルベルト・アインシュタイン",
        source: "広く帰属されている言葉"
    },
    {
        id: 55,
        fortune: "大大吉",
        quote: "人生は自転車に乗るようなものだ。バランスを保つには、動き続けなければならない。",
        author: "アルベルト・アインシュタイン",
        source: "1930年の手紙"
    },
    {
        id: 56,
        fortune: "大吉",
        quote: "想像力は知識よりも重要である。",
        author: "アルベルト・アインシュタイン",
        source: "1929年のインタビュー"
    },
    {
        id: 57,
        fortune: "吉",
        quote: "一度も失敗したことがない人は、新しいことを何も試していない人だ。",
        author: "アルベルト・アインシュタイン",
        source: "広く帰属されている言葉"
    },

    {
        id: 58,
        fortune: "大吉",
        quote: "情熱なしに偉大なことは何も成し遂げられなかった。",
        author: "ラルフ・ワルド・エマーソン",
        source: "エッセイ"
    },
    {
        id: 59,
        fortune: "大大吉",
        quote: "私たちの内側にあるものに比べれば、過去も未来も小さな問題にすぎない。",
        author: "ラルフ・ワルド・エマーソン",
        source: "Ralph Waldo Emerson"
    },
    {
        id: 60,
        fortune: "中吉",
        quote: "あなたがなるべき人とは、自分自身で決めた人である。",
        author: "ラルフ・ワルド・エマーソン",
        source: "広く帰属されている言葉"
    },

    {
        id: 61,
        fortune: "大吉",
        quote: "道があるところへ行くのではなく、道のないところへ行き、道を残しなさい。",
        author: "ラルフ・ワルド・エマーソン",
        source: "広く帰属されている言葉"
    },
    {
        id: 62,
        fortune: "吉",
        quote: "決断した瞬間から、世界はその実現に向けて動き始める。",
        author: "ラルフ・ワルド・エマーソン",
        source: "広く帰属されている言葉"
    },

    {
        id: 63,
        fortune: "大大吉",
        quote: "挑戦する者に、不可能なことはない。",
        author: "アレクサンドロス大王",
        source: "広く帰属されている言葉"
    },
    {
        id: 64,
        fortune: "大吉",
        quote: "幸運は勇者に味方する。",
        author: "ウェルギリウス",
        source: "『アエネーイス』"
    },
    {
        id: 65,
        fortune: "吉",
        quote: "できると信じる者こそ、勝利することができる。",
        author: "ウェルギリウス",
        source: "『アエネーイス』"
    },

    {
        id: 66,
        fortune: "大吉",
        quote: "賽は投げられた。",
        author: "ユリウス・カエサル",
        source: "スエトニウス『皇帝伝』"
    },
    {
        id: 67,
        fortune: "大大吉",
        quote: "来た、見た、勝った。",
        author: "ユリウス・カエサル",
        source: "プルタルコス『英雄伝』"
    },

    {
        id: 68,
        fortune: "大吉",
        quote: "心がすべてである。あなたは自分が考えたものになる。",
        author: "ブッダ",
        source: "広く帰属されている言葉"
    },
    {
        id: 69,
        fortune: "中吉",
        quote: "私たちは、自分が考えたものになる。",
        author: "ブッダ",
        source: "広く帰属されている言葉"
    },
    {
        id: 70,
        fortune: "大吉",
        quote: "人生は心によって形づくられる。私たちは思った通りの人間になる。",
        author: "ブッダ",
        source: "『法句経』の伝統"
    },

    {
        id: 71,
        fortune: "大大吉",
        quote: "旅そのものが、人生の報酬である。",
        author: "スティーブ・ジョブズ",
        source: "広く帰属されている言葉"
    },
    {
        id: 72,
        fortune: "大吉",
        quote: "ハングリーであれ。愚か者であれ。",
        author: "スティーブ・ジョブズ",
        source: "2005年スタンフォード大学卒業式"
    },
    {
        id: 73,
        fortune: "大大吉",
        quote: "あなたの時間は限られている。他人の人生を生きるために時間を使ってはいけない。",
        author: "スティーブ・ジョブズ",
        source: "2005年スタンフォード大学卒業式"
    },
    {
        id: 74,
        fortune: "大吉",
        quote: "何かを信じなければならない。",
        author: "スティーブ・ジョブズ",
        source: "2005年スタンフォード大学卒業式"
    },
    {
        id: 75,
        fortune: "中吉",
        quote: "自分が本当に愛せるものを見つけなければならない。",
        author: "スティーブ・ジョブズ",
        source: "2005年スタンフォード大学卒業式"
    },

    {
        id: 76,
        fortune: "大吉",
        quote: "何もしなければ、何も成し遂げられない。",
        author: "マヤ・アンジェロウ",
        source: "広く帰属されている言葉"
    },
    {
        id: 77,
        fortune: "大大吉",
        quote: "創造性は使い切ることができない。使えば使うほど増えていく。",
        author: "マヤ・アンジェロウ",
        source: "Maya Angelou"
    },

    {
        id: 78,
        fortune: "大吉",
        quote: "成功は終わりではなく、失敗は終わりでもない。大切なのは続ける勇気だ。",
        author: "ウィンストン・チャーチル",
        source: "広く帰属されている言葉"
    },
    {
        id: 79,
        fortune: "大大吉",
        quote: "地獄を通っているなら、そのまま進み続けなさい。",
        author: "ウィンストン・チャーチル",
        source: "広く帰属されている言葉"
    },
    {
        id: 80,
        fortune: "大吉",
        quote: "決して、決して、決してあきらめるな。",
        author: "ウィンストン・チャーチル",
        source: "1941年の演説"
    },

    {
        id: 81,
        fortune: "大吉",
        quote: "私たちは皆、どん底にいる。しかし、星を見上げている者もいる。",
        author: "オスカー・ワイルド",
        source: "『ウィンダミア卿夫人の扇』"
    },
    {
        id: 82,
        fortune: "中吉",
        quote: "経験とは、私たちが失敗につける名前にすぎない。",
        author: "オスカー・ワイルド",
        source: "『ウィンダミア卿夫人の扇』"
    },

    {
        id: 83,
        fortune: "大吉",
        quote: "改善するとは変わること。完璧になるとは、何度も変わることだ。",
        author: "ウィンストン・チャーチル",
        source: "広く帰属されている言葉"
    },

    {
        id: 84,
        fortune: "大大吉",
        quote: "一時間の時間を無駄にする人は、人生の価値をまだ理解していない。",
        author: "チャールズ・ダーウィン",
        source: "広く帰属されている言葉"
    },
    {
        id: 85,
        fortune: "大吉",
        quote: "生き残るのは最も強い種でも、最も賢い種でもない。変化に適応できる種である。",
        author: "チャールズ・ダーウィン",
        source: "広く帰属されている言葉"
    },

    {
        id: 86,
        fortune: "大吉",
        quote: "もし私が遠くを見ることができたのなら、それは巨人の肩の上に立ったからだ。",
        author: "アイザック・ニュートン",
        source: "1675年のロバート・フックへの手紙"
    },
    {
        id: 87,
        fortune: "中吉",
        quote: "真理は、常に単純さの中に見つかる。",
        author: "アイザック・ニュートン",
        source: "Isaac Newton"
    },

    {
        id: 88,
        fortune: "大大吉",
        quote: "天才とは、永遠の忍耐である。",
        author: "ミケランジェロ",
        source: "広く帰属されている言葉"
    },
    {
        id: 89,
        fortune: "大吉",
        quote: "多くの人にとって最大の危険は、目標が高すぎて失敗することではなく、目標が低すぎて達成してしまうことだ。",
        author: "ミケランジェロ",
        source: "広く帰属されている言葉"
    },

    {
        id: 90,
        fortune: "大吉",
        quote: "シンプルさは究極の洗練である。",
        author: "レオナルド・ダ・ヴィンチ",
        source: "広く帰属されている言葉"
    },
    {
        id: 91,
        fortune: "大大吉",
        quote: "学ぶことは、決して心を疲れさせない。",
        author: "レオナルド・ダ・ヴィンチ",
        source: "Leonardo da Vinci"
    },
    {
        id: 92,
        fortune: "中吉",
        quote: "一つの星に心を定めた者は、その考えを簡単には変えない。",
        author: "レオナルド・ダ・ヴィンチ",
        source: "Leonardo da Vinci"
    },

    {
        id: 93,
        fortune: "大吉",
        quote: "他人を知ることは知性であり、自分自身を知ることは本当の知恵である。",
        author: "老子",
        source: "『道徳経』"
    },
    {
        id: 94,
        fortune: "大大吉",
        quote: "自分が何者であるかを手放したとき、自分がなり得るものになる。",
        author: "老子",
        source: "『道徳経』"
    },

    {
        id: 95,
        fortune: "大吉",
        quote: "どれほどゆっくり進んでも、止まらなければよい。",
        author: "孔子",
        source: "広く帰属されている言葉"
    },
    {
        id: 96,
        fortune: "大吉",
        quote: "すべてのものには美しさがある。しかし、それを見つけられる人はすべてではない。",
        author: "孔子",
        source: "広く帰属されている言葉"
    },
    {
        id: 97,
        fortune: "中吉",
        quote: "学んでも考えなければ迷い、考えても学ばなければ危うい。",
        author: "孔子",
        source: "『論語』"
    },
    {
        id: 98,
        fortune: "大吉",
        quote: "最大の栄光とは、一度も倒れないことではなく、倒れるたびに立ち上がることだ。",
        author: "孔子",
        source: "広く帰属されている言葉"
    },

    {
        id: 99,
        fortune: "大大吉",
        quote: "知るだけでは十分ではない。実行しなければならない。望むだけでは十分ではない。行動しなければならない。",
        author: "ヨハン・ヴォルフガング・フォン・ゲーテ",
        source: "広く帰属されている言葉"
    },
    {
        id: 100,
        fortune: "スーパー大吉",
        quote: "できること、夢見ることは、まず始めなさい。大胆さには天才と力と魔法が宿っている。",
        author: "ヨハン・ヴォルフガング・フォン・ゲーテ",
        source: "広く帰属されている言葉"
    }

];


/* =====================================================
   HTML要素
===================================================== */

const drawButton =
    document.getElementById("drawButton");

const fortuneElement =
    document.getElementById("fortune");

const quoteElement =
    document.getElementById("quote");

const authorElement =
    document.getElementById("author");

const cooldownElement =
    document.getElementById("cooldown");

const bookGrid =
    document.getElementById("bookGrid");

const countElement =
    document.getElementById("count");

const modal =
    document.getElementById("modal");

const closeModal =
    document.getElementById("closeModal");

const modalFortune =
    document.getElementById("modalFortune");

const modalQuote =
    document.getElementById("modalQuote");

const modalAuthor =
    document.getElementById("modalAuthor");

const modalSource =
    document.getElementById("modalSource");


/* =====================================================
   図鑑データ
===================================================== */

let collected =
    JSON.parse(
        localStorage.getItem(
            "quoteCollection"
        )
    ) || [];


/* =====================================================
   クールタイム
===================================================== */

let lastDraw =
    Number(
        localStorage.getItem(
            "quoteLastDraw"
        )
    ) || 0;

const COOLDOWN =
    30 * 60 * 1000;


/* =====================================================
   御神籤を引く
===================================================== */

drawButton.addEventListener(
    "click",
    function () {

        const now =
            Date.now();

        if (
            now - lastDraw <
            COOLDOWN
        ) {

            updateCooldown();

            return;
        }

        drawButton.disabled =
            true;

        drawButton.textContent =
            "🎋　引いています…";


        setTimeout(
            function () {

                const randomIndex =
                    Math.floor(
                        Math.random()
                        *
                        quotes.length
                    );

                const item =
                    quotes[randomIndex];


                showResult(item);

                register(item.id);


                lastDraw =
                    Date.now();


                localStorage.setItem(
                    "quoteLastDraw",
                    lastDraw
                );


                updateBook();

                updateCooldown();

            },
            600
        );
    }
);


/* =====================================================
   結果表示
===================================================== */

function showResult(item) {

    fortuneElement.textContent =
        item.fortune;

    quoteElement.textContent =
        "「" +
        item.quote +
        "」";

    authorElement.textContent =
        "― " +
        item.author;
}


/* =====================================================
   図鑑登録
===================================================== */

function register(id) {

    if (
        !collected.includes(id)
    ) {

        collected.push(id);

        localStorage.setItem(
            "quoteCollection",
            JSON.stringify(
                collected
            )
        );
    }
}


/* =====================================================
   図鑑を作る
===================================================== */

function updateBook() {

    bookGrid.innerHTML = "";

    countElement.textContent =
        collected.length;


    quotes.forEach(
        function(item) {

            const card =
                document.createElement(
                    "div"
                );


            card.className =
                "book-card";


            /* 登録済み */

            if (
                collected.includes(
                    item.id
                )
            ) {

                card.classList.add(
                    "unlocked"
                );


                card.innerHTML = `

                    <div class="book-number">
                        No.${String(item.id).padStart(3, "0")}
                    </div>

                    <div class="book-fortune">
                        ${item.fortune}
                    </div>

                    <div class="book-author">
                        ${item.author}
                    </div>

                `;


                /*
                    カードを押す
                    ↓
                    名言詳細を表示
                */

                card.addEventListener(
                    "click",
                    function() {

                        openModal(item);

                    }
                );

            }


            /* 未登録 */

            else {

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


            bookGrid.appendChild(
                card
            );
        }
    );
}


/* =====================================================
   名言詳細
===================================================== */

function openModal(item) {

    modalFortune.textContent =
        item.fortune;

    modalQuote.textContent =
        "「" +
        item.quote +
        "」";

    modalAuthor.textContent =
        "― " +
        item.author;

    modalSource.textContent =
        "出典：" +
        item.source;


    modal.classList.add(
        "open"
    );
}


/* =====================================================
   モーダルを閉じる
===================================================== */

closeModal.addEventListener(
    "click",
    function() {

        modal.classList.remove(
            "open"
        );

    }
);


document
    .querySelector(".modal-bg")
    .addEventListener(
        "click",
        function() {

            modal.classList.remove(
                "open"
            );

        }
    );


/* =====================================================
   クールタイム表示
===================================================== */

function updateCooldown() {

    const remaining =
        COOLDOWN -
        (
            Date.now()
            -
            lastDraw
        );


    /* 引ける */

    if (
        remaining <= 0
    ) {

        drawButton.disabled =
            false;

        drawButton.textContent =
            "🎋　御神籤を引く";

        cooldownElement.textContent =
            "✨ 御神籤を引くことができます";

        return;
    }


    /* 残り時間 */

    const minutes =
        Math.floor(
            remaining / 60000
        );

    const seconds =
        Math.floor(
            (
                remaining %
                60000
            ) / 1000
        );


    drawButton.disabled =
        true;

    drawButton.textContent =
        "⏳　次の御神籤まで待機";


    cooldownElement.textContent =
        "次の御神籤まで " +
        minutes +
        "分 " +
        String(seconds).padStart(
            2,
            "0"
        ) +
        "秒";
}


/* =====================================================
   初期化
===================================================== */

updateBook();

updateCooldown();


/* 1秒ごとにタイマー更新 */

setInterval(
    updateCooldown,
    1000
);
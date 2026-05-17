const storageKey = "boundaryTrainingRecords";
const lastQuestionKeyPrefix = "boundaryTrainingLastQuestion:";
const dailyQuestionCount = 10;

const situationContexts = [
  { kind: "help", request: "今週末、ちょっと手伝える？", limit: "休む時間を取っておきたい", boundary: "今日は休む予定を優先したい" },
  { kind: "errand", request: "今から買い物行ける？", limit: "もう予定が詰まっている", boundary: "今日は行けないので別の方法を考えたい" },
  { kind: "listening", request: "今ちょっと話聞いてもらえる？", limit: "気持ちの余裕が少ない", boundary: "聞ける時間を短く区切りたい" },
  { kind: "work", request: "これ、今日中にお願いできる？", limit: "退勤時間が近い", boundary: "明日の着手にしたい" },
  { kind: "invite", request: "今度の集まり、来るよね？", limit: "一人で休みたい", boundary: "今回は見送りたい" },
  { kind: "visit", request: "今日、少し寄ってもいい？", limit: "家で静かに過ごしたい", boundary: "別の日に調整したい" },
  { kind: "explain", request: "代わりに説明しておいてくれない？", limit: "自分の担当範囲を超えている", boundary: "知っている範囲だけ共有したい" },
  { kind: "money", request: "一回立て替えておいてもらえる？", limit: "お金のやり取りに不安がある", boundary: "立て替えはしない形にしたい" },
  { kind: "sharing", request: "最近の写真、もっと送ってよ", limit: "頻度が負担になっている", boundary: "送れる時だけにしたい" },
  { kind: "coordination", request: "今回も日程まとめてもらっていい？", limit: "毎回役割が偏っている", boundary: "今回は調整役を休みたい" },
  { kind: "lateTalk", request: "今夜、少しだけ話せる？", limit: "眠る時間を守りたい", boundary: "明日に回したい" },
  { kind: "joke", request: "それくらい笑って流してよ", limit: "その言い方に傷ついている", boundary: "その表現は控えてほしい" },
  { kind: "routine", request: "いつも通りお願いね", limit: "体力が残っていない", boundary: "最低限だけにしたい" },
  { kind: "offHours", request: "休み中だけど、これ見られる？", limit: "休日は仕事から離れたい", boundary: "次の勤務日に確認したい" },
  { kind: "visit", request: "今から家行ってもいい？", limit: "迎える準備ができていない", boundary: "別の日にしたい" },
  { kind: "schedule", request: "やっぱり時間変えてもいい？", limit: "調整に疲れている", boundary: "今回は決めた時間で進めたい" },
  { kind: "vagueWork", request: "いい感じに広めに見ておいて", limit: "範囲が見えないまま進めたくない", boundary: "完了条件を確認したい" },
  { kind: "priority", request: "こっちの予定に合わせてくれる？", limit: "先に決めた予定がある", boundary: "先約を優先したい" },
  { kind: "rescue", request: "もうどうしたらいいか決めてほしい", limit: "代わりに背負うことはできない", boundary: "一緒に整理する範囲にしたい" },
  { kind: "privacy", request: "で、実際どうなの？詳しく教えて", limit: "話したくない部分がある", boundary: "詳しい話は控えたい" },
  { kind: "invite", request: "来てくれたらうれしいんだけどな", limit: "気持ちが乗らない", boundary: "今回は参加しない選択をしたい" },
  { kind: "fittingIn", request: "いつもの感じで合わせてくれるよね", limit: "自分の気持ちを置き去りにしている", boundary: "自分の希望も一つ伝えたい" }
];

function naturalHealthy(category, c, index) {
  const specific = specificHealthy(c);
  if (specific[category]) {
    return specific[category][index % specific[category].length];
  }

  const pattern = index % 6;
  const replies = {
    "頼まれごと": [
      `助けたい気持ちはあるけれど、今日は${c.limit}。まず自分の余白を確認しよう。`,
      `すぐ引き受けなくても大丈夫。今の自分に無理がないか見てから決めよう。`,
      `相手を大切にしたい気持ちと、自分を休ませたい気持ちが両方ある。`,
      `${c.boundary}気持ちもある。少し間を置いて考えよう。`,
      `断ることは冷たさではなく、今の自分を守る選択かもしれない。`,
      `手伝えるかどうかより先に、今の疲れ具合を見てみよう。`
    ],
    "罪悪感": [
      `申し訳なさはある。でも、その気持ちだけで決めなくてもいい。`,
      `罪悪感が出ているだけで、引き受ける必要があるとは限らない。`,
      `今の私には少し重い。そう感じていることを大事にしていい。`,
      `${c.boundary}気持ちもある。理由を増やしすぎなくていい。`,
      `すぐ決めずに、予定と体力に無理がないか見てから考えよう。`,
      `相手の期待は受け取りつつ、自分のしんどさも同じくらい見ていい。`
    ],
    "不機嫌への反応": [
      `相手の空気は気になる。でも、機嫌まで自分が整えなくていい。`,
      `落ち着かない感じがある。まず自分の呼吸を戻そう。`,
      `相手の気持ちを尊重しながら、自分のペースも守っていい。`,
      `${c.boundary}気持ちもある。空気だけで決めないでおこう。`,
      `今は少し距離を取る方が、自分にも相手にもやさしいかもしれない。`,
      `様子は気になるけれど、全部引き受けなくていい。`
    ],
    "急なお願い": [
      `急いで返事したくなるけれど、一度予定を見てからでいい。`,
      `${c.boundary}気持ちがある。焦りだけで決めないようにしよう。`,
      `今すぐ動けるかより、今の自分に無理がないかを先に見よう。`,
      `急な流れに飲まれそう。少し考える時間を取っていい。`,
      `今日は余裕が少ない。別の方法があるかもしれない。`,
      `すぐ答えなくても、落ち着いて選び直せる。`
    ],
    "過剰な共感": [
      `助けたい気持ちと、今の自分には余裕がない感覚が両方ある。`,
      `心配している。でも、相手のつらさを全部持たなくていい。`,
      `${c.boundary}気持ちもある。今の私に無理がない形を探そう。`,
      `聞きたい気持ちはある。けれど、今日は短い時間がちょうどよさそう。`,
      `相手の気持ちは大切。私の疲れも大切。`,
      `一緒に考えることと、代わりに背負うことは別にしていい。`
    ],
    "説明しすぎ": [
      `わかってもらうために、全部説明しなくてもいい。`,
      `理由をたくさん並べたくなっている。短くても伝わるかもしれない。`,
      `${c.boundary}気持ちがある。詳しい理由は足さなくていい。`,
      `嫌われたくなくて説明したくなる。でも、今は短く整えよう。`,
      `必要なことだけ言えば大丈夫。自分を証明しなくていい。`,
      `少し考えた上で選ぶなら、それ以上説明しなくてもいい。`
    ],
    "拒否・断る": [
      `嫌だな、という感覚がある。まずそれをなかったことにしない。`,
      `強く言わなくても、少し距離を置く選択はできる。`,
      `${c.boundary}気持ちもある。自分の感覚を信じていい。`,
      `合わせた方が楽に見えるけれど、あとで疲れそうな感じがある。`,
      `今は少し離れる方が、自分を大切にできそう。`,
      `断るというより、自分の心地よさを守る選択をしたい。`
    ]
  };

  return replies[category][pattern];
}

function specificHealthy(c) {
  const map = {
    visit: {
      "頼まれごと": [
        `来てくれる気持ちはうれしい。でも今日は静かに過ごしたい感覚がある。`,
        `急に迎える準備をしなくてもいい。今日は家の静けさを守っていい。`
      ],
      "急なお願い": [
        `急な訪問に合わせようとしている。まず、自分が休みたい気持ちを見ていい。`,
        `今すぐ返事しなくてもいい。今日は家で落ち着きたい感覚がある。`
      ],
      "罪悪感": [
        `断ると悪い気がする。でも、休みたい気持ちもちゃんとある。`,
        `相手を嫌いなわけではなく、今日は静かにしたいだけかもしれない。`
      ],
      "拒否・断る": [
        `家に人を入れる準備ができていない感覚を、大切にしていい。`,
        `今は迎えない選択をしても、自分を責めなくていい。`
      ]
    },
    listening: {
      "頼まれごと": [
        `聞きたい気持ちはある。でも、今の余白は少なそう。`,
        `全部聞くかどうかの前に、今日はどれくらい聞けるか見てみよう。`
      ],
      "過剰な共感": [
        `助けたい気持ちと、今の自分には余裕がない感覚が両方ある。`,
        `相手のつらさは大切。でも、私の疲れも同じくらい大切。`
      ]
    },
    help: {
      "頼まれごと": [
      `手伝いたい気持ちはあるけれど、休みたい気持ちもある。`,
      `引き受ける前に、今の体力を一度見てみよう。`
      ]
    },
    joke: {
      "拒否・断る": [
        `笑って流せない自分を責めなくていい。傷ついた感覚を見ていい。`,
        `強く言わなくても、その言い方が苦手だと感じていい。`
      ],
      "不機嫌への反応": [
        `場の空気より、自分が傷ついた感覚を置き去りにしない。`,
        `笑って合わせる前に、今の違和感を見てみよう。`
      ]
    },
    money: {
      "頼まれごと": [
        `助けたい気持ちはあっても、お金の不安は無視しなくていい。`,
        `立て替える前に、自分が安心できるかを確認していい。`
      ],
      "拒否・断る": [
        `お金のやり取りに不安があるなら、その感覚を大切にしていい。`,
        `相手を疑うためではなく、自分の安心を守る選択をしていい。`
      ]
    },
    privacy: {
      "拒否・断る": [
        `話したくない部分がある。それは隠しごとではなく、自分の境界線かもしれない。`,
        `詳しく話さない選択をしても、自分を責めなくていい。`
      ],
      "説明しすぎ": [
        `わかってもらいたくて説明したくなる。でも、どこまで話すかは自分で選べる。`,
        `全部話さなくてもいい。今はここまで、で止めても大丈夫。`
      ]
    }
  };

  return map[c.kind] || {};
}

function contextsForCategory(category) {
  const includesAny = (context, words) => words.some((word) => context.request.includes(word) || context.limit.includes(word));
  const pools = {
    "頼まれごと": situationContexts.filter((context) =>
      includesAny(context, ["手伝", "買い物", "話聞", "今日中", "集まり", "寄って", "説明", "立て替え", "送って", "日程", "見られる", "合わせ"])
    ),
    "罪悪感": situationContexts.filter((context) =>
      includesAny(context, ["来る", "寄って", "手伝", "話聞", "うれしい", "合わせ", "お願い", "優先", "いつもの"])
    ),
    "不機嫌への反応": situationContexts.filter((context) =>
      includesAny(context, ["予定", "買い物", "話", "集まり", "寄って", "時間変え", "優先", "決めて", "合わせ"])
    ),
    "急なお願い": situationContexts.filter((context) =>
      includesAny(context, ["今から", "今日中", "今週末", "代わり", "買い物", "寄って", "休み中", "時間変え", "日程"])
    ),
    "過剰な共感": situationContexts.filter((context) =>
      includesAny(context, ["話聞", "決めて", "説明", "不安", "詳しく", "長め", "代わり", "優先", "しんど"])
    ),
    "説明しすぎ": situationContexts.filter((context) =>
      includesAny(context, ["集まり", "寄って", "見られる", "詳しく", "立て替え", "送って", "来て", "優先", "予定", "うれしい"])
    ),
    "拒否・断る": situationContexts.filter((context) =>
      includesAny(context, ["笑って", "写真", "詳しく", "家行", "立て替え", "時間変え", "いつも通り", "優先", "合わせ", "流して"])
    )
  };

  return pools[category].length ? pools[category] : situationContexts;
}

const themeTemplates = [
  {
    category: "頼まれごと",
    scene: (c) => `ふっと連絡が入ります。「${c.request}」 今日は、${c.limit}。少し間を置いて心の反応を見てみます。`,
    codependent: (c) => `頼まれたなら、私が何とかしないと。`,
    middle: (c) => `少ししんどいけれど、たぶん引き受けた方が丸く収まりそう。`,
    healthy: (c, index) => naturalHealthy("頼まれごと", c, index),
    feedback: "頼まれた瞬間の反応に気づくと、引き受ける前に自分の余白へ戻りやすくなります。",
    point: "まず心の中で『今の私に無理はない？』と聞いてみます。"
  },
  {
    category: "罪悪感",
    scene: `${"dynamic"}`,
    makeScene: (c) => `「${c.request}」 画面を見たまま、断ったら悪いかな、が浮かんできます。自分の本音も小さく残っています。`,
    codependent: (c) => `断ったら悪い人みたい。無理してでも応えなきゃ。`,
    middle: (c) => `罪悪感はある。けれど、本当にできるか少し迷っている。`,
    healthy: (c, index) => naturalHealthy("罪悪感", c, index),
    feedback: "罪悪感は大切なサインですが、そのまま行動を決める合図とは限りません。",
    point: "『悪い人になる』ではなく『今の自分に合う選択を探す』に戻します。"
  },
  {
    category: "不機嫌への反応",
    makeScene: (c) => `返事が少し短く感じます。「${c.request}」 空気に合わせそうになりながら、自分のペースも思い出します。`,
    codependent: (c) => `機嫌が悪そう。私が合わせれば落ち着くかもしれない。`,
    middle: (c) => `不機嫌そうだと落ち着かないから、つい合わせたくなります。`,
    healthy: (c, index) => naturalHealthy("不機嫌への反応", c, index),
    feedback: "相手の気持ちは大切にしながらも、機嫌まで自分が抱え込まなくて大丈夫です。",
    point: "GIVEのGentleを保ちながら、自分の余白も同じくらい大切にします。"
  },
  {
    category: "急なお願い",
    makeScene: (c) => `予定外の連絡が入ります。「${c.request}」 こちらは、${c.limit}。`,
    codependent: (c) => `急ぎなら、今すぐ動かなきゃ。`,
    middle: (c) => `急すぎて困る。でも少しなら無理してできるかもしれない。`,
    healthy: (c, index) => naturalHealthy("急なお願い", c, index),
    feedback: "急な流れほど、焦りと自分の本音を分けて見ることが助けになります。",
    point: "すぐ動く前に、体の緊張や疲れに一度気づいてみます。"
  },
  {
    category: "過剰な共感",
    makeScene: (c) => `相手がしんどそうにしています。「${c.request}」 力になりたい気持ちと、自分の疲れが同時にあります。`,
    codependent: (c) => `相手がつらいなら、私が最後まで受け止めなきゃ。`,
    middle: (c) => `心配だから、少し無理してでも聞いた方がいいかも。`,
    healthy: (c, index) => naturalHealthy("過剰な共感", c, index),
    feedback: "共感は相手を丸ごと背負うことではありません。自分の余力も同じくらい大切です。",
    point: "『聞く』と『背負う』を分ける練習です。やさしさの中にも、自分の余白を残します。"
  },
  {
    category: "説明しすぎ",
    makeScene: (c) => `「${c.request}」 断りたいだけなのに、頭の中で理由がどんどん増えていきます。短く言っても大丈夫そうです。`,
    codependent: (c) => `ちゃんと理由を全部話さないと、きっとわかってもらえない。`,
    middle: (c) => `短く言いたいけれど、説明が足りないと不安になる。`,
    healthy: (c, index) => naturalHealthy("説明しすぎ", c, index),
    feedback: "説明したくなる気持ちは自然です。ただ、全部わかってもらおうとすると疲れやすくなります。",
    point: "心の中で『短くても大丈夫』と確認します。"
  },
  {
    category: "拒否・断る",
    makeScene: (c) => `「${c.request}」 その一言に、少し体が固まります。嫌だな、という感覚をなかったことにしない場面です。`,
    codependent: (c) => `嫌だけど、波風を立てるくらいなら我慢しよう。`,
    middle: (c) => `少しつらい。けれど、どう扱えばいいかまだ迷っている。`,
    healthy: (c, index) => naturalHealthy("拒否・断る", c, index),
    feedback: "嫌だと感じた時は、その感覚を無視せず、静かに距離を取る言葉を選んで大丈夫です。",
    point: "自分の体感を手がかりに、やわらかく線を引く練習です。"
  }
];

function buildQuestions() {
  const generated = [];
  themeTemplates.forEach((theme) => {
    const contexts = contextsForCategory(theme.category);
    for (let index = 0; index < 22; index += 1) {
      const context = contexts[index % contexts.length];
      generated.push(makeQuestion(theme, context, index));
    }
  });
  return generated.slice(0, 150);
}

function makeQuestion(theme, context, index) {
  const scene = theme.makeScene ? theme.makeScene(context) : theme.scene(context);
  const healthy = theme.healthy(context, index);
  return {
    id: `${theme.category}-${index + 1}`,
    category: theme.category,
    scene,
    choices: [
      { text: theme.codependent(context), type: "codependent" },
      { text: theme.middle(context), type: "middle" },
      { text: healthy, type: "healthy" }
    ],
    feedback: theme.feedback,
    modelAnswer: healthy,
    point: theme.point
  };
}

const questions = buildQuestions();

const checkInItems = [
  "今日は無理をしすぎませんでしたか？",
  "自分の気持ちを無視しませんでしたか？",
  "少しでも安心できる時間がありましたか？",
  "「やらなければ」を減らせましたか？",
  "自分に優しい言葉を使えましたか？"
];

let dailyQuestions = [];
let currentIndex = 0;
let score = 0;
let answered = false;
let answerResults = [];
let checkInAnswers = {};

const intro = document.getElementById("intro");
const quiz = document.getElementById("quiz");
const summary = document.getElementById("summary");
const startBtn = document.getElementById("startBtn");
const homeBtn = document.getElementById("homeBtn");
const progressText = document.getElementById("progressText");
const progressFill = document.getElementById("progressFill");
const scoreText = document.getElementById("scoreText");
const sceneText = document.getElementById("sceneText");
const choicesEl = document.getElementById("choices");
const feedback = document.getElementById("feedback");
const resultText = document.getElementById("resultText");
const feedbackText = document.getElementById("feedbackText");
const modelAnswerText = document.getElementById("modelAnswerText");
const pointText = document.getElementById("pointText");
const retryBtn = document.getElementById("retryBtn");
const nextBtn = document.getElementById("nextBtn");
const summaryScore = document.getElementById("summaryScore");
const checkInList = document.getElementById("checkInList");
const successInput = document.getElementById("successInput");
const saveBtn = document.getElementById("saveBtn");
const summaryHomeBtn = document.getElementById("summaryHomeBtn");
const historyList = document.getElementById("historyList");
const clearHistoryBtn = document.getElementById("clearHistoryBtn");

function shuffle(items) {
  return [...items].sort(() => Math.random() - 0.5);
}

function startTraining() {
  dailyQuestions = createDailyQuestions();
  avoidRepeatFromLastSession();
  currentIndex = 0;
  score = 0;
  answered = false;
  answerResults = Array(dailyQuestions.length).fill(null);
  showScreen("quiz");
  renderQuestion();
}

function createDailyQuestions() {
  return shuffle(questions).slice(0, dailyQuestionCount);
}

function avoidRepeatFromLastSession() {
  const lastId = localStorage.getItem(`${lastQuestionKeyPrefix}all`);
  if (!lastId || dailyQuestions.length < 2 || dailyQuestions[0].id !== lastId) {
    return;
  }

  const swapIndex = dailyQuestions.findIndex((question) => question.id !== lastId);
  if (swapIndex > 0) {
    [dailyQuestions[0], dailyQuestions[swapIndex]] = [dailyQuestions[swapIndex], dailyQuestions[0]];
  }
}

function showScreen(name) {
  intro.classList.toggle("hidden", name !== "intro");
  quiz.classList.toggle("hidden", name !== "quiz");
  summary.classList.toggle("hidden", name !== "summary");
}

function renderQuestion() {
  const currentQuestion = dailyQuestions[currentIndex];
  localStorage.setItem(`${lastQuestionKeyPrefix}all`, currentQuestion.id);
  answered = false;
  feedback.classList.add("hidden");
  choicesEl.innerHTML = "";
  progressText.textContent = `${currentIndex + 1} / ${dailyQuestions.length} 問`;
  progressFill.style.width = `${(currentIndex / dailyQuestions.length) * 100}%`;
  scoreText.textContent = `境界線あり ${score} 問`;
  sceneText.textContent = currentQuestion.scene;

  shuffle(currentQuestion.choices).forEach((choice) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "choice";
    button.dataset.type = choice.type;
    button.textContent = choice.text;
    button.addEventListener("click", () => selectChoice(choice, button));
    choicesEl.appendChild(button);
  });
}

function selectChoice(choice, selectedButton) {
  if (answered) {
    return;
  }

  answered = true;
  const question = dailyQuestions[currentIndex];
  const isCorrect = choice.type === "healthy";
  answerResults[currentIndex] = isCorrect;
  score = answerResults.filter(Boolean).length;

  [...choicesEl.children].forEach((button) => {
    button.disabled = true;
    if (button.dataset.type === "healthy") {
      button.classList.add("correct");
    }
    if (button.dataset.type === "middle") {
      button.classList.add("middle");
    }
  });

  if (!isCorrect) {
    selectedButton.classList.add("incorrect");
  }

  const resultMessages = {
    codependent: "相手や状況を、少し背負いすぎているかもしれません",
    middle: "少し巻き込まれていますが、自分の感覚にも気づけています",
    healthy: "自分も相手も大切にする距離感です"
  };
  resultText.textContent = resultMessages[choice.type];
  feedbackText.textContent = question.feedback;
  modelAnswerText.textContent = question.modelAnswer;
  pointText.textContent = question.point;
  scoreText.textContent = `境界線あり ${score} 問`;
  feedback.classList.remove("hidden");
}

function retryQuestion() {
  renderQuestion();
}

function nextQuestion() {
  if (currentIndex < dailyQuestions.length - 1) {
    currentIndex += 1;
    renderQuestion();
  } else {
    progressFill.style.width = "100%";
    showSummary();
  }
}

function showSummary() {
  const rate = Math.round((score / dailyQuestions.length) * 100);
  summaryScore.textContent = `境界線あり ${score} / ${dailyQuestions.length} 問（${rate}%）`;
  checkInAnswers = {};
  successInput.value = "";
  renderCheckIn();
  showScreen("summary");
}

function renderCheckIn() {
  checkInList.innerHTML = "";
  checkInItems.forEach((item, index) => {
    const row = document.createElement("div");
    row.className = "checkin-item";

    const question = document.createElement("p");
    question.textContent = item;
    row.appendChild(question);

    const options = document.createElement("div");
    options.className = "checkin-options";
    ["Yes", "No", "どちらとも言えない"].forEach((option) => {
      const button = document.createElement("button");
      button.type = "button";
      button.textContent = option;
      button.className = "checkin-button";
      button.addEventListener("click", () => {
        checkInAnswers[index] = option;
        [...options.children].forEach((child) => child.classList.remove("active"));
        button.classList.add("active");
      });
      options.appendChild(button);
    });

    row.appendChild(options);
    checkInList.appendChild(row);
  });
}

function saveRecord() {
  const records = getRecords();
  const rate = Math.round((score / dailyQuestions.length) * 100);
  records.unshift({
    date: new Date().toLocaleString("ja-JP", { dateStyle: "medium", timeStyle: "short" }),
    category: "全テーマ",
    score,
    total: dailyQuestions.length,
    rate,
    checkIn: checkInItems.map((item, index) => ({
      question: item,
      answer: checkInAnswers[index] || ""
    })),
    success: successInput.value.trim()
  });
  localStorage.setItem(storageKey, JSON.stringify(records.slice(0, 10)));
  renderHistory();
  showScreen("intro");
}

function getRecords() {
  try {
    return JSON.parse(localStorage.getItem(storageKey)) || [];
  } catch {
    return [];
  }
}

function renderHistory() {
  const records = getRecords();
  historyList.innerHTML = "";

  if (!records.length) {
    const empty = document.createElement("div");
    empty.className = "history-item";
    empty.textContent = "まだ記録はありません。今日の10問から始めましょう。";
    historyList.appendChild(empty);
    return;
  }

  records.forEach((record) => {
    const item = document.createElement("div");
    item.className = "history-item";
    const success = record.success ? ` 小さな成功：${record.success}` : "";
    item.textContent = `${record.date} / ${record.category} / 境界線あり ${record.score}/${record.total}（${record.rate}%）${success}`;
    historyList.appendChild(item);
  });
}

function clearHistory() {
  localStorage.removeItem(storageKey);
  renderHistory();
}

startBtn.addEventListener("click", startTraining);
homeBtn.addEventListener("click", () => showScreen("intro"));
retryBtn.addEventListener("click", retryQuestion);
nextBtn.addEventListener("click", nextQuestion);
saveBtn.addEventListener("click", saveRecord);
summaryHomeBtn.addEventListener("click", () => showScreen("intro"));
clearHistoryBtn.addEventListener("click", clearHistory);

renderHistory();

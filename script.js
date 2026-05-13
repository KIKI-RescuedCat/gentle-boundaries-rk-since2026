const storageKey = "boundaryTrainingRecords";
const lastQuestionKeyPrefix = "boundaryTrainingLastQuestion:";
const dailyQuestionCount = 10;

const situationContexts = [
  { person: "身近な人", request: "週末の予定を手伝ってほしい", limit: "休む時間を確保したい", boundary: "今日は休む予定を優先したい" },
  { person: "家族", request: "今すぐ買い物に行ってほしい", limit: "すでに予定が詰まっている", boundary: "今日は行けないので別の方法を考えたい" },
  { person: "親しい相手", request: "長めの相談を聞いてほしい", limit: "気持ちの余裕が少ない", boundary: "聞ける時間を短く区切りたい" },
  { person: "職場の人", request: "追加作業を今日中に進めてほしい", limit: "退勤時間が近い", boundary: "明日の着手にしたい" },
  { person: "友人", request: "集まりに参加してほしい", limit: "一人で休みたい", boundary: "今回は見送りたい" },
  { person: "親族", request: "急な訪問に対応してほしい", limit: "家で静かに過ごしたい", boundary: "別の日に調整したい" },
  { person: "同僚", request: "代わりに説明してほしい", limit: "自分の担当範囲を超えている", boundary: "知っている範囲だけ共有したい" },
  { person: "知人", request: "お金を立て替えてほしい", limit: "金銭面で不安がある", boundary: "立て替えはしない形にしたい" },
  { person: "相手", request: "写真や近況を頻繁に送ってほしい", limit: "頻度が負担になっている", boundary: "送れる時だけにしたい" },
  { person: "グループ", request: "調整役を引き受けてほしい", limit: "毎回役割が偏っている", boundary: "今回は調整役を休みたい" },
  { person: "大切な人", request: "夜遅くに話を聞いてほしい", limit: "眠る時間を守りたい", boundary: "明日に回したい" },
  { person: "相手", request: "苦手な冗談を受け流してほしい", limit: "その言い方に傷ついている", boundary: "その表現は控えてほしい" },
  { person: "家の人", request: "体調が悪くても普段通り動いてほしい", limit: "体力が残っていない", boundary: "最低限だけにしたい" },
  { person: "仕事相手", request: "休みの日に返信してほしい", limit: "休日は仕事から離れたい", boundary: "次の勤務日に確認したい" },
  { person: "友人", request: "急に家へ行きたい", limit: "迎える準備ができていない", boundary: "別の日にしたい" },
  { person: "相手", request: "予定を何度も変更してほしい", limit: "調整に疲れている", boundary: "今回は決めた時間で進めたい" },
  { person: "職場の人", request: "曖昧な依頼を広めに対応してほしい", limit: "範囲が見えないまま進めたくない", boundary: "完了条件を確認したい" },
  { person: "身近な人", request: "自分の予定より相手の都合を優先してほしい", limit: "先に決めた予定がある", boundary: "先約を優先したい" },
  { person: "相談してきた相手", request: "問題を代わりに解決してほしい", limit: "代わりに背負うことはできない", boundary: "一緒に整理する範囲にしたい" },
  { person: "相手", request: "個人的なことを詳しく話してほしい", limit: "話したくない部分がある", boundary: "詳しい話は控えたい" },
  { person: "親しい人", request: "気が進まない誘いに来てほしい", limit: "気持ちが乗らない", boundary: "今回は参加しない選択をしたい" },
  { person: "周囲の人", request: "いつも通り場に合わせてほしい", limit: "自分の気持ちを置き去りにしている", boundary: "自分の希望も一つ伝えたい" }
];

function naturalHealthy(category, c, index) {
  const pattern = index % 6;
  const replies = {
    "頼まれごと": [
      `${c.boundary}。`,
      `今日は引き受けられません。`,
      `今は難しいです。必要なら別の方法を考えましょう。`,
      `${c.boundary}。少し時間を置いて返事します。`,
      `それは今回はできません。`,
      `手伝える範囲を確認してから返事します。`
    ],
    "罪悪感": [
      `${c.boundary}。無理して引き受けるのはやめておきます。`,
      `申し訳なさはありますが、今回は難しいです。`,
      `今の私には引き受けられません。`,
      `${c.boundary}。理由はここまでにします。`,
      `すぐに返事せず、予定を見てから決めます。`,
      `気持ちは受け取りました。ただ、今回は見送ります。`
    ],
    "不機嫌への反応": [
      `不機嫌そうに見えるね。話したければ聞くよ。`,
      `今は少し距離を取ります。落ち着いたら話しましょう。`,
      `気持ちは尊重するけれど、私は無理に合わせません。`,
      `${c.boundary}。必要なら後で話を聞きます。`,
      `私はいったん落ち着く時間を取ります。`,
      `様子は気になるけれど、私が全部背負うことはしません。`
    ],
    "急なお願い": [
      `急には対応できません。`,
      `${c.boundary}。`,
      `今すぐは難しいです。明日なら確認できます。`,
      `一度予定を見てから返事します。`,
      `今日は無理です。急ぎなら別の方法を探してください。`,
      `少し考える時間をください。`
    ],
    "過剰な共感": [
      `大切に聞きたいから、今日は短い時間だけにします。`,
      `心配しています。ただ、私が全部抱えることはできません。`,
      `${c.boundary}。今の私にできるのはここまでです。`,
      `少しなら聞けます。続きは別の日にしましょう。`,
      `気持ちは受け止めます。でも私も休みます。`,
      `一緒に整理はできます。代わりに背負うことはできません。`
    ],
    "説明しすぎ": [
      `今回は難しいです。`,
      `行けません。声をかけてくれてありがとう。`,
      `${c.boundary}。詳しい理由は控えます。`,
      `今回は見送ります。また合う時にお願いします。`,
      `できません。必要なことだけお伝えします。`,
      `少し考えましたが、今回は引き受けません。`
    ],
    "拒否・断る": [
      `それはやめてください。`,
      `私はそれは受け入れられません。`,
      `${c.boundary}。`,
      `その形ではできません。`,
      `嫌なので断ります。`,
      `今回はNoにします。`
    ]
  };

  return replies[category][pattern];
}

const themeTemplates = [
  {
    category: "頼まれごと",
    scene: (c) => `${c.person}から「${c.request}」と言われました。あなたは${c.limit}状態です。どう返しますか？`,
    codependent: (c) => `わかった。私が何とかするね。`,
    middle: (c) => `今はちょっと困るけど、たぶん大丈夫だと思う。`,
    healthy: (c, index) => naturalHealthy("頼まれごと", c, index),
    feedback: "頼まれごとは、引き受けるか断るかを一度自分で選んでよいものです。",
    point: "DEAR MANのAssertを使い、できる範囲とできない範囲を短く伝えます。"
  },
  {
    category: "罪悪感",
    scene: `${"dynamic"}`,
    makeScene: (c) => `${c.person}の期待に応えられないと、強い罪悪感が出てきます。状況は「${c.request}」です。どう考えて返しますか？`,
    codependent: (c) => `申し訳ないから、無理してでもやります。`,
    middle: (c) => `罪悪感はあるけど、できるかどうか少し迷っています。`,
    healthy: (c, index) => naturalHealthy("罪悪感", c, index),
    feedback: "罪悪感は大切なサインですが、必ず従う命令ではありません。",
    point: "CBTで『断ると悪い人になる』を『できる範囲を選んでよい』に見直します。"
  },
  {
    category: "不機嫌への反応",
    makeScene: (c) => `${c.person}が不機嫌そうに見えます。あなたは「${c.request}」に応じるべきか迷っています。どう関わりますか？`,
    codependent: (c) => `機嫌が悪そうだから、私が合わせます。何でも言って。`,
    middle: (c) => `不機嫌そうにされると落ち着かないから、早く済ませたいです。`,
    healthy: (c, index) => naturalHealthy("不機嫌への反応", c, index),
    feedback: "相手の感情は尊重できますが、機嫌を整える責任を背負いすぎないことが境界線です。",
    point: "GIVEのGentleを保ちながら、自分の責任範囲を超えない練習です。"
  },
  {
    category: "急なお願い",
    makeScene: (c) => `急に「${c.request}」と頼まれました。あなたは${c.limit}状態です。どう返しますか？`,
    codependent: (c) => `急ぎなんだよね。今すぐやるよ。`,
    middle: (c) => `急すぎて困るけど、少しならできるかもしれない。`,
    healthy: (c, index) => naturalHealthy("急なお願い", c, index),
    feedback: "急なお願いほど、即答せずに自分の予定と余力を確認することが大切です。",
    point: "Mindfulに戻り、焦りではなく選択で返答します。"
  },
  {
    category: "過剰な共感",
    makeScene: (c) => `${c.person}がつらそうで、あなたは「自分がもっと支えなければ」と感じています。テーマは「${c.request}」です。どう関わりますか？`,
    codependent: (c) => `つらいなら私が全部受け止めるよ。最後まで付き合うね。`,
    middle: (c) => `心配だから、少し無理してでも聞いた方がいいかも。`,
    healthy: (c, index) => naturalHealthy("過剰な共感", c, index),
    feedback: "共感は相手を丸ごと背負うことではありません。自分の余力も同じくらい大切です。",
    point: "共感と責任の境界を分けます。『聞く』と『背負う』は別です。"
  },
  {
    category: "説明しすぎ",
    makeScene: (c) => `${c.person}に「${c.request}」と言われました。断ると嫌われそうで、理由を長く説明したくなっています。どう返しますか？`,
    codependent: (c) => `本当にごめん。実は色々あって、全部説明すると…。`,
    middle: (c) => `無理なんだけど、理由をわかってもらえないと困ります。`,
    healthy: (c, index) => naturalHealthy("説明しすぎ", c, index),
    feedback: "説明は最小限で大丈夫です。長い説明で自分を守ろうとしすぎると、かえって疲れやすくなります。",
    point: "FASTのApologiesを意識し、過度に謝らず、短く本当のことを言います。"
  },
  {
    category: "拒否・断る",
    makeScene: (c) => `${c.person}から「${c.request}」と言われましたが、あなたは嫌だと感じています。どう境界線を出しますか？`,
    codependent: (c) => `嫌だけど、波風を立てたくないから合わせます。`,
    middle: (c) => `本当は嫌です。できればやめてほしいです。`,
    healthy: (c, index) => naturalHealthy("拒否・断る", c, index),
    feedback: "嫌だと感じた時は、その感覚を無視せず、短く明確に拒否してよい場面があります。",
    point: "自分の体感を手がかりに、Noを短く言う練習です。"
  }
];

function buildQuestions() {
  const generated = [];
  themeTemplates.forEach((theme) => {
    situationContexts.forEach((context, index) => {
      generated.push(makeQuestion(theme, context, index));
    });
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
  scoreText.textContent = `正答 ${score} 問`;
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
    codependent: "共依存：相手や状況を背負いすぎています",
    middle: "中間：少し巻き込まれています",
    healthy: "境界線あり：健全な関わり方です"
  };
  resultText.textContent = resultMessages[choice.type];
  feedbackText.textContent = question.feedback;
  modelAnswerText.textContent = question.modelAnswer;
  pointText.textContent = question.point;
  scoreText.textContent = `正答 ${score} 問`;
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
  summaryScore.textContent = `正答率 ${rate}%（${score} / ${dailyQuestions.length} 問）`;
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
    item.textContent = `${record.date} / ${record.category} / 正答率 ${record.rate}%（${record.score}/${record.total}）${success}`;
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

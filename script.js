const categories = ["夫", "義実家", "職場", "友人", "共通"];
const storageKey = "boundaryTrainingRecords";

const questions = [
  {
    category: "夫",
    scene: "疲れている夜に、家事をもう一つ頼まれました。明日の朝でも困らない内容です。",
    choices: [
      { text: "いいよ。私がやっておくから休んでいて。", type: "passive" },
      { text: "どうしていつも私ばかりなの。少しは考えてよ。", type: "aggressive" },
      { text: "今日は疲れているから、明日の朝にするね。急ぎなら一緒に分けたい。", type: "assertive" }
    ],
    feedback: "境界線として適切なのは、自分の状態と希望を短く伝え、必要なら代替案を出す返答です。",
    modelAnswer: "今日は体力が残っていないから、明日の朝に回したい。今必要なら10分だけ一緒にやろう。",
    point: "DEAR MANのDescribeとAssertを意識し、事実と希望を分けて伝えます。"
  },
  {
    category: "夫",
    scene: "予定を確認しないまま、週末の用事に同行することになっていました。",
    choices: [
      { text: "わかった。私の予定は調整するから大丈夫。", type: "passive" },
      { text: "勝手に決めないで。もう行かないから。", type: "aggressive" },
      { text: "先に確認してほしかった。今回は予定を見てから返事をするね。", type: "assertive" }
    ],
    feedback: "相手を責め切らず、自分に必要な手順を明確にすることが境界線になります。",
    modelAnswer: "週末の予定は、決める前に一度確認してほしい。今回は私の予定を見てから返事するね。",
    point: "FASTのTruthfulを使い、過度に謝らず本当の希望を言葉にします。"
  },
  {
    category: "義実家",
    scene: "急な訪問の連絡がありましたが、今日は一人で休む時間を確保したい日です。",
    choices: [
      { text: "大丈夫です。少し散らかっていますが来てください。", type: "passive" },
      { text: "急に来られても迷惑です。無理です。", type: "aggressive" },
      { text: "今日は休む予定があるので難しいです。別の日なら調整できます。", type: "assertive" }
    ],
    feedback: "関係を保ちながら断るには、理由を長く説明しすぎず、可能な範囲を示すのが有効です。",
    modelAnswer: "今日は予定がありお迎えできません。来週なら時間を相談できます。",
    point: "GIVEのGentleを意識し、柔らかさと明確さを同時に持たせます。"
  },
  {
    category: "義実家",
    scene: "家庭のやり方について助言を受け、すぐに従わないと失礼かもと感じています。",
    choices: [
      { text: "そうですよね。これから全部その通りにします。", type: "passive" },
      { text: "うちのことに口を出さないでください。", type: "aggressive" },
      { text: "教えてくださってありがとうございます。家では夫婦で相談して決めますね。", type: "assertive" }
    ],
    feedback: "感謝と決定権の所在を分けて伝えると、自分の境界線を落ち着いて守れます。",
    modelAnswer: "参考にしますね。最終的には家で話し合って、私たちに合う形にします。",
    point: "CBTでは『従わないと失礼』という自動思考を、『感謝しながら選んでもよい』に見直します。"
  },
  {
    category: "職場",
    scene: "退勤直前に、今日中でなくてもよい追加作業を頼まれました。",
    choices: [
      { text: "はい、今日中にやります。残って対応します。", type: "passive" },
      { text: "こんな時間に頼むなんて非常識です。", type: "aggressive" },
      { text: "今日は退勤時間なので、明日の午前に着手します。急ぎなら優先順位を確認したいです。", type: "assertive" }
    ],
    feedback: "仕事では、時間・優先順位・着手可能なタイミングを具体的に伝えると建設的です。",
    modelAnswer: "本日は退勤します。明日の午前に対応できます。今日中が必要なら、他の作業との優先順位を教えてください。",
    point: "DEAR MANのReinforceとして、調整すると仕事の質を保てることを含めてもよいです。"
  },
  {
    category: "職場",
    scene: "同僚のミスの説明を、あなたが代わりにしてほしいと頼まれました。",
    choices: [
      { text: "私でよければ説明しておきます。", type: "passive" },
      { text: "それはあなたの責任でしょ。巻き込まないで。", type: "aggressive" },
      { text: "私から説明できる範囲はここまでです。詳細は担当した本人から伝えるのがよいと思います。", type: "assertive" }
    ],
    feedback: "助ける範囲を限定することは冷たさではなく、責任の境界を明確にする行動です。",
    modelAnswer: "事実として知っている部分は共有できます。判断や経緯は担当者から説明してもらいましょう。",
    point: "FASTのApologiesを意識し、必要以上に謝って引き受けない練習です。"
  },
  {
    category: "友人",
    scene: "友人から長時間の相談が続き、今日は気持ちの余裕がありません。",
    choices: [
      { text: "うん、何時間でも聞くよ。", type: "passive" },
      { text: "またその話？もう聞きたくない。", type: "aggressive" },
      { text: "大切に聞きたいけれど、今日は20分なら聞けるよ。続きは別の日でもいい？", type: "assertive" }
    ],
    feedback: "相手を大事にする気持ちと、自分の余力の限界は同時に伝えられます。",
    modelAnswer: "今は20分くらいなら聞けるよ。ちゃんと聞きたいから、足りなければ明日また話そう。",
    point: "GIVEのInterestedを保ちつつ、自分の限界をAssertします。"
  },
  {
    category: "友人",
    scene: "行きたくない集まりに誘われ、断るとがっかりされそうで迷っています。",
    choices: [
      { text: "行けるよ。楽しみにしてる。", type: "passive" },
      { text: "そういう集まり苦手だから誘わないで。", type: "aggressive" },
      { text: "誘ってくれてありがとう。今回は休みたいから見送るね。また別の機会に会いたい。", type: "assertive" }
    ],
    feedback: "断ることと関係を大切にしないことは同じではありません。感謝と意思を分けます。",
    modelAnswer: "声をかけてくれてありがとう。今回は家で休む日にするね。近いうちに少人数で会えたらうれしい。",
    point: "CBTで『断ったら嫌われる』を、『断っても関係を保つ言い方はある』に置き換えます。"
  },
  {
    category: "共通",
    scene: "相手が少し不機嫌そうで、自分が何かして機嫌を直さなければと焦っています。",
    choices: [
      { text: "私が何かしたならごめん。何でもするから言って。", type: "passive" },
      { text: "不機嫌を出されるとこっちも嫌な気分になる。やめて。", type: "aggressive" },
      { text: "少し元気がなさそうに見えるね。必要なら話を聞くよ。私は今できる範囲で関わるね。", type: "assertive" }
    ],
    feedback: "相手の感情を観察しつつ、責任をすべて引き受けないことが大切です。",
    modelAnswer: "何かあれば聞くよ。ただ、私が全部解決しなければとは考えずに、できる範囲で関わるね。",
    point: "CBTでは『相手の不機嫌は私の責任』という自動思考を検討します。"
  },
  {
    category: "共通",
    scene: "頼まれごとを断りたいのに、罪悪感で即答しそうになっています。",
    choices: [
      { text: "大丈夫です。なんとかします。", type: "passive" },
      { text: "そんなことまで頼まれても困ります。", type: "aggressive" },
      { text: "すぐには返事できないので、予定を確認してから答えます。", type: "assertive" }
    ],
    feedback: "即答しない時間を取ることも境界線です。落ち着いて選ぶ余白を作れます。",
    modelAnswer: "今すぐ判断できないので、確認してから返事します。難しい場合は早めに伝えますね。",
    point: "DEAR MANのMindfulとして、罪悪感に流されず目的に戻ります。"
  }
];

let selectedCategory = "共通";
let dailyQuestions = [];
let currentIndex = 0;
let score = 0;
let answered = false;
let answerResults = [];

const intro = document.getElementById("intro");
const quiz = document.getElementById("quiz");
const summary = document.getElementById("summary");
const categoryGrid = document.getElementById("categoryGrid");
const startBtn = document.getElementById("startBtn");
const homeBtn = document.getElementById("homeBtn");
const progressText = document.getElementById("progressText");
const progressFill = document.getElementById("progressFill");
const questionCategory = document.getElementById("questionCategory");
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
const reflectionInput = document.getElementById("reflectionInput");
const saveBtn = document.getElementById("saveBtn");
const summaryHomeBtn = document.getElementById("summaryHomeBtn");
const historyList = document.getElementById("historyList");
const clearHistoryBtn = document.getElementById("clearHistoryBtn");

function shuffle(items) {
  return [...items].sort(() => Math.random() - 0.5);
}

function renderCategories() {
  categoryGrid.innerHTML = "";
  categories.forEach((category) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `category${category === selectedCategory ? " active" : ""}`;
    button.textContent = category;
    button.addEventListener("click", () => {
      selectedCategory = category;
      renderCategories();
    });
    categoryGrid.appendChild(button);
  });
}

function startTraining() {
  const focused = questions.filter((question) => question.category === selectedCategory);
  const common = questions.filter((question) => question.category === "共通");
  const others = questions.filter((question) => question.category !== selectedCategory && question.category !== "共通");
  dailyQuestions = shuffle([...focused, ...common, ...others]).slice(0, 5);
  currentIndex = 0;
  score = 0;
  answerResults = Array(dailyQuestions.length).fill(null);
  showScreen("quiz");
  renderQuestion();
}

function showScreen(name) {
  intro.classList.toggle("hidden", name !== "intro");
  quiz.classList.toggle("hidden", name !== "quiz");
  summary.classList.toggle("hidden", name !== "summary");
}

function renderQuestion() {
  const question = dailyQuestions[currentIndex];
  answered = false;
  feedback.classList.add("hidden");
  choicesEl.innerHTML = "";
  progressText.textContent = `${currentIndex + 1} / ${dailyQuestions.length} 問`;
  progressFill.style.width = `${(currentIndex / dailyQuestions.length) * 100}%`;
  questionCategory.textContent = question.category;
  scoreText.textContent = `正答 ${score} 問`;
  sceneText.textContent = question.scene;

  shuffle(question.choices).forEach((choice) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "choice";
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
  const isCorrect = choice.type === "assertive";
  answerResults[currentIndex] = isCorrect;
  score = answerResults.filter(Boolean).length;

  [...choicesEl.children].forEach((button) => {
    button.disabled = true;
    const source = question.choices.find((item) => item.text === button.textContent);
    if (source.type === "assertive") {
      button.classList.add("correct");
    }
  });

  if (!isCorrect) {
    selectedButton.classList.add("incorrect");
  }

  resultText.textContent = isCorrect ? "よい境界線の返答です" : "ここは境界線の言い方を練習できる場面です";
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
  reflectionInput.value = "";
  showScreen("summary");
}

function saveRecord() {
  const records = getRecords();
  const rate = Math.round((score / dailyQuestions.length) * 100);
  records.unshift({
    date: new Date().toLocaleString("ja-JP", { dateStyle: "medium", timeStyle: "short" }),
    category: selectedCategory,
    score,
    total: dailyQuestions.length,
    rate,
    reflection: reflectionInput.value.trim()
  });
  localStorage.setItem(storageKey, JSON.stringify(records.slice(0, 7)));
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
    empty.textContent = "まだ記録はありません。今日の5問から始めましょう。";
    historyList.appendChild(empty);
    return;
  }

  records.forEach((record) => {
    const item = document.createElement("div");
    item.className = "history-item";
    const reflection = record.reflection ? ` 気づき：${record.reflection}` : "";
    item.textContent = `${record.date} / ${record.category} / 正答率 ${record.rate}%（${record.score}/${record.total}）${reflection}`;
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

renderCategories();
renderHistory();

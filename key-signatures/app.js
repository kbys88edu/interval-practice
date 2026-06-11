
function t(text) {
  return window.EarTrainingLang?.translateText(text) || text;
}

const signatures = [
  { acc: -7, label: "♭7", majorJa: "変ハ長調", minorJa: "変イ短調", majorRoman: "Cb dur", minorRoman: "ab moll", abcMajor: "Cb", abcMinor: "Abm" },
  { acc: -6, label: "♭6", majorJa: "変ト長調", minorJa: "変ホ短調", majorRoman: "Gb dur", minorRoman: "eb moll", abcMajor: "Gb", abcMinor: "Ebm" },
  { acc: -5, label: "♭5", majorJa: "変ニ長調", minorJa: "変ロ短調", majorRoman: "Db dur", minorRoman: "bb moll", abcMajor: "Db", abcMinor: "Bbm" },
  { acc: -4, label: "♭4", majorJa: "変イ長調", minorJa: "ヘ短調", majorRoman: "Ab dur", minorRoman: "f moll", abcMajor: "Ab", abcMinor: "Fm" },
  { acc: -3, label: "♭3", majorJa: "変ホ長調", minorJa: "ハ短調", majorRoman: "Eb dur", minorRoman: "c moll", abcMajor: "Eb", abcMinor: "Cm" },
  { acc: -2, label: "♭2", majorJa: "変ロ長調", minorJa: "ト短調", majorRoman: "Bb dur", minorRoman: "g moll", abcMajor: "Bb", abcMinor: "Gm" },
  { acc: -1, label: "♭1", majorJa: "ヘ長調", minorJa: "ニ短調", majorRoman: "F dur", minorRoman: "d moll", abcMajor: "F", abcMinor: "Dm" },
  { acc: 0, label: "調号なし", majorJa: "ハ長調", minorJa: "イ短調", majorRoman: "C dur", minorRoman: "a moll", abcMajor: "C", abcMinor: "Am" },
  { acc: 1, label: "♯1", majorJa: "ト長調", minorJa: "ホ短調", majorRoman: "G dur", minorRoman: "e moll", abcMajor: "G", abcMinor: "Em" },
  { acc: 2, label: "♯2", majorJa: "ニ長調", minorJa: "ロ短調", majorRoman: "D dur", minorRoman: "b moll", abcMajor: "D", abcMinor: "Bm" },
  { acc: 3, label: "♯3", majorJa: "イ長調", minorJa: "嬰ヘ短調", majorRoman: "A dur", minorRoman: "f# moll", abcMajor: "A", abcMinor: "F#m" },
  { acc: 4, label: "♯4", majorJa: "ホ長調", minorJa: "嬰ハ短調", majorRoman: "E dur", minorRoman: "c# moll", abcMajor: "E", abcMinor: "C#m" },
  { acc: 5, label: "♯5", majorJa: "ロ長調", minorJa: "嬰ト短調", majorRoman: "B dur", minorRoman: "g# moll", abcMajor: "B", abcMinor: "G#m" },
  { acc: 6, label: "♯6", majorJa: "嬰ヘ長調", minorJa: "嬰ニ短調", majorRoman: "F# dur", minorRoman: "d# moll", abcMajor: "F#", abcMinor: "D#m" },
  { acc: 7, label: "♯7", majorJa: "嬰ハ長調", minorJa: "嬰イ短調", majorRoman: "C# dur", minorRoman: "a# moll", abcMajor: "C#", abcMinor: "A#m" }
];

const basicAccidentals = [-4, -3, -2, -1, 0, 1, 2, 3, 4];
let currentRange = "basic";
let currentQuestion = null;
let hasAnsweredCurrentQuestion = false;
let totalCount = 0;
let correctCount = 0;
let resultLog = [];
let questionStartTime = null;
let latestResponseTimeSec = null;

const statusEl = document.querySelector("#status");
const questionDisplay = document.querySelector("#question-display");
const keyNameDisplay = document.querySelector("#key-name-display");
const signatureDisplay = document.querySelector("#signature-display");
const answerText = document.querySelector("#answer-text");
const notationEl = document.querySelector("#notation");
const totalCountEl = document.querySelector("#total-count");
const correctCountEl = document.querySelector("#correct-count");
const scorePercentEl = document.querySelector("#score-percent");
const currentTimeEl = document.querySelector("#current-time");
const progressCountEl = document.querySelector("#progress-count");
const historyList = document.querySelector("#history-list");
const answerInput = document.querySelector("#answer-input");
const quickButtons = document.querySelector("#quick-buttons");
const signatureSelect = document.querySelector("#signature-select");
const keyAnswerArea = document.querySelector("#key-answer-area");
const signatureAnswerArea = document.querySelector("#signature-answer-area");

document.querySelector("#new-question").addEventListener("click", newQuestion);
document.querySelector("#check-answer").addEventListener("click", checkAnswer);
document.querySelector("#show-answer").addEventListener("click", showAnswer);
document.querySelector("#reset-score").addEventListener("click", resetScore);
document.querySelector("#export-pdf").addEventListener("click", exportResultsPdf);

answerInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    checkAnswer();
  }
});

document.querySelectorAll('input[name="questionType"], input[name="keyMode"], input[name="clef"]').forEach((input) => {
  input.addEventListener("change", () => {
    updateQuestionTypeView();
    if (currentQuestion) renderQuestion();
  });
});

document.querySelectorAll("[data-range]").forEach((button) => {
  button.addEventListener("click", () => {
    currentRange = button.dataset.range;
    setStatus(currentRange === "all" ? "全調号モードにしました。" : "基本調号モードにしました。");
  });
});

function init() {
  renderSignatureSelect();
  updateQuestionTypeView();
  updateScore();
}

function renderSignatureSelect() {
  signatureSelect.innerHTML = "";
  signatures.forEach((sig) => {
    const option = document.createElement("option");
    option.value = String(sig.acc);
    option.textContent = sig.label;
    signatureSelect.appendChild(option);
  });
}

function updateQuestionTypeView() {
  const type = getQuestionType();
  keyAnswerArea.classList.toggle("hidden", type !== "signatureToKey");
  signatureAnswerArea.classList.toggle("hidden", type !== "keyToSignature");
}

function getQuestionType() {
  return document.querySelector('input[name="questionType"]:checked').value;
}

function getKeyMode() {
  return document.querySelector('input[name="keyMode"]:checked').value;
}

function getClef() {
  return document.querySelector('input[name="clef"]:checked').value;
}

function getSignaturePool() {
  const pool = currentRange === "all"
    ? signatures
    : signatures.filter((sig) => basicAccidentals.includes(sig.acc));
  return pool;
}

function getKeyPool() {
  const keyMode = getKeyMode();
  const keys = [];
  getSignaturePool().forEach((sig) => {
    if (keyMode === "both" || keyMode === "major") {
      keys.push({ sig, mode: "major" });
    }
    if (keyMode === "both" || keyMode === "minor") {
      keys.push({ sig, mode: "minor" });
    }
  });
  return keys;
}

function randomItem(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function newQuestion() {
  clearFeedback();

  const questionType = getQuestionType();
  const keyPool = getKeyPool();

  if (keyPool.length === 0) {
    setStatus(t("出題範囲が空です。"), "incorrect");
    return;
  }

  const key = randomItem(keyPool);

  currentQuestion = {
    number: totalCount + 1,
    questionType,
    sig: key.sig,
    keyMode: key.mode,
    clef: getClef()
  };

  hasAnsweredCurrentQuestion = false;
  questionStartTime = performance.now();
  latestResponseTimeSec = null;
  currentTimeEl.textContent = "0.0s";
  answerInput.value = "";
  signatureSelect.value = String(currentQuestion.sig.acc);
  answerText.textContent = "";
  notationEl.innerHTML = "";

  renderQuestion();
  renderQuickButtons();
  setStatus(questionType === "signatureToKey" ? "調号を見て調を答えてください。" : "調名を見て、調号の数だけを選んでください。");
}

function renderQuestion() {
  if (!currentQuestion) return;

  if (currentQuestion.questionType === "signatureToKey") {
    questionDisplay.textContent = "READ";
    keyNameDisplay.textContent = "調名 ?";
    renderSignature(signatureDisplay, currentQuestion.sig, currentQuestion.clef);
  } else {
    questionDisplay.textContent = "KEY";
    keyNameDisplay.textContent = getKeyName(currentQuestion.sig, currentQuestion.keyMode);
    renderEmptyStaff(signatureDisplay, currentQuestion.clef);
  }
}

function renderSignature(target, sig, clef) {
  const abcKey = getAbcKey(sig, "major");
  const abc = `X:1
M:4/4
L:1/4
K:${abcKey} clef=${clef}
z4 |`;
  ABCJS.renderAbc(target, abc, {
    responsive: "resize",
    staffwidth: 360,
    paddingtop: 0,
    paddingbottom: 0,
    paddingleft: 0,
    paddingright: 0
  });
}

function renderEmptyStaff(target, clef) {
  const abc = `X:1
M:4/4
L:1/4
K:C clef=${clef}
z4 |`;
  ABCJS.renderAbc(target, abc, {
    responsive: "resize",
    staffwidth: 360,
    paddingtop: 0,
    paddingbottom: 0,
    paddingleft: 0,
    paddingright: 0
  });
}

function renderQuickButtons() {
  quickButtons.innerHTML = "";

  if (!currentQuestion || currentQuestion.questionType !== "signatureToKey") return;

  const correct = {
    sig: currentQuestion.sig,
    mode: currentQuestion.keyMode
  };

  const candidates = [correct];
  const keyPool = getKeyPool();

  while (candidates.length < 6 && candidates.length < keyPool.length) {
    const candidate = randomItem(keyPool);
    if (!candidates.some((item) => item.sig.acc === candidate.sig.acc && item.mode === candidate.mode)) {
      candidates.push(candidate);
    }
  }

  candidates.sort(() => Math.random() - 0.5).forEach((candidate) => {
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = getKeyName(candidate.sig, candidate.mode);
    button.addEventListener("click", () => {
      answerInput.value = getKeyName(candidate.sig, candidate.mode);
    });
    quickButtons.appendChild(button);
  });
}

function checkAnswer() {
  if (!currentQuestion) {
    setStatus(t("先に NEW を押してください。"), "incorrect");
    return;
  }

  if (hasAnsweredCurrentQuestion) {
    setStatus(t("この問題は回答済みです。NEW を押してください。"));
    return;
  }

  latestResponseTimeSec = questionStartTime
    ? Math.max(0, (performance.now() - questionStartTime) / 1000)
    : null;

  let isCorrect = false;
  let userAnswer = "";
  let correctAnswer = "";

  const correctSignature = currentQuestion.sig.label;
  let userSignature = "";

  if (currentQuestion.questionType === "signatureToKey") {
    userAnswer = answerInput.value;
    correctAnswer = getKeyName(currentQuestion.sig, currentQuestion.keyMode);
    userSignature = "調名回答";
    isCorrect = normalizeKeyAnswer(userAnswer) === normalizeKeyAnswer(correctAnswer);
  } else {
    userAnswer = signatureLabel(Number(signatureSelect.value));
    correctAnswer = currentQuestion.sig.label;
    userSignature = userAnswer;
    isCorrect = Number(signatureSelect.value) === currentQuestion.sig.acc;
  }

  hasAnsweredCurrentQuestion = true;
  totalCount += 1;
  if (isCorrect) correctCount += 1;

  currentTimeEl.textContent = formatResponseTime(latestResponseTimeSec);

  setStatus(
    `${isCorrect ? "正解" : "不正解"} / 正解：${correctAnswer} / 正解調号：${correctSignature} / 回答：${userAnswer || "-"} / ${formatResponseTime(latestResponseTimeSec)}`,
    isCorrect ? "correct" : "incorrect"
  );

  answerText.textContent = `正解：${correctAnswer} / 正解調号：${correctSignature} / 回答：${userAnswer || "-"} / 回答調号：${userSignature || "-"}`;
  renderSignature(notationEl, currentQuestion.sig, currentQuestion.clef);

  resultLog.push({
    number: totalCount,
    questionType: currentQuestion.questionType,
    questionTypeLabel: getQuestionTypeLabel(currentQuestion.questionType),
    sig: currentQuestion.sig,
    keyMode: currentQuestion.keyMode,
    clef: currentQuestion.clef,
    correctAnswer,
    userAnswer,
    correctSignature,
    userSignature,
    isCorrect,
    responseTimeSec: latestResponseTimeSec
  });

  updateScore();
  renderHistory();
}

function showAnswer() {
  if (!currentQuestion) {
    setStatus(t("先に NEW を押してください。"), "incorrect");
    return;
  }

  const keyName = getKeyName(currentQuestion.sig, currentQuestion.keyMode);
  const latest = resultLog.length > 0 ? resultLog[resultLog.length - 1] : null;
  const answeredThisQuestion = latest && latest.number === totalCount && hasAnsweredCurrentQuestion;

  if (answeredThisQuestion) {
    answerText.textContent = `正解：${latest.correctAnswer} / 正解調号：${latest.correctSignature} / 回答：${latest.userAnswer || "-"} / 回答調号：${latest.userSignature || "-"}`;
  } else {
    answerText.textContent = `正解：${keyName} / ${getKeyRoman(currentQuestion.sig, currentQuestion.keyMode)} / 正解調号：${currentQuestion.sig.label}`;
  }

  renderSignature(notationEl, currentQuestion.sig, currentQuestion.clef);
}

function getQuestionTypeLabel(type) {
  return {
    signatureToKey: "調号→調",
    keyToSignature: "調→調号"
  }[type] || type;
}

function getKeyName(sig, mode) {
  return mode === "major" ? sig.majorJa : sig.minorJa;
}

function getKeyRoman(sig, mode) {
  return mode === "major" ? sig.majorRoman : sig.minorRoman;
}

function getAbcKey(sig, mode) {
  return mode === "major" ? sig.abcMajor : sig.abcMinor;
}

function signatureLabel(acc) {
  const sig = signatures.find((item) => item.acc === acc);
  return sig ? sig.label : "";
}

function normalizeKeyAnswer(text) {
  return String(text || "")
    .trim()
    .toLowerCase()
    .replace(/♯/g, "#")
    .replace(/＃/g, "#")
    .replace(/♭/g, "b")
    .replace(/変/g, "b")
    .replace(/嬰/g, "#")
    .replace(/長調/g, "dur")
    .replace(/短調/g, "moll")
    .replace(/\s+/g, "");
}

function clearFeedback() {
  statusEl.className = "status";
}

function setStatus(message, type = "") {
  statusEl.textContent = message;
  statusEl.className = `status ${type}`.trim();
}

function updateScore() {
  totalCountEl.textContent = totalCount;
  correctCountEl.textContent = correctCount;
  const percent = totalCount === 0 ? 0 : Math.round((correctCount / totalCount) * 100);
  scorePercentEl.textContent = `${percent}%`;
  progressCountEl.textContent = `${String(correctCount).padStart(2, "0")} / ${String(totalCount).padStart(2, "0")}`;
}

function resetScore() {
  totalCount = 0;
  correctCount = 0;
  resultLog = [];
  questionStartTime = null;
  latestResponseTimeSec = null;
  currentTimeEl.textContent = "--";
  updateScore();
  renderHistory();
  setStatus(t("スコアと履歴をリセットしました。"));
}

function renderHistory() {
  if (resultLog.length === 0) {
    historyList.textContent = t("まだ解答履歴がありません。");
    return;
  }

  historyList.innerHTML = "";
  resultLog.slice().reverse().forEach((item) => {
    const row = document.createElement("div");
    row.className = "history-item";
    row.innerHTML = `
      <span>${String(item.number).padStart(2, "0")}</span>
      <span>${item.questionTypeLabel} / 正解 ${item.correctAnswer}・${item.correctSignature || item.sig.label} / 回答 ${item.userAnswer || "-"} / ${formatResponseTime(item.responseTimeSec)}</span>
      <span class="${item.isCorrect ? "ok" : "ng"}">${item.isCorrect ? "OK" : "NG"}</span>
    `;
    historyList.appendChild(row);
  });
}

function formatResponseTime(value) {
  return typeof value === "number" && Number.isFinite(value) ? `${value.toFixed(1)}s` : "-";
}

async function exportResultsPdf() {
  if (!window.jspdf || !window.jspdf.jsPDF) {
    setStatus(t("PDFライブラリを読み込めませんでした。インターネット接続を確認してください。"), "incorrect");
    return;
  }

  if (resultLog.length === 0) {
    setStatus(t("PDFに出力する解答履歴がありません。"), "incorrect");
    return;
  }

  const exportButton = document.querySelector("#export-pdf");
  exportButton.disabled = true;

  try {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });

    const rate = totalCount === 0 ? 0 : Math.round((correctCount / totalCount) * 100);
    const date = new Date().toLocaleString();
    const answeredWithTime = resultLog.filter(item => item.responseTimeSec !== null);
    const avgTime = answeredWithTime.length
      ? answeredWithTime.reduce((sum, item) => sum + item.responseTimeSec, 0) / answeredWithTime.length
      : null;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.text("Key Signature Practice Result", 16, 18);

    doc.setDrawColor(40);
    doc.setLineWidth(1.4);
    doc.line(16, 23, 194, 23);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text(`Date: ${date}`, 16, 32);
    doc.text(`Questions: ${totalCount}`, 16, 39);
    doc.text(`Correct: ${correctCount}`, 58, 39);
    doc.text(`Accuracy: ${rate}%`, 96, 39);
    doc.text(`Avg. time: ${avgTime !== null ? avgTime.toFixed(1) + "s" : "-"}`, 138, 39);

    let y = 52;

    resultLog.forEach((item) => {
      if (y > 260) {
        doc.addPage();
        y = 18;
      }

      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.text(`${String(item.number).padStart(2, "0")}  ${item.questionTypeLabel}`, 16, y);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.text(`Correct: ${item.correctAnswer} / Correct signature: ${item.correctSignature || item.sig.label}`, 16, y + 6);
      doc.text(`Your answer: ${item.userAnswer || "-"} / Selected signature: ${item.userSignature || "-"} / ${item.isCorrect ? "OK" : "NG"}`, 16, y + 12);
      doc.text(`Time: ${formatResponseTime(item.responseTimeSec)}`, 16, y + 18);

      y += 30;
    });

    doc.save("key-signature-practice-result.pdf");
    setStatus(t("結果PDFを出力しました。"), "correct");
  } catch (error) {
    console.error(error);
    setStatus(t("PDF作成中にエラーが発生しました。"), "incorrect");
  } finally {
    exportButton.disabled = false;
  }
}

init();

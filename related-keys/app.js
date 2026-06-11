const keyNames = [
  { pc: 0, majorJa: "ハ長調", minorJa: "ハ短調", majorRoman: "C dur", minorRoman: "c moll" },
  { pc: 1, majorJa: "変ニ長調", minorJa: "嬰ハ短調", majorRoman: "Db dur", minorRoman: "c# moll" },
  { pc: 2, majorJa: "ニ長調", minorJa: "ニ短調", majorRoman: "D dur", minorRoman: "d moll" },
  { pc: 3, majorJa: "変ホ長調", minorJa: "変ホ短調", majorRoman: "Eb dur", minorRoman: "eb moll" },
  { pc: 4, majorJa: "ホ長調", minorJa: "ホ短調", majorRoman: "E dur", minorRoman: "e moll" },
  { pc: 5, majorJa: "ヘ長調", minorJa: "ヘ短調", majorRoman: "F dur", minorRoman: "f moll" },
  { pc: 6, majorJa: "嬰ヘ長調", minorJa: "嬰ヘ短調", majorRoman: "F# dur", minorRoman: "f# moll" },
  { pc: 7, majorJa: "ト長調", minorJa: "ト短調", majorRoman: "G dur", minorRoman: "g moll" },
  { pc: 8, majorJa: "変イ長調", minorJa: "嬰ト短調", majorRoman: "Ab dur", minorRoman: "g# moll" },
  { pc: 9, majorJa: "イ長調", minorJa: "イ短調", majorRoman: "A dur", minorRoman: "a moll" },
  { pc: 10, majorJa: "変ロ長調", minorJa: "変ロ短調", majorRoman: "Bb dur", minorRoman: "bb moll" },
  { pc: 11, majorJa: "ロ長調", minorJa: "ロ短調", majorRoman: "B dur", minorRoman: "b moll" }
];

const basicKeys = [
  { pc: 0, mode: "major" }, { pc: 7, mode: "major" }, { pc: 5, mode: "major" },
  { pc: 2, mode: "major" }, { pc: 10, mode: "major" }, { pc: 9, mode: "minor" },
  { pc: 4, mode: "minor" }, { pc: 2, mode: "minor" }, { pc: 7, mode: "minor" }
];

const allKeys = [];
for (let pc = 0; pc < 12; pc += 1) {
  allKeys.push({ pc, mode: "major" });
  allKeys.push({ pc, mode: "minor" });
}

const relations = [
  { id: "parallel", label: "同主調" },
  { id: "subdominant", label: "下属調" },
  { id: "dominant", label: "属調" },
  { id: "relative", label: "平行調" }
];

let currentQuestion = null;
let hasAnsweredCurrentQuestion = false;
let totalCount = 0;
let correctCount = 0;
let resultLog = [];
let questionStartTime = null;
let latestResponseTimeSec = null;

const relationOptions = document.querySelector("#relation-options");
const statusEl = document.querySelector("#status");
const questionDisplay = document.querySelector("#question-display");
const answerText = document.querySelector("#answer-text");
const answerMap = document.querySelector("#answer-map");
const totalCountEl = document.querySelector("#total-count");
const correctCountEl = document.querySelector("#correct-count");
const scorePercentEl = document.querySelector("#score-percent");
const currentTimeEl = document.querySelector("#current-time");
const progressCountEl = document.querySelector("#progress-count");
const historyList = document.querySelector("#history-list");
const answerInput = document.querySelector("#answer-input");
const quickButtons = document.querySelector("#quick-buttons");
const singleAnswerArea = document.querySelector("#single-answer-area");
const diagramAnswerArea = document.querySelector("#diagram-answer-area");

document.querySelector("#new-question").addEventListener("click", newQuestion);
document.querySelector("#check-answer").addEventListener("click", checkAnswer);
document.querySelector("#show-answer").addEventListener("click", showAnswer);
document.querySelector("#reset-score").addEventListener("click", resetScore);
document.querySelector("#export-pdf").addEventListener("click", exportResultsPdf);
document.querySelector("#select-all-relations").addEventListener("click", () => setAllRelations(true));
document.querySelector("#clear-all-relations").addEventListener("click", () => setAllRelations(false));

answerInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    checkAnswer();
  }
});

document.querySelectorAll('input[name="questionMode"]').forEach((input) => {
  input.addEventListener("change", updateQuestionModeView);
});

function init() {
  renderRelationOptions();
  setAllRelations(true);
  updateScore();
  updateQuestionModeView();
}

function renderRelationOptions() {
  relationOptions.innerHTML = "";
  relations.forEach((relation) => {
    const label = document.createElement("label");
    label.innerHTML = `<input type="checkbox" value="${relation.id}" checked> ${relation.label}`;
    relationOptions.appendChild(label);
  });
}

function setAllRelations(checked) {
  document.querySelectorAll("#relation-options input").forEach((input) => {
    input.checked = checked;
  });
  setStatus(checked ? "関係をすべて選択しました。" : "関係をすべて外しました。");
}

function updateQuestionModeView() {
  const mode = getQuestionMode();
  singleAnswerArea.classList.toggle("hidden", mode !== "single");
  diagramAnswerArea.classList.toggle("hidden", mode !== "diagram");
}

function getQuestionMode() {
  return document.querySelector('input[name="questionMode"]:checked').value;
}

function getKeyPool() {
  return document.querySelector('input[name="keyPool"]:checked').value === "all" ? allKeys : basicKeys;
}

function getSelectedRelations() {
  return Array.from(document.querySelectorAll("#relation-options input:checked")).map((input) => input.value);
}

function randomItem(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function newQuestion() {
  const selectedRelations = getSelectedRelations();

  if (getQuestionMode() === "single" && selectedRelations.length === 0) {
    setStatus("関係を1つ以上選択してください。", "incorrect");
    return;
  }

  clearFeedback();

  const tonic = randomItem(getKeyPool());
  const map = buildRelatedKeyMap(tonic);
  const targetRelation = getQuestionMode() === "single" ? randomItem(selectedRelations) : null;

  currentQuestion = {
    number: totalCount + 1,
    tonic,
    map,
    targetRelation,
    questionMode: getQuestionMode()
  };

  hasAnsweredCurrentQuestion = false;
  questionStartTime = performance.now();
  latestResponseTimeSec = null;
  currentTimeEl.textContent = "0.0s";
  answerText.textContent = "";
  answerMap.innerHTML = "";
  answerInput.value = "";
  document.querySelectorAll("[data-answer-slot]").forEach((input) => input.value = "");

  updateDiagramForQuestion(false);
  renderQuickButtons();
  questionDisplay.textContent = formatKey(tonic);

  if (currentQuestion.questionMode === "single") {
    const label = relations.find((relation) => relation.id === targetRelation)?.label || "";
    setStatus(`主調：${formatKey(tonic)}。${label}を答えてください。`);
  } else {
    setStatus(`主調：${formatKey(tonic)}。同主調・下属調・属調・平行調を埋めてください。`);
  }
}

function buildRelatedKeyMap(tonic) {
  const pc = tonic.pc;
  const mode = tonic.mode;

  if (mode === "major") {
    return {
      tonic,
      parallel: { pc, mode: "minor" },
      subdominant: { pc: mod12(pc - 5), mode: "major" },
      dominant: { pc: mod12(pc + 7), mode: "major" },
      relative: { pc: mod12(pc - 3), mode: "minor" }
    };
  }

  return {
    tonic,
    parallel: { pc, mode: "major" },
    subdominant: { pc: mod12(pc - 5), mode: "minor" },
    dominant: { pc: mod12(pc + 7), mode: "minor" },
    relative: { pc: mod12(pc + 3), mode: "major" }
  };
}

function mod12(value) {
  return ((value % 12) + 12) % 12;
}

function checkAnswer() {
  if (!currentQuestion) {
    setStatus("先に NEW を押してください。", "incorrect");
    return;
  }

  if (hasAnsweredCurrentQuestion) {
    setStatus("この問題は回答済みです。NEW を押してください。");
    return;
  }

  latestResponseTimeSec = questionStartTime
    ? Math.max(0, (performance.now() - questionStartTime) / 1000)
    : null;

  let isCorrect = false;
  let detail = "";

  if (currentQuestion.questionMode === "single") {
    const correctKey = currentQuestion.map[currentQuestion.targetRelation];
    isCorrect = normalizeKeyAnswer(answerInput.value) === canonicalKey(correctKey);
    detail = `${getRelationLabel(currentQuestion.targetRelation)}：${formatKey(correctKey)} / 回答：${answerInput.value || "-"}`;
  } else {
    const results = [];
    let correctCountForDiagram = 0;

    relations.forEach((relation) => {
      const input = document.querySelector(`[data-answer-slot="${relation.id}"]`);
      const correctKey = currentQuestion.map[relation.id];
      const ok = normalizeKeyAnswer(input.value) === canonicalKey(correctKey);
      if (ok) correctCountForDiagram += 1;
      results.push(`${relation.label}:${ok ? "OK" : "NG"}`);
    });

    isCorrect = correctCountForDiagram === relations.length;
    detail = `${correctCountForDiagram}/${relations.length} correct`;
  }

  hasAnsweredCurrentQuestion = true;
  totalCount += 1;
  if (isCorrect) correctCount += 1;

  currentTimeEl.textContent = formatResponseTime(latestResponseTimeSec);
  setStatus(
    `${isCorrect ? "正解" : "不正解"} / ${detail} / ${formatResponseTime(latestResponseTimeSec)}`,
    isCorrect ? "correct" : "incorrect"
  );

  resultLog.push({
    number: totalCount,
    tonic: currentQuestion.tonic,
    targetRelation: currentQuestion.targetRelation,
    questionMode: currentQuestion.questionMode,
    map: currentQuestion.map,
    userAnswer: currentQuestion.questionMode === "single" ? answerInput.value : "diagram",
    detail,
    isCorrect,
    responseTimeSec: latestResponseTimeSec
  });

  updateDiagramForQuestion(true);
  updateScore();
  renderHistory();
}

function showAnswer() {
  if (!currentQuestion) {
    setStatus("先に NEW を押してください。", "incorrect");
    return;
  }

  updateDiagramForQuestion(true);

  const rows = relations.map((relation) => {
    return `${relation.label}：${formatKey(currentQuestion.map[relation.id])}`;
  });

  answerText.textContent = `主調：${formatKey(currentQuestion.tonic)}`;
  answerMap.innerHTML = rows.map((row) => `<div>${row}</div>`).join("");
}

function updateDiagramForQuestion(showAnswers) {
  document.querySelectorAll("[data-slot]").forEach((box) => {
    const slot = box.dataset.slot;
    box.classList.remove("target", "correct", "incorrect");

    if (!currentQuestion) {
      if (slot === "tonic") box.textContent = "主調";
      return;
    }

    if (slot === "tonic") {
      box.textContent = formatKey(currentQuestion.tonic);
      return;
    }

    if (showAnswers) {
      box.textContent = formatKey(currentQuestion.map[slot]);
    } else {
      if (slot === currentQuestion.targetRelation) {
        box.textContent = "?";
        box.classList.add("target");
      } else {
        box.textContent = getRelationLabel(slot);
      }
    }
  });
}

function renderQuickButtons() {
  quickButtons.innerHTML = "";

  if (!currentQuestion || currentQuestion.questionMode !== "single") return;

  const candidates = makeQuickCandidates();
  candidates.forEach((key) => {
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = formatKey(key);
    button.addEventListener("click", () => {
      answerInput.value = formatKey(key);
    });
    quickButtons.appendChild(button);
  });
}

function makeQuickCandidates() {
  const correct = currentQuestion.map[currentQuestion.targetRelation];
  const pool = [correct];

  while (pool.length < 6) {
    const candidate = randomItem(getKeyPool());
    if (!pool.some((key) => canonicalKey(key) === canonicalKey(candidate))) {
      pool.push(candidate);
    }
  }

  return pool.sort(() => Math.random() - 0.5);
}

function getRelationLabel(id) {
  return relations.find((relation) => relation.id === id)?.label || id;
}

function formatKey(key) {
  const item = keyNames.find((entry) => entry.pc === key.pc);
  return key.mode === "major" ? item.majorJa : item.minorJa;
}

function formatKeyRoman(key) {
  const item = keyNames.find((entry) => entry.pc === key.pc);
  return key.mode === "major" ? item.majorRoman : item.minorRoman;
}

function canonicalKey(key) {
  return `${key.pc}:${key.mode}`;
}

function normalizeKeyAnswer(text) {
  const raw = String(text || "").trim();
  if (!raw) return "";

  const lowered = raw.toLowerCase()
    .replace(/♯/g, "#")
    .replace(/＃/g, "#")
    .replace(/♭/g, "b")
    .replace(/変/g, "b")
    .replace(/嬰/g, "#")
    .replace(/\s+/g, "");

  for (const key of allKeys) {
    const ja = formatKey(key).toLowerCase().replace(/\s+/g, "");
    const roman = formatKeyRoman(key).toLowerCase().replace(/\s+/g, "");
    const simpleRoman = roman.replace("dur", "").replace("moll", key.mode === "minor" ? "m" : "");

    if (
      lowered === ja ||
      lowered === roman ||
      lowered === simpleRoman ||
      lowered === ja.replace("長調", "dur").replace("短調", "moll")
    ) {
      return canonicalKey(key);
    }
  }

  return lowered;
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
  setStatus("スコアと履歴をリセットしました。");
}

function renderHistory() {
  if (resultLog.length === 0) {
    historyList.textContent = "まだ解答履歴がありません。";
    return;
  }

  historyList.innerHTML = "";
  resultLog.slice().reverse().forEach((item) => {
    const row = document.createElement("div");
    row.className = "history-item";
    row.innerHTML = `
      <span>${String(item.number).padStart(2, "0")}</span>
      <span>${formatKey(item.tonic)} / ${item.questionMode === "single" ? getRelationLabel(item.targetRelation) : "図全体"} / ${formatResponseTime(item.responseTimeSec)}</span>
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
    setStatus("PDFライブラリを読み込めませんでした。インターネット接続を確認してください。", "incorrect");
    return;
  }

  if (resultLog.length === 0) {
    setStatus("PDFに出力する解答履歴がありません。", "incorrect");
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
    doc.text("Related Key Practice Result", 16, 18);

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
      if (y > 250) {
        doc.addPage();
        y = 18;
      }

      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.text(`${String(item.number).padStart(2, "0")}  Tonic: ${formatKeyRoman(item.tonic)}  ${item.questionMode}`, 16, y);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.text(`${item.isCorrect ? "OK" : "NG"} / Time: ${formatResponseTime(item.responseTimeSec)} / ${item.detail}`, 16, y + 6);

      const lines = relations.map((relation) => {
        return `${relation.label}: ${formatKeyRoman(item.map[relation.id])}`;
      });

      lines.forEach((line, index) => {
        doc.text(line, 18, y + 14 + index * 5);
      });

      y += 58;
    });

    doc.save("related-key-practice-result.pdf");
    setStatus("結果PDFを出力しました。", "correct");
  } catch (error) {
    console.error(error);
    setStatus("PDF作成中にエラーが発生しました。", "incorrect");
  } finally {
    exportButton.disabled = false;
  }
}

init();

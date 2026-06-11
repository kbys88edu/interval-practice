function t(text) {
  return window.EarTrainingLang?.translateText(text) || text;
}

// Rebuilt rhythm section.
// Internal time unit:
// 4/4 and 3/4 patterns use 16th-note units.
// 4/4 bar length = 16 units. 3/4 bar length = 12 units.
// 6/8 patterns use 16th-note units too.
// 6/8 bar length = 12 units. One eighth note = 2 units.

const patterns = [
  // 4/4 basic
  { id: "44-basic-quarters", meter: "4/4", group: "basic", label: "four quarters", abc: "C C C C |", hits: [0, 4, 8, 12] },
  { id: "44-basic-half", meter: "4/4", group: "basic", label: "half + quarters", abc: "C2 C C |", hits: [0, 8, 12] },
  { id: "44-basic-eighths", meter: "4/4", group: "basic", label: "eighth-note motion", abc: "C C/ C/ C C |", hits: [0, 4, 6, 8, 12] },
  { id: "44-basic-rest", meter: "4/4", group: "basic", label: "quarter rest", abc: "C z C C |", hits: [0, 8, 12] },

  // 4/4 sixteenth
  { id: "44-sixteenth-1", meter: "4/4", group: "sixteenth", label: "sixteenth group", abc: "C C/2C/2C/2C/2 C C |", hits: [0, 4, 5, 6, 7, 8, 12] },
  { id: "44-sixteenth-2", meter: "4/4", group: "sixteenth", label: "two sixteenth groups", abc: "C/2C/2C/2C/2 C C/2C/2C/2C/2 C |", hits: [0, 1, 2, 3, 4, 8, 9, 10, 11, 12] },
  { id: "44-sixteenth-3", meter: "4/4", group: "sixteenth", label: "eighth + two sixteenths", abc: "C/ C/2C/2 C C C |", hits: [0, 2, 3, 4, 8, 12] },

  // 4/4 triplet
  { id: "44-triplet-1", meter: "4/4", group: "triplet", label: "one triplet beat", abc: "(3C/2C/2C/2 C C C |", hits: [0, 1.333, 2.667, 4, 8, 12] },
  { id: "44-triplet-2", meter: "4/4", group: "triplet", label: "two triplet beats", abc: "C (3C/2C/2C/2 C C |", hits: [0, 4, 5.333, 6.667, 8, 12] },

  // 4/4 ties
  { id: "44-tie-1", meter: "4/4", group: "tie", label: "syncopated tie", abc: "C/ C/-C/ C C |", hits: [0, 2, 8, 12] },
  { id: "44-tie-2", meter: "4/4", group: "tie", label: "held middle", abc: "C C-C C |", hits: [0, 4, 12] },

  // 3/4 basic
  { id: "34-basic-quarters", meter: "3/4", group: "basic", label: "three quarters", abc: "C C C |", hits: [0, 4, 8] },
  { id: "34-basic-half", meter: "3/4", group: "basic", label: "half + quarter", abc: "C2 C |", hits: [0, 8] },
  { id: "34-basic-eighths", meter: "3/4", group: "basic", label: "eighth motion", abc: "C C/ C/ C |", hits: [0, 4, 6, 8] },
  { id: "34-basic-rest", meter: "3/4", group: "basic", label: "rest", abc: "C z C |", hits: [0, 8] },

  // 3/4 sixteenth
  { id: "34-sixteenth-1", meter: "3/4", group: "sixteenth", label: "sixteenth group", abc: "C/2C/2C/2C/2 C C |", hits: [0, 1, 2, 3, 4, 8] },
  { id: "34-sixteenth-2", meter: "3/4", group: "sixteenth", label: "eighth + sixteenths", abc: "C/ C/2C/2 C C |", hits: [0, 2, 3, 4, 8] },

  // 3/4 triplet
  { id: "34-triplet-1", meter: "3/4", group: "triplet", label: "triplet opening", abc: "(3C/2C/2C/2 C C |", hits: [0, 1.333, 2.667, 4, 8] },
  { id: "34-triplet-2", meter: "3/4", group: "triplet", label: "triplet middle", abc: "C (3C/2C/2C/2 C |", hits: [0, 4, 5.333, 6.667, 8] },

  // 3/4 ties
  { id: "34-tie-1", meter: "3/4", group: "tie", label: "middle tie", abc: "C/ C/-C/ C |", hits: [0, 2, 8] },
  { id: "34-tie-2", meter: "3/4", group: "tie", label: "held start", abc: "C-C C |", hits: [0, 8] },

  // 6/8 basic
  { id: "68-basic-six", meter: "6/8", group: "basic", label: "six eighths", abc: "C C C C C C |", hits: [0, 2, 4, 6, 8, 10] },
  { id: "68-basic-two-dotted", meter: "6/8", group: "basic", label: "two dotted quarters", abc: "C3 C3 |", hits: [0, 6] },
  { id: "68-basic-3-1-1-1", meter: "6/8", group: "basic", label: "3 + 1 + 1 + 1", abc: "C3 C C C |", hits: [0, 6, 8, 10] },
  { id: "68-basic-1-1-1-3", meter: "6/8", group: "basic", label: "1 + 1 + 1 + 3", abc: "C C C C3 |", hits: [0, 2, 4, 6] },
  { id: "68-basic-rest", meter: "6/8", group: "basic", label: "rest inside", abc: "C z C C C C |", hits: [0, 4, 6, 8, 10] },

  // 6/8 sixteenth
  { id: "68-sixteenth-1", meter: "6/8", group: "sixteenth", label: "sixteenths first beat", abc: "C/2C/2 C C C C C |", hits: [0, 1, 2, 4, 6, 8, 10] },
  { id: "68-sixteenth-2", meter: "6/8", group: "sixteenth", label: "sixteenths second group", abc: "C C C C/2C/2 C C |", hits: [0, 2, 4, 6, 7, 8, 10] },

  // 6/8 triplet-like subdivision
  { id: "68-triplet-1", meter: "6/8", group: "triplet", label: "triplet color", abc: "(3C/2C/2C/2 C C C C |", hits: [0, 1.333, 2.667, 4, 6, 8, 10] },
  { id: "68-triplet-2", meter: "6/8", group: "triplet", label: "triplet second dotted beat", abc: "C C C (3C/2C/2C/2 C C |", hits: [0, 2, 4, 6, 7.333, 8.667, 10] },

  // 6/8 ties
  { id: "68-tie-1", meter: "6/8", group: "tie", label: "tie across middle", abc: "C C-C C C |", hits: [0, 2, 6, 8] },
  { id: "68-tie-2", meter: "6/8", group: "tie", label: "held first dotted beat", abc: "C3-C C C |", hits: [0, 8, 10] }
];

let currentQuestion = null;
let hasAnsweredCurrentQuestion = false;
let totalCount = 0;
let correctCount = 0;
let resultLog = [];
let questionStartTime = null;
let latestResponseTimeSec = null;
let rhythmSynth = null;
let clickSynth = null;

const choiceList = document.querySelector("#choice-list");
const choiceMeterHeader = document.querySelector("#choice-meter-header");
const statusEl = document.querySelector("#status");
const questionDisplay = document.querySelector("#question-display");
const answerText = document.querySelector("#answer-text");
const analysisText = document.querySelector("#analysis-text");
const notationEl = document.querySelector("#notation");
const totalCountEl = document.querySelector("#total-count");
const correctCountEl = document.querySelector("#correct-count");
const scorePercentEl = document.querySelector("#score-percent");
const currentTimeEl = document.querySelector("#current-time");
const progressCountEl = document.querySelector("#progress-count");
const historyList = document.querySelector("#history-list");

document.querySelector("#new-question").addEventListener("click", newQuestion);
document.querySelector("#play-question").addEventListener("click", playCurrentQuestion);
document.querySelector("#show-answer").addEventListener("click", showAnswer);
document.querySelector("#reset-score").addEventListener("click", resetScore);
document.querySelector("#export-pdf").addEventListener("click", exportResultsPdf);

function init() {
  updateScore();
  setStatus("NEW を押して、演奏されたリズムを3つの譜例から選んでください。");
}

function getSelectedValues(name) {
  return Array.from(document.querySelectorAll(`input[name="${name}"]:checked`)).map((input) => input.value);
}

function getTempo() {
  return Number(document.querySelector("#tempo-select").value) || 84;
}

function getSoundType() {
  return document.querySelector("#sound-select").value;
}

function getPool() {
  const meters = getSelectedValues("meter");
  const groups = getSelectedValues("content");

  return patterns.filter((pattern) => {
    return meters.includes(pattern.meter) && groups.includes(pattern.group);
  });
}

function randomItem(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function shuffle(array) {
  return array.slice().sort(() => Math.random() - 0.5);
}

function newQuestion() {
  const pool = getPool();

  if (pool.length < 3) {
    setStatus("3択を作るには候補が足りません。拍子または内容を増やしてください。", "incorrect");
    return;
  }

  clearFeedback();

  const correct = randomItem(pool);
  const sameMeterPool = pool.filter((pattern) => {
    return pattern.meter === correct.meter && pattern.id !== correct.id;
  });

  if (sameMeterPool.length < 2) {
    setStatus(`${correct.meter} の候補が足りません。同じ拍子で3択を作るため、内容設定を増やしてください。`, "incorrect");
    return;
  }

  const choices = shuffle([correct, ...shuffle(sameMeterPool).slice(0, 2)]);

  if (!choices.every((choice) => choice.meter === correct.meter)) {
    setStatus("内部エラー：拍子が混在しました。もう一度NEWを押してください。", "incorrect");
    return;
  }

  currentQuestion = {
    number: totalCount + 1,
    correct,
    choices,
    tempo: getTempo(),
    sound: getSoundType()
  };

  hasAnsweredCurrentQuestion = false;
  questionStartTime = null;
  latestResponseTimeSec = null;
  currentTimeEl.textContent = "--";
  answerText.textContent = "";
  analysisText.textContent = "";
  notationEl.innerHTML = "";
  questionDisplay.textContent = `METER ${correct.meter}`;
  choiceMeterHeader.textContent = `ALL CHOICES: ${correct.meter}`;

  renderChoices();
  setStatus(`${correct.meter} の1小節です。カウント後すぐに本編リズムが始まります。`);
  playCurrentQuestion();
}

function renderChoices() {
  choiceList.innerHTML = "";

  if (!currentQuestion) return;

  currentQuestion.choices.forEach((choice, index) => {
    const card = document.createElement("button");
    card.type = "button";
    card.className = "choice-card";
    card.dataset.id = choice.id;
    card.innerHTML = `
      <span class="choice-label">${String.fromCharCode(65 + index)}</span>
      <span class="choice-body">
        <span class="choice-meter">METER ${choice.meter}</span>
        <span class="choice-notation" id="choice-notation-${index}"></span>
      </span>
    `;
    card.addEventListener("click", () => answer(choice.id));
    choiceList.appendChild(card);

    requestAnimationFrame(() => {
      renderAbc(`choice-notation-${index}`, buildAbc(choice), 360);
    });
  });
}

async function ensureAudio() {
  if (Tone.context.state !== "running") {
    await Tone.start();
  }

  if (!rhythmSynth) {
    rhythmSynth = new Tone.MembraneSynth({
      pitchDecay: 0.015,
      octaves: 2.2,
      envelope: { attack: 0.001, decay: 0.08, sustain: 0, release: 0.02 }
    }).toDestination();
    rhythmSynth.volume.value = -6;
  }

  if (!clickSynth) {
    clickSynth = new Tone.Synth({
      oscillator: { type: "square" },
      envelope: { attack: 0.001, decay: 0.035, sustain: 0, release: 0.01 }
    }).toDestination();
    clickSynth.volume.value = -13;
  }

  return { rhythmSynth, clickSynth };
}

async function playCurrentQuestion() {
  if (!currentQuestion) {
    setStatus("先に NEW を押してください。", "incorrect");
    return;
  }

  const { rhythmSynth, clickSynth } = await ensureAudio();

  const lead = 0.14;
  const startNow = Tone.now() + lead;
  const tempo = currentQuestion.tempo;
  const quarterSec = 60 / tempo;
  const sixteenthSec = quarterSec / 4;
  const meter = currentQuestion.correct.meter;

  const count = getCountSpec(meter, quarterSec);
  const countStart = startNow;
  const barStart = countStart + count.countClicks * count.stepSec;

  if (!hasAnsweredCurrentQuestion) {
    questionStartTime = performance.now();
    latestResponseTimeSec = null;
    currentTimeEl.textContent = "0.0s";
  }

  // Count-in
  for (let i = 0; i < count.countClicks; i += 1) {
    clickSynth.triggerAttackRelease(count.isAccent(i) ? "A5" : "C5", "32n", countStart + i * count.stepSec);
  }

  // Metronome inside the performed bar
  for (let i = 0; i < count.countClicks; i += 1) {
    clickSynth.triggerAttackRelease(count.isAccent(i) ? "A5" : "C5", "32n", barStart + i * count.stepSec);
  }

  const rhythmPitch = currentQuestion.sound === "click" ? "C3" : "C4";
  currentQuestion.correct.hits.forEach((unit) => {
    rhythmSynth.triggerAttackRelease(rhythmPitch, "32n", barStart + unit * sixteenthSec);
  });

  const msg = meter === "6/8"
    ? "6/8です。カウントも本編も8分音符単位で6回クリックします。1拍目と4拍目が高い音です。"
    : `${meter}です。1拍目が高いクリックです。カウント後すぐ本編に入ります。`;
  setStatus(msg);
}

function getCountSpec(meter, quarterSec) {
  if (meter === "6/8") {
    return {
      countClicks: 6,
      stepSec: quarterSec / 2,
      isAccent(index) {
        return index === 0 || index === 3;
      }
    };
  }

  const countClicks = meter === "3/4" ? 3 : 4;
  return {
    countClicks,
    stepSec: quarterSec,
    isAccent(index) {
      return index === 0;
    }
  };
}

function answer(choiceId) {
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

  hasAnsweredCurrentQuestion = true;
  totalCount += 1;

  const isCorrect = choiceId === currentQuestion.correct.id;
  if (isCorrect) correctCount += 1;

  currentTimeEl.textContent = formatResponseTime(latestResponseTimeSec);

  document.querySelectorAll(".choice-card").forEach((card) => {
    card.classList.remove("selected-correct", "selected-incorrect");
    if (card.dataset.id === currentQuestion.correct.id) {
      card.classList.add("selected-correct");
    }
    if (!isCorrect && card.dataset.id === choiceId) {
      card.classList.add("selected-incorrect");
    }
  });

  const selected = currentQuestion.choices.find((item) => item.id === choiceId);

  setStatus(
    `${isCorrect ? "正解" : "不正解"} / 拍子：${currentQuestion.correct.meter} / 正解：${currentQuestion.correct.label} / 選択：${selected?.label || "-"} / ${formatResponseTime(latestResponseTimeSec)}`,
    isCorrect ? "correct" : "incorrect"
  );

  resultLog.push({
    number: totalCount,
    meter: currentQuestion.correct.meter,
    label: currentQuestion.correct.label,
    selectedLabel: selected?.label || "",
    isCorrect,
    responseTimeSec: latestResponseTimeSec
  });

  updateScore();
  renderHistory();
  showAnswer();
}

function showAnswer() {
  if (!currentQuestion) {
    setStatus("先に NEW を押してください。", "incorrect");
    return;
  }

  answerText.textContent = `正解：${currentQuestion.correct.meter} / ${currentQuestion.correct.label}`;
  analysisText.textContent = `3つの選択肢はすべて ${currentQuestion.correct.meter} です。`;
  renderAbc("notation", buildAbc(currentQuestion.correct), 680);
}

function buildAbc(pattern) {
  const lUnit = pattern.meter === "6/8" ? "1/8" : "1/4";
  return `X:1
M:${pattern.meter}
L:${lUnit}
K:C clef=perc
${pattern.abc}`;
}

function renderAbc(targetId, abc, width) {
  if (!window.ABCJS) return;
  ABCJS.renderAbc(targetId, abc, {
    responsive: "resize",
    staffwidth: width,
    paddingtop: 0,
    paddingbottom: 0,
    paddingleft: 0,
    paddingright: 0,
    add_classes: true
  });
}

function clearFeedback() {
  statusEl.className = "status";
  document.querySelectorAll(".choice-card").forEach((card) => {
    card.classList.remove("selected-correct", "selected-incorrect");
  });
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
    historyList.textContent = t("まだ解答履歴がありません。");
    return;
  }

  historyList.innerHTML = "";
  resultLog.slice().reverse().forEach((item) => {
    const row = document.createElement("div");
    row.className = "history-item";
    row.innerHTML = `
      <span>${String(item.number).padStart(2, "0")}</span>
      <span>${item.meter} / ${item.label} / ${formatResponseTime(item.responseTimeSec)}</span>
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
    doc.text("Rhythm Dictation Result", 16, 18);

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
      if (y > 266) {
        doc.addPage();
        y = 18;
      }
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.text(`${String(item.number).padStart(2, "0")}  ${item.meter}  ${item.label}`, 16, y);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.text(`Your answer: ${item.selectedLabel || "-"} / ${item.isCorrect ? "OK" : "NG"} / Time: ${formatResponseTime(item.responseTimeSec)}`, 16, y + 6);
      y += 18;
    });

    doc.save("rhythm-dictation-result.pdf");
    setStatus("結果PDFを出力しました。", "correct");
  } catch (error) {
    console.error(error);
    setStatus("PDF作成中にエラーが発生しました。", "incorrect");
  } finally {
    exportButton.disabled = false;
  }
}

init();

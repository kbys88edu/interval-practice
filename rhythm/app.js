function t(text) {
  return window.EarTrainingLang?.translateText(text) || text;
}

// Rhythm engine rebuilt on a strict 16th-note grid.
// ABC notation is rendered with L:1/16 for every meter.
// Therefore a 16th note is always written as C, an 8th note as C2, a quarter note as C4, etc.

const patterns = [
  // 4/4 basic
  p("44-basic-1", "4/4", "basic", "quarter notes", "C4 C4 C4 C4", [0,4,8,12]),
  p("44-basic-2", "4/4", "basic", "half + quarters", "C8 C4 C4", [0,8,12]),
  p("44-basic-3", "4/4", "basic", "eighth motion", "C4 C2 C2 C4 C4", [0,4,6,8,12]),
  p("44-basic-4", "4/4", "basic", "rests", "C4 z4 C4 C4", [0,8,12]),
  p("44-basic-5", "4/4", "basic", "off eighth", "C2 z2 C2 C2 C4 C4", [0,4,6,8,12]),

  // 4/4 true sixteenths
  p("44-16-1", "4/4", "sixteenth", "four sixteenths", "C C C C C4 C4 C4", [0,1,2,3,4,8,12]),
  p("44-16-2", "4/4", "sixteenth", "sixteenth turn", "C2 C C C4 C2 C C C4", [0,2,3,4,8,10,11,12]),
  p("44-16-3", "4/4", "sixteenth", "eighth + sixteenths", "C2 C C C4 C4 C4", [0,2,3,4,8,12]),
  p("44-16-4", "4/4", "sixteenth", "two sixteenth groups", "C C C C C4 C C C C C4", [0,1,2,3,4,8,9,10,11,12]),
  p("44-16-5", "4/4", "sixteenth", "late sixteenths", "C4 C4 C2 C C C4", [0,4,8,10,11,12]),
  p("44-16-6", "4/4", "sixteenth", "syncopated sixteenths", "C2 C C C2 C2 C4 C2", [0,2,3,4,6,8,12,14]),

  // 4/4 dotted rhythms
  p("44-dot-1", "4/4", "dotted", "dotted eighth + sixteenth", "C3 C C4 C4 C4", [0,3,4,8,12]),
  p("44-dot-2", "4/4", "dotted", "sixteenth + dotted eighth", "C C3 C4 C4 C4", [0,1,4,8,12]),
  p("44-dot-3", "4/4", "dotted", "two dotted figures", "C3 C C3 C C4 C4", [0,3,4,7,8,12]),
  p("44-dot-4", "4/4", "dotted", "dotted quarter", "C6 C2 C4 C4", [0,6,8,12]),
  p("44-dot-5", "4/4", "dotted", "dotted middle", "C4 C3 C C4 C4", [0,4,7,8,12]),
  p("44-dot-6", "4/4", "dotted", "reverse dotted middle", "C4 C C3 C4 C4", [0,4,5,8,12]),

  // 4/4 triplets
  p("44-trip-1", "4/4", "triplet", "triplet opening", "(3C2C2C2 C4 C4 C4", [0,1.333,2.667,4,8,12]),
  p("44-trip-2", "4/4", "triplet", "triplet second beat", "C4 (3C2C2C2 C4 C4", [0,4,5.333,6.667,8,12]),
  p("44-trip-3", "4/4", "triplet", "two triplet beats", "(3C2C2C2 (3C2C2C2 C4 C4", [0,1.333,2.667,4,5.333,6.667,8,12]),

  // 4/4 ties
  p("44-tie-1", "4/4", "tie", "eighth tied syncopation", "C2 C2-C2 C2 C4 C4", [0,2,6,8,12]),
  p("44-tie-2", "4/4", "tie", "quarter tie", "C4 C4-C4 C4", [0,4,12]),
  p("44-tie-3", "4/4", "tie", "dotted tie", "C3 C-C2 C4 C4", [0,3,6,8,12]),

  // 3/4 basic
  p("34-basic-1", "3/4", "basic", "three quarters", "C4 C4 C4", [0,4,8]),
  p("34-basic-2", "3/4", "basic", "half + quarter", "C8 C4", [0,8]),
  p("34-basic-3", "3/4", "basic", "eighth motion", "C4 C2 C2 C4", [0,4,6,8]),
  p("34-basic-4", "3/4", "basic", "rest", "C4 z4 C4", [0,8]),

  // 3/4 sixteenths
  p("34-16-1", "3/4", "sixteenth", "sixteenth opening", "C C C C C4 C4", [0,1,2,3,4,8]),
  p("34-16-2", "3/4", "sixteenth", "eighth + sixteenths", "C2 C C C4 C4", [0,2,3,4,8]),
  p("34-16-3", "3/4", "sixteenth", "late sixteenths", "C4 C4 C C C C", [0,4,8,9,10,11]),
  p("34-16-4", "3/4", "sixteenth", "two short groups", "C C C C C2 C C C2", [0,1,2,3,4,6,7,8]),

  // 3/4 dotted
  p("34-dot-1", "3/4", "dotted", "dotted opening", "C3 C C4 C4", [0,3,4,8]),
  p("34-dot-2", "3/4", "dotted", "reverse dotted opening", "C C3 C4 C4", [0,1,4,8]),
  p("34-dot-3", "3/4", "dotted", "dotted middle", "C4 C3 C C4", [0,4,7,8]),
  p("34-dot-4", "3/4", "dotted", "dotted quarter", "C6 C2 C4", [0,6,8]),
  p("34-dot-5", "3/4", "dotted", "two dotted figures", "C3 C C3 C C4", [0,3,4,7,8]),

  // 3/4 triplets
  p("34-trip-1", "3/4", "triplet", "triplet opening", "(3C2C2C2 C4 C4", [0,1.333,2.667,4,8]),
  p("34-trip-2", "3/4", "triplet", "triplet middle", "C4 (3C2C2C2 C4", [0,4,5.333,6.667,8]),

  // 3/4 ties
  p("34-tie-1", "3/4", "tie", "middle tie", "C2 C2-C2 C2 C4", [0,2,6,8]),
  p("34-tie-2", "3/4", "tie", "held start", "C4-C4 C4", [0,8]),

  // 6/8 basic
  p("68-basic-1", "6/8", "basic", "six eighths", "C2 C2 C2 C2 C2 C2", [0,2,4,6,8,10]),
  p("68-basic-2", "6/8", "basic", "two dotted quarters", "C6 C6", [0,6]),
  p("68-basic-3", "6/8", "basic", "3 + 1 + 1 + 1", "C6 C2 C2 C2", [0,6,8,10]),
  p("68-basic-4", "6/8", "basic", "1 + 1 + 1 + 3", "C2 C2 C2 C6", [0,2,4,6]),
  p("68-basic-5", "6/8", "basic", "rest inside", "C2 z2 C2 C2 C2 C2", [0,4,6,8,10]),

  // 6/8 sixteenths
  p("68-16-1", "6/8", "sixteenth", "sixteenths first eighth", "C C C2 C2 C2 C2 C2", [0,1,2,4,6,8,10]),
  p("68-16-2", "6/8", "sixteenth", "sixteenths middle", "C2 C2 C C C2 C2 C2", [0,2,4,5,6,8,10]),
  p("68-16-3", "6/8", "sixteenth", "sixteenths second dotted beat", "C2 C2 C2 C C C2 C2", [0,2,4,6,7,8,10]),
  p("68-16-4", "6/8", "sixteenth", "running sixteenths", "C C C C C C C2 C2 C2", [0,1,2,3,4,5,6,8,10]),
  p("68-16-5", "6/8", "sixteenth", "late sixteenths", "C2 C2 C2 C2 C C C", [0,2,4,6,8,9,10]),

  // 6/8 dotted rhythms
  p("68-dot-1", "6/8", "dotted", "dotted eighth + sixteenth", "C3 C C2 C2 C2 C2", [0,3,4,6,8,10]),
  p("68-dot-2", "6/8", "dotted", "sixteenth + dotted eighth", "C C3 C2 C2 C2 C2", [0,1,4,6,8,10]),
  p("68-dot-3", "6/8", "dotted", "two dotted figures", "C3 C C3 C C2 C2", [0,3,4,7,8,10]),
  p("68-dot-4", "6/8", "dotted", "dotted in second group", "C2 C2 C2 C3 C C2", [0,2,4,6,9,10]),
  p("68-dot-5", "6/8", "dotted", "reverse dotted second group", "C2 C2 C2 C C3 C2", [0,2,4,6,7,10]),

  // 6/8 triplets
  p("68-trip-1", "6/8", "triplet", "triplet opening", "(3C2C2C2 C2 C2 C2 C2", [0,1.333,2.667,4,6,8,10]),
  p("68-trip-2", "6/8", "triplet", "triplet second group", "C2 C2 C2 (3C2C2C2 C2 C2", [0,2,4,6,7.333,8.667,10]),

  // 6/8 ties
  p("68-tie-1", "6/8", "tie", "tie across middle", "C2 C2-C2 C2 C2 C2", [0,2,6,8,10]),
  p("68-tie-2", "6/8", "tie", "held dotted beat", "C6-C2 C2 C2", [0,8,10]),
  p("68-tie-3", "6/8", "tie", "dotted tie", "C3 C-C2 C2 C2 C2", [0,3,6,8,10])
];

function p(id, meter, group, label, abcBody, hits) {
  return { id, meter, group, label, abcBody, hits };
}

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
  return patterns.filter((pattern) => meters.includes(pattern.meter) && groups.includes(pattern.group));
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
  const sameMeterPool = pool.filter((pattern) => pattern.meter === correct.meter && pattern.id !== correct.id);

  if (sameMeterPool.length < 2) {
    setStatus(`${correct.meter} の候補が足りません。同じ拍子で3択を作るため、内容設定を増やしてください。`, "incorrect");
    return;
  }

  const distractors = chooseSimilarDistractors(correct, sameMeterPool, 2);
  const choices = shuffle([correct, ...distractors]);

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
  setStatus(`${correct.meter} の1小節です。16分音符は16分音符として表記されます。`);
  playCurrentQuestion();
}

function chooseSimilarDistractors(correct, candidates, count) {
  const ranked = candidates
    .map((candidate) => ({
      candidate,
      score: rhythmSimilarityScore(correct, candidate)
    }))
    .sort((a, b) => a.score - b.score);

  const closeGroup = ranked.slice(0, Math.min(8, ranked.length)).map((item) => item.candidate);
  return shuffle(closeGroup).slice(0, count);
}

function rhythmSimilarityScore(a, b) {
  let score = 0;

  if (a.group !== b.group) score += 3;
  score += Math.abs(a.hits.length - b.hits.length) * 2.8;

  const aHits = a.hits.slice().sort((x, y) => x - y);
  const bHits = b.hits.slice().sort((x, y) => x - y);
  const pairCount = Math.min(aHits.length, bHits.length);

  for (let i = 0; i < pairCount; i += 1) {
    score += Math.abs(aHits[i] - bHits[i]) * 0.7;
  }

  score += Math.abs(aHits[0] - bHits[0]) * 1.2;
  score += Math.abs(aHits[aHits.length - 1] - bHits[bHits.length - 1]) * 0.7;

  const strongBeats = a.meter === "6/8" ? [0, 6] : a.meter === "3/4" ? [0, 4, 8] : [0, 4, 8, 12];
  strongBeats.forEach((beat) => {
    const aHas = aHits.some((hit) => Math.abs(hit - beat) < 0.01);
    const bHas = bHits.some((hit) => Math.abs(hit - beat) < 0.01);
    if (aHas !== bHas) score += 2.4;
  });

  // Similar notational density and dotted/sixteenth profile.
  score += Math.abs(a.abcBody.length - b.abcBody.length) * 0.03;
  score += Math.abs(countTrueSixteenths(a.abcBody) - countTrueSixteenths(b.abcBody)) * 1.4;
  score += Math.abs(countDottedDurations(a.abcBody) - countDottedDurations(b.abcBody)) * 1.8;

  return score;
}

function countTrueSixteenths(abc) {
  return (abc.match(/(^|\\s|\\()C(\\s|$|\\)|-)/g) || []).length;
}

function countDottedDurations(abc) {
  return (abc.match(/C3|C6/g) || []).length;
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
      renderAbc(`choice-notation-${index}`, buildAbc(choice), 260);
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

  for (let i = 0; i < count.countClicks; i += 1) {
    clickSynth.triggerAttackRelease(count.isAccent(i) ? "A5" : "C5", "32n", countStart + i * count.stepSec);
  }

  const rhythmPitch = currentQuestion.sound === "click" ? "C3" : "C4";
  currentQuestion.correct.hits.forEach((unit) => {
    rhythmSynth.triggerAttackRelease(rhythmPitch, "32n", barStart + unit * sixteenthSec);
  });

  const msg = meter === "6/8"
    ? "6/8です。カウントは8分音符単位で6回、その後リズムだけが再生されます。"
    : `${meter}です。カウント後、メトロノームなしでリズムだけが再生されます。`;
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
  analysisText.textContent = `すべて ${currentQuestion.correct.meter}。L:1/16で表示しているため、16分音符は16分音符として表記されます。`;
  renderAbc("notation", buildAbc(currentQuestion.correct), 520);
}

function buildAbc(pattern) {
  return `X:1
M:${pattern.meter}
L:1/16
K:C clef=perc
${pattern.abcBody} |`;
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

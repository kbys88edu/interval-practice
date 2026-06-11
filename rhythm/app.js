
function t(text) {
  return window.EarTrainingLang?.translateText(text) || text;
}

const patterns = [
  // 4/4 basic
  { id: "44-q", meter: "4/4", name: "四分音符", abc: "C C C C |", events: [{t:0,d:1},{t:1,d:1},{t:2,d:1},{t:3,d:1}], level: "basic" },
  { id: "44-hq", meter: "4/4", name: "二分 + 四分", abc: "C2 C C |", events: [{t:0,d:2},{t:2,d:1},{t:3,d:1}], level: "basic" },
  { id: "44-eeq", meter: "4/4", name: "八分入り", abc: "C C/ C/ C C |", events: [{t:0,d:1},{t:1,d:.5},{t:1.5,d:.5},{t:2,d:1},{t:3,d:1}], level: "basic" },
  { id: "44-sync", meter: "4/4", name: "シンコペーション", abc: "C C/ C3/ C |", events: [{t:0,d:1},{t:1,d:.5},{t:1.5,d:1.5},{t:3,d:1}], tie: true },
  { id: "44-16a", meter: "4/4", name: "16分音符", abc: "C/2C/2C/2C/2 C C C |", events: [{t:0,d:.25},{t:.25,d:.25},{t:.5,d:.25},{t:.75,d:.25},{t:1,d:1},{t:2,d:1},{t:3,d:1}], sixteenth: true },
  { id: "44-16b", meter: "4/4", name: "付点風16分", abc: "C3/4C/4 C C C |", events: [{t:0,d:.75},{t:.75,d:.25},{t:1,d:1},{t:2,d:1},{t:3,d:1}], sixteenth: true },
  { id: "44-trip", meter: "4/4", name: "三連符", abc: "(3CCC C C C |", events: [{t:0,d:1/3},{t:1/3,d:1/3},{t:2/3,d:1/3},{t:1,d:1},{t:2,d:1},{t:3,d:1}], triplet: true },
  { id: "44-rest", meter: "4/4", name: "休符入り", abc: "C z C/ C/ C |", events: [{t:0,d:1},{t:2,d:.5},{t:2.5,d:.5},{t:3,d:1}], level: "basic" },

  // 3/4
  { id: "34-q", meter: "3/4", name: "四分音符", abc: "C C C |", events: [{t:0,d:1},{t:1,d:1},{t:2,d:1}], level: "basic" },
  { id: "34-he", meter: "3/4", name: "二分 + 四分", abc: "C2 C |", events: [{t:0,d:2},{t:2,d:1}], level: "basic" },
  { id: "34-ee", meter: "3/4", name: "八分入り", abc: "C/ C/ C C |", events: [{t:0,d:.5},{t:.5,d:.5},{t:1,d:1},{t:2,d:1}], level: "basic" },
  { id: "34-16", meter: "3/4", name: "16分音符", abc: "C/2C/2C/2C/2 C C |", events: [{t:0,d:.25},{t:.25,d:.25},{t:.5,d:.25},{t:.75,d:.25},{t:1,d:1},{t:2,d:1}], sixteenth: true },
  { id: "34-trip", meter: "3/4", name: "三連符", abc: "C (3CCC C |", events: [{t:0,d:1},{t:1,d:1/3},{t:1+1/3,d:1/3},{t:1+2/3,d:1/3},{t:2,d:1}], triplet: true },
  { id: "34-tie", meter: "3/4", name: "タイ風", abc: "C C3/2 C/ |", events: [{t:0,d:1},{t:1,d:1.5},{t:2.5,d:.5}], tie: true },

  // 6/8: using L:1/8, event unit is eighth note; playback converts by meter
  { id: "68-basic", meter: "6/8", name: "基本", abc: "C C C C C C |", events: [{t:0,d:1},{t:1,d:1},{t:2,d:1},{t:3,d:1},{t:4,d:1},{t:5,d:1}], level: "basic" },
  { id: "68-dotted", meter: "6/8", name: "付点四分", abc: "C3 C3 |", events: [{t:0,d:3},{t:3,d:3}], level: "basic" },
  { id: "68-mix", meter: "6/8", name: "3+1+1+1", abc: "C3 C C C |", events: [{t:0,d:3},{t:3,d:1},{t:4,d:1},{t:5,d:1}], level: "basic" },
  { id: "68-mix2", meter: "6/8", name: "1+1+1+3", abc: "C C C C3 |", events: [{t:0,d:1},{t:1,d:1},{t:2,d:1},{t:3,d:3}], level: "basic" },
  { id: "68-16", meter: "6/8", name: "16分音符", abc: "C/2C/2 C C C3 |", events: [{t:0,d:.5},{t:.5,d:.5},{t:1,d:1},{t:2,d:1},{t:3,d:3}], sixteenth: true },
  { id: "68-tie", meter: "6/8", name: "タイ風", abc: "C2 C2 C C |", events: [{t:0,d:2},{t:2,d:2},{t:4,d:1},{t:5,d:1}], tie: true }
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
const answerNotation = document.querySelector("#answer-notation");
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
}

function getSelectedMeters() {
  return Array.from(document.querySelectorAll('input[name="meter"]:checked')).map((input) => input.value);
}

function getTempo() {
  return Number(document.querySelector("#tempo-select").value) || 84;
}

function getSoundType() {
  return document.querySelector('input[name="sound"]:checked').value;
}

function getAllowedPatterns() {
  const meters = getSelectedMeters();
  const allowTriplets = document.querySelector("#allow-triplets").checked;
  const allowSixteenths = document.querySelector("#allow-sixteenths").checked;
  const allowTies = document.querySelector("#allow-ties").checked;

  return patterns.filter((pattern) => {
    if (!meters.includes(pattern.meter)) return false;
    if (pattern.triplet && !allowTriplets) return false;
    if (pattern.sixteenth && !allowSixteenths) return false;
    if (pattern.tie && !allowTies) return false;
    return true;
  });
}

function randomItem(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function shuffle(array) {
  return array.slice().sort(() => Math.random() - 0.5);
}

function newQuestion() {
  const pool = getAllowedPatterns();

  if (pool.length < 3) {
    setStatus(t("出題できるリズムが3つ未満です。設定を増やしてください。"), "incorrect");
    return;
  }

  clearFeedback();

  const correct = randomItem(pool);
  const sameMeterPool = pool.filter((pattern) => pattern.meter === correct.meter && pattern.id !== correct.id);

  if (sameMeterPool.length < 2) {
    setStatus(t("同じ拍子で3択を作るには、候補が足りません。設定を増やしてください。"), "incorrect");
    return;
  }

  const distractors = shuffle(sameMeterPool).slice(0, 2);
  const choices = shuffle([correct, ...distractors]);

  currentQuestion = {
    number: totalCount + 1,
    correct,
    choices,
    tempo: getTempo()
  };

  hasAnsweredCurrentQuestion = false;
  questionStartTime = null;
  latestResponseTimeSec = null;
  currentTimeEl.textContent = "--";
  answerText.textContent = "";
  answerNotation.innerHTML = "";
  questionDisplay.textContent = `METER ${correct.meter}`;
  if (choiceMeterHeader) choiceMeterHeader.textContent = `ALL CHOICES: ${correct.meter}`;

  renderChoices();
  setStatus(`${correct.meter} の1小節です。3つの答えはすべて同じ拍子です。カウント後にリズムを再生します。`);
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
      <div class="choice-body">
        <div class="choice-meter">METER ${choice.meter}</div>
        <div class="choice-notation" id="choice-${index}"></div>
      </div>
    `;
    card.addEventListener("click", () => answer(choice.id));
    choiceList.appendChild(card);

    const target = card.querySelector(`#choice-${index}`);
    renderRhythm(target, choice);
  });
}

function renderRhythm(target, pattern) {
  const abc = buildAbc(pattern);
  ABCJS.renderAbc(target, abc, {
    responsive: "resize",
    staffwidth: 520,
    paddingtop: 0,
    paddingbottom: 0,
    paddingleft: 0,
    paddingright: 0
  });
}

function buildAbc(pattern) {
  const length = pattern.meter === "6/8" ? "1/8" : "1/4";
  return `X:1
M:${pattern.meter}
L:${length}
K:C clef=perc
${pattern.abc}`;
}

async function ensureAudio() {
  if (Tone.context.state !== "running") {
    await Tone.start();
  }

  if (!rhythmSynth) {
    rhythmSynth = new Tone.MembraneSynth({
      pitchDecay: 0.018,
      octaves: 3,
      envelope: { attack: 0.001, decay: 0.11, sustain: 0, release: 0.02 }
    }).toDestination();
    rhythmSynth.volume.value = -7;
  }

  if (!clickSynth) {
    clickSynth = new Tone.Synth({
      oscillator: { type: "square" },
      envelope: { attack: 0.001, decay: 0.035, sustain: 0, release: 0.01 }
    }).toDestination();
    clickSynth.volume.value = -14;
  }

  return { rhythmSynth, clickSynth };
}

async function playCurrentQuestion() {
  if (!currentQuestion) {
    setStatus(t("先に NEW を押してください。"), "incorrect");
    return;
  }

  const { rhythmSynth, clickSynth } = await ensureAudio();

  // Schedule slightly ahead of the current audio time.
  // This avoids browser timing instability and removes the perceived gap before the bar.
  const scheduleLeadSec = 0.12;
  const now = Tone.now() + scheduleLeadSec;

  const beatSec = 60 / currentQuestion.tempo;
  const isSixEight = currentQuestion.correct.meter === "6/8";

  // In 6/8, one unit is the eighth note. In 4/4 and 3/4, one unit is the quarter note.
  const unitSec = isSixEight ? beatSec / 2 : beatSec;
  const rhythmPitch = getSoundType() === "kick" ? "C2" : "C4";

  if (!hasAnsweredCurrentQuestion) {
    questionStartTime = performance.now();
    latestResponseTimeSec = null;
    currentTimeEl.textContent = "0.0s";
  }

  // Count-in:
  // 4/4: 4 quarter-note clicks
  // 3/4: 3 quarter-note clicks
  // 6/8: 6 eighth-note clicks
  const countClicks = isSixEight ? 6 : Number(currentQuestion.correct.meter.split("/")[0]);
  const clickStepSec = isSixEight ? unitSec : beatSec;
  const countStart = now;
  const barStart = countStart + countClicks * clickStepSec;

  for (let i = 0; i < countClicks; i += 1) {
    const isAccent = isSixEight ? (i === 0 || i === 3) : i === 0;
    const countPitch = isAccent ? "A5" : "C5";
    clickSynth.triggerAttackRelease(countPitch, "32n", countStart + i * clickStepSec);
  }

  // The played bar starts exactly one pulse after the last count click.
  // There is no additional silent offset.
  for (let i = 0; i < countClicks; i += 1) {
    const isAccent = isSixEight ? (i === 0 || i === 3) : i === 0;
    const clickPitch = isAccent ? "A5" : "C5";
    clickSynth.triggerAttackRelease(clickPitch, "32n", barStart + i * clickStepSec);
  }

  currentQuestion.correct.events.forEach((event) => {
    rhythmSynth.triggerAttackRelease(rhythmPitch, "32n", barStart + event.t * unitSec);
  });

  setStatus(`${currentQuestion.correct.meter} のリズムです。選択肢はすべて同じ拍子です。6/8では8分音符単位で6回クリックします。`);
}

function answer(choiceId) {
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
    `${isCorrect ? "正解" : "不正解"} / 正解：${currentQuestion.correct.meter} ${currentQuestion.correct.name} / 選択：${selected?.name || "-"} / ${formatResponseTime(latestResponseTimeSec)}`,
    isCorrect ? "correct" : "incorrect"
  );

  resultLog.push({
    number: totalCount,
    meter: currentQuestion.correct.meter,
    name: currentQuestion.correct.name,
    selectedName: selected?.name || "",
    isCorrect,
    responseTimeSec: latestResponseTimeSec,
    abc: buildAbc(currentQuestion.correct)
  });

  updateScore();
  renderHistory();
}

function showAnswer() {
  if (!currentQuestion) {
    setStatus(t("先に NEW を押してください。"), "incorrect");
    return;
  }

  answerText.textContent = `正解：${currentQuestion.correct.meter} / ${currentQuestion.correct.name}`;
  renderRhythm(answerNotation, currentQuestion.correct);
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
      <span>${item.meter} / ${item.name} / ${formatResponseTime(item.responseTimeSec)}</span>
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
      doc.text(`${String(item.number).padStart(2, "0")}  ${item.meter}  ${item.name}`, 16, y);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.text(`Your answer: ${item.selectedName || "-"} / ${item.isCorrect ? "OK" : "NG"} / Time: ${formatResponseTime(item.responseTimeSec)}`, 16, y + 6);
      y += 18;
    });

    doc.save("rhythm-dictation-result.pdf");
    setStatus(t("結果PDFを出力しました。"), "correct");
  } catch (error) {
    console.error(error);
    setStatus(t("PDF作成中にエラーが発生しました。"), "incorrect");
  } finally {
    exportButton.disabled = false;
  }
}

init();

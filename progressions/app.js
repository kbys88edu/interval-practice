function t(text) {
  return window.EarTrainingLang?.translateText(text) || text;
}

const progressions = [
  // Major basic
  { id: "maj-151", tonality: "major", level: "basic", roman: "I - V - I", degrees: [1, 5, 1], qualities: ["M", "M", "M"], label: "tonic - dominant - tonic" },
  { id: "maj-141", tonality: "major", level: "basic", roman: "I - IV - I", degrees: [1, 4, 1], qualities: ["M", "M", "M"], label: "tonic - subdominant - tonic" },
  { id: "maj-1451", tonality: "major", level: "basic", roman: "I - IV - V - I", degrees: [1, 4, 5, 1], qualities: ["M", "M", "M", "M"], label: "basic authentic movement" },
  { id: "maj-1564", tonality: "major", level: "basic", roman: "I - V - vi - IV", degrees: [1, 5, 6, 4], qualities: ["M", "M", "m", "M"], label: "common pop progression" },
  { id: "maj-1645", tonality: "major", level: "basic", roman: "I - vi - IV - V", degrees: [1, 6, 4, 5], qualities: ["M", "m", "M", "M"], label: "common circle-like progression" },
  { id: "maj-251", tonality: "major", level: "cadence", roman: "ii - V - I", degrees: [2, 5, 1], qualities: ["m", "M", "M"], label: "predominant - dominant - tonic" },
  { id: "maj-46251", tonality: "major", level: "cadence", roman: "IV - ii - V - I", degrees: [4, 2, 5, 1], qualities: ["M", "m", "M", "M"], label: "expanded cadence" },
  { id: "maj-1764", tonality: "major", level: "all", roman: "I - vii° - I6", degrees: [1, 7, 1], qualities: ["M", "dim", "M"], inversion: ["root", "root", "first"], label: "leading-tone return" },

  // Minor
  { id: "min-151", tonality: "minor", level: "basic", roman: "i - V - i", degrees: [1, 5, 1], qualities: ["m", "M", "m"], label: "minor authentic movement" },
  { id: "min-141", tonality: "minor", level: "basic", roman: "i - iv - i", degrees: [1, 4, 1], qualities: ["m", "m", "m"], label: "minor subdominant return" },
  { id: "min-1451", tonality: "minor", level: "basic", roman: "i - iv - V - i", degrees: [1, 4, 5, 1], qualities: ["m", "m", "M", "m"], label: "minor cadence" },
  { id: "min-67-1", tonality: "minor", level: "basic", roman: "i - ♭VI - ♭VII - i", degrees: [1, 6, 7, 1], qualities: ["m", "M", "M", "m"], naturalMinor: true, label: "Aeolian color" },
  { id: "min-251", tonality: "minor", level: "cadence", roman: "ii° - V - i", degrees: [2, 5, 1], qualities: ["dim", "M", "m"], harmonicMinor: true, label: "minor predominant cadence" },
  { id: "min-4651", tonality: "minor", level: "cadence", roman: "iv - ♭VI - V - i", degrees: [4, 6, 5, 1], qualities: ["m", "M", "M", "m"], label: "minor expanded cadence" },
  { id: "min-picardy", tonality: "minor", level: "cadence", roman: "i - iv - V - I", degrees: [1, 4, 5, 1], qualities: ["m", "m", "M", "M"], label: "Picardy-type ending" }
];

const whiteMajorKeys = [48, 50, 52, 53, 55, 57]; // C D E F G A
const whiteMinorKeys = [45, 47, 48, 50, 52, 53, 55]; // A B C D E F G
const allMajorKeys = [48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 58, 59];
const allMinorKeys = [45, 46, 47, 48, 49, 50, 51, 52, 53, 54, 55, 56];

let keyRange = "white";
let currentQuestion = null;
let hasAnsweredCurrentQuestion = false;
let totalCount = 0;
let correctCount = 0;
let resultLog = [];
let questionStartTime = null;
let latestResponseTimeSec = null;
let sampler = null;
let synth = null;
let instrumentLoadPromise = null;

const choiceList = document.querySelector("#choice-list");
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

document.querySelectorAll("[data-keys]").forEach((button) => {
  button.addEventListener("click", () => {
    keyRange = button.dataset.keys;
    setStatus(keyRange === "all" ? "全調モードにしました。" : "白鍵の調だけにしました。");
  });
});

function init() {
  updateScore();
}

function getSelectedTonalities() {
  return Array.from(document.querySelectorAll('input[name="tonality"]:checked')).map((input) => input.value);
}

function getLevel() {
  return document.querySelector('input[name="level"]:checked').value;
}

function getTempo() {
  return Number(document.querySelector("#tempo-select").value) || 72;
}

function getPlayback() {
  return document.querySelector('input[name="playback"]:checked').value;
}

function getProgressionPool() {
  const tonalities = getSelectedTonalities();
  const level = getLevel();

  return progressions.filter((progression) => {
    if (!tonalities.includes(progression.tonality)) return false;
    if (level === "all") return true;
    if (level === "basic") return progression.level === "basic";
    if (level === "cadence") return progression.level === "cadence" || progression.level === "basic";
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
  const pool = getProgressionPool();

  if (pool.length < 3) {
    setStatus("3択を作るには候補が足りません。設定を増やしてください。", "incorrect");
    return;
  }

  clearFeedback();

  const correct = randomItem(pool);
  const sameTonalityPool = pool.filter((progression) => progression.tonality === correct.tonality && progression.id !== correct.id);
  const distractorPool = sameTonalityPool.length >= 2 ? sameTonalityPool : pool.filter((progression) => progression.id !== correct.id);
  const distractors = shuffle(distractorPool).slice(0, 2);
  const choices = shuffle([correct, ...distractors]);
  const rootMidi = chooseRoot(correct.tonality);

  currentQuestion = {
    number: totalCount + 1,
    correct,
    choices,
    rootMidi,
    tempo: getTempo(),
    playback: getPlayback()
  };

  hasAnsweredCurrentQuestion = false;
  questionStartTime = null;
  latestResponseTimeSec = null;
  currentTimeEl.textContent = "--";
  answerText.textContent = "";
  analysisText.textContent = "";
  notationEl.innerHTML = "";
  questionDisplay.textContent = correct.tonality === "major" ? "MAJOR" : "MINOR";

  renderChoices();
  setStatus("問題を作成しました。再生します。");
  playCurrentQuestion();
}

function chooseRoot(tonality) {
  if (keyRange === "all") {
    return randomItem(tonality === "major" ? allMajorKeys : allMinorKeys);
  }
  return randomItem(tonality === "major" ? whiteMajorKeys : whiteMinorKeys);
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
      <span class="choice-main">
        <span class="choice-roman">${choice.roman}</span>
        <span class="choice-meta">${choice.tonality === "major" ? "Major" : "Minor"} / ${choice.label}</span>
      </span>
    `;
    card.addEventListener("click", () => answer(choice.id));
    choiceList.appendChild(card);
  });
}

async function ensureAudio() {
  if (Tone.context.state !== "running") {
    await Tone.start();
  }

  if (!instrumentLoadPromise) {
    instrumentLoadPromise = createInstrument();
  }

  return instrumentLoadPromise;
}

async function createInstrument() {
  sampler = new Tone.Sampler({
    urls: {
      "A0": "A0.mp3", "C1": "C1.mp3", "D#1": "Ds1.mp3", "F#1": "Fs1.mp3",
      "A1": "A1.mp3", "C2": "C2.mp3", "D#2": "Ds2.mp3", "F#2": "Fs2.mp3",
      "A2": "A2.mp3", "C3": "C3.mp3", "D#3": "Ds3.mp3", "F#3": "Fs3.mp3",
      "A3": "A3.mp3", "C4": "C4.mp3", "D#4": "Ds4.mp3", "F#4": "Fs4.mp3",
      "A4": "A4.mp3", "C5": "C5.mp3", "D#5": "Ds5.mp3", "F#5": "Fs5.mp3",
      "A5": "A5.mp3", "C6": "C6.mp3", "D#6": "Ds6.mp3", "F#6": "Fs6.mp3",
      "A6": "A6.mp3", "C7": "C7.mp3", "D#7": "Ds7.mp3", "F#7": "Fs7.mp3",
      "A7": "A7.mp3", "C8": "C8.mp3"
    },
    release: 1.2,
    baseUrl: "https://tonejs.github.io/audio/salamander/"
  }).toDestination();
  sampler.volume.value = -8;

  synth = new Tone.PolySynth(Tone.Synth, {
    oscillator: { type: "triangle" },
    envelope: { attack: 0.01, decay: 0.08, sustain: 0.42, release: 0.45 }
  }).toDestination();
  synth.volume.value = -13;

  await Tone.loaded();
  return sampler;
}

async function playCurrentQuestion() {
  if (!currentQuestion) {
    setStatus("先に NEW を押してください。", "incorrect");
    return;
  }

  let instrument;
  try {
    instrument = await ensureAudio();
  } catch (error) {
    console.error(error);
    instrument = synth;
  }

  const now = Tone.now();
  const beatSec = 60 / currentQuestion.tempo;
  const progression = currentQuestion.correct;
  const chords = buildProgressionChords(currentQuestion.rootMidi, progression);

  if (!hasAnsweredCurrentQuestion) {
    questionStartTime = performance.now();
    latestResponseTimeSec = null;
    currentTimeEl.textContent = "0.0s";
  }

  chords.forEach((chord, index) => {
    const start = now + index * beatSec * 1.15;
    if (currentQuestion.playback === "arpeggio" || currentQuestion.playback === "both") {
      chord.forEach((midi, noteIndex) => {
        instrument.triggerAttackRelease(midiToToneNote(midi), "8n", start + noteIndex * 0.12);
      });
    }
    if (currentQuestion.playback === "block" || currentQuestion.playback === "both") {
      const blockStart = currentQuestion.playback === "both" ? start + 0.42 : start;
      instrument.triggerAttackRelease(chord.map(midiToToneNote), "2n", blockStart);
    }
  });

  setStatus(`${progression.tonality === "major" ? "長調" : "短調"} のコード進行です。ローマ数字を選んでください。`);
}

function buildProgressionChords(rootMidi, progression) {
  return progression.degrees.map((degree, index) => {
    const quality = progression.qualities[index];
    const inversion = progression.inversion?.[index] || "root";
    const chordRoot = rootMidi + degreeToSemitone(degree, progression.tonality, progression);
    return buildChord(chordRoot, quality, inversion);
  });
}

function degreeToSemitone(degree, tonality, progression) {
  const major = { 1: 0, 2: 2, 3: 4, 4: 5, 5: 7, 6: 9, 7: 11 };
  const naturalMinor = { 1: 0, 2: 2, 3: 3, 4: 5, 5: 7, 6: 8, 7: 10 };
  const harmonicMinor = { 1: 0, 2: 2, 3: 3, 4: 5, 5: 7, 6: 8, 7: 11 };

  if (tonality === "major") return major[degree];

  if (progression.harmonicMinor) return harmonicMinor[degree];
  return naturalMinor[degree];
}

function buildChord(root, quality, inversion) {
  const intervals = {
    M: [0, 4, 7],
    m: [0, 3, 7],
    dim: [0, 3, 6]
  }[quality];

  let notes = intervals.map((interval) => root + interval + 12); // keep chords in comfortable register

  if (inversion === "first") {
    notes = [notes[1], notes[2], notes[0] + 12];
  }

  return notes;
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
    `${isCorrect ? "正解" : "不正解"} / 正解：${currentQuestion.correct.roman} / 選択：${selected?.roman || "-"} / ${formatResponseTime(latestResponseTimeSec)}`,
    isCorrect ? "correct" : "incorrect"
  );

  resultLog.push({
    number: totalCount,
    tonality: currentQuestion.correct.tonality,
    roman: currentQuestion.correct.roman,
    selectedRoman: selected?.roman || "",
    label: currentQuestion.correct.label,
    rootNote: midiToToneNote(currentQuestion.rootMidi),
    isCorrect,
    responseTimeSec: latestResponseTimeSec,
    abc: buildAbc(currentQuestion)
  });

  updateScore();
  renderHistory();
}

function showAnswer() {
  if (!currentQuestion) {
    setStatus("先に NEW を押してください。", "incorrect");
    return;
  }

  answerText.textContent = `正解：${currentQuestion.correct.roman} / ${currentQuestion.correct.tonality === "major" ? "長調" : "短調"} / 主音 ${midiToToneNote(currentQuestion.rootMidi)}`;
  analysisText.textContent = `機能：${currentQuestion.correct.label}`;
  renderNotation();
}

function renderNotation() {
  if (!currentQuestion) return;

  const abc = buildAbc(currentQuestion);
  ABCJS.renderAbc("notation", abc, {
    responsive: "resize",
    staffwidth: 680,
    paddingtop: 0,
    paddingbottom: 0,
    paddingleft: 0,
    paddingright: 0
  });
}

function buildAbc(question) {
  const chords = buildProgressionChords(question.rootMidi, question.correct);
  const chordTokens = chords.map((chord) => `[${chord.map(midiToAbc).join("")}]2`);
  return `X:1
M:4/4
L:1/4
K:C
${chordTokens.join(" ")} |`;
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
      <span>${item.rootNote} / ${item.roman} / ${formatResponseTime(item.responseTimeSec)}</span>
      <span class="${item.isCorrect ? "ok" : "ng"}">${item.isCorrect ? "OK" : "NG"}</span>
    `;
    historyList.appendChild(row);
  });
}

function formatResponseTime(value) {
  return typeof value === "number" && Number.isFinite(value) ? `${value.toFixed(1)}s` : "-";
}

function midiToToneNote(midi) {
  const names = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
  const pc = ((midi % 12) + 12) % 12;
  const octave = Math.floor(midi / 12) - 1;
  return `${names[pc]}${octave}`;
}

function midiToAbc(midi) {
  const names = ["C", "^C", "D", "_E", "E", "F", "^F", "G", "^G", "A", "_B", "B"];
  const pc = ((midi % 12) + 12) % 12;
  const octave = Math.floor(midi / 12) - 1;
  let name = names[pc];

  if (octave === 4) return name;
  if (octave === 5) return name.toLowerCase();
  if (octave === 3) return name + ",";
  if (octave > 5) return name.toLowerCase() + "'".repeat(octave - 5);
  if (octave < 3) return name + ",".repeat(4 - octave);
  return name;
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
    doc.text("Chord Progression Practice Result", 16, 18);

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
      doc.text(`${String(item.number).padStart(2, "0")}  ${item.rootNote}  ${item.roman}`, 16, y);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.text(`Your answer: ${item.selectedRoman || "-"} / ${item.isCorrect ? "OK" : "NG"} / Time: ${formatResponseTime(item.responseTimeSec)}`, 16, y + 6);
      doc.text(`Function: ${item.label}`, 16, y + 12);
      y += 24;
    });

    doc.save("chord-progression-practice-result.pdf");
    setStatus("結果PDFを出力しました。", "correct");
  } catch (error) {
    console.error(error);
    setStatus("PDF作成中にエラーが発生しました。", "incorrect");
  } finally {
    exportButton.disabled = false;
  }
}

init();

const intervals = [
  { id: "m2", name: "短2度", semitones: 1 },
  { id: "M2", name: "長2度", semitones: 2 },
  { id: "m3", name: "短3度", semitones: 3 },
  { id: "M3", name: "長3度", semitones: 4 },
  { id: "P4", name: "完全4度", semitones: 5 },
  { id: "TT", name: "増4度 / 減5度", semitones: 6 },
  { id: "P5", name: "完全5度", semitones: 7 },
  { id: "m6", name: "短6度", semitones: 8 },
  { id: "M6", name: "長6度", semitones: 9 },
  { id: "m7", name: "短7度", semitones: 10 },
  { id: "M7", name: "長7度", semitones: 11 }
];

const presets = {
  beginner: ["M2", "m3", "M3", "P5"],
  intermediate: ["m2", "M2", "m3", "M3", "P4", "TT", "P5"],
  advanced: intervals.map((interval) => interval.id)
};

const baseMidiNotes = [60, 62, 64, 65, 67, 69];

let currentQuestion = null;
let hasAnsweredCurrentQuestion = false;
let totalCount = 0;
let correctCount = 0;
let currentInstrument = null;
let currentInstrumentName = null;
let instrumentLoadPromise = null;
let resultLog = [];
let questionStartTime = null;
let latestResponseTimeSec = null;

const intervalOptions = document.querySelector("#interval-options");
const answerButtons = document.querySelector("#answer-buttons");
const statusEl = document.querySelector("#status");
const answerText = document.querySelector("#answer-text");
const notationEl = document.querySelector("#notation");
const totalCountEl = document.querySelector("#total-count");
const correctCountEl = document.querySelector("#correct-count");
const scorePercentEl = document.querySelector("#score-percent");
const currentTimeEl = document.querySelector("#current-time");
const progressCountEl = document.querySelector("#progress-count");
const questionDisplay = document.querySelector("#question-display");
const bigNote = document.querySelector("#big-note");
const historyList = document.querySelector("#history-list");
const instrumentSelect = document.querySelector("#instrument-select");

document.querySelector("#new-question").addEventListener("click", newQuestion);
document.querySelector("#play-question").addEventListener("click", playCurrentQuestion);
document.querySelector("#show-answer").addEventListener("click", showAnswerAndNotation);
document.querySelector("#reset-score").addEventListener("click", resetScore);
document.querySelector("#export-pdf").addEventListener("click", exportResultsPdf);

instrumentSelect.addEventListener("change", () => {
  disposeCurrentInstrument();
  currentInstrumentName = null;
  instrumentLoadPromise = null;
  setStatus(`音色：${instrumentSelect.options[instrumentSelect.selectedIndex].text}`);
});

document.querySelectorAll("[data-preset]").forEach((button) => {
  button.addEventListener("click", () => applyPreset(button.dataset.preset));
});

function init() {
  renderIntervalOptions();
  renderAnswerButtons();
  applyPreset("beginner");
  updateScore();
}

function renderIntervalOptions() {
  intervalOptions.innerHTML = "";
  intervals.forEach((interval) => {
    const label = document.createElement("label");
    label.className = "interval-check";
    label.innerHTML = `<input type="checkbox" value="${interval.id}" /><span>${interval.name}</span>`;
    intervalOptions.appendChild(label);
  });
}

function renderAnswerButtons() {
  answerButtons.innerHTML = "";
  intervals.forEach((interval) => {
    const button = document.createElement("button");
    button.type = "button";
    button.dataset.answer = interval.id;
    button.textContent = interval.name;
    button.addEventListener("click", () => answer(interval.id));
    answerButtons.appendChild(button);
  });
}

function applyPreset(name) {
  const selected = presets[name] || [];
  document.querySelectorAll("#interval-options input").forEach((input) => {
    input.checked = selected.includes(input.value);
  });
  setStatus("プリセットを選択しました。NEW を押してください。");
}

function getSelectedIntervals() {
  const selectedIds = Array.from(document.querySelectorAll("#interval-options input:checked"))
    .map((input) => input.value);
  return intervals.filter((interval) => selectedIds.includes(interval.id));
}

function getMode() {
  return document.querySelector('input[name="mode"]:checked').value;
}

function randomItem(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function newQuestion() {
  const selectedIntervals = getSelectedIntervals();

  if (selectedIntervals.length === 0) {
    setStatus("出題範囲を1つ以上選択してください。", "incorrect");
    return;
  }

  clearFeedback();

  const interval = randomItem(selectedIntervals);
  const lowerMidi = randomItem(baseMidiNotes);
  const upperMidi = lowerMidi + interval.semitones;

  currentQuestion = {
    number: totalCount + 1,
    interval,
    mode: getMode(),
    lowerMidi,
    upperMidi
  };

  hasAnsweredCurrentQuestion = false;
  answerText.textContent = "";
  notationEl.innerHTML = "";
  questionStartTime = null;
  latestResponseTimeSec = null;
  currentTimeEl.textContent = "--";

  // 問題ごとにタイポグラフィが変化すると、視覚情報から推測できるため固定します。
  questionDisplay.textContent = "LISTEN";
  bigNote.textContent = "C";
  setStatus("問題を作成しました。再生します。");
  playCurrentQuestion();
}

async function ensureAudio() {
  if (Tone.context.state !== "running") {
    await Tone.start();
  }

  const selectedInstrumentName = instrumentSelect.value;

  if (currentInstrument && currentInstrumentName === selectedInstrumentName) {
    return currentInstrument;
  }

  if (!instrumentLoadPromise || currentInstrumentName !== selectedInstrumentName) {
    currentInstrumentName = selectedInstrumentName;
    instrumentLoadPromise = createInstrument(selectedInstrumentName);
  }

  currentInstrument = await instrumentLoadPromise;
  return currentInstrument;
}

async function createInstrument(name) {
  disposeCurrentInstrument();

  if (name === "realPiano") {
    setStatus("リアルピアノを読み込み中です。初回のみ時間がかかります。");

    const sampler = new Tone.Sampler({
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
      release: 1.4,
      baseUrl: "https://tonejs.github.io/audio/salamander/"
    }).toDestination();

    sampler.volume.value = -6;
    await Tone.loaded();
    setStatus("リアルピアノの読み込みが完了しました。");
    return sampler;
  }

  if (name === "softPiano") {
    const synth = new Tone.PolySynth(Tone.Synth, {
      oscillator: { type: "triangle" },
      envelope: { attack: 0.015, decay: 0.18, sustain: 0.22, release: 0.9 }
    }).toDestination();
    synth.volume.value = -9;
    return synth;
  }

  if (name === "clearSine") {
    const synth = new Tone.PolySynth(Tone.Synth, {
      oscillator: { type: "sine" },
      envelope: { attack: 0.01, decay: 0.08, sustain: 0.5, release: 0.45 }
    }).toDestination();
    synth.volume.value = -8;
    return synth;
  }

  if (name === "warmSynth") {
    const synth = new Tone.PolySynth(Tone.Synth, {
      oscillator: { type: "sawtooth" },
      envelope: { attack: 0.04, decay: 0.18, sustain: 0.35, release: 0.7 }
    });
    const filter = new Tone.Filter(1200, "lowpass");
    synth.connect(filter);
    filter.toDestination();
    synth.volume.value = -16;
    return synth;
  }

  if (name === "organ") {
    const synth = new Tone.PolySynth(Tone.Synth, {
      oscillator: { type: "square" },
      envelope: { attack: 0.01, decay: 0.02, sustain: 0.85, release: 0.25 }
    });
    const filter = new Tone.Filter(1800, "lowpass");
    synth.connect(filter);
    filter.toDestination();
    synth.volume.value = -18;
    return synth;
  }

  if (name === "pluck") {
    const synth = new Tone.PolySynth(Tone.Synth, {
      oscillator: { type: "triangle" },
      envelope: { attack: 0.005, decay: 0.12, sustain: 0.05, release: 0.35 }
    }).toDestination();
    synth.volume.value = -8;
    return synth;
  }

  return createInstrument("softPiano");
}

function disposeCurrentInstrument() {
  if (currentInstrument) {
    try {
      currentInstrument.releaseAll?.();
      currentInstrument.dispose?.();
    } catch (error) {
      console.warn(error);
    }
  }
  currentInstrument = null;
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
    setStatus("リアルピアノの読み込みに失敗しました。内蔵音色を選んでください。", "incorrect");
    return;
  }

  const lower = midiToToneNote(currentQuestion.lowerMidi);
  const upper = midiToToneNote(currentQuestion.upperMidi);
  const now = Tone.now();

  // 回答時間は、問題音の再生開始時から最初の回答までを計測します。
  if (!hasAnsweredCurrentQuestion) {
    questionStartTime = performance.now();
    latestResponseTimeSec = null;
    currentTimeEl.textContent = "0.0s";
  }

  if (currentQuestion.mode === "ascending") {
    instrument.triggerAttackRelease(lower, "4n", now);
    instrument.triggerAttackRelease(upper, "4n", now + 0.75);
  }

  if (currentQuestion.mode === "descending") {
    instrument.triggerAttackRelease(upper, "4n", now);
    instrument.triggerAttackRelease(lower, "4n", now + 0.75);
  }

  if (currentQuestion.mode === "harmonic") {
    instrument.triggerAttackRelease([lower, upper], "2n", now);
  }

  setStatus("再生しました。答えを選んでください。");
}

function answer(intervalId) {
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

  const isCorrect = intervalId === currentQuestion.interval.id;
  const selectedInterval = intervals.find((interval) => interval.id === intervalId);

  const timeText = latestResponseTimeSec !== null ? ` / ${latestResponseTimeSec.toFixed(1)}秒` : "";

  if (isCorrect) {
    correctCount += 1;
    setStatus(`正解：${currentQuestion.interval.name}${timeText}`, "correct");
  } else {
    setStatus(`不正解：選択 ${selectedInterval?.name || ""} / 正解 ${currentQuestion.interval.name}${timeText}`, "incorrect");
  }

  currentTimeEl.textContent = latestResponseTimeSec !== null ? `${latestResponseTimeSec.toFixed(1)}s` : "--";

  resultLog.push({
    number: totalCount,
    mode: currentQuestion.mode,
    modeLabel: getModeLabel(currentQuestion.mode),
    lowerMidi: currentQuestion.lowerMidi,
    upperMidi: currentQuestion.upperMidi,
    intervalName: currentQuestion.interval.name,
    selectedName: selectedInterval?.name || "",
    isCorrect,
    responseTimeSec: latestResponseTimeSec,
    lowerNote: midiToToneNote(currentQuestion.lowerMidi),
    upperNote: midiToToneNote(currentQuestion.upperMidi)
  });

  markAnswerButtons(intervalId, isCorrect);
  updateScore();
  renderHistory();
}

function markAnswerButtons(selectedId, isCorrect) {
  document.querySelectorAll("#answer-buttons button").forEach((button) => {
    button.classList.remove("selected-correct", "selected-incorrect");

    if (button.dataset.answer === currentQuestion.interval.id) {
      button.classList.add("selected-correct");
    }

    if (!isCorrect && button.dataset.answer === selectedId) {
      button.classList.add("selected-incorrect");
    }
  });
}

function clearFeedback() {
  statusEl.className = "status";
  document.querySelectorAll("#answer-buttons button").forEach((button) => {
    button.classList.remove("selected-correct", "selected-incorrect");
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

function showAnswerAndNotation() {
  if (!currentQuestion) {
    setStatus("先に NEW を押してください。", "incorrect");
    return;
  }

  const modeLabel = getModeLabel(currentQuestion.mode);
  const lowerName = midiToToneNote(currentQuestion.lowerMidi);
  const upperName = midiToToneNote(currentQuestion.upperMidi);

  answerText.textContent = `正解：${currentQuestion.interval.name} / ${modeLabel} / ${lowerName} – ${upperName}`;

  const abc = buildAbcNotation(currentQuestion);
  ABCJS.renderAbc("notation", abc, {
    responsive: "resize",
    staffwidth: 520,
    paddingtop: 0,
    paddingbottom: 0,
    paddingleft: 0,
    paddingright: 0
  });
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
      <span>${item.modeLabel} / ${item.intervalName} / ${formatResponseTime(item.responseTimeSec)}</span>
      <span class="${item.isCorrect ? "ok" : "ng"}">${item.isCorrect ? "OK" : "NG"}</span>
    `;
    historyList.appendChild(row);
  });
}

function formatResponseTime(value) {
  return typeof value === "number" && Number.isFinite(value) ? `${value.toFixed(1)}s` : "-";
}

function buildAbcNotation(question) {
  const lower = midiToAbc(question.lowerMidi);
  const upper = midiToAbc(question.upperMidi);

  let body = "";
  if (question.mode === "ascending") body = `${lower} ${upper} |`;
  if (question.mode === "descending") body = `${upper} ${lower} |`;
  if (question.mode === "harmonic") body = `[${lower}${upper}]2 |`;

  return `X:1
M:4/4
L:1/4
K:C
${body}`;
}

function getModeLabel(mode) {
  return {
    ascending: "旋律音程・上行",
    descending: "旋律音程・下行",
    harmonic: "和声音程・同時"
  }[mode];
}

function getModeShortLabel(mode) {
  return {
    ascending: "A / UP",
    descending: "B / DOWN",
    harmonic: "D / HARM."
  }[mode];
}

function midiToToneNote(midi) {
  const names = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
  const pc = ((midi % 12) + 12) % 12;
  const octave = Math.floor(midi / 12) - 1;
  return `${names[pc]}${octave}`;
}

function midiToAbc(midi) {
  const names = ["C", "_D", "D", "_E", "E", "F", "^F", "G", "_A", "A", "_B", "B"];
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

// PDF出力。
// 画面の楽譜と同じ abcjs SVG を生成し、それをPNG画像化してPDFに貼ります。
// これにより、PDF内の五線譜・音符の位置が崩れにくくなります。
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
  setStatus("PDFを作成中です。楽譜画像を生成しています。");

  try {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });

    const rate = totalCount === 0 ? 0 : Math.round((correctCount / totalCount) * 100);
    const date = new Date().toLocaleString();

    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.text("Interval Practice Result", 16, 18);

    doc.setDrawColor(40);
    doc.setLineWidth(1.4);
    doc.line(16, 23, 194, 23);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text(`Date: ${date}`, 16, 32);
    const answeredWithTime = resultLog.filter(item => item.responseTimeSec !== null);
    const avgTime = answeredWithTime.length
      ? answeredWithTime.reduce((sum, item) => sum + item.responseTimeSec, 0) / answeredWithTime.length
      : null;

    doc.text(`Questions: ${totalCount}`, 16, 39);
    doc.text(`Correct: ${correctCount}`, 58, 39);
    doc.text(`Accuracy: ${rate}%`, 96, 39);
    doc.text(`Avg. time: ${avgTime !== null ? avgTime.toFixed(1) + "s" : "-"}`, 138, 39);

    let y = 52;

    for (const item of resultLog) {
      if (y > 248) {
        doc.addPage();
        y = 18;
      }

      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.text(
        `${String(item.number).padStart(2, "0")}  ${modeToPdfLabel(item.mode)}  ${item.lowerNote} - ${item.upperNote}`,
        16,
        y
      );

      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.text(
        `Correct interval: ${intervalToPdfLabel(item.intervalName)} / Your answer: ${intervalToPdfLabel(item.selectedName)} / ${item.isCorrect ? "OK" : "NG"} / Time: ${formatResponseTime(item.responseTimeSec)}`,
        16,
        y + 6
      );

      const abc = buildAbcNotation({
        mode: item.mode,
        lowerMidi: item.lowerMidi,
        upperMidi: item.upperMidi
      });

      const notationImage = await renderAbcToPngDataUrl(abc);
      const imageWidthMm = 92;
      const imageHeightMm = imageWidthMm * (notationImage.height / notationImage.width);

      if (y + 12 + imageHeightMm > 282) {
        doc.addPage();
        y = 18;
      }

      doc.addImage(notationImage.dataUrl, "PNG", 16, y + 10, imageWidthMm, imageHeightMm);

      y += 18 + imageHeightMm;
    }

    doc.save("interval-practice-result.pdf");
    setStatus("結果PDFを出力しました。", "correct");
  } catch (error) {
    console.error(error);
    setStatus("PDF作成中にエラーが発生しました。", "incorrect");
  } finally {
    exportButton.disabled = false;
  }
}

function modeToPdfLabel(mode) {
  return {
    ascending: "Mode A: ascending melodic",
    descending: "Mode B: descending melodic",
    harmonic: "Mode D: harmonic"
  }[mode] || mode;
}

function intervalToPdfLabel(name) {
  const map = {
    "短2度": "minor 2nd",
    "長2度": "major 2nd",
    "短3度": "minor 3rd",
    "長3度": "major 3rd",
    "完全4度": "perfect 4th",
    "増4度 / 減5度": "tritone",
    "完全5度": "perfect 5th",
    "短6度": "minor 6th",
    "長6度": "major 6th",
    "短7度": "minor 7th",
    "長7度": "major 7th"
  };
  return map[name] || name || "-";
}

async function renderAbcToPngDataUrl(abc) {
  const host = document.createElement("div");
  host.style.position = "fixed";
  host.style.left = "-10000px";
  host.style.top = "0";
  host.style.width = "720px";
  host.style.background = "white";
  document.body.appendChild(host);

  ABCJS.renderAbc(host, abc, {
    responsive: "resize",
    staffwidth: 620,
    paddingtop: 0,
    paddingbottom: 0,
    paddingleft: 0,
    paddingright: 0
  });

  const svg = host.querySelector("svg");
  if (!svg) {
    document.body.removeChild(host);
    throw new Error("abcjs SVG was not generated.");
  }

  svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");

  const svgText = new XMLSerializer().serializeToString(svg);
  const pngImage = await svgTextToPngDataUrl(svgText, 2.2);

  document.body.removeChild(host);
  return pngImage;
}

function svgTextToPngDataUrl(svgText, scale = 2) {
  return new Promise((resolve, reject) => {
    const svgBlob = new Blob([svgText], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(svgBlob);
    const image = new Image();

    image.onload = () => {
      try {
        const canvas = document.createElement("canvas");
        canvas.width = Math.ceil(image.width * scale);
        canvas.height = Math.ceil(image.height * scale);

        const context = canvas.getContext("2d");
        context.fillStyle = "#ffffff";
        context.fillRect(0, 0, canvas.width, canvas.height);
        context.setTransform(scale, 0, 0, scale, 0, 0);
        context.drawImage(image, 0, 0);

        URL.revokeObjectURL(url);
        resolve({
          dataUrl: canvas.toDataURL("image/png"),
          width: canvas.width,
          height: canvas.height
        });
      } catch (error) {
        URL.revokeObjectURL(url);
        reject(error);
      }
    };

    image.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("SVG to PNG conversion failed."));
    };

    image.src = url;
  });
}

init();

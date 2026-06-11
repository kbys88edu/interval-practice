
function t(text) {
  return window.EarTrainingLang?.translateText(text) || text;
}

const scales = [
  {
    id: "natural",
    name: "自然短音階",
    pdfName: "natural minor",
    intervals: [0, 2, 3, 5, 7, 8, 10, 12],
    hint: "第6音・第7音が低い短音階。"
  },
  {
    id: "harmonic",
    name: "和声短音階",
    pdfName: "harmonic minor",
    intervals: [0, 2, 3, 5, 7, 8, 11, 12],
    hint: "第7音が上がる。第6音と第7音の間に増2度がある。"
  },
  {
    id: "melodic",
    name: "旋律短音階",
    pdfName: "melodic minor",
    intervals: [0, 2, 3, 5, 7, 9, 11, 12],
    descendingIntervals: [12, 10, 8, 7, 5, 3, 2, 0],
    hint: "上行で第6音・第7音が上がる。クラシック式の下行は自然短音階。"
  }
];

const whiteKeyTonics = [57, 59, 60, 62, 64, 65, 67]; // A3 B3 C4 D4 E4 F4 G4
const allTonics = [57, 58, 59, 60, 61, 62, 63, 64, 65, 66, 67, 68];

let tonicPool = whiteKeyTonics.slice();

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

const scaleOptions = document.querySelector("#scale-options");
const answerButtons = document.querySelector("#answer-buttons");
const statusEl = document.querySelector("#status");
const answerText = document.querySelector("#answer-text");
const notationEl = document.querySelector("#notation");
const totalCountEl = document.querySelector("#total-count");
const correctCountEl = document.querySelector("#correct-count");
const scorePercentEl = document.querySelector("#score-percent");
const currentTimeEl = document.querySelector("#current-time");
const progressCountEl = document.querySelector("#progress-count");
const historyList = document.querySelector("#history-list");
const instrumentSelect = document.querySelector("#instrument-select");
const selectAllScalesButton = document.querySelector("#select-all-scales");
const clearAllScalesButton = document.querySelector("#clear-all-scales");

document.querySelector("#new-question").addEventListener("click", newQuestion);
document.querySelector("#play-question").addEventListener("click", playCurrentQuestion);
document.querySelector("#show-answer").addEventListener("click", showAnswerAndNotation);
document.querySelector("#reset-score").addEventListener("click", resetScore);
document.querySelector("#export-pdf").addEventListener("click", exportResultsPdf);

selectAllScalesButton.addEventListener("click", () => setAllScaleSelections(true));
clearAllScalesButton.addEventListener("click", () => setAllScaleSelections(false));

document.querySelectorAll("[data-tonics]").forEach((button) => {
  button.addEventListener("click", () => {
    tonicPool = button.dataset.tonics === "all" ? allTonics.slice() : whiteKeyTonics.slice();
    setStatus(button.dataset.tonics === "all" ? "全調モードにしました。" : "白鍵の主音だけにしました。");
  });
});

instrumentSelect.addEventListener("change", () => {
  disposeCurrentInstrument();
  currentInstrumentName = null;
  instrumentLoadPromise = null;
  setStatus(`音色：${instrumentSelect.options[instrumentSelect.selectedIndex].text}`);
});

function init() {
  renderScaleOptions();
  renderAnswerButtons();
  setAllScaleSelections(true);
  updateScore();
}

function renderScaleOptions() {
  scaleOptions.innerHTML = "";
  scales.forEach((scale) => {
    const label = document.createElement("label");
    label.className = "choice-check";
    label.innerHTML = `<input type="checkbox" value="${scale.id}" checked /><span>${scale.name}</span>`;
    scaleOptions.appendChild(label);
  });
}

function renderAnswerButtons() {
  answerButtons.innerHTML = "";
  scales.forEach((scale) => {
    const button = document.createElement("button");
    button.type = "button";
    button.dataset.answer = scale.id;
    button.textContent = scale.name;
    button.addEventListener("click", () => answer(scale.id));
    answerButtons.appendChild(button);
  });
}

function setAllScaleSelections(checked) {
  document.querySelectorAll("#scale-options input").forEach((input) => {
    input.checked = checked;
  });
  setStatus(checked ? "短音階の種類をすべて選択しました。" : "短音階の種類をすべて外しました。");
}

function getSelectedScales() {
  const selectedIds = Array.from(document.querySelectorAll("#scale-options input:checked"))
    .map((input) => input.value);
  return scales.filter((scale) => selectedIds.includes(scale.id));
}

function getMode() {
  return document.querySelector('input[name="mode"]:checked').value;
}

function randomItem(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function newQuestion() {
  const selectedScales = getSelectedScales();

  if (selectedScales.length === 0) {
    setStatus(t("出題範囲を1つ以上選択してください。"), "incorrect");
    return;
  }

  clearFeedback();

  const scale = randomItem(selectedScales);
  const tonicMidi = randomItem(tonicPool);
  const mode = getMode();
  const midiNotes = buildScaleNotes(tonicMidi, scale, mode);

  currentQuestion = {
    number: totalCount + 1,
    scale,
    mode,
    tonicMidi,
    midiNotes
  };

  hasAnsweredCurrentQuestion = false;
  answerText.textContent = "";
  notationEl.innerHTML = "";
  questionStartTime = null;
  latestResponseTimeSec = null;
  currentTimeEl.textContent = "--";

  setStatus(t("問題を作成しました。再生します。"));
  playCurrentQuestion();
}

function buildScaleNotes(tonicMidi, scale, mode) {
  if (mode === "descending") {
    const descending = scale.id === "melodic"
      ? scale.descendingIntervals
      : scale.intervals.slice().reverse();
    return descending.map((interval) => tonicMidi + interval);
  }

  if (mode === "upDown") {
    const up = scale.intervals.map((interval) => tonicMidi + interval);
    const downIntervals = scale.id === "melodic"
      ? scale.descendingIntervals.slice(1)
      : scale.intervals.slice(0, -1).reverse();
    const down = downIntervals.map((interval) => tonicMidi + interval);
    return up.concat(down);
  }

  return scale.intervals.map((interval) => tonicMidi + interval);
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
    setStatus(t("リアルピアノを読み込み中です。初回のみ時間がかかります。"));

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
      release: 1.2,
      baseUrl: "https://tonejs.github.io/audio/salamander/"
    }).toDestination();

    sampler.volume.value = -8;
    await Tone.loaded();
    setStatus(t("リアルピアノの読み込みが完了しました。"));
    return sampler;
  }

  if (name === "softPiano") {
    const synth = new Tone.PolySynth(Tone.Synth, {
      oscillator: { type: "triangle" },
      envelope: { attack: 0.015, decay: 0.18, sustain: 0.22, release: 0.65 }
    }).toDestination();
    synth.volume.value = -11;
    return synth;
  }

  if (name === "clearSine") {
    const synth = new Tone.PolySynth(Tone.Synth, {
      oscillator: { type: "sine" },
      envelope: { attack: 0.01, decay: 0.08, sustain: 0.5, release: 0.35 }
    }).toDestination();
    synth.volume.value = -9;
    return synth;
  }

  if (name === "warmSynth") {
    const synth = new Tone.PolySynth(Tone.Synth, {
      oscillator: { type: "sawtooth" },
      envelope: { attack: 0.04, decay: 0.18, sustain: 0.35, release: 0.55 }
    });
    const filter = new Tone.Filter(1200, "lowpass");
    synth.connect(filter);
    filter.toDestination();
    synth.volume.value = -20;
    return synth;
  }

  if (name === "organ") {
    const synth = new Tone.PolySynth(Tone.Synth, {
      oscillator: { type: "square" },
      envelope: { attack: 0.01, decay: 0.02, sustain: 0.85, release: 0.2 }
    });
    const filter = new Tone.Filter(1800, "lowpass");
    synth.connect(filter);
    filter.toDestination();
    synth.volume.value = -22;
    return synth;
  }

  if (name === "pluck") {
    const synth = new Tone.PolySynth(Tone.Synth, {
      oscillator: { type: "triangle" },
      envelope: { attack: 0.005, decay: 0.12, sustain: 0.05, release: 0.25 }
    }).toDestination();
    synth.volume.value = -10;
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
    setStatus(t("先に NEW を押してください。"), "incorrect");
    return;
  }

  let instrument;
  try {
    instrument = await ensureAudio();
  } catch (error) {
    console.error(error);
    setStatus(t("リアルピアノの読み込みに失敗しました。内蔵音色を選んでください。"), "incorrect");
    return;
  }

  const notes = currentQuestion.midiNotes.map(midiToToneNote);
  const now = Tone.now();

  if (!hasAnsweredCurrentQuestion) {
    questionStartTime = performance.now();
    latestResponseTimeSec = null;
    currentTimeEl.textContent = "0.0s";
  }

  notes.forEach((note, index) => {
    instrument.triggerAttackRelease(note, "8n", now + index * 0.26);
  });

  setStatus(t("再生しました。答えを選んでください。"));
}

function answer(scaleId) {
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

  const isCorrect = scaleId === currentQuestion.scale.id;
  const selectedScale = scales.find((scale) => scale.id === scaleId);
  const timeText = latestResponseTimeSec !== null ? ` / ${latestResponseTimeSec.toFixed(1)}秒` : "";

  if (isCorrect) {
    correctCount += 1;
    setStatus(`正解：${currentQuestion.scale.name}${timeText}`, "correct");
  } else {
    setStatus(`不正解：選択 ${selectedScale?.name || ""} / 正解 ${currentQuestion.scale.name}${timeText}`, "incorrect");
  }

  currentTimeEl.textContent = latestResponseTimeSec !== null ? `${latestResponseTimeSec.toFixed(1)}s` : "--";

  resultLog.push({
    number: totalCount,
    mode: currentQuestion.mode,
    modeLabel: getModeLabel(currentQuestion.mode),
    tonicMidi: currentQuestion.tonicMidi,
    tonicNote: midiToToneNote(currentQuestion.tonicMidi),
    scaleName: currentQuestion.scale.name,
    scalePdfName: currentQuestion.scale.pdfName,
    selectedName: selectedScale?.name || "",
    selectedPdfName: selectedScale?.pdfName || "",
    hint: currentQuestion.scale.hint,
    isCorrect,
    responseTimeSec: latestResponseTimeSec,
    midiNotes: currentQuestion.midiNotes,
    notes: currentQuestion.midiNotes.map(midiToToneNote)
  });

  markAnswerButtons(scaleId, isCorrect);
  updateScore();
  renderHistory();
}

function markAnswerButtons(selectedId, isCorrect) {
  document.querySelectorAll("#answer-buttons button").forEach((button) => {
    button.classList.remove("selected-correct", "selected-incorrect");

    if (button.dataset.answer === currentQuestion.scale.id) {
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
  setStatus(t("スコアと履歴をリセットしました。"));
}

function showAnswerAndNotation() {
  if (!currentQuestion) {
    setStatus(t("先に NEW を押してください。"), "incorrect");
    return;
  }

  const modeLabel = getModeLabel(currentQuestion.mode);
  const tonicName = midiToToneNote(currentQuestion.tonicMidi);
  const noteNames = currentQuestion.midiNotes.map(midiToToneNote).join(" - ");

  answerText.textContent = `正解：${tonicName} ${currentQuestion.scale.name} / ${modeLabel} / ${noteNames}`;

  const abc = buildAbcNotation(currentQuestion);
  ABCJS.renderAbc("notation", abc, {
    responsive: "resize",
    staffwidth: 620,
    paddingtop: 0,
    paddingbottom: 0,
    paddingleft: 0,
    paddingright: 0
  });
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
      <span>${item.modeLabel} / ${item.scaleName} / ${formatResponseTime(item.responseTimeSec)}</span>
      <span class="${item.isCorrect ? "ok" : "ng"}">${item.isCorrect ? "OK" : "NG"}</span>
    `;
    historyList.appendChild(row);
  });
}

function formatResponseTime(value) {
  return typeof value === "number" && Number.isFinite(value) ? `${value.toFixed(1)}s` : "-";
}

function buildAbcNotation(question) {
  const notes = question.midiNotes.map(midiToAbc);
  return `X:1
M:4/4
L:1/8
K:C
${notes.join(" ")} |`;
}

function getModeLabel(mode) {
  return {
    ascending: "上行",
    descending: "下行",
    upDown: "往復"
  }[mode];
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
    setStatus(t("PDFライブラリを読み込めませんでした。インターネット接続を確認してください。"), "incorrect");
    return;
  }

  if (resultLog.length === 0) {
    setStatus(t("PDFに出力する解答履歴がありません。"), "incorrect");
    return;
  }

  const exportButton = document.querySelector("#export-pdf");
  exportButton.disabled = true;
  setStatus(t("PDFを作成中です。楽譜画像を生成しています。"));

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
    doc.text("Minor Scale Practice Result", 16, 18);

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

    for (const item of resultLog) {
      if (y > 248) {
        doc.addPage();
        y = 18;
      }

      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.text(
        `${String(item.number).padStart(2, "0")}  ${modeToPdfLabel(item.mode)}  Tonic: ${item.tonicNote}`,
        16,
        y
      );

      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.text(
        `Correct scale: ${item.scalePdfName} / Your answer: ${item.selectedPdfName || "-"} / ${item.isCorrect ? "OK" : "NG"} / Time: ${formatResponseTime(item.responseTimeSec)}`,
        16,
        y + 6
      );

      doc.text(`Hint: ${hintToPdf(item.hint)}`, 16, y + 12);

      const abc = buildAbcNotation({
        mode: item.mode,
        midiNotes: item.midiNotes
      });

      const notationImage = await renderAbcToPngDataUrl(abc);
      const imageWidthMm = 112;
      const imageHeightMm = imageWidthMm * (notationImage.height / notationImage.width);

      if (y + 20 + imageHeightMm > 282) {
        doc.addPage();
        y = 18;
      }

      doc.addImage(notationImage.dataUrl, "PNG", 16, y + 16, imageWidthMm, imageHeightMm);
      y += 26 + imageHeightMm;
    }

    doc.save("minor-scale-practice-result.pdf");
    setStatus(t("結果PDFを出力しました。"), "correct");
  } catch (error) {
    console.error(error);
    setStatus(t("PDF作成中にエラーが発生しました。"), "incorrect");
  } finally {
    exportButton.disabled = false;
  }
}

function modeToPdfLabel(mode) {
  return {
    ascending: "Ascending",
    descending: "Descending",
    upDown: "Up and down"
  }[mode] || mode;
}

function hintToPdf(hint) {
  const map = {
    "第6音・第7音が低い短音階。": "Lowered 6th and 7th.",
    "第7音が上がる。第6音と第7音の間に増2度がある。": "Raised 7th; augmented 2nd between 6th and 7th.",
    "上行で第6音・第7音が上がる。クラシック式の下行は自然短音階。": "Raised 6th and 7th ascending; classical descending form returns to natural minor."
  };
  return map[hint] || hint || "-";
}

async function renderAbcToPngDataUrl(abc) {
  const host = document.createElement("div");
  host.style.position = "fixed";
  host.style.left = "-10000px";
  host.style.top = "0";
  host.style.width = "820px";
  host.style.background = "white";
  document.body.appendChild(host);

  ABCJS.renderAbc(host, abc, {
    responsive: "resize",
    staffwidth: 760,
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

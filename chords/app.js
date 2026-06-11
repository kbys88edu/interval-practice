const chords = [
  { id: "maj", name: "長三和音", symbol: "maj", intervals: [0, 4, 7], inversionHint: "root + major 3rd + perfect 5th" },
  { id: "min", name: "短三和音", symbol: "min", intervals: [0, 3, 7], inversionHint: "root + minor 3rd + perfect 5th" },
  { id: "dim", name: "減三和音", symbol: "dim", intervals: [0, 3, 6], inversionHint: "minor 3rd + tritone" },
  { id: "aug", name: "増三和音", symbol: "aug", intervals: [0, 4, 8], inversionHint: "major 3rd + augmented 5th" },

  { id: "maj7", name: "長七の和音", symbol: "maj7", intervals: [0, 4, 7, 11], inversionHint: "major triad + major 7th" },
  { id: "7", name: "属七の和音", symbol: "7", intervals: [0, 4, 7, 10], inversionHint: "major triad + minor 7th" },
  { id: "min7", name: "短七の和音", symbol: "min7", intervals: [0, 3, 7, 10], inversionHint: "minor triad + minor 7th" },
  { id: "mMaj7", name: "短三長七", symbol: "mMaj7", intervals: [0, 3, 7, 11], inversionHint: "minor triad + major 7th" },
  { id: "m7b5", name: "半減七", symbol: "m7♭5", intervals: [0, 3, 6, 10], inversionHint: "diminished triad + minor 7th" },
  { id: "dim7", name: "減七の和音", symbol: "dim7", intervals: [0, 3, 6, 9], inversionHint: "stacked minor thirds" },

  { id: "sus4", name: "sus4", symbol: "sus4", intervals: [0, 5, 7], inversionHint: "4th instead of 3rd" },
  { id: "sus2", name: "sus2", symbol: "sus2", intervals: [0, 2, 7], inversionHint: "2nd instead of 3rd" },
  { id: "add9", name: "add9", symbol: "add9", intervals: [0, 4, 7, 14], inversionHint: "major triad + 9th" },
  { id: "minAdd9", name: "m(add9)", symbol: "m(add9)", intervals: [0, 3, 7, 14], inversionHint: "minor triad + 9th" }
];

const presets = {
  triads: ["maj", "min", "dim", "aug"],
  sevenths: ["maj7", "7", "min7", "m7b5", "dim7"],
  advanced: chords.map((chord) => chord.id)
};

// C3からA4までを候補にし、転回形を含む和音の最高音がA5を超えない範囲で出題します。
const MAX_TREBLE_MIDI = 81; // A5
const rootMidiNotes = [48, 50, 52, 53, 55, 57, 59, 60, 62, 64, 65, 67, 69];

const inversionLabels = {
  0: "根音位置",
  1: "第1転回",
  2: "第2転回",
  3: "第3転回"
};

const inversionPdfLabels = {
  0: "root position",
  1: "first inversion",
  2: "second inversion",
  3: "third inversion"
};

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

const chordOptions = document.querySelector("#chord-options");
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
const selectAllChordsButton = document.querySelector("#select-all-chords");
const clearAllChordsButton = document.querySelector("#clear-all-chords");

document.querySelector("#new-question").addEventListener("click", newQuestion);
document.querySelector("#play-question").addEventListener("click", playCurrentQuestion);
document.querySelector("#show-answer").addEventListener("click", showAnswerAndNotation);
document.querySelector("#reset-score").addEventListener("click", resetScore);
document.querySelector("#export-pdf").addEventListener("click", exportResultsPdf);

selectAllChordsButton.addEventListener("click", () => setAllChordSelections(true));
clearAllChordsButton.addEventListener("click", () => setAllChordSelections(false));

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
  renderChordOptions();
  renderAnswerButtons();
  applyPreset("triads");
  updateScore();
}

function renderChordOptions() {
  chordOptions.innerHTML = "";
  chords.forEach((chord) => {
    const label = document.createElement("label");
    label.className = "choice-check";
    label.innerHTML = `<input type="checkbox" value="${chord.id}" /><span>${chord.name}</span>`;
    chordOptions.appendChild(label);
  });
}

function renderAnswerButtons() {
  answerButtons.innerHTML = "";
  chords.forEach((chord) => {
    const button = document.createElement("button");
    button.type = "button";
    button.dataset.answer = chord.id;
    button.textContent = chord.name;
    button.addEventListener("click", () => answer(chord.id));
    answerButtons.appendChild(button);
  });
}

function setAllChordSelections(checked) {
  document.querySelectorAll("#chord-options input").forEach((input) => {
    input.checked = checked;
  });
  setStatus(checked ? "和音の種類をすべて選択しました。" : "和音の種類をすべて外しました。");
}

function getSelectedInversions() {
  return Array.from(document.querySelectorAll("#inversion-options input:checked"))
    .map((input) => Number(input.value))
    .filter((value) => Number.isInteger(value));
}

function applyPreset(name) {
  const selected = presets[name] || [];
  document.querySelectorAll("#chord-options input").forEach((input) => {
    input.checked = selected.includes(input.value);
  });
  setStatus("プリセットを選択しました。NEW を押してください。");
}

function getSelectedChords() {
  const selectedIds = Array.from(document.querySelectorAll("#chord-options input:checked"))
    .map((input) => input.value);
  return chords.filter((chord) => selectedIds.includes(chord.id));
}

function getMode() {
  return document.querySelector('input[name="mode"]:checked').value;
}

function randomItem(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function buildChordVoicing(rootMidi, intervals, inversion) {
  const rootPosition = intervals.map((interval) => rootMidi + interval);
  const lowerPart = rootPosition.slice(inversion).map((midi) => midi);
  const raisedPart = rootPosition.slice(0, inversion).map((midi) => midi + 12);
  return lowerPart.concat(raisedPart);
}

function newQuestion() {
  const selectedChords = getSelectedChords();

  if (selectedChords.length === 0) {
    setStatus("出題範囲を1つ以上選択してください。", "incorrect");
    return;
  }

  clearFeedback();

  const selectedInversions = getSelectedInversions();

  if (selectedInversions.length === 0) {
    setStatus("転回形を1つ以上選択してください。", "incorrect");
    return;
  }

  const chord = randomItem(selectedChords);
  const validInversions = selectedInversions.filter((inversion) => inversion < chord.intervals.length);

  if (validInversions.length === 0) {
    setStatus("選択された転回形が、この和音タイプに対応していません。", "incorrect");
    return;
  }

  const playableVoicings = [];
  rootMidiNotes.forEach((rootMidi) => {
    validInversions.forEach((inversion) => {
      const midiNotes = buildChordVoicing(rootMidi, chord.intervals, inversion);
      if (Math.max(...midiNotes) <= MAX_TREBLE_MIDI) {
        playableVoicings.push({ rootMidi, inversion, midiNotes });
      }
    });
  });

  if (playableVoicings.length === 0) {
    setStatus("この和音と転回形では、A5以内に収まる出題がありません。", "incorrect");
    return;
  }

  const voicing = randomItem(playableVoicings);
  const rootMidi = voicing.rootMidi;
  const inversion = voicing.inversion;
  const midiNotes = voicing.midiNotes;

  currentQuestion = {
    number: totalCount + 1,
    chord,
    mode: getMode(),
    rootMidi,
    inversion,
    midiNotes
  };

  hasAnsweredCurrentQuestion = false;
  answerText.textContent = "";
  notationEl.innerHTML = "";
  questionStartTime = null;
  latestResponseTimeSec = null;
  currentTimeEl.textContent = "--";

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

    sampler.volume.value = -7;
    await Tone.loaded();
    setStatus("リアルピアノの読み込みが完了しました。");
    return sampler;
  }

  if (name === "softPiano") {
    const synth = new Tone.PolySynth(Tone.Synth, {
      oscillator: { type: "triangle" },
      envelope: { attack: 0.015, decay: 0.18, sustain: 0.22, release: 0.9 }
    }).toDestination();
    synth.volume.value = -12;
    return synth;
  }

  if (name === "clearSine") {
    const synth = new Tone.PolySynth(Tone.Synth, {
      oscillator: { type: "sine" },
      envelope: { attack: 0.01, decay: 0.08, sustain: 0.5, release: 0.45 }
    }).toDestination();
    synth.volume.value = -10;
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
    synth.volume.value = -20;
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
    synth.volume.value = -22;
    return synth;
  }

  if (name === "pluck") {
    const synth = new Tone.PolySynth(Tone.Synth, {
      oscillator: { type: "triangle" },
      envelope: { attack: 0.005, decay: 0.12, sustain: 0.05, release: 0.35 }
    }).toDestination();
    synth.volume.value = -11;
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

  const notes = currentQuestion.midiNotes.map(midiToToneNote);
  const now = Tone.now();

  if (!hasAnsweredCurrentQuestion) {
    questionStartTime = performance.now();
    latestResponseTimeSec = null;
    currentTimeEl.textContent = "0.0s";
  }

  if (currentQuestion.mode === "block") {
    instrument.triggerAttackRelease(notes, "2n", now);
  }

  if (currentQuestion.mode === "arpUp") {
    notes.forEach((note, index) => {
      instrument.triggerAttackRelease(note, "4n", now + index * 0.36);
    });
  }

  if (currentQuestion.mode === "arpDown") {
    notes.slice().reverse().forEach((note, index) => {
      instrument.triggerAttackRelease(note, "4n", now + index * 0.36);
    });
  }

  setStatus("再生しました。答えを選んでください。");
}

function answer(chordId) {
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

  const isCorrect = chordId === currentQuestion.chord.id;
  const selectedChord = chords.find((chord) => chord.id === chordId);
  const timeText = latestResponseTimeSec !== null ? ` / ${latestResponseTimeSec.toFixed(1)}秒` : "";

  const inversionText = ` / ${inversionLabels[currentQuestion.inversion]}`;

  if (isCorrect) {
    correctCount += 1;
    setStatus(`正解：${currentQuestion.chord.name}${inversionText}${timeText}`, "correct");
  } else {
    setStatus(`不正解：選択 ${selectedChord?.name || ""} / 正解 ${currentQuestion.chord.name}${inversionText}${timeText}`, "incorrect");
  }

  currentTimeEl.textContent = latestResponseTimeSec !== null ? `${latestResponseTimeSec.toFixed(1)}s` : "--";

  resultLog.push({
    number: totalCount,
    mode: currentQuestion.mode,
    modeLabel: getModeLabel(currentQuestion.mode),
    rootMidi: currentQuestion.rootMidi,
    inversion: currentQuestion.inversion,
    inversionLabel: inversionLabels[currentQuestion.inversion],
    midiNotes: currentQuestion.midiNotes,
    chordName: currentQuestion.chord.name,
    chordSymbol: currentQuestion.chord.symbol,
    selectedName: selectedChord?.name || "",
    selectedSymbol: selectedChord?.symbol || "",
    inversionHint: currentQuestion.chord.inversionHint,
    isCorrect,
    responseTimeSec: latestResponseTimeSec,
    rootNote: midiToToneNote(currentQuestion.rootMidi),
    notes: currentQuestion.midiNotes.map(midiToToneNote)
  });

  markAnswerButtons(chordId, isCorrect);
  updateScore();
  renderHistory();
}

function markAnswerButtons(selectedId, isCorrect) {
  document.querySelectorAll("#answer-buttons button").forEach((button) => {
    button.classList.remove("selected-correct", "selected-incorrect");

    if (button.dataset.answer === currentQuestion.chord.id) {
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
  const rootName = midiToToneNote(currentQuestion.rootMidi);
  const noteNames = currentQuestion.midiNotes.map(midiToToneNote).join(" - ");

  answerText.textContent = `正解：${rootName}${currentQuestion.chord.symbol} / ${currentQuestion.chord.name} / ${inversionLabels[currentQuestion.inversion]} / ${modeLabel} / ${noteNames}`;

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
      <span>${item.modeLabel} / ${item.chordName} / ${item.inversionLabel} / ${formatResponseTime(item.responseTimeSec)}</span>
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
  const clef = getClefForQuestion(question);
  let body = "";

  if (question.mode === "block") {
    body = `[${notes.join("")}]2 |`;
  }

  if (question.mode === "arpUp") {
    body = `${notes.join(" ")} |`;
  }

  if (question.mode === "arpDown") {
    body = `${notes.slice().reverse().join(" ")} |`;
  }

  return `X:1
M:4/4
L:1/4
K:C clef=${clef}
${body}`;
}

function getClefForQuestion(question) {
  // 低い和音はヘ音記号に残します。
  // 最高音がE4以下、または平均音高がC4以下の場合は bass。
  const maxMidi = Math.max(...question.midiNotes);
  const avgMidi = question.midiNotes.reduce((sum, midi) => sum + midi, 0) / question.midiNotes.length;
  return maxMidi <= 64 || avgMidi <= 60 ? "bass" : "treble";
}

function getModeLabel(mode) {
  return {
    block: "同時",
    arpUp: "上行分散",
    arpDown: "下行分散"
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
    const answeredWithTime = resultLog.filter(item => item.responseTimeSec !== null);
    const avgTime = answeredWithTime.length
      ? answeredWithTime.reduce((sum, item) => sum + item.responseTimeSec, 0) / answeredWithTime.length
      : null;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.text("Chord Practice Result", 16, 18);

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
        `${String(item.number).padStart(2, "0")}  ${modeToPdfLabel(item.mode)}  ${inversionToPdfLabel(item.inversion)}  Root: ${item.rootNote}  ${item.chordSymbol}`,
        16,
        y
      );

      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.text(
        `Correct chord: ${chordToPdfLabel(item.chordName)} / Your answer: ${chordToPdfLabel(item.selectedName)} / ${item.isCorrect ? "OK" : "NG"} / Time: ${formatResponseTime(item.responseTimeSec)}`,
        16,
        y + 6
      );

      doc.text(`Hint: ${item.inversionHint}`, 16, y + 12);

      const abc = buildAbcNotation({
        mode: item.mode,
        midiNotes: item.midiNotes
      });

      const notationImage = await renderAbcToPngDataUrl(abc);
      const imageWidthMm = 92;
      const imageHeightMm = imageWidthMm * (notationImage.height / notationImage.width);

      if (y + 20 + imageHeightMm > 282) {
        doc.addPage();
        y = 18;
      }

      doc.addImage(notationImage.dataUrl, "PNG", 16, y + 16, imageWidthMm, imageHeightMm);
      y += 26 + imageHeightMm;
    }

    doc.save("chord-practice-result.pdf");
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
    block: "Block chord",
    arpUp: "Arpeggio up",
    arpDown: "Arpeggio down"
  }[mode] || mode;
}

function inversionToPdfLabel(inversion) {
  return inversionPdfLabels[inversion] || "-";
}

function chordToPdfLabel(name) {
  const map = {
    "長三和音": "major triad",
    "短三和音": "minor triad",
    "減三和音": "diminished triad",
    "増三和音": "augmented triad",
    "長七の和音": "major seventh",
    "属七の和音": "dominant seventh",
    "短七の和音": "minor seventh",
    "短三長七": "minor major seventh",
    "半減七": "half-diminished seventh",
    "減七の和音": "diminished seventh",
    "sus4": "sus4",
    "sus2": "sus2",
    "add9": "add9",
    "m(add9)": "minor add9"
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

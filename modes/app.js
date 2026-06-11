
function t(text) {
  return window.EarTrainingLang?.translateText(text) || text;
}

const modes = [
  {
    id: "ionian",
    name: "Ionian",
    ja: "アイオニアン",
    intervals: [0, 2, 4, 5, 7, 9, 11, 12],
    degrees: "1 2 3 4 5 6 7",
    feature: "長音階",
    comment: "明るく安定した長調の基準。",
    phraseVariants: [
      [0, 2, 4, 7, 9, 7, 4, 2, 0],
      [0, 4, 5, 7, 11, 9, 7, 4, 0],
      [0, 2, 4, 5, 4, 7, 9, 11, 12],
      [0, 7, 4, 2, 5, 4, 2, 0],
      [0, 2, 4, 7, 5, 4, 2, 0],
      [0, 4, 7, 9, 11, 12, 11, 7, 4, 0],
      [0, 5, 4, 2, 0, 4, 7, 12],
      [0, 2, 4, 2, 5, 7, 9, 7, 0],
      [0, 4, 7, 11, 9, 7, 5, 4, 2, 0],
      [0, 2, 5, 7, 9, 11, 9, 7, 4, 0]
    ]
  },
  {
    id: "dorian",
    name: "Dorian",
    ja: "ドリアン",
    intervals: [0, 2, 3, 5, 7, 9, 10, 12],
    degrees: "1 2 ♭3 4 5 6 ♭7",
    feature: "長6度",
    comment: "短調の中に6度だけ明るく残る。",
    phraseVariants: [
      [0, 3, 5, 7, 9, 7, 5, 3, 0],
      [0, 2, 3, 5, 9, 7, 5, 3, 0],
      [0, 3, 5, 9, 10, 9, 7, 5, 3, 0],
      [0, 7, 9, 10, 9, 7, 5, 3, 0],
      [0, 3, 5, 7, 5, 9, 7, 3, 0],
      [0, 2, 3, 5, 7, 9, 7, 5, 0],
      [0, 5, 3, 2, 0, 7, 9, 10, 9, 7, 0],
      [0, 3, 7, 9, 7, 5, 3, 2, 0],
      [0, 2, 5, 9, 7, 5, 3, 0],
      [0, 3, 5, 10, 9, 7, 5, 3, 0]
    ]
  },
  {
    id: "phrygian",
    name: "Phrygian",
    ja: "フリジアン",
    intervals: [0, 1, 3, 5, 7, 8, 10, 12],
    degrees: "1 ♭2 ♭3 4 5 ♭6 ♭7",
    feature: "短2度",
    comment: "主音のすぐ上に半音があり、強い緊張がある。",
    phraseVariants: [
      [0, 1, 0, 3, 5, 3, 1, 0],
      [0, 1, 3, 5, 3, 1, 0],
      [0, 3, 1, 0, 5, 3, 1, 0],
      [0, 1, 0, 1, 3, 5, 3, 1, 0],
      [0, 5, 3, 1, 0, 1, 0],
      [0, 1, 3, 1, 0, 8, 7, 5, 3, 1, 0],
      [0, 3, 5, 7, 5, 3, 1, 0],
      [0, 1, 3, 5, 8, 7, 5, 3, 1, 0],
      [0, 1, 0, 3, 1, 0, 5, 3, 1, 0],
      [0, 3, 1, 0, 1, 3, 5, 3, 0]
    ]
  },
  {
    id: "lydian",
    name: "Lydian",
    ja: "リディアン",
    intervals: [0, 2, 4, 6, 7, 9, 11, 12],
    degrees: "1 2 3 #4 5 6 7",
    feature: "増4度",
    comment: "長調より浮遊感があり、4度が上ずって聴こえる。",
    phraseVariants: [
      [0, 2, 4, 6, 7, 6, 4, 2, 0],
      [0, 4, 6, 7, 11, 7, 6, 4, 0],
      [0, 2, 4, 6, 4, 2, 7, 6, 4, 0],
      [0, 7, 6, 4, 2, 0, 4, 6, 7, 12],
      [0, 2, 6, 7, 9, 7, 6, 4, 0],
      [0, 4, 6, 11, 9, 7, 6, 4, 0],
      [0, 2, 4, 7, 6, 4, 2, 0],
      [0, 6, 7, 6, 4, 2, 4, 6, 12],
      [0, 2, 4, 6, 7, 9, 7, 6, 4, 0],
      [0, 4, 7, 11, 12, 11, 7, 6, 4, 0]
    ]
  },
  {
    id: "mixolydian",
    name: "Mixolydian",
    ja: "ミクソリディアン",
    intervals: [0, 2, 4, 5, 7, 9, 10, 12],
    degrees: "1 2 3 4 5 6 ♭7",
    feature: "短7度",
    comment: "長調に近いが、7度が低く、少し民俗的・開放的。",
    phraseVariants: [
      [0, 4, 7, 10, 9, 7, 4, 2, 0],
      [0, 2, 4, 7, 10, 7, 4, 0],
      [0, 7, 10, 9, 7, 5, 4, 2, 0],
      [0, 4, 5, 7, 10, 9, 7, 4, 0],
      [0, 2, 4, 7, 9, 10, 9, 7, 0],
      [0, 4, 7, 10, 12, 10, 9, 7, 4, 0],
      [0, 5, 4, 2, 0, 7, 10, 9, 7, 0],
      [0, 2, 4, 10, 9, 7, 5, 4, 0],
      [0, 4, 7, 9, 7, 10, 9, 7, 4, 0],
      [0, 2, 5, 7, 10, 7, 5, 4, 2, 0]
    ]
  },
  {
    id: "aeolian",
    name: "Aeolian",
    ja: "エオリアン",
    intervals: [0, 2, 3, 5, 7, 8, 10, 12],
    degrees: "1 2 ♭3 4 5 ♭6 ♭7",
    feature: "短6度",
    comment: "自然短音階。暗く、6度も7度も低い。",
    phraseVariants: [
      [0, 2, 3, 7, 8, 7, 5, 3, 0],
      [0, 3, 5, 7, 8, 7, 5, 3, 0],
      [0, 2, 3, 5, 8, 7, 5, 3, 0],
      [0, 7, 8, 10, 8, 7, 5, 3, 0],
      [0, 3, 2, 0, 5, 7, 8, 7, 3, 0],
      [0, 2, 3, 7, 5, 3, 8, 7, 0],
      [0, 5, 3, 2, 0, 7, 8, 7, 5, 3, 0],
      [0, 3, 5, 8, 10, 8, 7, 5, 3, 0],
      [0, 2, 3, 5, 7, 8, 7, 3, 0],
      [0, 3, 7, 8, 7, 5, 3, 2, 0]
    ]
  },
  {
    id: "locrian",
    name: "Locrian",
    ja: "ロクリアン",
    intervals: [0, 1, 3, 5, 6, 8, 10, 12],
    degrees: "1 ♭2 ♭3 4 ♭5 ♭6 ♭7",
    feature: "短2度 + 減5度",
    comment: "主音上の5度が減5度になり、非常に不安定。",
    phraseVariants: [
      [0, 1, 3, 5, 6, 5, 3, 1, 0],
      [0, 1, 3, 6, 5, 3, 1, 0],
      [0, 3, 1, 0, 6, 5, 3, 1, 0],
      [0, 1, 0, 3, 5, 6, 5, 3, 0],
      [0, 6, 5, 3, 1, 0, 1, 3, 0],
      [0, 1, 3, 5, 3, 6, 5, 3, 1, 0],
      [0, 3, 5, 6, 8, 6, 5, 3, 1, 0],
      [0, 1, 3, 1, 0, 5, 6, 5, 3, 0],
      [0, 3, 6, 5, 3, 1, 0],
      [0, 1, 3, 5, 6, 10, 8, 6, 5, 3, 1, 0]
    ]
  }
];

const presets = {
  beginner: ["ionian", "dorian", "mixolydian", "aeolian"],
  middle: ["dorian", "phrygian", "lydian", "mixolydian", "aeolian"],
  advanced: modes.map((mode) => mode.id)
};

const whiteKeyTonics = [60, 62, 64, 65, 67, 69, 71]; // C D E F G A B
const allTonics = [60, 61, 62, 63, 64, 65, 66, 67, 68, 69, 70, 71];
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

const modeOptions = document.querySelector("#mode-options");
const answerButtons = document.querySelector("#answer-buttons");
const statusEl = document.querySelector("#status");
const answerText = document.querySelector("#answer-text");
const analysisText = document.querySelector("#analysis-text");
const notationEl = document.querySelector("#notation");
const totalCountEl = document.querySelector("#total-count");
const correctCountEl = document.querySelector("#correct-count");
const scorePercentEl = document.querySelector("#score-percent");
const currentTimeEl = document.querySelector("#current-time");
const progressCountEl = document.querySelector("#progress-count");
const historyList = document.querySelector("#history-list");
const instrumentSelect = document.querySelector("#instrument-select");

document.querySelector("#new-question").addEventListener("click", newQuestion);
document.querySelector("#play-question").addEventListener("click", playCurrentQuestion);
document.querySelector("#show-answer").addEventListener("click", showAnswerAndNotation);
document.querySelector("#reset-score").addEventListener("click", resetScore);
document.querySelector("#export-pdf").addEventListener("click", exportResultsPdf);
document.querySelector("#select-all-modes").addEventListener("click", () => setAllModeSelections(true));
document.querySelector("#clear-all-modes").addEventListener("click", () => setAllModeSelections(false));

document.querySelectorAll("[data-preset]").forEach((button) => {
  button.addEventListener("click", () => applyPreset(button.dataset.preset));
});

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
  renderModeOptions();
  renderAnswerButtons();
  applyPreset("beginner");
  updateScore();
}

function renderModeOptions() {
  modeOptions.innerHTML = "";
  modes.forEach((mode) => {
    const label = document.createElement("label");
    label.className = "choice-check";
    label.innerHTML = `<input type="checkbox" value="${mode.id}" /><span>${mode.name} / ${mode.ja}</span>`;
    modeOptions.appendChild(label);
  });
}

function renderAnswerButtons() {
  answerButtons.innerHTML = "";
  modes.forEach((mode) => {
    const button = document.createElement("button");
    button.type = "button";
    button.dataset.answer = mode.id;
    button.textContent = `${mode.name} / ${mode.ja}`;
    button.addEventListener("click", () => answer(mode.id));
    answerButtons.appendChild(button);
  });
}

function setAllModeSelections(checked) {
  document.querySelectorAll("#mode-options input").forEach((input) => {
    input.checked = checked;
  });
  setStatus(checked ? "旋法をすべて選択しました。" : "旋法をすべて外しました。");
}

function applyPreset(name) {
  const selected = presets[name] || [];
  document.querySelectorAll("#mode-options input").forEach((input) => {
    input.checked = selected.includes(input.value);
  });
  setStatus(t("プリセットを選択しました。NEW を押してください。"));
}

function getSelectedModes() {
  const selectedIds = Array.from(document.querySelectorAll("#mode-options input:checked"))
    .map((input) => input.value);
  return modes.filter((mode) => selectedIds.includes(mode.id));
}

function getQuestionType() {
  return document.querySelector('input[name="questionType"]:checked').value;
}

function randomItem(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function newQuestion() {
  const selectedModes = getSelectedModes();

  if (selectedModes.length === 0) {
    setStatus(t("出題範囲を1つ以上選択してください。"), "incorrect");
    return;
  }

  clearFeedback();

  const mode = randomItem(selectedModes);
  const tonicMidi = randomItem(tonicPool);
  const questionType = getQuestionType();
  const built = buildQuestionNotes(tonicMidi, mode, questionType);

  currentQuestion = {
    number: totalCount + 1,
    mode,
    questionType,
    tonicMidi,
    midiNotes: built.midiNotes,
    phraseIndex: built.phraseIndex
  };

  hasAnsweredCurrentQuestion = false;
  answerText.textContent = "";
  analysisText.textContent = "";
  notationEl.innerHTML = "";
  questionStartTime = null;
  latestResponseTimeSec = null;
  currentTimeEl.textContent = "--";

  setStatus(t("問題を作成しました。再生します。"));
  playCurrentQuestion();
}

function buildQuestionNotes(tonicMidi, mode, questionType) {
  if (questionType === "scale") {
    return {
      midiNotes: mode.intervals.map((interval) => tonicMidi + interval),
      phraseIndex: null
    };
  }

  if (questionType === "phrase" || questionType === "dronePhrase") {
    const variants = mode.phraseVariants || [mode.phrase || mode.intervals];
    const phraseIndex = Math.floor(Math.random() * variants.length);
    const opening = [tonicMidi, tonicMidi + 12];
    const phrase = variants[phraseIndex].map((interval) => tonicMidi + interval);
    return {
      midiNotes: opening.concat(phrase),
      phraseIndex
    };
  }

  return {
    midiNotes: mode.intervals.map((interval) => tonicMidi + interval),
    phraseIndex: null
  };
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

  if (currentQuestion.questionType === "dronePhrase") {
    const droneNote = midiToToneNote(currentQuestion.tonicMidi - 12);
    instrument.triggerAttackRelease(droneNote, "1m", now);
  }

  notes.forEach((note, index) => {
    const duration = index < 2 && currentQuestion.questionType !== "scale" ? "4n" : "8n";
    instrument.triggerAttackRelease(note, duration, now + index * 0.28);
  });

  setStatus(t("再生しました。答えを選んでください。"));
}

function answer(modeId) {
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

  const isCorrect = modeId === currentQuestion.mode.id;
  const selectedMode = modes.find((mode) => mode.id === modeId);
  const timeText = latestResponseTimeSec !== null ? ` / ${latestResponseTimeSec.toFixed(1)}秒` : "";

  if (isCorrect) {
    correctCount += 1;
    setStatus(`正解：${currentQuestion.mode.name}${timeText}`, "correct");
  } else {
    setStatus(`不正解：選択 ${selectedMode?.name || ""} / 正解 ${currentQuestion.mode.name}${timeText}`, "incorrect");
  }

  currentTimeEl.textContent = latestResponseTimeSec !== null ? `${latestResponseTimeSec.toFixed(1)}s` : "--";

  resultLog.push({
    number: totalCount,
    questionType: currentQuestion.questionType,
    questionTypeLabel: getQuestionTypeLabel(currentQuestion.questionType),
    tonicMidi: currentQuestion.tonicMidi,
    tonicNote: midiToToneNote(currentQuestion.tonicMidi),
    modeName: currentQuestion.mode.name,
    modeJa: currentQuestion.mode.ja,
    selectedName: selectedMode?.name || "",
    feature: currentQuestion.mode.feature,
    degrees: currentQuestion.mode.degrees,
    comment: currentQuestion.mode.comment,
    phraseIndex: currentQuestion.phraseIndex,
    isCorrect,
    responseTimeSec: latestResponseTimeSec,
    midiNotes: currentQuestion.midiNotes
  });

  markAnswerButtons(modeId, isCorrect);
  updateScore();
  renderHistory();
}

function markAnswerButtons(selectedId, isCorrect) {
  document.querySelectorAll("#answer-buttons button").forEach((button) => {
    button.classList.remove("selected-correct", "selected-incorrect");

    if (button.dataset.answer === currentQuestion.mode.id) {
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

  const tonicName = midiToToneNote(currentQuestion.tonicMidi);
  answerText.textContent = `正解：${tonicName} ${currentQuestion.mode.name} / ${currentQuestion.mode.ja} / ${getQuestionTypeLabel(currentQuestion.questionType)}`;
  const phraseText = currentQuestion.phraseIndex !== null ? ` / Phrase ${currentQuestion.phraseIndex + 1}` : "";
  analysisText.textContent = `特徴音：${currentQuestion.mode.feature} / 構成：${currentQuestion.mode.degrees} / 聴き方：${currentQuestion.mode.comment}${phraseText}`;

  const abc = buildAbcNotation(currentQuestion);
  ABCJS.renderAbc("notation", abc, {
    responsive: "resize",
    staffwidth: 680,
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
      <span>${item.questionTypeLabel} / ${item.modeName}${item.phraseIndex !== null ? " #" + (item.phraseIndex + 1) : ""} / ${formatResponseTime(item.responseTimeSec)}</span>
      <span class="${item.isCorrect ? "ok" : "ng"}">${item.isCorrect ? "OK" : "NG"}</span>
    `;
    historyList.appendChild(row);
  });
}

function formatResponseTime(value) {
  return typeof value === "number" && Number.isFinite(value) ? `${value.toFixed(1)}s` : "-";
}

function getQuestionTypeLabel(type) {
  return {
    scale: "Scale",
    phrase: "Phrase",
    dronePhrase: "Drone + Phrase"
  }[type] || type;
}

function buildAbcNotation(question) {
  const notes = question.midiNotes.map(midiToAbc);
  return `X:1
M:4/4
L:1/8
K:C
${notes.join(" ")} |`;
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
    doc.text("Mode Practice Result", 16, 18);

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
      if (y > 246) {
        doc.addPage();
        y = 18;
      }

      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.text(
        `${String(item.number).padStart(2, "0")}  ${item.questionTypeLabel}${item.phraseIndex !== null ? " #" + (item.phraseIndex + 1) : ""}  Tonic: ${item.tonicNote}  ${item.modeName}`,
        16,
        y
      );

      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.text(
        `Your answer: ${item.selectedName || "-"} / ${item.isCorrect ? "OK" : "NG"} / Time: ${formatResponseTime(item.responseTimeSec)}`,
        16,
        y + 6
      );
      doc.text(`Feature: ${item.feature} / Degrees: ${item.degrees}`, 16, y + 12);

      const abc = buildAbcNotation({ midiNotes: item.midiNotes });
      const notationImage = await renderAbcToPngDataUrl(abc);
      const imageWidthMm = 118;
      const imageHeightMm = imageWidthMm * (notationImage.height / notationImage.width);

      if (y + 20 + imageHeightMm > 282) {
        doc.addPage();
        y = 18;
      }

      doc.addImage(notationImage.dataUrl, "PNG", 16, y + 16, imageWidthMm, imageHeightMm);
      y += 27 + imageHeightMm;
    }

    doc.save("mode-practice-result.pdf");
    setStatus(t("結果PDFを出力しました。"), "correct");
  } catch (error) {
    console.error(error);
    setStatus(t("PDF作成中にエラーが発生しました。"), "incorrect");
  } finally {
    exportButton.disabled = false;
  }
}

async function renderAbcToPngDataUrl(abc) {
  const host = document.createElement("div");
  host.style.position = "fixed";
  host.style.left = "-10000px";
  host.style.top = "0";
  host.style.width = "840px";
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

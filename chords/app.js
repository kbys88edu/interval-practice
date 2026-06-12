function t(text) {
  return window.EarTrainingLang?.translateText(text) || text;
}

/*
  Chords — rebuilt from zero.

  Core rule:
  Do not derive notation from sharp-only MIDI names.
  Every chord tone is spelled from:
  - root spelling
  - chord quality
  - chord-tone degree: 1, 3, 5, 7, 9
  - key-signature context

  Dominant seventh example:
  Db7 = Db - F - Ab - Cb, not Db - F - Ab - B
  E7  = E - G# - B - D, not E - G# - B - C##
*/

const chordTypes = [
  { id: "maj", label: "Major triad", symbol: "", tones: [{step:0, semis:0}, {step:2, semis:4}, {step:4, semis:7}] },
  { id: "min", label: "Minor triad", symbol: "m", tones: [{step:0, semis:0}, {step:2, semis:3}, {step:4, semis:7}] },
  { id: "dim", label: "Diminished triad", symbol: "dim", tones: [{step:0, semis:0}, {step:2, semis:3}, {step:4, semis:6}] },
  { id: "aug", label: "Augmented triad", symbol: "aug", tones: [{step:0, semis:0}, {step:2, semis:4}, {step:4, semis:8}] },

  { id: "maj7", label: "Major seventh", symbol: "maj7", tones: [{step:0, semis:0}, {step:2, semis:4}, {step:4, semis:7}, {step:6, semis:11}] },
  { id: "dom7", label: "Dominant seventh", symbol: "7", tones: [{step:0, semis:0}, {step:2, semis:4}, {step:4, semis:7}, {step:6, semis:10}] },
  { id: "min7", label: "Minor seventh", symbol: "m7", tones: [{step:0, semis:0}, {step:2, semis:3}, {step:4, semis:7}, {step:6, semis:10}] },
  { id: "mMaj7", label: "Minor major seventh", symbol: "mMaj7", tones: [{step:0, semis:0}, {step:2, semis:3}, {step:4, semis:7}, {step:6, semis:11}] },
  { id: "m7b5", label: "Half-diminished seventh", symbol: "ø7", tones: [{step:0, semis:0}, {step:2, semis:3}, {step:4, semis:6}, {step:6, semis:10}] },
  { id: "dim7", label: "Diminished seventh", symbol: "dim7", tones: [{step:0, semis:0}, {step:2, semis:3}, {step:4, semis:6}, {step:6, semis:9}] },

  { id: "sus4", label: "Suspended fourth", symbol: "sus4", tones: [{step:0, semis:0}, {step:3, semis:5}, {step:4, semis:7}] },
  { id: "sus2", label: "Suspended second", symbol: "sus2", tones: [{step:0, semis:0}, {step:1, semis:2}, {step:4, semis:7}] },
  { id: "add9", label: "Add ninth", symbol: "add9", tones: [{step:0, semis:0}, {step:2, semis:4}, {step:4, semis:7}, {step:1, semis:14}] },
  { id: "minAdd9", label: "Minor add ninth", symbol: "m(add9)", tones: [{step:0, semis:0}, {step:2, semis:3}, {step:4, semis:7}, {step:1, semis:14}] }
];

const rootPool = [
  { name:"C",  midi:48, letter:"C", alt:0,  majorKey:"C",  minorKey:"Cm" },
  { name:"Db", midi:49, letter:"D", alt:-1, majorKey:"Db", minorKey:"Bbm" },
  { name:"D",  midi:50, letter:"D", alt:0,  majorKey:"D",  minorKey:"Dm" },
  { name:"Eb", midi:51, letter:"E", alt:-1, majorKey:"Eb", minorKey:"Ebm" },
  { name:"E",  midi:52, letter:"E", alt:0,  majorKey:"E",  minorKey:"Em" },
  { name:"F",  midi:53, letter:"F", alt:0,  majorKey:"F",  minorKey:"Fm" },
  { name:"Gb", midi:54, letter:"G", alt:-1, majorKey:"Gb", minorKey:"Ebm" },
  { name:"F#", midi:54, letter:"F", alt:1,  majorKey:"F#", minorKey:"F#m" },
  { name:"G",  midi:55, letter:"G", alt:0,  majorKey:"G",  minorKey:"Gm" },
  { name:"Ab", midi:56, letter:"A", alt:-1, majorKey:"Ab", minorKey:"Fm" },
  { name:"A",  midi:57, letter:"A", alt:0,  majorKey:"A",  minorKey:"Am" },
  { name:"Bb", midi:58, letter:"B", alt:-1, majorKey:"Bb", minorKey:"Bbm" },
  { name:"B",  midi:59, letter:"B", alt:0,  majorKey:"B",  minorKey:"Bm" },

  { name:"C",  midi:60, letter:"C", alt:0,  majorKey:"C",  minorKey:"Cm" },
  { name:"Db", midi:61, letter:"D", alt:-1, majorKey:"Db", minorKey:"Bbm" },
  { name:"D",  midi:62, letter:"D", alt:0,  majorKey:"D",  minorKey:"Dm" },
  { name:"Eb", midi:63, letter:"E", alt:-1, majorKey:"Eb", minorKey:"Ebm" },
  { name:"E",  midi:64, letter:"E", alt:0,  majorKey:"E",  minorKey:"Em" },
  { name:"F",  midi:65, letter:"F", alt:0,  majorKey:"F",  minorKey:"Fm" },
  { name:"Gb", midi:66, letter:"G", alt:-1, majorKey:"Gb", minorKey:"Ebm" },
  { name:"F#", midi:66, letter:"F", alt:1,  majorKey:"F#", minorKey:"F#m" },
  { name:"G",  midi:67, letter:"G", alt:0,  majorKey:"G",  minorKey:"Gm" },
  { name:"Ab", midi:68, letter:"A", alt:-1, majorKey:"Ab", minorKey:"Fm" },
  { name:"A",  midi:69, letter:"A", alt:0,  majorKey:"A", minorKey:"Am" }
];

const MAX_TREBLE_MIDI = 81;
const naturalPitchClasses = { C:0, D:2, E:4, F:5, G:7, A:9, B:11 };
const letterOrder = ["C", "D", "E", "F", "G", "A", "B"];

let currentQuestion = null;
let hasAnsweredCurrentQuestion = false;
let totalCount = 0;
let correctCount = 0;
let resultLog = [];
let questionStartTime = null;
let latestResponseTimeSec = null;
let chordDifficulty = "advanced";
let synth = null;
let clickSynth = null;

const choiceList = document.querySelector("#answer-buttons");
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
const chordOptionsEl = document.querySelector("#chord-options");
const answerButtonsEl = document.querySelector("#answer-buttons");
const inversionOptionsEl = document.querySelector("#inversion-options");
const selectAllChordsButton = document.querySelector("#select-all-chords");
const clearAllChordsButton = document.querySelector("#clear-all-chords");
let difficultyToggleEl = null;


document.querySelector("#new-question").addEventListener("click", newQuestion);
document.querySelector("#play-question").addEventListener("click", playCurrentQuestion);
document.querySelector("#show-answer").addEventListener("click", showAnswer);
document.querySelector("#reset-score").addEventListener("click", resetScore);
document.querySelector("#export-pdf").addEventListener("click", exportResultsPdf);
if (selectAllChordsButton) {
  selectAllChordsButton.addEventListener("click", () => {
    document.querySelectorAll('input[name="chordType"]').forEach((input) => input.checked = true);
  });
}

if (clearAllChordsButton) {
  clearAllChordsButton.addEventListener("click", () => {
    document.querySelectorAll('input[name="chordType"]').forEach((input) => input.checked = false);
  });
}

document.querySelectorAll("[data-preset]").forEach((button) => {
  button.addEventListener("click", () => applyPreset(button.dataset.preset));
});


function init() {
  ensureChordDifficultyStyle();
  renderDifficultyToggle();
  renderChordOptions();
  updateScore();
  setStatus("レベルを選び、NEW を押してください。中級はコード種別、上級は譜例3択です。");
}



function ensureChordDifficultyStyle() {
  if (document.querySelector("#chord-difficulty-inline-style")) return;
  const style = document.createElement("style");
  style.id = "chord-difficulty-inline-style";
  style.textContent = `
    .difficulty-button.is-active { outline: 2px solid currentColor; }
    .chord-type-answer-card { min-height: 54px; justify-content: center; }
    .chord-type-answer-card .choice-label { font-size: 18px; font-weight: 700; }
  `;
  document.head.appendChild(style);
}

function renderDifficultyToggle() {
  if (difficultyToggleEl || !chordOptionsEl) return;
  const host = chordOptionsEl.parentElement;
  if (!host || !host.parentElement) return;

  difficultyToggleEl = document.createElement("div");
  difficultyToggleEl.className = "field difficulty-field";
  difficultyToggleEl.innerHTML = `
    <div class="field-label">LEVEL</div>
    <div class="preset-row difficulty-row">
      <button type="button" class="mini difficulty-button is-active" data-difficulty="intermediate">中級：色彩で答える</button>
      <button type="button" class="mini difficulty-button" data-difficulty="advanced">上級：譜例3択</button>
    </div>
  `;
  host.parentElement.insertBefore(difficultyToggleEl, host);

  difficultyToggleEl.querySelectorAll("[data-difficulty]").forEach((button) => {
    button.addEventListener("click", () => {
      chordDifficulty = button.dataset.difficulty;
      difficultyToggleEl.querySelectorAll("[data-difficulty]").forEach((item) => item.classList.remove("is-active"));
      button.classList.add("is-active");
      if (choiceList) choiceList.innerHTML = "";
      answerText.textContent = "";
      if (analysisText) analysisText.textContent = "";
      notationEl.innerHTML = "";
      questionDisplay.textContent = "LISTEN";
      setStatus(chordDifficulty === "intermediate"
        ? "中級：楽譜を見ず、コードの色彩感をボタンから選びます。"
        : "上級：譜例を見て3択から選びます。");
    });
  });

  chordDifficulty = "intermediate";
}

function renderChordOptions() {
  if (!chordOptionsEl) return;

  chordOptionsEl.innerHTML = "";
  chordTypes.forEach((chord, index) => {
    const label = document.createElement("label");
    label.className = "option-tile";

    const checked = ["maj", "min", "dim", "aug", "dom7", "maj7", "min7"].includes(chord.id);
    label.innerHTML = `
      <input type="checkbox" name="chordType" value="${chord.id}" ${checked ? "checked" : ""}>
      <span>${chord.symbol || "major"}</span>
      <small>${chord.label}</small>
    `;

    chordOptionsEl.appendChild(label);
  });
}

function renderAnswerButtons() {
  // #answer-buttons is used for the three actual answer choices.
}


function applyPreset(preset) {
  const groups = {
    triads: ["maj", "min", "dim", "aug"],
    sevenths: ["maj7", "dom7", "min7", "mMaj7", "m7b5", "dim7"],
    advanced: chordTypes.map((chord) => chord.id)
  };

  const selected = new Set(groups[preset] || groups.advanced);
  document.querySelectorAll('input[name="chordType"]').forEach((input) => {
    input.checked = selected.has(input.value);
  });

  setStatus(preset === "triads" ? "三和音プリセットにしました。" : preset === "sevenths" ? "七和音プリセットにしました。" : "応用プリセットにしました。");
}

function selectedModes() {
  return Array.from(document.querySelectorAll('input[name="mode"]:checked')).map((input) => input.value);
}

function selectedChordTypeIds() {
  return Array.from(document.querySelectorAll('input[name="chordType"]:checked')).map((input) => input.value);
}

function selectedInversions() {
  return Array.from(document.querySelectorAll('#inversion-options input[type="checkbox"]:checked')).map((input) => Number(input.value));
}

function getTempo() {
  return Number(document.querySelector("#tempo-select")?.value) || 72;
}

function randomItem(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function shuffle(array) {
  return array.slice().sort(() => Math.random() - 0.5);
}

function newQuestion() {
  const modes = selectedModes();
  const chordIds = selectedChordTypeIds();
  const inversions = selectedInversions();

  if (modes.length === 0 || chordIds.length === 0 || inversions.length === 0) {
    setStatus("モード・和音種別・転回形を1つ以上選んでください。", "incorrect");
    return;
  }

  clearFeedback();

  const chordPool = chordTypes.filter((item) => chordIds.includes(item.id));
  const mode = randomItem(modes);
  const correctChord = randomItem(chordPool);
  const candidates = buildPlayableCandidates(correctChord, inversions);
  const correctBase = randomItem(candidates);
  const correct = buildChoice(correctChord, correctBase.root, correctBase.inversion, mode);

  const choices = chordDifficulty === "advanced"
    ? shuffle([correct, ...buildDistractors(correct, chordPool, inversions, mode, 2)])
    : chordPool.map((chord) => ({
        id: `type-${chord.id}-${Date.now()}-${Math.random().toString(16).slice(2)}`,
        answerType: "chordType",
        chord,
        chordId: chord.id,
        answerLabel: chord.symbol || "major",
        detailLabel: chord.label
      }));

  currentQuestion = {
    number: totalCount + 1,
    renderId: `chord-${Date.now()}-${Math.random().toString(16).slice(2)}`,
    difficulty: chordDifficulty,
    mode,
    correct,
    choices,
    tempo: getTempo()
  };

  hasAnsweredCurrentQuestion = false;
  questionStartTime = null;
  latestResponseTimeSec = null;
  currentTimeEl.textContent = "--";
  answerText.textContent = "";
  if (analysisText) analysisText.textContent = "";
  notationEl.innerHTML = "";
  questionDisplay.textContent = "LISTEN";

  renderChoices();
  setStatus(chordDifficulty === "intermediate"
    ? "聴いて、コードの種類をボタンから選んでください。"
    : "聴いて、譜例だけを見て右側の3択を選んでください。");
  playCurrentQuestion();
}

function buildPlayableCandidates(chord, inversions) {
  const out = [];

  rootPool.forEach((root) => {
    inversions.forEach((inversion) => {
      if (inversion >= chord.tones.length) return;
      const midiNotes = buildMidiVoicing(root, chord, inversion);
      if (Math.max(...midiNotes) <= MAX_TREBLE_MIDI) {
        out.push({ root, inversion, midiNotes });
      }
    });
  });

  return out.length ? out : [{ root: rootPool[0], inversion: 0, midiNotes: buildMidiVoicing(rootPool[0], chord, 0) }];
}

function buildMidiVoicing(root, chord, inversion) {
  const rootPosition = chord.tones.map((tone) => root.midi + tone.semis);
  const raised = rootPosition.slice(0, inversion).map((midi) => midi + 12);
  return rootPosition.slice(inversion).concat(raised);
}

function buildToneOrder(chord, inversion) {
  const indices = chord.tones.map((_, index) => index);
  return indices.slice(inversion).concat(indices.slice(0, inversion));
}

function buildChoice(chord, root, inversion, mode) {
  const midiNotes = buildMidiVoicing(root, chord, inversion);
  const toneOrder = buildToneOrder(chord, inversion);
  const spelledTones = toneOrder.map((toneIndex) => spellChordTone(root, chord, toneIndex));
  const keySig = keySigForChord(root, chord);
  const abc = buildAbcNotation({ mode, chord, root, inversion, midiNotes, toneOrder, spelledTones, keySig });

  return {
    id: `${root.name}-${chord.id}-${inversion}-${Date.now()}-${Math.random().toString(16).slice(2)}`,
    chord,
    root,
    inversion,
    mode,
    midiNotes,
    toneOrder,
    spelledTones,
    keySig,
    abc,
    answerLabel: `${root.name}${chord.symbol}`,
    detailLabel: `${root.name}${chord.symbol} / ${inversionLabel(inversion)}`
  };
}

function buildDistractors(correct, chordPool, inversions, mode, count) {
  const out = [];
  const seen = new Set([`${correct.root.name}-${correct.chord.id}-${correct.inversion}`]);

  let guard = 0;
  while (out.length < count && guard < 200) {
    guard += 1;

    const chord = randomItem(chordPool);
    const root = Math.random() < 0.55 ? correct.root : randomItem(rootPool);
    const inversion = randomItem(inversions.filter((inv) => inv < chord.tones.length));

    if (inversion === undefined) continue;

    const key = `${root.name}-${chord.id}-${inversion}`;
    if (seen.has(key)) continue;
    seen.add(key);

    const candidate = buildChoice(chord, root, inversion, mode);
    out.push(candidate);
  }

  return out;
}

function spellChordTone(root, chord, toneIndex) {
  const tone = chord.tones[toneIndex];
  const letter = letterFrom(root.letter, tone.step);
  const actualPc = mod12(root.midi + tone.semis);
  const naturalPc = naturalPitchClasses[letter];
  const alt = absoluteAccidentalFromNatural(actualPc, naturalPc);

  return {
    letter,
    alt,
    pc: actualPc,
    label: `${letter}${displayAccidental(alt)}`
  };
}

function keySigForChord(root, chord) {
  const minorContext = new Set(["min", "min7", "mMaj7", "m7b5", "dim", "dim7", "minAdd9"]);
  return minorContext.has(chord.id) ? root.minorKey : root.majorKey;
}

function renderChoices() {
  choiceList.innerHTML = "";
  if (!currentQuestion) return;

  if (currentQuestion.difficulty === "intermediate") {
    renderIntermediateChordTypeChoices();
    return;
  }

  renderAdvancedNotationChoices();
}

function renderIntermediateChordTypeChoices() {
  currentQuestion.choices.forEach((choice) => {
    const card = document.createElement("button");
    card.type = "button";
    card.className = "choice-card chord-choice-card chord-type-answer-card";
    card.dataset.id = choice.id;
    card.dataset.chordId = choice.chordId;

    // 中級：楽譜なし。音の色彩感だけでコード種別を選ぶ。
    card.innerHTML = `
      <span class="choice-top">
        <span class="choice-label">${choice.answerLabel}</span>
      </span>
      <span class="choice-info">${choice.detailLabel}</span>
    `;

    card.addEventListener("click", () => answer(choice.id));
    choiceList.appendChild(card);
  });
}

function renderAdvancedNotationChoices() {
  const renderId = currentQuestion.renderId;

  currentQuestion.choices.forEach((choice, index) => {
    const notationId = `choice-notation-${renderId}-${index}`;
    const card = document.createElement("button");
    card.type = "button";
    card.className = "choice-card chord-choice-card";
    card.dataset.id = choice.id;

    // 上級：和音名・調号名・構成音は隠し、譜例だけ表示。
    card.innerHTML = `
      <span class="choice-top">
        <span class="choice-label">${String.fromCharCode(65 + index)}</span>
        <span class="choice-name">Choice ${String.fromCharCode(65 + index)}</span>
      </span>
      <span class="choice-info">譜例を見て選んでください</span>
      <span class="choice-notation" id="${notationId}"></span>
    `;

    card.addEventListener("click", () => answer(choice.id));
    choiceList.appendChild(card);

    requestAnimationFrame(() => {
      if (!currentQuestion || currentQuestion.renderId !== renderId) return;
      renderAbc(notationId, choice.abc, 230);
    });
  });
}

async function ensureAudio() {
  if (Tone.context.state !== "running") await Tone.start();

  if (!synth) {
    synth = new Tone.PolySynth(Tone.Synth, {
      oscillator: { type: "triangle" },
      envelope: { attack: 0.01, decay: 0.10, sustain: 0.42, release: 0.45 }
    }).toDestination();
    synth.volume.value = -12;
  }

  if (!clickSynth) {
    clickSynth = new Tone.Synth({
      oscillator: { type: "square" },
      envelope: { attack: 0.001, decay: 0.035, sustain: 0, release: 0.01 }
    }).toDestination();
    clickSynth.volume.value = -20;
  }

  return { synth, clickSynth };
}

async function playCurrentQuestion() {
  if (!currentQuestion) {
    setStatus("先に NEW を押してください。", "incorrect");
    return;
  }

  const { synth, clickSynth } = await ensureAudio();
  const now = Tone.now() + 0.12;
  const beatSec = 60 / currentQuestion.tempo;
  const start = now + beatSec;
  const choice = currentQuestion.correct;

  if (!hasAnsweredCurrentQuestion) {
    questionStartTime = performance.now();
    latestResponseTimeSec = null;
    currentTimeEl.textContent = "0.0s";
  }

  clickSynth.triggerAttackRelease("C5", "32n", now);

  if (currentQuestion.mode === "block") {
    synth.triggerAttackRelease(choice.midiNotes.map(midiToToneNote), "2n", start);
  } else if (currentQuestion.mode === "arpUp") {
    choice.midiNotes.forEach((midi, index) => {
      synth.triggerAttackRelease(midiToToneNote(midi), "8n", start + index * 0.18);
    });
  } else if (currentQuestion.mode === "arpDown") {
    choice.midiNotes.slice().reverse().forEach((midi, index) => {
      synth.triggerAttackRelease(midiToToneNote(midi), "8n", start + index * 0.18);
    });
  }

  setStatus(currentQuestion.difficulty === "intermediate"
    ? "再生中。コードの種類をボタンから選んでください。"
    : "再生中。譜例だけを見て右側の3択を選んでください。");
}


function revealChoiceCards() {
  if (!currentQuestion) return;

  if (currentQuestion.difficulty === "intermediate") {
    document.querySelectorAll(".choice-card").forEach((card) => {
      const choice = currentQuestion.choices.find((item) => item.id === card.dataset.id);
      if (!choice) return;
      card.innerHTML = `
        <span class="choice-top">
          <span class="choice-label">${choice.answerLabel}</span>
        </span>
        <span class="choice-info">${choice.detailLabel}</span>
      `;
    });
    return;
  }

  document.querySelectorAll(".choice-card").forEach((card, index) => {
    const choice = currentQuestion.choices.find((item) => item.id === card.dataset.id);
    if (!choice) return;

    const notationId = `revealed-choice-notation-${currentQuestion.renderId}-${index}`;
    card.innerHTML = `
      <span class="choice-top">
        <span class="choice-label">${String.fromCharCode(65 + index)}</span>
        <span class="choice-name">${choice.answerLabel}</span>
      </span>
      <span class="choice-info">${choice.keySig} / ${choice.chord.label} / ${inversionLabel(choice.inversion)}</span>
      <span class="choice-tones">${choice.spelledTones.map((tone) => tone.label).join(" - ")}</span>
      <span class="choice-notation" id="${notationId}"></span>
    `;

    requestAnimationFrame(() => {
      if (!currentQuestion) return;
      renderAbc(notationId, choice.abc, 250);
    });
  });
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

  latestResponseTimeSec = questionStartTime ? Math.max(0, (performance.now() - questionStartTime) / 1000) : null;
  hasAnsweredCurrentQuestion = true;
  totalCount += 1;

  const selected = currentQuestion.choices.find((choice) => choice.id === choiceId);
  const isCorrect = currentQuestion.difficulty === "intermediate"
    ? selected?.chordId === currentQuestion.correct.chord.id
    : choiceId === currentQuestion.correct.id;
  if (isCorrect) correctCount += 1;

  currentTimeEl.textContent = formatResponseTime(latestResponseTimeSec);

  document.querySelectorAll(".choice-card").forEach((card) => {
    card.classList.remove("selected-correct", "selected-incorrect");

    if (currentQuestion.difficulty === "intermediate") {
      if (card.dataset.chordId === currentQuestion.correct.chord.id) card.classList.add("selected-correct");
      if (!isCorrect && card.dataset.id === choiceId) card.classList.add("selected-incorrect");
    } else {
      if (card.dataset.id === currentQuestion.correct.id) card.classList.add("selected-correct");
      if (!isCorrect && card.dataset.id === choiceId) card.classList.add("selected-incorrect");
    }
  });

  revealChoiceCards();

  const correctStatusLabel = currentQuestion.difficulty === "intermediate"
    ? currentQuestion.correct.chord.label
    : currentQuestion.correct.detailLabel;

  setStatus(
    `${isCorrect ? "正解" : "不正解"} / 正解：${correctStatusLabel} / 選択：${selected?.detailLabel || "-"} / ${formatResponseTime(latestResponseTimeSec)}`,
    isCorrect ? "correct" : "incorrect"
  );

  const selectedLabel = currentQuestion.difficulty === "intermediate"
    ? selected?.detailLabel || ""
    : selected?.detailLabel || "";

  const selectedSpelledTones = currentQuestion.difficulty === "advanced" && selected?.spelledTones
    ? selected.spelledTones.map((tone) => tone.label).join(" - ")
    : "";

  const selectedAbc = currentQuestion.difficulty === "advanced" && selected?.abc
    ? selected.abc
    : "";

  resultLog.push({
    number: totalCount,
    correctLabel: currentQuestion.correct.detailLabel,
    selectedLabel,
    difficulty: currentQuestion.difficulty,
    keySig: currentQuestion.correct.keySig,
    spelledTones: currentQuestion.correct.spelledTones.map((tone) => tone.label).join(" - "),
    selectedSpelledTones,
    abc: currentQuestion.correct.abc,
    selectedAbc,
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

  revealChoiceCards();

  const correct = currentQuestion.correct;
  answerText.textContent = currentQuestion.difficulty === "intermediate"
    ? `正解：${correct.chord.label} / 実際の和音：${correct.detailLabel}`
    : `正解：${correct.detailLabel} / 調号 ${correct.keySig}`;
  if (analysisText) analysisText.textContent = `構成音：${correct.spelledTones.map((tone) => tone.label).join(" - ")}。属7の第7音は短7度として理論的に綴ります。`;
  renderAbc("notation", correct.abc, 460);
}

function buildAbcNotation(choice) {
  const notes = choice.spelledTones.map((tone, index) => {
    const midi = choice.midiNotes[index];
    return spelledToneToAbc(tone, midi, choice.keySig);
  });

  const clef = clefForNotes(choice.midiNotes);
  let body = "";

  if (choice.mode === "block") body = `[${notes.join("")}]2 |`;
  if (choice.mode === "arpUp") body = `${notes.join(" ")} |`;
  if (choice.mode === "arpDown") body = `${notes.slice().reverse().join(" ")} |`;

  return `X:1
M:4/4
L:1/4
K:${choice.keySig} clef=${clef}
${body}`;
}

function spelledToneToAbc(tone, midi, keySig) {
  const octave = Math.floor(midi / 12) - 1;
  const keyAlt = keySignatureAlteration(keySig, tone.letter);
  const prefix = keyAlt === tone.alt ? "" : abcAccidentalPrefix(tone.alt);
  return `${prefix}${abcLetterWithOctave(tone.letter, octave)}`;
}

function clefForNotes(notes) {
  const avg = notes.reduce((sum, note) => sum + note, 0) / notes.length;
  return avg < 55 ? "bass" : "treble";
}

function letterFrom(rootLetter, step) {
  const rootIndex = letterOrder.indexOf(rootLetter);
  return letterOrder[(rootIndex + step) % 7];
}

function absoluteAccidentalFromNatural(actualPc, naturalPc) {
  const candidates = [-2, -1, 0, 1, 2];
  const match = candidates.find((alt) => mod12(naturalPc + alt) === actualPc);
  return match ?? 0;
}

function keySignatureAlteration(keySig, letter) {
  const count = keySignatureAccidentalCount(keySig);
  const sharps = ["F", "C", "G", "D", "A", "E", "B"];
  const flats = ["B", "E", "A", "D", "G", "C", "F"];

  if (count > 0) return sharps.slice(0, count).includes(letter) ? 1 : 0;
  if (count < 0) return flats.slice(0, Math.abs(count)).includes(letter) ? -1 : 0;
  return 0;
}

function keySignatureAccidentalCount(keySig) {
  const map = {
    C:0, Am:0,
    G:1, Em:1,
    D:2, Bm:2,
    A:3, "F#m":3,
    E:4, "C#m":4,
    B:5, "G#m":5,
    "F#":6, "D#m":6,
    "C#":7, "A#m":7,
    F:-1, Dm:-1,
    Bb:-2, Gm:-2,
    Eb:-3, Cm:-3,
    Ab:-4, Fm:-4,
    Db:-5, Bbm:-5,
    Gb:-6, Ebm:-6,
    Cb:-7, Abm:-7
  };
  return map[keySig] ?? 0;
}

function abcAccidentalPrefix(alt) {
  if (alt === 0) return "=";
  if (alt === 1) return "^";
  if (alt === 2) return "^^";
  if (alt === -1) return "_";
  if (alt === -2) return "__";
  return "";
}

function displayAccidental(alt) {
  if (alt === 1) return "♯";
  if (alt === 2) return "𝄪";
  if (alt === -1) return "♭";
  if (alt === -2) return "𝄫";
  return "";
}

function abcLetterWithOctave(letter, octave) {
  if (octave >= 5) return letter.toLowerCase() + "'".repeat(octave - 5);
  if (octave <= 3) return letter + ",".repeat(4 - octave);
  return letter;
}

function midiToToneNote(midi) {
  const names = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
  const pc = mod12(midi);
  const octave = Math.floor(midi / 12) - 1;
  return `${names[pc]}${octave}`;
}

function mod12(value) {
  return ((value % 12) + 12) % 12;
}

function modeLabel(mode) {
  return {
    block: "同時",
    arpUp: "上行アルペジオ",
    arpDown: "下行アルペジオ"
  }[mode] || mode;
}

function inversionLabel(inversion) {
  if (inversion === 0) return "基本形";
  if (inversion === 1) return "第1転回形";
  if (inversion === 2) return "第2転回形";
  if (inversion === 3) return "第3転回形";
  return `${inversion}転回形`;
}

function renderAbc(targetId, abc, staffwidth) {
  if (!window.ABCJS) return;
  ABCJS.renderAbc(targetId, abc, {
    responsive: "resize",
    staffwidth,
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
    const detail = item.difficulty === "intermediate"
      ? `${item.correctLabel} / 選択：${item.selectedLabel || "-"} / ${formatResponseTime(item.responseTimeSec)}`
      : `${item.correctLabel} / ${item.spelledTones} / ${formatResponseTime(item.responseTimeSec)}`;

    row.innerHTML = `
      <span>${String(item.number).padStart(2, "0")}</span>
      <span>${detail}</span>
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
    const answeredWithTime = resultLog.filter((item) => item.responseTimeSec !== null);
    const avgTime = answeredWithTime.length
      ? answeredWithTime.reduce((sum, item) => sum + item.responseTimeSec, 0) / answeredWithTime.length
      : null;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.text("Chord Result", 16, 18);

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
      if (y > 220) {
        doc.addPage();
        y = 18;
      }

      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.text(`${String(item.number).padStart(2, "0")}  ${item.correctLabel}  ${item.isCorrect ? "OK" : "NG"}`, 16, y);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.text(`Mode: ${item.difficulty || "advanced"}`, 16, y + 6);
      doc.text(`Correct tones: ${item.spelledTones}`, 16, y + 12);
      doc.text(`Selected: ${item.selectedLabel || "-"}${item.selectedSpelledTones ? " / " + item.selectedSpelledTones : ""} / Time: ${formatResponseTime(item.responseTimeSec)}`, 16, y + 18);

      y += 24;

      if (item.abc) {
        doc.setFont("helvetica", "bold");
        doc.setFontSize(8);
        doc.text("Correct notation", 16, y);
        const notation = await abcToPngDataUrl(item.abc, 760);
        const size = fitImageSize(notation, 174, 32);
        doc.addImage(notation.dataUrl, "PNG", 18 + (174 - size.width) / 2, y + 2, size.width, size.height);
        y += size.height + 8;
      }

      if (item.selectedAbc) {
        if (y > 250) {
          doc.addPage();
          y = 18;
        }

        doc.setFont("helvetica", "bold");
        doc.setFontSize(8);
        doc.text("Selected notation", 16, y);
        const notation = await abcToPngDataUrl(item.selectedAbc, 760);
        const size = fitImageSize(notation, 174, 32);
        doc.addImage(notation.dataUrl, "PNG", 18 + (174 - size.width) / 2, y + 2, size.width, size.height);
        y += size.height + 10;
      }
    }

    doc.save("chord-result.pdf");
    setStatus("正解譜例と選択譜例を含むPDFを出力しました。", "correct");
  } catch (error) {
    console.error(error);
    setStatus("PDF作成中にエラーが発生しました。", "incorrect");
  } finally {
    exportButton.disabled = false;
  }
}

function fitImageSize(notation, maxWidth, maxHeight) {
  const scale = Math.min(maxWidth / notation.widthMm, maxHeight / notation.heightMm);
  return {
    width: notation.widthMm * scale,
    height: notation.heightMm * scale
  };
}

async function abcToPngDataUrl(abc, staffwidth = 620) {
  if (!window.ABCJS) throw new Error("ABCJS is not available.");

  const holder = document.createElement("div");
  holder.style.position = "fixed";
  holder.style.left = "-10000px";
  holder.style.top = "0";
  holder.style.width = `${staffwidth}px`;
  holder.style.background = "#ffffff";
  holder.style.color = "#000000";
  document.body.appendChild(holder);

  try {
    ABCJS.renderAbc(holder, abc, {
      responsive: "resize",
      staffwidth,
      paddingtop: 0,
      paddingbottom: 0,
      paddingleft: 0,
      paddingright: 0,
      add_classes: true
    });

    const svg = holder.querySelector("svg");
    if (!svg) throw new Error("No SVG generated.");

    svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
    svg.style.background = "#ffffff";

    const bbox = svg.getBBox();
    const width = Math.max(1, Math.ceil(bbox.width + 12));
    const height = Math.max(1, Math.ceil(bbox.height + 12));
    svg.setAttribute("width", String(width));
    svg.setAttribute("height", String(height));
    svg.setAttribute("viewBox", `${bbox.x - 6} ${bbox.y - 6} ${width} ${height}`);

    const svgText = new XMLSerializer().serializeToString(svg);
    const svgBlob = new Blob([svgText], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(svgBlob);

    const img = await loadImage(url);
    URL.revokeObjectURL(url);

    const scale = 2;
    const canvas = document.createElement("canvas");
    canvas.width = Math.ceil(width * scale);
    canvas.height = Math.ceil(height * scale);
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

    return {
      dataUrl: canvas.toDataURL("image/png"),
      widthMm: width * 0.264583,
      heightMm: height * 0.264583
    };
  } finally {
    holder.remove();
  }
}

function loadImage(url) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = url;
  });
}

init();

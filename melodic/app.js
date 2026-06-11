function t(text) {
  return window.EarTrainingLang?.translateText(text) || text;
}

const keyDefs = {
  C: { label: "C major", tonic: 60, mode: "major", keySig: "C", scale: [0, 2, 4, 5, 7, 9, 11] },
  G: { label: "G major", tonic: 67, mode: "major", keySig: "G", scale: [0, 2, 4, 5, 7, 9, 11] },
  F: { label: "F major", tonic: 65, mode: "major", keySig: "F", scale: [0, 2, 4, 5, 7, 9, 11] },
  Am: { label: "A minor", tonic: 57, mode: "minor", keySig: "Am", scale: [0, 2, 3, 5, 7, 8, 10] }
};

const majorProgressions = [
  { label: "I - V", degrees: [1, 5] },
  { label: "I - IV", degrees: [1, 4] },
  { label: "I - V - I", degrees: [1, 5] },
  { label: "I - vi", degrees: [1, 6] },
  { label: "ii - V", degrees: [2, 5] },
  { label: "IV - V", degrees: [4, 5] }
];

const minorProgressions = [
  { label: "i - V", degrees: [1, 5] },
  { label: "i - iv", degrees: [1, 4] },
  { label: "i - ♭VI", degrees: [1, 6] },
  { label: "iv - V", degrees: [4, 5] },
  { label: "ii° - V", degrees: [2, 5] }
];

// All rhythm cells sum to 16 sixteenth-units = one 4/4 bar.
// ABC uses L:1/16, so true 16ths stay true 16ths.
const rhythmCells = {
  simple: [
    { label: "four quarters", units: [4, 4, 4, 4], abcDur: ["4", "4", "4", "4"], triplet: [false, false, false, false] },
    { label: "half + quarters", units: [8, 4, 4], abcDur: ["8", "4", "4"], triplet: [false, false, false] },
    { label: "quarters + half", units: [4, 4, 8], abcDur: ["4", "4", "8"], triplet: [false, false, false] }
  ],
  eighth: [
    { label: "eighth pair + quarters", units: [2, 2, 4, 4, 4], abcDur: ["2", "2", "4", "4", "4"], triplet: [false, false, false, false, false] },
    { label: "quarters + eighth pair", units: [4, 4, 2, 2, 4], abcDur: ["4", "4", "2", "2", "4"], triplet: [false, false, false, false, false] },
    { label: "two eighth pairs", units: [2, 2, 4, 2, 2, 4], abcDur: ["2", "2", "4", "2", "2", "4"], triplet: [false, false, false, false, false, false] },
    { label: "dotted opening", units: [3, 1, 4, 4, 4], abcDur: ["3", "", "4", "4", "4"], triplet: [false, false, false, false, false] },
    { label: "reverse dotted", units: [1, 3, 4, 4, 4], abcDur: ["", "3", "4", "4", "4"], triplet: [false, false, false, false, false] },
    { label: "middle dotted", units: [4, 3, 1, 4, 4], abcDur: ["4", "3", "", "4", "4"], triplet: [false, false, false, false, false] },
    { label: "triplet opening", units: [4/3, 4/3, 4/3, 4, 4, 4], abcDur: ["2", "2", "2", "4", "4", "4"], triplet: [true, true, true, false, false, false] },
    { label: "triplet middle", units: [4, 4/3, 4/3, 4/3, 4, 4], abcDur: ["4", "2", "2", "2", "4", "4"], triplet: [false, true, true, true, false, false] },
    { label: "dotted quarter", units: [6, 2, 4, 4], abcDur: ["6", "2", "4", "4"], triplet: [false, false, false, false] }
  ]
};

let currentQuestion = null;
let hasAnsweredCurrentQuestion = false;
let totalCount = 0;
let correctCount = 0;
let resultLog = [];
let questionStartTime = null;
let latestResponseTimeSec = null;
let piano = null;
let fallbackSynth = null;
let instrumentLoadPromise = null;

const choiceList = document.querySelector("#choice-list");
const choiceKeyHeader = document.querySelector("#choice-key-header");
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
  setStatus("NEW を押して、演奏された2小節の旋律を3つの譜例から選んでください。");
}

function getSelectedKeys() {
  return Array.from(document.querySelectorAll('input[name="key"]:checked')).map((input) => input.value);
}

function getLevel() {
  return document.querySelector('input[name="level"]:checked').value;
}

function getRhythmMode() {
  return document.querySelector('input[name="rhythm"]:checked').value;
}

function getTempo() {
  return Number(document.querySelector("#tempo-select").value) || 72;
}

function randomItem(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function shuffle(array) {
  return array.slice().sort(() => Math.random() - 0.5);
}

function newQuestion() {
  const keys = getSelectedKeys();
  if (keys.length === 0) {
    setStatus("少なくとも1つの調を選んでください。", "incorrect");
    return;
  }

  clearFeedback();

  const keyId = randomItem(keys);
  const key = keyDefs[keyId];
  const rhythmMode = getRhythmMode();
  const level = getLevel();

  const harmonicPlan = randomItem(key.mode === "major" ? majorProgressions : minorProgressions);
  const rhythms = chooseTwoBarRhythm(rhythmMode);
  const correct = generateHarmonicMelody(key, harmonicPlan, rhythms, level);
  const distractors = generateDistractors(correct, key, harmonicPlan, rhythms, level, 2);
  const choices = shuffle([correct, ...distractors]);

  currentQuestion = {
    number: totalCount + 1,
    renderId: `m-${Date.now()}-${Math.random().toString(16).slice(2)}`,
    keyId,
    key,
    lengthBars: 2,
    rhythmMode,
    level,
    harmonicPlan,
    tempo: getTempo(),
    correct,
    choices
  };

  hasAnsweredCurrentQuestion = false;
  questionStartTime = null;
  latestResponseTimeSec = null;
  currentTimeEl.textContent = "--";
  answerText.textContent = "";
  analysisText.textContent = "";
  notationEl.innerHTML = "";
  questionDisplay.textContent = key.label.toUpperCase();
  choiceKeyHeader.textContent = `KEY: ${key.label} / 2 BARS / IMPLIED ${harmonicPlan.label}`;

  renderChoices();
  setStatus(`${key.label} / 2小節 / 想定和声：${harmonicPlan.label} / ${levelLabel(level)}。`);
  playCurrentQuestion();
}

function chooseTwoBarRhythm(rhythmMode) {
  const pool = rhythmMode === "simple"
    ? rhythmCells.simple
    : rhythmCells.simple.concat(rhythmCells.eighth);

  return [randomItem(pool), randomItem(pool)];
}

function generateHarmonicMelody(key, harmonicPlan, rhythmBars, level) {
  const notes = [];
  const harmonyDegrees = harmonicPlan.degrees;

  rhythmBars.forEach((rhythm, barIndex) => {
    const chordDegree = harmonyDegrees[barIndex] || harmonyDegrees[harmonyDegrees.length - 1];
    const chordTones = chordToneDegreesForHarmony(key, chordDegree);
    const nextChordDegree = harmonyDegrees[barIndex + 1] || chordDegree;
    const nextChordTones = chordToneDegreesForHarmony(key, nextChordDegree);

    let currentDegree = barIndex === 0
      ? randomItem(chordTones.filter((degree) => degree >= 0 && degree <= 4))
      : notes[notes.length - 1].degree;

    rhythm.units.forEach((unit, eventIndex) => {
      const isStrong = eventIndex === 0 || approxBeatBoundary(rhythm.units, eventIndex);
      const isLastInBar = eventIndex === rhythm.units.length - 1;
      const isLastOverall = barIndex === rhythmBars.length - 1 && isLastInBar;

      if (eventIndex === 0 && barIndex === 0) {
        currentDegree = randomItem(chordTones.filter((degree) => degree >= 0 && degree <= 4));
      } else if (isLastOverall) {
        currentDegree = chooseCadentialEnd(key, harmonicPlan);
      } else if (isLastInBar && barIndex === 0) {
        currentDegree = chooseApproachToNextHarmony(currentDegree, nextChordTones, level);
      } else if (isStrong) {
        currentDegree = chooseNearChordTone(currentDegree, chordTones, level);
      } else {
        currentDegree = choosePassingOrNeighbor(currentDegree, chordTones, level);
      }

      notes.push({
        midi: degreeToMidi(key, currentDegree),
        degree: currentDegree,
        dur: unit,
        abcDur: rhythm.abcDur[eventIndex],
        triplet: rhythm.triplet[eventIndex],
        barIndex,
        harmonicDegree: chordDegree
      });
    });
  });

  return finalizeMelody(key, notes, harmonicPlan);
}

function approxBeatBoundary(units, eventIndex) {
  let pos = 0;
  for (let i = 0; i < eventIndex; i += 1) pos += units[i];
  return Math.abs(pos - 4) < 0.01 || Math.abs(pos - 8) < 0.01 || Math.abs(pos - 12) < 0.01;
}

function chordToneDegreesForHarmony(key, degree) {
  if (key.mode === "major") {
    const map = {
      1: [0, 2, 4, 7],
      2: [1, 3, 5],
      4: [3, 5, 7],
      5: [4, 6, 8],
      6: [5, 7, 9]
    };
    return map[degree] || map[1];
  }

  const map = {
    1: [0, 2, 4, 7],
    2: [1, 3, 5],
    4: [3, 5, 7],
    5: [4, 6, 8],     // harmonic-minor dominant implication
    6: [5, 7, 9]
  };
  return map[degree] || map[1];
}

function chooseCadentialEnd(key, harmonicPlan) {
  const finalHarmony = harmonicPlan.degrees[harmonicPlan.degrees.length - 1];
  if (finalHarmony === 5) return randomItem([4, 6, 8]); // half cadence: V tones
  return randomItem([0, 2, 4, 7]); // stable tonic-area close
}

function chooseApproachToNextHarmony(currentDegree, nextChordTones, level) {
  const candidates = nextChordTones
    .filter((degree) => degree >= 0 && degree <= 9)
    .sort((a, b) => Math.abs(a - currentDegree) - Math.abs(b - currentDegree));

  const filtered = candidates.filter((degree) => Math.abs(degree - currentDegree) <= maxMelodicMove(level) + 1);
  return randomItem((filtered.length ? filtered : candidates).slice(0, 3));
}

function chooseNearChordTone(currentDegree, chordTones, level) {
  const maxMove = maxMelodicMove(level);
  const candidates = chordTones
    .filter((degree) => degree >= 0 && degree <= 9 && Math.abs(degree - currentDegree) <= maxMove + 1)
    .sort((a, b) => Math.abs(a - currentDegree) - Math.abs(b - currentDegree));

  if (candidates.length) return randomItem(candidates.slice(0, 3));
  return currentDegree;
}

function choosePassingOrNeighbor(currentDegree, chordTones, level) {
  const maxMove = maxMelodicMove(level);
  const moves = level === "step"
    ? [-1, 0, 1]
    : level === "thirds"
      ? [-2, -1, 0, 1, 2]
      : [-4, -3, -2, -1, 0, 1, 2, 3, 4];

  const weighted = [];
  moves.forEach((move) => {
    const next = currentDegree + move;
    if (next < 0 || next > 9) return;

    const isChordTone = chordTones.includes(next);
    const distance = Math.abs(move);
    const weight = isChordTone ? 4 : distance <= 1 ? 3 : distance <= maxMove ? 1 : 0;
    for (let i = 0; i < weight; i += 1) weighted.push(next);
  });

  return weighted.length ? randomItem(weighted) : currentDegree;
}

function maxMelodicMove(level) {
  if (level === "step") return 1;
  if (level === "thirds") return 2;
  return 4;
}

function generateDistractors(correct, key, harmonicPlan, rhythmBars, level, count) {
  const out = [];
  const seen = new Set([melodyKey(correct.notes)]);

  let guard = 0;
  while (out.length < count && guard < 100) {
    guard += 1;
    const candidate = mutateMelody(correct, key, harmonicPlan, level);
    const k = melodyKey(candidate.notes);
    if (seen.has(k)) continue;
    seen.add(k);
    out.push(candidate);
  }

  while (out.length < count) {
    const candidate = generateHarmonicMelody(key, harmonicPlan, rhythmBars, level);
    const k = melodyKey(candidate.notes);
    if (!seen.has(k)) {
      seen.add(k);
      out.push(candidate);
    }
  }

  return out;
}

function mutateMelody(correct, key, harmonicPlan, level) {
  const notes = correct.notes.map((note) => ({ ...note }));
  const mutable = notes
    .map((note, index) => ({ note, index }))
    .filter((item) => item.index !== notes.length - 1);

  const changeCount = Math.min(mutable.length, randomItem([1, 2, 2, 3]));
  shuffle(mutable).slice(0, changeCount).forEach(({ note }) => {
    const chordTones = chordToneDegreesForHarmony(key, note.harmonicDegree);
    if (Math.random() < 0.65) {
      note.degree = chooseNearChordTone(note.degree, chordTones, level);
    } else {
      note.degree = choosePassingOrNeighbor(note.degree, chordTones, level);
    }
    note.midi = degreeToMidi(key, note.degree);
  });

  return finalizeMelody(key, notes, harmonicPlan);
}

function finalizeMelody(key, notes, harmonicPlan) {
  const abc = buildAbc(key, notes);
  return {
    id: `mel-${Date.now()}-${Math.random().toString(16).slice(2)}`,
    key,
    notes,
    contour: contourFromNotes(notes),
    harmonicLabel: harmonicPlan.label,
    abc,
    label: contourFromNotes(notes).join(" ")
  };
}

function degreeToMidi(key, degree) {
  const octave = Math.floor(degree / 7) * 12;
  const scaleDegree = ((degree % 7) + 7) % 7;

  if (key.mode === "minor" && scaleDegree === 6) {
    // For melodic/harmonic dominant implication, allow raised leading tone when degree 6 appears over V.
    return key.tonic + 11 + octave;
  }

  return key.tonic + key.scale[scaleDegree] + octave;
}

function contourFromNotes(notes) {
  const contour = [];
  for (let i = 1; i < notes.length; i += 1) {
    const diff = notes[i].midi - notes[i - 1].midi;
    contour.push(diff > 0 ? "↑" : diff < 0 ? "↓" : "→");
  }
  return contour;
}

function melodyKey(notes) {
  return notes.map((note) => `${note.midi}:${note.dur}:${note.abcDur}:${note.triplet}`).join("|");
}

function renderChoices() {
  choiceList.innerHTML = "";
  if (!currentQuestion) return;

  const renderId = currentQuestion.renderId;

  currentQuestion.choices.forEach((choice, index) => {
    const notationId = `choice-notation-${renderId}-${index}`;
    const card = document.createElement("button");
    card.type = "button";
    card.className = "choice-card";
    card.dataset.id = choice.id;
    card.innerHTML = `
      <span class="choice-top">
        <span class="choice-label">${String.fromCharCode(65 + index)}</span>
        <span class="choice-info">${currentQuestion.key.label}</span>
      </span>
      <span class="choice-contour">${choice.contour.join(" ") || "single line"}</span>
      <span class="choice-notation" id="${notationId}"></span>
    `;
    card.addEventListener("click", () => answer(choice.id));
    choiceList.appendChild(card);

    requestAnimationFrame(() => {
      if (!currentQuestion || currentQuestion.renderId !== renderId) return;
      renderAbc(notationId, choice.abc, 310);
    });
  });
}

async function ensureAudio() {
  if (Tone.context.state !== "running") await Tone.start();
  if (!instrumentLoadPromise) instrumentLoadPromise = createInstrument();
  return instrumentLoadPromise;
}

async function createInstrument() {
  piano = new Tone.Sampler({
    urls: {
      "A0":"A0.mp3","C1":"C1.mp3","D#1":"Ds1.mp3","F#1":"Fs1.mp3",
      "A1":"A1.mp3","C2":"C2.mp3","D#2":"Ds2.mp3","F#2":"Fs2.mp3",
      "A2":"A2.mp3","C3":"C3.mp3","D#3":"Ds3.mp3","F#3":"Fs3.mp3",
      "A3":"A3.mp3","C4":"C4.mp3","D#4":"Ds4.mp3","F#4":"Fs4.mp3",
      "A4":"A4.mp3","C5":"C5.mp3","D#5":"Ds5.mp3","F#5":"Fs5.mp3",
      "A5":"A5.mp3","C6":"C6.mp3","D#6":"Ds6.mp3","F#6":"Fs6.mp3",
      "A6":"A6.mp3","C7":"C7.mp3","D#7":"Ds7.mp3","F#7":"Fs7.mp3",
      "A7":"A7.mp3","C8":"C8.mp3"
    },
    release: 0.8,
    baseUrl: "https://tonejs.github.io/audio/salamander/"
  }).toDestination();
  piano.volume.value = -6;

  fallbackSynth = new Tone.PolySynth(Tone.Synth, {
    oscillator: { type: "triangle" },
    envelope: { attack: 0.01, decay: 0.08, sustain: 0.45, release: 0.35 }
  }).toDestination();
  fallbackSynth.volume.value = -12;

  await Tone.loaded();
  return piano;
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
    instrument = fallbackSynth;
  }

  const now = Tone.now() + 0.12;
  const quarterSec = 60 / currentQuestion.tempo;
  let cursor = now;

  if (!hasAnsweredCurrentQuestion) {
    questionStartTime = performance.now();
    latestResponseTimeSec = null;
    currentTimeEl.textContent = "0.0s";
  }

  currentQuestion.correct.notes.forEach((note) => {
    const durSec = (note.dur / 4) * quarterSec;
    instrument.triggerAttackRelease(midiToToneNote(note.midi), Math.max(0.08, durSec * 0.88), cursor);
    cursor += durSec;
  });

  setStatus(`${currentQuestion.key.label} / 2小節 / 想定和声：${currentQuestion.harmonicPlan.label}`);
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
    if (card.dataset.id === currentQuestion.correct.id) card.classList.add("selected-correct");
    if (!isCorrect && card.dataset.id === choiceId) card.classList.add("selected-incorrect");
  });

  const selected = currentQuestion.choices.find((item) => item.id === choiceId);

  setStatus(
    `${isCorrect ? "正解" : "不正解"} / ${currentQuestion.key.label} / ${currentQuestion.harmonicPlan.label} / ${formatResponseTime(latestResponseTimeSec)}`,
    isCorrect ? "correct" : "incorrect"
  );

  resultLog.push({
    number: totalCount,
    keyLabel: currentQuestion.key.label,
    lengthBars: 2,
    level: currentQuestion.level,
    rhythmMode: currentQuestion.rhythmMode,
    harmony: currentQuestion.harmonicPlan.label,
    correctContour: currentQuestion.correct.contour.join(" "),
    selectedContour: selected?.contour.join(" ") || "",
    correctAbc: currentQuestion.correct.abc,
    selectedAbc: selected ? selected.abc : "",
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

  answerText.textContent = `正解：${currentQuestion.key.label} / 2小節 / 想定和声：${currentQuestion.harmonicPlan.label}`;
  analysisText.textContent = `旋律輪郭：${currentQuestion.correct.contour.join(" ") || "単音"} / ${levelLabel(currentQuestion.level)}`;
  renderAbc("notation", currentQuestion.correct.abc, 620);
}

function buildAbc(key, notes) {
  const bar1 = [];
  const bar2 = [];

  notes.forEach((note) => {
    const token = `${note.triplet ? "(3" : ""}${midiToAbc(note.midi)}${note.abcDur}`;
    if (note.barIndex === 0) bar1.push(token);
    else bar2.push(token);
  });

  return `X:1
M:4/4
L:1/16
K:${key.keySig}
${bar1.join(" ")} | ${bar2.join(" ")} |`;
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

function midiToToneNote(midi) {
  const names = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];
  const pc = ((midi % 12) + 12) % 12;
  const octave = Math.floor(midi / 12) - 1;
  return `${names[pc]}${octave}`;
}

function midiToAbc(midi) {
  const sharpNames = ["C", "^C", "D", "^D", "E", "F", "^F", "G", "^G", "A", "^A", "B"];
  const pc = ((midi % 12) + 12) % 12;
  const octave = Math.floor(midi / 12) - 1;
  let name = sharpNames[pc];

  if (octave >= 5) {
    name = name.toLowerCase() + "'".repeat(octave - 5);
  } else if (octave <= 3) {
    name = name + ",".repeat(4 - octave);
  }

  return name;
}

function levelLabel(level) {
  if (level === "step") return "順次進行中心";
  if (level === "thirds") return "3度跳躍まで";
  return "4度・5度少し";
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
      <span>${item.keyLabel} / ${item.harmony} / ${formatResponseTime(item.responseTimeSec)}</span>
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
    doc.text("Melodic Dictation Result", 16, 18);

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
      doc.text(`${String(item.number).padStart(2, "0")}  ${item.keyLabel}  ${item.harmony}  ${item.isCorrect ? "OK" : "NG"}`, 16, y);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.text(`Correct contour: ${item.correctContour || "-"}`, 16, y + 6);
      doc.text(`Selected contour: ${item.selectedContour || "-"} / Time: ${formatResponseTime(item.responseTimeSec)}`, 16, y + 12);

      y += 18;

      if (item.correctAbc) {
        doc.setFont("helvetica", "bold");
        doc.setFontSize(8);
        doc.text("Correct notation", 16, y);
        const correctNotation = await abcToPngDataUrl(item.correctAbc, 700);
        const correctSize = fitImageSize(correctNotation, 174, 30);
        doc.addImage(correctNotation.dataUrl, "PNG", 18 + (174 - correctSize.width) / 2, y + 2, correctSize.width, correctSize.height);
        y += correctSize.height + 8;
      }

      if (item.selectedAbc) {
        if (y > 250) {
          doc.addPage();
          y = 18;
        }
        doc.setFont("helvetica", "bold");
        doc.setFontSize(8);
        doc.text("Selected notation", 16, y);
        const selectedNotation = await abcToPngDataUrl(item.selectedAbc, 700);
        const selectedSize = fitImageSize(selectedNotation, 174, 30);
        doc.addImage(selectedNotation.dataUrl, "PNG", 18 + (174 - selectedSize.width) / 2, y + 2, selectedSize.width, selectedSize.height);
        y += selectedSize.height + 10;
      } else {
        y += 8;
      }
    }

    doc.save("melodic-dictation-result.pdf");
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

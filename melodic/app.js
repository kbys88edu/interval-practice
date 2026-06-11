function t(text) {
  return window.EarTrainingLang?.translateText(text) || text;
}

const keyDefs = {
  C:  { label: "C major",  tonic: 60, mode: "major", keySig: "C",  scale: [0, 2, 4, 5, 7, 9, 11] },
  Db: { label: "Db major", tonic: 61, mode: "major", keySig: "Db", scale: [0, 2, 4, 5, 7, 9, 11] },
  D:  { label: "D major",  tonic: 62, mode: "major", keySig: "D",  scale: [0, 2, 4, 5, 7, 9, 11] },
  Eb: { label: "Eb major", tonic: 63, mode: "major", keySig: "Eb", scale: [0, 2, 4, 5, 7, 9, 11] },
  E:  { label: "E major",  tonic: 64, mode: "major", keySig: "E",  scale: [0, 2, 4, 5, 7, 9, 11] },
  F:  { label: "F major",  tonic: 65, mode: "major", keySig: "F",  scale: [0, 2, 4, 5, 7, 9, 11] },
  Gb: { label: "Gb major", tonic: 66, mode: "major", keySig: "Gb", scale: [0, 2, 4, 5, 7, 9, 11] },
  G:  { label: "G major",  tonic: 67, mode: "major", keySig: "G",  scale: [0, 2, 4, 5, 7, 9, 11] },
  Ab: { label: "Ab major", tonic: 68, mode: "major", keySig: "Ab", scale: [0, 2, 4, 5, 7, 9, 11] },
  A:  { label: "A major",  tonic: 69, mode: "major", keySig: "A",  scale: [0, 2, 4, 5, 7, 9, 11] },
  Bb: { label: "Bb major", tonic: 70, mode: "major", keySig: "Bb", scale: [0, 2, 4, 5, 7, 9, 11] },
  B:  { label: "B major",  tonic: 71, mode: "major", keySig: "B",  scale: [0, 2, 4, 5, 7, 9, 11] },

  Cm:  { label: "C minor",  tonic: 60, mode: "minor", keySig: "Cm",  scale: [0, 2, 3, 5, 7, 8, 10] },
  Csm: { label: "C# minor", tonic: 61, mode: "minor", keySig: "C#m", scale: [0, 2, 3, 5, 7, 8, 10] },
  Dm:  { label: "D minor",  tonic: 62, mode: "minor", keySig: "Dm",  scale: [0, 2, 3, 5, 7, 8, 10] },
  Ebm: { label: "Eb minor", tonic: 63, mode: "minor", keySig: "Ebm", scale: [0, 2, 3, 5, 7, 8, 10] },
  Em:  { label: "E minor",  tonic: 64, mode: "minor", keySig: "Em",  scale: [0, 2, 3, 5, 7, 8, 10] },
  Fm:  { label: "F minor",  tonic: 65, mode: "minor", keySig: "Fm",  scale: [0, 2, 3, 5, 7, 8, 10] },
  Fsm: { label: "F# minor", tonic: 66, mode: "minor", keySig: "F#m", scale: [0, 2, 3, 5, 7, 8, 10] },
  Gm:  { label: "G minor",  tonic: 67, mode: "minor", keySig: "Gm",  scale: [0, 2, 3, 5, 7, 8, 10] },
  Abm: { label: "Ab minor", tonic: 68, mode: "minor", keySig: "Abm", scale: [0, 2, 3, 5, 7, 8, 10] },
  Am:  { label: "A minor",  tonic: 69, mode: "minor", keySig: "Am",  scale: [0, 2, 3, 5, 7, 8, 10] },
  Bbm: { label: "Bb minor", tonic: 70, mode: "minor", keySig: "Bbm", scale: [0, 2, 3, 5, 7, 8, 10] },
  Bm:  { label: "B minor",  tonic: 71, mode: "minor", keySig: "Bm",  scale: [0, 2, 3, 5, 7, 8, 10] }
};

const allKeyIds = Object.keys(keyDefs);

const progressions = {
  major: [
    { label: "I - V - I", roman: ["I", "V"], harmony: [1, 5], final: 0 },
    { label: "I - IV - V", roman: ["I", "IV"], harmony: [1, 4], final: 4 },
    { label: "I - vi - IV", roman: ["I", "vi"], harmony: [1, 6], final: 5 },
    { label: "ii - V - I", roman: ["ii", "V"], harmony: [2, 5], final: 0 },
    { label: "IV - V - I", roman: ["IV", "V"], harmony: [4, 5], final: 0 }
  ],
  minor: [
    { label: "i - V - i", roman: ["i", "V"], harmony: [1, 5], final: 0 },
    { label: "i - iv - V", roman: ["i", "iv"], harmony: [1, 4], final: 4 },
    { label: "iv - V - i", roman: ["iv", "V"], harmony: [4, 5], final: 0 },
    { label: "i - ♭VI - V", roman: ["i", "♭VI"], harmony: [1, 6], final: 4 },
    { label: "ii° - V - i", roman: ["ii°", "V"], harmony: [2, 5], final: 0 }
  ]
};

// One bar = 16 sixteenth units. Each group inside a bar is one beat group.
// Tokens are joined within a group, spaces separate beat groups, so beams follow beat units.
const rhythmPatterns = [
  {
    id: "simple-quarters",
    group: "simple",
    label: "four quarters",
    bars: [
      [{ units: 4, abcDur: "4" }, { units: 4, abcDur: "4" }, { units: 4, abcDur: "4" }, { units: 4, abcDur: "4" }],
      [{ units: 4, abcDur: "4" }, { units: 4, abcDur: "4" }, { units: 4, abcDur: "4" }, { units: 4, abcDur: "4" }]
    ]
  },
  {
    id: "eighth-pairs",
    group: "eighth",
    label: "eighth pairs",
    bars: [
      [{ units: 2, abcDur: "2" }, { units: 2, abcDur: "2" }, { units: 4, abcDur: "4" }, { units: 2, abcDur: "2" }, { units: 2, abcDur: "2" }, { units: 4, abcDur: "4" }],
      [{ units: 4, abcDur: "4" }, { units: 2, abcDur: "2" }, { units: 2, abcDur: "2" }, { units: 4, abcDur: "4" }, { units: 4, abcDur: "4" }]
    ]
  },
  {
    id: "dotted-opening",
    group: "dotted",
    label: "dotted eighth",
    bars: [
      [{ units: 3, abcDur: "3" }, { units: 1, abcDur: "" }, { units: 4, abcDur: "4" }, { units: 4, abcDur: "4" }, { units: 4, abcDur: "4" }],
      [{ units: 4, abcDur: "4" }, { units: 3, abcDur: "3" }, { units: 1, abcDur: "" }, { units: 4, abcDur: "4" }, { units: 4, abcDur: "4" }]
    ]
  },
  {
    id: "reverse-dotted",
    group: "dotted",
    label: "reverse dotted",
    bars: [
      [{ units: 1, abcDur: "" }, { units: 3, abcDur: "3" }, { units: 4, abcDur: "4" }, { units: 4, abcDur: "4" }, { units: 4, abcDur: "4" }],
      [{ units: 4, abcDur: "4" }, { units: 4, abcDur: "4" }, { units: 1, abcDur: "" }, { units: 3, abcDur: "3" }, { units: 4, abcDur: "4" }]
    ]
  },
  {
    id: "dotted-quarter",
    group: "dotted",
    label: "dotted quarter",
    bars: [
      [{ units: 6, abcDur: "6" }, { units: 2, abcDur: "2" }, { units: 4, abcDur: "4" }, { units: 4, abcDur: "4" }],
      [{ units: 4, abcDur: "4" }, { units: 6, abcDur: "6" }, { units: 2, abcDur: "2" }, { units: 4, abcDur: "4" }]
    ]
  },
  {
    id: "triplet-first",
    group: "triplet",
    label: "triplet first beat",
    bars: [
      [{ units: 4/3, abcDur: "2", triplet: "start" }, { units: 4/3, abcDur: "2", triplet: "mid" }, { units: 4/3, abcDur: "2", triplet: "mid" }, { units: 4, abcDur: "4" }, { units: 4, abcDur: "4" }, { units: 4, abcDur: "4" }],
      [{ units: 4, abcDur: "4" }, { units: 4, abcDur: "4" }, { units: 4/3, abcDur: "2", triplet: "start" }, { units: 4/3, abcDur: "2", triplet: "mid" }, { units: 4/3, abcDur: "2", triplet: "mid" }, { units: 4, abcDur: "4" }]
    ]
  },
  {
    id: "triplet-middle",
    group: "triplet",
    label: "triplet middle",
    bars: [
      [{ units: 4, abcDur: "4" }, { units: 4/3, abcDur: "2", triplet: "start" }, { units: 4/3, abcDur: "2", triplet: "mid" }, { units: 4/3, abcDur: "2", triplet: "mid" }, { units: 4, abcDur: "4" }, { units: 4, abcDur: "4" }],
      [{ units: 4, abcDur: "4" }, { units: 4, abcDur: "4" }, { units: 4, abcDur: "4" }, { units: 4/3, abcDur: "2", triplet: "start" }, { units: 4/3, abcDur: "2", triplet: "mid" }, { units: 4/3, abcDur: "2", triplet: "mid" }]
    ]
  }
];


rhythmPatterns.push(
  {
    id: "sixteenth-run",
    group: "sixteenth",
    label: "sixteenth run",
    bars: [
      [{ units: 1, abcDur: "" }, { units: 1, abcDur: "" }, { units: 1, abcDur: "" }, { units: 1, abcDur: "" }, { units: 4, abcDur: "4" }, { units: 4, abcDur: "4" }, { units: 4, abcDur: "4" }],
      [{ units: 4, abcDur: "4" }, { units: 1, abcDur: "" }, { units: 1, abcDur: "" }, { units: 1, abcDur: "" }, { units: 1, abcDur: "" }, { units: 4, abcDur: "4" }, { units: 4, abcDur: "4" }]
    ]
  },
  {
    id: "eighth-two-sixteenths",
    group: "sixteenth",
    label: "eighth + two sixteenths",
    bars: [
      [{ units: 2, abcDur: "2" }, { units: 1, abcDur: "" }, { units: 1, abcDur: "" }, { units: 4, abcDur: "4" }, { units: 2, abcDur: "2" }, { units: 1, abcDur: "" }, { units: 1, abcDur: "" }, { units: 4, abcDur: "4" }],
      [{ units: 4, abcDur: "4" }, { units: 2, abcDur: "2" }, { units: 1, abcDur: "" }, { units: 1, abcDur: "" }, { units: 4, abcDur: "4" }, { units: 4, abcDur: "4" }]
    ]
  },
  {
    id: "two-sixteenths-eighth",
    group: "sixteenth",
    label: "two sixteenths + eighth",
    bars: [
      [{ units: 1, abcDur: "" }, { units: 1, abcDur: "" }, { units: 2, abcDur: "2" }, { units: 4, abcDur: "4" }, { units: 4, abcDur: "4" }, { units: 4, abcDur: "4" }],
      [{ units: 4, abcDur: "4" }, { units: 4, abcDur: "4" }, { units: 1, abcDur: "" }, { units: 1, abcDur: "" }, { units: 2, abcDur: "2" }, { units: 4, abcDur: "4" }]
    ]
  },
  {
    id: "syncopated-sixteenth",
    group: "sixteenth",
    label: "syncopated sixteenth",
    bars: [
      [{ units: 2, abcDur: "2" }, { units: 1, abcDur: "" }, { units: 1, abcDur: "" }, { units: 2, abcDur: "2" }, { units: 2, abcDur: "2" }, { units: 4, abcDur: "4" }, { units: 4, abcDur: "4" }],
      [{ units: 4, abcDur: "4" }, { units: 4, abcDur: "4" }, { units: 2, abcDur: "2" }, { units: 1, abcDur: "" }, { units: 1, abcDur: "" }, { units: 4, abcDur: "4" }]
    ]
  }
);

let currentQuestion = null;
let hasAnsweredCurrentQuestion = false;
let totalCount = 0;
let correctCount = 0;
let resultLog = [];
let questionStartTime = null;
let latestResponseTimeSec = null;
let melodySynth = null;
let clickSynth = null;

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

function getSelectedValues(name) {
  return Array.from(document.querySelectorAll(`input[name="${name}"]:checked`)).map((input) => input.value);
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
  const keyIds = allKeyIds;
  const selectedFigures = getSelectedValues("figure");
  const selectedRhythms = getSelectedValues("rhythm");

  if (selectedFigures.length === 0) {
    setStatus("旋律型を1つ以上選んでください。", "incorrect");
    return;
  }

  if (selectedRhythms.length === 0) {
    setStatus("リズムを1つ以上選んでください。", "incorrect");
    return;
  }

  clearFeedback();

  const key = keyDefs[randomItem(keyIds)];
  const progression = randomItem(progressions[key.mode]);
  const rhythmPool = rhythmPatterns.filter((pattern) => selectedRhythms.includes(pattern.group));
  const rhythm = randomItem(rhythmPool);

  const correct = buildMelody(key, progression, rhythm, selectedFigures);
  const distractors = buildMelodyDistractors(correct, key, progression, rhythm, selectedFigures, 2);
  const choices = shuffle([correct, ...distractors]);

  currentQuestion = {
    number: totalCount + 1,
    renderId: `mel-${Date.now()}-${Math.random().toString(16).slice(2)}`,
    key,
    progression,
    rhythm,
    figures: selectedFigures,
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
  choiceKeyHeader.textContent = `KEY: ${key.label} / 2 BARS / ${progression.label}`;

  renderChoices();
  setStatus(`${key.label} / 2小節 / 全調ランダム / 想定和声：${progression.label} / ${rhythm.label}`);
  playCurrentQuestion();
}

function buildMelody(key, progression, rhythm, selectedFigures) {
  const events = [];
  rhythm.bars.forEach((bar, barIndex) => {
    bar.forEach((cell, eventIndex) => {
      const position = sumUnits(bar, eventIndex);
      const harmonyDegree = progression.harmony[barIndex] || progression.harmony[progression.harmony.length - 1];
      events.push({
        ...cell,
        barIndex,
        eventIndex,
        position,
        harmonyDegree,
        role: "chord"
      });
    });
  });

  const notes = [];
  let previousDegree = null;

  events.forEach((event, index) => {
    const isFirst = index === 0;
    const isLast = index === events.length - 1;
    const isStrong = event.position === 0 || event.position === 4 || event.position === 8 || event.position === 12;
    const chordTones = chordToneDegrees(key, event.harmonyDegree);
    const nextEvent = events[index + 1];
    const prevNote = notes[notes.length - 1];

    let degree;
    let role = "chord";

    if (isFirst) {
      degree = chooseOpeningDegree(chordTones);
    } else if (isLast) {
      degree = cadenceDegree(key, progression);
      role = "cadence";
    } else if (selectedFigures.includes("suspension") && canMakeSuspension(event, prevNote, chordTones)) {
      degree = prevNote.degree;
      role = "suspension";
    } else if (!isStrong && selectedFigures.includes("passing") && prevNote && nextEvent) {
      const target = chooseNearChordTone(prevNote.degree, chordToneDegrees(key, nextEvent.harmonyDegree));
      const passing = choosePassingDegree(prevNote.degree, target);
      degree = passing ?? chooseNeighborOrChord(prevNote.degree, chordTones, selectedFigures);
      role = passing === null ? "neighbor" : "passing";
    } else if (!isStrong && selectedFigures.includes("neighbor") && prevNote) {
      degree = chooseNeighborDegree(prevNote.degree, key);
      role = "neighbor";
    } else {
      degree = chooseNearChordTone(previousDegree, chordTones);
    }

    if (!Number.isFinite(degree)) degree = chooseNearChordTone(previousDegree, chordTones);
    degree = clampDegree(degree);

    const note = {
      ...event,
      degree,
      midi: degreeToMidi(key, degree, event.harmonyDegree),
      role
    };

    notes.push(note);
    previousDegree = degree;
  });

  return finalizeMelody(key, progression, rhythm, notes);
}

function sumUnits(bar, eventIndex) {
  let total = 0;
  for (let i = 0; i < eventIndex; i += 1) total += bar[i].units;
  return Math.round(total * 1000) / 1000;
}

function chooseOpeningDegree(chordTones) {
  return randomItem(chordTones.filter((degree) => degree >= 0 && degree <= 4));
}

function cadenceDegree(key, progression) {
  if (progression.final === 4) return 4;
  return randomItem([0, 0, 2, 4, 7]);
}

function canMakeSuspension(event, prevNote, chordTones) {
  if (!prevNote) return false;
  if (!(event.position === 0 || event.position === 4 || event.position === 8 || event.position === 12)) return false;
  if (chordTones.includes(prevNote.degree)) return false;
  return Math.abs(prevNote.degree - chordTones[0]) <= 4;
}

function choosePassingDegree(fromDegree, toDegree) {
  const diff = toDegree - fromDegree;
  if (Math.abs(diff) < 2) return null;
  return fromDegree + Math.sign(diff);
}

function chooseNeighborDegree(centerDegree, key) {
  const candidates = [centerDegree - 1, centerDegree + 1].filter((degree) => degree >= 0 && degree <= 9);
  return candidates.length ? randomItem(candidates) : centerDegree;
}

function chooseNeighborOrChord(prevDegree, chordTones, selectedFigures) {
  if (selectedFigures.includes("neighbor") && Math.random() < 0.7) return chooseNeighborDegree(prevDegree);
  return chooseNearChordTone(prevDegree, chordTones);
}

function chooseNearChordTone(previousDegree, chordTones) {
  const inRange = chordTones.filter((degree) => degree >= 0 && degree <= 9);
  if (!Number.isFinite(previousDegree)) return randomItem(inRange);
  const sorted = inRange.slice().sort((a, b) => Math.abs(a - previousDegree) - Math.abs(b - previousDegree));
  return randomItem(sorted.slice(0, Math.min(3, sorted.length)));
}

function chordToneDegrees(key, harmonyDegree) {
  if (key.mode === "major") {
    const map = {
      1: [0, 2, 4, 7],
      2: [1, 3, 5, 8],
      4: [3, 5, 7],
      5: [4, 6, 8],
      6: [5, 7, 9]
    };
    return map[harmonyDegree] || map[1];
  }

  const map = {
    1: [0, 2, 4, 7],
    2: [1, 3, 5],
    4: [3, 5, 7],
    5: [4, 6, 8],
    6: [5, 7, 9]
  };
  return map[harmonyDegree] || map[1];
}

function clampDegree(degree) {
  return Math.max(0, Math.min(9, degree));
}

function degreeToMidi(key, degree, harmonyDegree) {
  const octaveShift = Math.floor(degree / 7) * 12;
  const scaleDegree = ((degree % 7) + 7) % 7;

  if (key.mode === "minor" && harmonyDegree === 5 && scaleDegree === 6) {
    return key.tonic + 11 + octaveShift;
  }

  return key.tonic + key.scale[scaleDegree] + octaveShift;
}

function buildMelodyDistractors(correct, key, progression, rhythm, selectedFigures, count) {
  const out = [];
  const seen = new Set([melodyKey(correct.notes)]);

  let guard = 0;
  while (out.length < count && guard < 100) {
    guard += 1;
    const candidate = mutateMelody(correct, key, progression);
    const k = melodyKey(candidate.notes);
    if (seen.has(k)) continue;
    seen.add(k);
    out.push(candidate);
  }

  return out;
}

function mutateMelody(correct, key, progression) {
  const notes = correct.notes.map((note) => ({ ...note }));
  const mutable = notes.map((note, index) => ({ note, index })).filter((item) => item.index > 0 && item.index < notes.length - 1);
  const count = Math.min(mutable.length, randomItem([1, 2, 2, 3]));

  shuffle(mutable).slice(0, count).forEach(({ note }) => {
    const chordTones = chordToneDegrees(key, note.harmonyDegree);
    if (note.role === "passing") {
      note.degree = chooseNeighborDegree(note.degree, key);
      note.role = "neighbor";
    } else if (note.role === "neighbor") {
      note.degree = chooseNearChordTone(note.degree, chordTones);
      note.role = "chord";
    } else if (note.role === "suspension") {
      note.degree = chooseNearChordTone(note.degree, chordTones);
      note.role = "resolution";
    } else {
      note.degree = chooseNeighborDegree(note.degree, key);
      note.role = "neighbor";
    }
    note.degree = clampDegree(note.degree);
    note.midi = degreeToMidi(key, note.degree, note.harmonyDegree);
  });

  return finalizeMelody(key, progression, correct.rhythm, notes);
}

function finalizeMelody(key, progression, rhythm, notes) {
  const abc = buildAbc(key, notes);
  const contour = contourFromNotes(notes);
  const roles = Array.from(new Set(notes.map((note) => note.role))).join(" / ");
  return {
    id: `mel-${Date.now()}-${Math.random().toString(16).slice(2)}`,
    key,
    progression,
    rhythm,
    notes,
    contour,
    roles,
    abc,
    label: contour.join(" ")
  };
}

function melodyKey(notes) {
  return notes.map((note) => `${note.midi}:${note.units}:${note.role}`).join("|");
}

function contourFromNotes(notes) {
  const contour = [];
  for (let i = 1; i < notes.length; i += 1) {
    const diff = notes[i].midi - notes[i - 1].midi;
    contour.push(diff > 0 ? "↑" : diff < 0 ? "↓" : "→");
  }
  return contour;
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
        <span class="choice-meter">${currentQuestion.key.label}</span>
      </span>
      <span class="choice-notation" id="${notationId}"></span>
    `;
    card.addEventListener("click", () => answer(choice.id));
    choiceList.appendChild(card);

    requestAnimationFrame(() => {
      if (!currentQuestion || currentQuestion.renderId !== renderId) return;
      renderAbc(notationId, choice.abc, 330);
    });
  });
}

async function ensureAudio() {
  if (Tone.context.state !== "running") await Tone.start();

  if (!melodySynth) {
    melodySynth = new Tone.PolySynth(Tone.Synth, {
      oscillator: { type: "triangle" },
      envelope: { attack: 0.01, decay: 0.10, sustain: 0.35, release: 0.28 }
    }).toDestination();
    melodySynth.volume.value = -10;
  }

  if (!clickSynth) {
    clickSynth = new Tone.Synth({
      oscillator: { type: "square" },
      envelope: { attack: 0.001, decay: 0.035, sustain: 0, release: 0.01 }
    }).toDestination();
    clickSynth.volume.value = -18;
  }

  return { melodySynth, clickSynth };
}

async function playCurrentQuestion() {
  if (!currentQuestion) {
    setStatus("先に NEW を押してください。", "incorrect");
    return;
  }

  const { melodySynth, clickSynth } = await ensureAudio();

  const tempo = currentQuestion.tempo;
  const quarterSec = 60 / tempo;
  const sixteenthSec = quarterSec / 4;
  const now = Tone.now() + 0.12;
  const barStart = now + 4 * quarterSec;

  if (!hasAnsweredCurrentQuestion) {
    questionStartTime = performance.now();
    latestResponseTimeSec = null;
    currentTimeEl.textContent = "0.0s";
  }

  // Count-in only. No metronome during melody.
  for (let i = 0; i < 4; i += 1) {
    clickSynth.triggerAttackRelease(i === 0 ? "A5" : "C5", "32n", now + i * quarterSec);
  }

  currentQuestion.correct.notes.forEach((note) => {
    const start = barStart + (note.barIndex * 16 + note.position) * sixteenthSec;
    const durSec = note.units * sixteenthSec;
    melodySynth.triggerAttackRelease(midiToToneNote(note.midi), Math.max(0.06, durSec * 0.88), start);
  });

  setStatus(`${currentQuestion.key.label} / 2小節 / ${currentQuestion.progression.label} / カウント後に旋律のみ再生します。`);
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
    `${isCorrect ? "正解" : "不正解"} / ${currentQuestion.key.label} / ${currentQuestion.progression.label} / ${formatResponseTime(latestResponseTimeSec)}`,
    isCorrect ? "correct" : "incorrect"
  );

  resultLog.push({
    number: totalCount,
    keyLabel: currentQuestion.key.label,
    harmony: currentQuestion.progression.label,
    roles: currentQuestion.correct.roles,
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

  answerText.textContent = `正解：${currentQuestion.key.label} / 2小節 / 想定和声：${currentQuestion.progression.label}`;
  analysisText.textContent = `含まれる要素：${currentQuestion.correct.roles}`;
  renderAbc("notation", currentQuestion.correct.abc, 680);
}

function buildAbc(key, notes) {
  // Notes are converted to ABC tokens first, then grouped by quarter-note beat.
  // The spelling is key-aware: diatonic notes covered by the key signature do
  // not receive redundant accidentals. Only chromatic notes, such as the raised
  // leading tone in minor, receive accidentals.
  const bars = [[], []];

  notes.forEach((note) => {
    const prefix = note.triplet === "start" ? "(3" : "";
    const token = `${prefix}${melodicNoteToAbc(note, key)}${note.abcDur}`;
    bars[note.barIndex].push({ token, position: note.position });
  });

  return `X:1
M:4/4
L:1/16
K:${key.keySig}
${formatBarByBeat(bars[0])} | ${formatBarByBeat(bars[1])} |`;
}

function formatBarByBeat(items) {
  // Beam grouping follows the same principle as the rhythm page.
  // In 4/4 and 3/4-style simple meter, the quarter note is the unit.
  // Therefore two eighth notes inside the same quarter beat are written without a space:
  //   C2D2 E2F2 G4 A4
  // This prevents ABCJS from separating eighth-note beams.
  const sorted = items.slice().sort((a, b) => a.position - b.position);
  const groups = [];
  let current = [];
  let currentBeat = null;

  sorted.forEach((item) => {
    const beat = Math.floor(item.position / 4);
    if (currentBeat === null) {
      currentBeat = beat;
    }

    if (beat !== currentBeat) {
      groups.push(current.join(""));
      current = [];
      currentBeat = beat;
    }

    current.push(item.token);
  });

  if (current.length) {
    groups.push(current.join(""));
  }

  return groups.join(" ");
}


const naturalPitchClasses = {
  C: 0,
  D: 2,
  E: 4,
  F: 5,
  G: 7,
  A: 9,
  B: 11
};

const letterOrder = ["C", "D", "E", "F", "G", "A", "B"];

function melodicNoteToAbc(note, key) {
  const degree = ((note.degree % 7) + 7) % 7;
  const octaveShift = Math.floor(note.degree / 7);
  const tonicLetter = tonicLetterFromKey(key.keySig);
  const tonicLetterIndex = letterOrder.indexOf(tonicLetter);
  const letter = letterOrder[(tonicLetterIndex + degree) % 7];

  const naturalPc = naturalPitchClasses[letter];
  const keySignaturePc = mod12(naturalPc + keySignatureAlteration(key.keySig, letter));
  const actualPc = mod12(note.midi);
  const octave = Math.floor(note.midi / 12) - 1;

  const accidentalDelta = normalizedPcDelta(actualPc - keySignaturePc);
  const accidental = accidentalPrefix(accidentalDelta);

  return `${accidental}${abcLetterWithOctave(letter, octave)}`;
}

function tonicLetterFromKey(keySig) {
  return keySig.replace("m", "").replace("#", "").replace("b", "").charAt(0) || "C";
}

function keySignatureAlteration(keySig, letter) {
  const accidentalCount = keySignatureAccidentalCount(keySig);
  const sharps = ["F", "C", "G", "D", "A", "E", "B"];
  const flats = ["B", "E", "A", "D", "G", "C", "F"];

  if (accidentalCount > 0 && sharps.slice(0, accidentalCount).includes(letter)) return 1;
  if (accidentalCount < 0 && flats.slice(0, Math.abs(accidentalCount)).includes(letter)) return -1;
  return 0;
}

function keySignatureAccidentalCount(keySig) {
  const map = {
    C: 0, Am: 0,
    G: 1, Em: 1,
    D: 2, Bm: 2,
    A: 3, "F#m": 3,
    E: 4, "C#m": 4,
    B: 5, "G#m": 5,
    "F#": 6, "D#m": 6,
    "C#": 7, "A#m": 7,
    F: -1, Dm: -1,
    Bb: -2, Gm: -2,
    Eb: -3, Cm: -3,
    Ab: -4, Fm: -4,
    Db: -5, Bbm: -5,
    Gb: -6, Ebm: -6,
    Cb: -7, Abm: -7
  };
  return map[keySig] ?? 0;
}

function normalizedPcDelta(delta) {
  let d = ((delta % 12) + 12) % 12;
  if (d > 6) d -= 12;
  return d;
}

function accidentalPrefix(delta) {
  if (delta === 0) return "";
  if (delta === 1) return "^";
  if (delta === 2) return "^^";
  if (delta === -1) return "_";
  if (delta === -2) return "__";
  return "";
}

function abcLetterWithOctave(letter, octave) {
  // ABC octave mapping:
  // MIDI 60 = C4 = middle C = C
  // MIDI 72 = C5 = c
  // MIDI 48 = C3 = C,
  if (octave >= 5) {
    return letter.toLowerCase() + "'".repeat(octave - 5);
  }

  if (octave <= 3) {
    return letter + ",".repeat(4 - octave);
  }

  return letter;
}

function mod12(value) {
  return ((value % 12) + 12) % 12;
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
      doc.text(`Elements: ${item.roles || "-"}`, 16, y + 6);
      doc.text(`Time: ${formatResponseTime(item.responseTimeSec)}`, 16, y + 12);

      y += 18;

      if (item.correctAbc) {
        doc.setFont("helvetica", "bold");
        doc.setFontSize(8);
        doc.text("Correct notation", 16, y);
        const correctNotation = await abcToPngDataUrl(item.correctAbc, 760);
        const correctSize = fitImageSize(correctNotation, 174, 32);
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
        const selectedNotation = await abcToPngDataUrl(item.selectedAbc, 760);
        const selectedSize = fitImageSize(selectedNotation, 174, 32);
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

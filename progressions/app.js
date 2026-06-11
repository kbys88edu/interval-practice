function t(text) {
  return window.EarTrainingLang?.translateText(text) || text;
}

/*
  Chord Progressions — rebuilt cleanly.

  Design:
  - Playback pitch = MIDI.
  - Notation spelling = musical theory: key signature + roman-degree spelling.
  - These are not guessed from MIDI note names.
  - The ABC key is the progression key, never K:C unless the key is C/Am.
  - Chord tones are spelled from the chord root letter and chord quality.
*/

const progressionLibrary = [
  { id: "M_151", tonality: "major", complexity: "triads", label: "authentic cadence", roman: ["I", "V", "I"], chords: [{deg:1,q:"maj"},{deg:5,q:"maj"},{deg:1,q:"maj"}] },
  { id: "M_1451", tonality: "major", complexity: "triads", label: "basic cadence", roman: ["I", "IV", "V", "I"], chords: [{deg:1,q:"maj"},{deg:4,q:"maj"},{deg:5,q:"maj"},{deg:1,q:"maj"}] },
  { id: "M_1645", tonality: "major", complexity: "triads", label: "common pop", roman: ["I", "vi", "IV", "V"], chords: [{deg:1,q:"maj"},{deg:6,q:"min"},{deg:4,q:"maj"},{deg:5,q:"maj"}] },
  { id: "M_251", tonality: "major", complexity: "triads", label: "predominant cadence", roman: ["ii", "V", "I"], chords: [{deg:2,q:"min"},{deg:5,q:"maj"},{deg:1,q:"maj"}] },
  { id: "M_6415", tonality: "major", complexity: "triads", label: "submediant color", roman: ["vi", "IV", "I", "V"], chords: [{deg:6,q:"min"},{deg:4,q:"maj"},{deg:1,q:"maj"},{deg:5,q:"maj"}] },
  { id: "M_3415", tonality: "major", complexity: "triads", label: "mediant color", roman: ["iii", "IV", "I", "V"], chords: [{deg:3,q:"min"},{deg:4,q:"maj"},{deg:1,q:"maj"},{deg:5,q:"maj"}] },

  { id: "M7_251", tonality: "major", complexity: "sevenths", label: "jazz cadence", roman: ["ii7", "V7", "Imaj7"], chords: [{deg:2,q:"min7"},{deg:5,q:"dom7"},{deg:1,q:"maj7"}] },
  { id: "M7_1625", tonality: "major", complexity: "sevenths", label: "circle start", roman: ["Imaj7", "vi7", "ii7", "V7"], chords: [{deg:1,q:"maj7"},{deg:6,q:"min7"},{deg:2,q:"min7"},{deg:5,q:"dom7"}] },
  { id: "M7_1451", tonality: "major", complexity: "sevenths", label: "seventh cadence", roman: ["Imaj7", "IVmaj7", "V7", "Imaj7"], chords: [{deg:1,q:"maj7"},{deg:4,q:"maj7"},{deg:5,q:"dom7"},{deg:1,q:"maj7"}] },
  { id: "M7_4561", tonality: "major", complexity: "sevenths", label: "color motion", roman: ["IVmaj7", "V7", "vi7", "Imaj7"], chords: [{deg:4,q:"maj7"},{deg:5,q:"dom7"},{deg:6,q:"min7"},{deg:1,q:"maj7"}] },

  { id: "m_151", tonality: "minor", complexity: "triads", label: "minor authentic", roman: ["i", "V", "i"], chords: [{deg:1,q:"min"},{deg:5,q:"maj",source:"harmonic"},{deg:1,q:"min"}] },
  { id: "m_1451", tonality: "minor", complexity: "triads", label: "minor cadence", roman: ["i", "iv", "V", "i"], chords: [{deg:1,q:"min"},{deg:4,q:"min"},{deg:5,q:"maj",source:"harmonic"},{deg:1,q:"min"}] },
  { id: "m_b67i", tonality: "minor", complexity: "triads", label: "Aeolian motion", roman: ["i", "♭VI", "♭VII", "i"], chords: [{deg:1,q:"min"},{deg:6,q:"maj",source:"natural"},{deg:7,q:"maj",source:"natural"},{deg:1,q:"min"}] },
  { id: "m_iiVi", tonality: "minor", complexity: "triads", label: "minor predominant", roman: ["ii°", "V", "i"], chords: [{deg:2,q:"dim",source:"harmonic"},{deg:5,q:"maj",source:"harmonic"},{deg:1,q:"min"}] },
  { id: "m_ivb6Vi", tonality: "minor", complexity: "triads", label: "expanded minor", roman: ["iv", "♭VI", "V", "i"], chords: [{deg:4,q:"min"},{deg:6,q:"maj",source:"natural"},{deg:5,q:"maj",source:"harmonic"},{deg:1,q:"min"}] },

  { id: "m7_iiVi", tonality: "minor", complexity: "sevenths", label: "minor ii-V-i", roman: ["iiø7", "V7", "i7"], chords: [{deg:2,q:"halfDim7",source:"harmonic"},{deg:5,q:"dom7",source:"harmonic"},{deg:1,q:"min7"}] },
  { id: "m7_iivVi", tonality: "minor", complexity: "sevenths", label: "minor cadence", roman: ["i7", "iv7", "V7", "i7"], chords: [{deg:1,q:"min7"},{deg:4,q:"min7"},{deg:5,q:"dom7",source:"harmonic"},{deg:1,q:"min7"}] },
  { id: "m7_b6b7i", tonality: "minor", complexity: "sevenths", label: "Aeolian seventh", roman: ["i7", "♭VImaj7", "♭VII7", "i7"], chords: [{deg:1,q:"min7"},{deg:6,q:"maj7",source:"natural"},{deg:7,q:"dom7",source:"natural"},{deg:1,q:"min7"}] },
  { id: "m7_picardy", tonality: "minor", complexity: "sevenths", label: "Picardy close", roman: ["iiø7", "V7", "Imaj7"], chords: [{deg:2,q:"halfDim7",source:"harmonic"},{deg:5,q:"dom7",source:"harmonic"},{deg:1,q:"maj7"}] }
];

const keyContexts = {
  // major
  C:  { midi: 48, keySig: "C",  tonality: "major", tonicLetter: "C", tonicAlt: 0 },
  Db: { midi: 49, keySig: "Db", tonality: "major", tonicLetter: "D", tonicAlt: -1 },
  D:  { midi: 50, keySig: "D",  tonality: "major", tonicLetter: "D", tonicAlt: 0 },
  Eb: { midi: 51, keySig: "Eb", tonality: "major", tonicLetter: "E", tonicAlt: -1 },
  E:  { midi: 52, keySig: "E",  tonality: "major", tonicLetter: "E", tonicAlt: 0 },
  F:  { midi: 53, keySig: "F",  tonality: "major", tonicLetter: "F", tonicAlt: 0 },
  Gb: { midi: 54, keySig: "Gb", tonality: "major", tonicLetter: "G", tonicAlt: -1 },
  G:  { midi: 55, keySig: "G",  tonality: "major", tonicLetter: "G", tonicAlt: 0 },
  Ab: { midi: 56, keySig: "Ab", tonality: "major", tonicLetter: "A", tonicAlt: -1 },
  A:  { midi: 57, keySig: "A",  tonality: "major", tonicLetter: "A", tonicAlt: 0 },
  Bb: { midi: 58, keySig: "Bb", tonality: "major", tonicLetter: "B", tonicAlt: -1 },
  B:  { midi: 59, keySig: "B",  tonality: "major", tonicLetter: "B", tonicAlt: 0 },

  // minor
  Cm:  { midi: 48, keySig: "Cm",  tonality: "minor", tonicLetter: "C", tonicAlt: 0 },
  Csm: { midi: 49, keySig: "C#m", tonality: "minor", tonicLetter: "C", tonicAlt: 1 },
  Dm:  { midi: 50, keySig: "Dm",  tonality: "minor", tonicLetter: "D", tonicAlt: 0 },
  Ebm: { midi: 51, keySig: "Ebm", tonality: "minor", tonicLetter: "E", tonicAlt: -1 },
  Em:  { midi: 52, keySig: "Em",  tonality: "minor", tonicLetter: "E", tonicAlt: 0 },
  Fm:  { midi: 53, keySig: "Fm",  tonality: "minor", tonicLetter: "F", tonicAlt: 0 },
  Fsm: { midi: 54, keySig: "F#m", tonality: "minor", tonicLetter: "F", tonicAlt: 1 },
  Gm:  { midi: 55, keySig: "Gm",  tonality: "minor", tonicLetter: "G", tonicAlt: 0 },
  Abm: { midi: 56, keySig: "Abm", tonality: "minor", tonicLetter: "A", tonicAlt: -1 },
  Am:  { midi: 57, keySig: "Am",  tonality: "minor", tonicLetter: "A", tonicAlt: 0 },
  Bbm: { midi: 58, keySig: "Bbm", tonality: "minor", tonicLetter: "B", tonicAlt: -1 },
  Bm:  { midi: 59, keySig: "Bm",  tonality: "minor", tonicLetter: "B", tonicAlt: 0 }
};

const whiteMajorKeys = ["C", "D", "F", "G", "A"];
const whiteMinorKeys = ["Am", "Cm", "Dm", "Fm", "Gm"];
const allMajorKeys = ["C", "Db", "D", "Eb", "E", "F", "Gb", "G", "Ab", "A", "Bb", "B"];
const allMinorKeys = ["Cm", "Dm", "Ebm", "Em", "Fm", "Gm", "Abm", "Am", "Bbm", "Bm"];

let keyRange = "white";
let currentQuestion = null;
let hasAnsweredCurrentQuestion = false;
let totalCount = 0;
let correctCount = 0;
let resultLog = [];
let questionStartTime = null;
let latestResponseTimeSec = null;
let synth = null;
let clickSynth = null;

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
  setStatus("NEW を押して、演奏されたコード進行を3つの選択肢から選んでください。");
}

function getSelectedTonalities() {
  return Array.from(document.querySelectorAll('input[name="tonality"]:checked')).map((input) => input.value);
}

function getComplexity() {
  return document.querySelector('input[name="complexity"]:checked').value;
}

function getTempo() {
  return Number(document.querySelector("#tempo-select").value) || 66;
}

function getPlayback() {
  return document.querySelector('input[name="playback"]:checked').value;
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

  const correctTemplate = randomItem(pool);
  const keyContext = chooseKeyContext(correctTemplate.tonality);
  const chordCount = correctTemplate.chords.length;

  let distractorPool = pool.filter((item) =>
    item.id !== correctTemplate.id &&
    item.tonality === correctTemplate.tonality &&
    item.chords.length === chordCount
  );

  if (distractorPool.length < 2) {
    distractorPool = pool.filter((item) => item.id !== correctTemplate.id && item.tonality === correctTemplate.tonality);
  }

  if (distractorPool.length < 2) {
    setStatus("3択の候補が不足しています。設定を増やしてください。", "incorrect");
    return;
  }

  const distractorTemplates = shuffle(distractorPool).slice(0, 2);
  const correct = buildChoice(correctTemplate, keyContext);
  const choices = shuffle([
    correct,
    ...distractorTemplates.map((template) => buildChoice(template, keyContext))
  ]);

  currentQuestion = {
    number: totalCount + 1,
    renderId: `prog-${Date.now()}-${Math.random().toString(16).slice(2)}`,
    keyContext,
    tonicMidi: keyContext.midi,
    correct,
    choices,
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
  questionDisplay.textContent = `${keyContext.keySig} / ${correct.tonality.toUpperCase()}`;

  renderChoices();
  setStatus(`${keyContext.keySig} / ${correct.tonality === "major" ? "長調" : "短調"} / ${correct.label}`);
  playCurrentQuestion();
}

function getProgressionPool() {
  const tonalities = getSelectedTonalities();
  const complexity = getComplexity();

  return progressionLibrary.filter((item) => {
    if (!tonalities.includes(item.tonality)) return false;
    if (complexity === "all") return true;
    return item.complexity === complexity;
  });
}

function chooseKeyContext(tonality) {
  const ids = keyRange === "all"
    ? (tonality === "major" ? allMajorKeys : allMinorKeys)
    : (tonality === "major" ? whiteMajorKeys : whiteMinorKeys);

  return keyContexts[randomItem(ids)];
}

function buildChoice(template, keyContext) {
  const chordInfos = template.chords.map((chord) => buildChordInfo(chord, template.tonality, keyContext));
  const voiced = voiceLead(chordInfos);
  const choice = {
    ...template,
    keyContext,
    tonicMidi: keyContext.midi,
    chordInfos,
    voiced
  };

  choice.abc = buildGrandStaffAbc(choice);
  return choice;
}

function buildChordInfo(chordDef, tonality, keyContext) {
  const source = chordDef.source || (tonality === "minor" ? "natural" : "major");
  const degreeInfo = degreeInfoFor(chordDef.deg, source, keyContext);
  const rootPc = degreeInfo.pc;
  const pcs = buildChordPcs(rootPc, chordDef.q);
  const toneSpellings = buildChordToneSpellings(degreeInfo, chordDef.q);

  return {
    ...chordDef,
    tonality,
    keyContext,
    rootPc,
    pcs,
    bassPc: pcs[0],
    toneSpellings,
    essentialPcs: getEssentialPcs(rootPc, pcs, chordDef.q)
  };
}

function degreeInfoFor(degree, source, keyContext) {
  const degreeSemitones = {
    major:   {1:0, 2:2, 3:4, 4:5, 5:7, 6:9, 7:11},
    natural: {1:0, 2:2, 3:3, 4:5, 5:7, 6:8, 7:10},
    harmonic:{1:0, 2:2, 3:3, 4:5, 5:7, 6:8, 7:11}
  };

  const step = degree - 1;
  const letter = letterFromTonic(keyContext.tonicLetter, step);
  const naturalPc = naturalPitchClasses[letter];
  const pc = mod12(keyContext.midi + degreeSemitones[source][degree]);
  const absoluteAlt = absoluteAccidentalFromNatural(pc, naturalPc);

  return {
    degree,
    source,
    letter,
    pc,
    absoluteAlt
  };
}

function buildChordPcs(rootPc, quality) {
  const patterns = {
    maj: [0, 4, 7],
    min: [0, 3, 7],
    dim: [0, 3, 6],
    aug: [0, 4, 8],
    maj7: [0, 4, 7, 11],
    min7: [0, 3, 7, 10],
    dom7: [0, 4, 7, 10],
    halfDim7: [0, 3, 6, 10],
    dim7: [0, 3, 6, 9]
  };

  return (patterns[quality] || patterns.maj).map((interval) => mod12(rootPc + interval));
}

function buildChordToneSpellings(rootDegreeInfo, quality) {
  const steps = {
    maj:      [0, 2, 4],
    min:      [0, 2, 4],
    dim:      [0, 2, 4],
    aug:      [0, 2, 4],
    maj7:     [0, 2, 4, 6],
    min7:     [0, 2, 4, 6],
    dom7:     [0, 2, 4, 6],
    halfDim7: [0, 2, 4, 6],
    dim7:     [0, 2, 4, 6]
  };

  const qualityIntervals = {
    maj:      [0, 4, 7],
    min:      [0, 3, 7],
    dim:      [0, 3, 6],
    aug:      [0, 4, 8],
    maj7:     [0, 4, 7, 11],
    min7:     [0, 3, 7, 10],
    dom7:     [0, 4, 7, 10],
    halfDim7: [0, 3, 6, 10],
    dim7:     [0, 3, 6, 9]
  };

  const rootPc = rootDegreeInfo.pc;
  const rootLetter = rootDegreeInfo.letter;
  const stepList = steps[quality] || steps.maj;
  const intervalList = qualityIntervals[quality] || qualityIntervals.maj;

  return stepList.map((letterStep, index) => {
    const letter = letterFromTonic(rootLetter, letterStep);
    const pc = mod12(rootPc + intervalList[index]);
    const alt = absoluteAccidentalFromNatural(pc, naturalPitchClasses[letter]);
    return { letter, pc, alt };
  });
}

function getEssentialPcs(rootPc, pcs, quality) {
  if (quality === "maj" || quality === "min" || quality === "dim" || quality === "aug") return pcs.slice();
  return [rootPc, pcs[1], pcs[pcs.length - 1]];
}

function voiceLead(chordInfos) {
  let previous = null;
  return chordInfos.map((info, index) => {
    const voicing = chooseBestVoicing(info, previous, index === 0);
    previous = voicing;
    return voicing;
  });
}

function chooseBestVoicing(info, previous, isFirst) {
  const bassCandidates = midiCandidatesForPc(info.bassPc, 36, 52);
  const upperCombos = generateUpperPcCombos(info);
  const candidates = [];

  bassCandidates.forEach((bass) => {
    upperCombos.forEach((pcs) => {
      const ranges = [[53, 62], [57, 67], [61, 74]];
      const lists = pcs.map((pc, index) => midiCandidatesForPc(pc, ranges[index][0], ranges[index][1]));
      lists[0].forEach((tenor) => {
        lists[1].forEach((alto) => {
          lists[2].forEach((soprano) => {
            if (!(bass < tenor && tenor < alto && alto < soprano)) return;
            const voicing = [bass, tenor, alto, soprano];
            candidates.push({
              voicing,
              score: scoreVoicing(info, voicing, previous, isFirst)
            });
          });
        });
      });
    });
  });

  if (candidates.length === 0) return fallbackVoicing(info);
  candidates.sort((a, b) => a.score - b.score);
  return candidates[0].voicing;
}

function generateUpperPcCombos(info) {
  const pcs = info.pcs;
  const essentials = info.essentialPcs;
  const combos = [];
  const pool = pcs.slice();

  pool.forEach((a) => {
    pool.forEach((b) => {
      pool.forEach((c) => {
        const combo = [a, b, c];
        const hasEssentials = essentials.every((pc) => combo.includes(pc));
        if (!hasEssentials) return;
        combos.push(combo);
      });
    });
  });

  return combos.length ? combos : [[pcs[1], pcs[2], pcs[0]]];
}

function scoreVoicing(info, voicing, previous, isFirst) {
  let score = 0;

  const targetSoprano = isFirst ? 67 : previous ? previous[3] : 67;
  score += Math.abs(voicing[3] - targetSoprano) * 1.2;
  score += Math.abs(voicing[2] - 62) * 0.4;
  score += Math.abs(voicing[1] - 58) * 0.4;
  score += rangePenalty(voicing[0], 38, 48, 0.7);

  const upperPcs = voicing.slice(1).map(mod12);
  info.essentialPcs.forEach((pc) => {
    if (!upperPcs.includes(pc)) score += 20;
  });

  if (previous) {
    const motions = voicing.map((note, i) => note - previous[i]);
    score += motions.reduce((sum, motion, i) => sum + Math.abs(motion) * (i === 0 ? 0.45 : 1.0), 0);
    const signs = motions.filter((motion) => motion !== 0).map(Math.sign);
    if (signs.length >= 3 && signs.every((sign) => sign === signs[0])) score += 18;
    score += parallelPenalty(previous, voicing);
  }

  return score;
}

function parallelPenalty(previous, voicing) {
  let penalty = 0;

  for (let i = 0; i < previous.length; i += 1) {
    for (let j = i + 1; j < previous.length; j += 1) {
      const prevInterval = Math.abs(previous[j] - previous[i]) % 12;
      const currInterval = Math.abs(voicing[j] - voicing[i]) % 12;
      const dirA = Math.sign(voicing[i] - previous[i]);
      const dirB = Math.sign(voicing[j] - previous[j]);
      const similar = dirA !== 0 && dirA === dirB;
      if (similar && prevInterval === currInterval && (currInterval === 0 || currInterval === 7)) penalty += 24;
    }
  }

  return penalty;
}

function fallbackVoicing(info) {
  const bass = midiCandidatesForPc(info.bassPc, 38, 50)[0] || 48;
  const pcs = info.pcs.length === 4 ? [info.pcs[1], info.pcs[2], info.pcs[3]] : [info.pcs[1], info.pcs[0], info.pcs[2]];
  const ranges = [[54, 60], [58, 65], [62, 72]];
  const uppers = pcs.map((pc, index) => midiCandidatesForPc(pc, ranges[index][0], ranges[index][1])[0] || 60 + index * 4);
  return [bass, ...uppers];
}

function midiCandidatesForPc(pc, low, high) {
  const list = [];
  for (let midi = low; midi <= high; midi += 1) {
    if (mod12(midi) === pc) list.push(midi);
  }
  return list;
}

function rangePenalty(value, low, high, factor) {
  if (value < low) return (low - value) * factor * 4;
  if (value > high) return (value - high) * factor * 4;
  return 0;
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
        <span class="choice-roman">${choice.roman.join(" - ")}</span>
      </span>
      <span class="choice-meta">${choice.keyContext.keySig} / ${choice.tonality === "major" ? "Major" : "Minor"} / ${choice.label}</span>
      <span class="choice-notation" id="${notationId}"></span>
    `;
    card.addEventListener("click", () => answer(choice.id));
    choiceList.appendChild(card);

    requestAnimationFrame(() => {
      if (!currentQuestion || currentQuestion.renderId !== renderId) return;
      renderAbc(notationId, choice.abc, 260);
    });
  });
}

async function ensureAudio() {
  if (Tone.context.state !== "running") await Tone.start();

  if (!synth) {
    synth = new Tone.PolySynth(Tone.Synth, {
      oscillator: { type: "triangle" },
      envelope: { attack: 0.01, decay: 0.12, sustain: 0.45, release: 0.55 }
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
  const progression = currentQuestion.correct;
  const playback = currentQuestion.playback;
  const durations = getBeatDurations(progression.voiced.length);
  let cursor = now + beatSec * 4;

  if (!hasAnsweredCurrentQuestion) {
    questionStartTime = performance.now();
    latestResponseTimeSec = null;
    currentTimeEl.textContent = "0.0s";
  }

  for (let i = 0; i < 4; i += 1) {
    clickSynth.triggerAttackRelease(i === 0 ? "A5" : "C5", "32n", now + i * beatSec);
  }

  progression.voiced.forEach((voicing, index) => {
    const durBeats = durations[index];
    const chordDur = durBeats === 2 ? "2n" : "4n";

    if (playback === "arpeggio" || playback === "both") {
      voicing.forEach((midi, noteIndex) => {
        synth.triggerAttackRelease(midiToToneNote(midi), "8n", cursor + noteIndex * 0.08);
      });
    }

    if (playback === "block" || playback === "both") {
      const blockStart = playback === "both" ? cursor + 0.34 : cursor;
      synth.triggerAttackRelease(voicing.map(midiToToneNote), chordDur, blockStart);
    }

    cursor += durBeats * beatSec;
  });

  setStatus(`${progression.keyContext.keySig} / ${progression.tonality === "major" ? "長調" : "短調"} / カウント後に再生します。`);
}

function getBeatDurations(count) {
  if (count === 3) return [1, 1, 2];
  if (count === 4) return [1, 1, 1, 1];
  return Array.from({ length: count }, () => 1);
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
    `${isCorrect ? "正解" : "不正解"} / 正解：${currentQuestion.correct.roman.join(" - ")} / 選択：${selected?.roman.join(" - ") || "-"} / ${formatResponseTime(latestResponseTimeSec)}`,
    isCorrect ? "correct" : "incorrect"
  );

  resultLog.push({
    number: totalCount,
    keySig: currentQuestion.keyContext.keySig,
    tonality: currentQuestion.correct.tonality,
    roman: currentQuestion.correct.roman.join(" - "),
    selectedRoman: selected?.roman.join(" - ") || "",
    label: currentQuestion.correct.label,
    selectedLabel: selected?.label || "",
    abc: currentQuestion.correct.abc,
    selectedAbc: selected?.abc || "",
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

  answerText.textContent = `正解：${currentQuestion.correct.roman.join(" - ")} / ${currentQuestion.keyContext.keySig} / ${currentQuestion.correct.tonality === "major" ? "長調" : "短調"}`;
  analysisText.textContent = `調号：${currentQuestion.keyContext.keySig}。調号・和音度数・構成音の綴りから譜例を生成しています。再生と譜例は同じ4声配列です。`;
  renderAbc("notation", currentQuestion.correct.abc, 460);
}

function buildGrandStaffAbc(choice) {
  const durations = getBeatDurations(choice.voiced.length);
  const treble = [];
  const bass = [];
  const keySig = choice.keyContext.keySig;

  choice.voiced.forEach((notes, index) => {
    const dur = durations[index];
    const info = choice.chordInfos[index];
    treble.push(`[${notes.slice(1).map((midi) => midiToAbcProgressionTone(midi, info, choice.keyContext)).join("")}]${durToAbc(dur)}`);
    bass.push(`${midiToAbcProgressionTone(notes[0], info, choice.keyContext)}${durToAbc(dur)}`);
  });

  // Key signature is written globally and again per voice.
  // This is intentionally redundant: it prevents ABCJS from rendering a neutral C key
  // in compact multi-voice snippets.
  return [
    "X:1",
    "M:4/4",
    "L:1/4",
    `K:${keySig}`,
    "%%staves {1 2}",
    `V:1 clef=treble`,
    `V:2 clef=bass`,
    `[V:1] K:${keySig} ${treble.join(" ")} |`,
    `[V:2] K:${keySig} ${bass.join(" ")} |`
  ].join("\\n");
}

function durToAbc(dur) {
  return dur === 2 ? "2" : "";
}

function midiToAbcProgressionTone(midi, chordInfo, keyContext) {
  const toneIndex = chordToneIndexForMidi(midi, chordInfo);
  const spelling = chordInfo.toneSpellings[toneIndex];

  if (!spelling) return midiToAbcAbsolute(midi, keySignatureAccidentalCount(keyContext.keySig) < 0);

  const octave = Math.floor(midi / 12) - 1;
  const keySigAlt = keySignatureAlteration(keyContext.keySig, spelling.letter);

  if (keySigAlt === spelling.alt) {
    return abcLetterWithOctave(spelling.letter, octave);
  }

  return `${abcAccidentalPrefix(spelling.alt)}${abcLetterWithOctave(spelling.letter, octave)}`;
}

function chordToneIndexForMidi(midi, chordInfo) {
  const pc = mod12(midi);
  const index = chordInfo.pcs.findIndex((item) => item === pc);
  return index >= 0 ? index : 0;
}

const naturalPitchClasses = { C:0, D:2, E:4, F:5, G:7, A:9, B:11 };
const letterOrder = ["C", "D", "E", "F", "G", "A", "B"];

function letterFromTonic(tonicLetter, step) {
  const tonicIndex = letterOrder.indexOf(tonicLetter);
  return letterOrder[(tonicIndex + step) % 7];
}

function keySignatureAlteration(keySig, letter) {
  const count = keySignatureAccidentalCount(keySig);
  const sharps = ["F", "C", "G", "D", "A", "E", "B"];
  const flats = ["B", "E", "A", "D", "G", "C", "F"];

  if (count > 0) {
    const fullCycles = Math.floor(count / 7);
    const remainder = count % 7;
    return fullCycles + (sharps.slice(0, remainder).includes(letter) ? 1 : 0);
  }

  if (count < 0) {
    const n = Math.abs(count);
    const fullCycles = Math.floor(n / 7);
    const remainder = n % 7;
    return -(fullCycles + (flats.slice(0, remainder).includes(letter) ? 1 : 0));
  }

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

function absoluteAccidentalFromNatural(actualPc, naturalPc) {
  const candidates = [-2, -1, 0, 1, 2];
  const match = candidates.find((alt) => mod12(naturalPc + alt) === actualPc);
  return match ?? 0;
}

function abcAccidentalPrefix(alt) {
  if (alt === 0) return "=";
  if (alt === 1) return "^";
  if (alt === 2) return "^^";
  if (alt === -1) return "_";
  if (alt === -2) return "__";
  return "";
}

function abcLetterWithOctave(letter, octave) {
  if (octave >= 5) return letter.toLowerCase() + "'".repeat(octave - 5);
  if (octave <= 3) return letter + ",".repeat(4 - octave);
  return letter;
}

function midiToAbcAbsolute(midi, preferFlats = false) {
  const sharpNames = ["C", "^C", "D", "^D", "E", "F", "^F", "G", "^G", "A", "^A", "B"];
  const flatNames = ["C", "_D", "D", "_E", "E", "F", "_G", "G", "_A", "A", "_B", "B"];
  const names = preferFlats ? flatNames : sharpNames;
  const pc = mod12(midi);
  const octave = Math.floor(midi / 12) - 1;
  let name = names[pc];

  if (octave >= 5) name = name.toLowerCase() + "'".repeat(octave - 5);
  else if (octave <= 3) name = name + ",".repeat(4 - octave);

  return name;
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
    row.innerHTML = `
      <span>${String(item.number).padStart(2, "0")}</span>
      <span>${item.keySig} / ${item.roman} / ${formatResponseTime(item.responseTimeSec)}</span>
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
    doc.text("Chord Progressions Result", 16, 18);

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
      doc.text(`${String(item.number).padStart(2, "0")}  ${item.keySig}  ${item.roman}  ${item.isCorrect ? "OK" : "NG"}`, 16, y);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.text(`Selected: ${item.selectedRoman || "-"} / Time: ${formatResponseTime(item.responseTimeSec)}`, 16, y + 6);

      y += 14;

      if (item.abc) {
        doc.setFont("helvetica", "bold");
        doc.setFontSize(8);
        doc.text("Correct notation", 16, y);
        const notation = await abcToPngDataUrl(item.abc, 760);
        const size = fitImageSize(notation, 174, 42);
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
        const size = fitImageSize(notation, 174, 42);
        doc.addImage(notation.dataUrl, "PNG", 18 + (174 - size.width) / 2, y + 2, size.width, size.height);
        y += size.height + 10;
      }
    }

    doc.save("chord-progressions-result.pdf");
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

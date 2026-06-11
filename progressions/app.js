function t(text) {
  return window.EarTrainingLang?.translateText(text) || text;
}

const progressionLibrary = [
  { id: "M_T_151", tonality: "major", complexity: "triads", label: "authentic frame", roman: ["I", "V", "I"], chords: [{deg:1,q:"maj"},{deg:5,q:"maj"},{deg:1,q:"maj"}] },
  { id: "M_T_1451", tonality: "major", complexity: "triads", label: "basic cadence", roman: ["I", "IV", "V", "I"], chords: [{deg:1,q:"maj"},{deg:4,q:"maj"},{deg:5,q:"maj"},{deg:1,q:"maj"}] },
  { id: "M_T_1645", tonality: "major", complexity: "triads", label: "common pop", roman: ["I", "vi", "IV", "V"], chords: [{deg:1,q:"maj"},{deg:6,q:"min"},{deg:4,q:"maj"},{deg:5,q:"maj"}] },
  { id: "M_T_251", tonality: "major", complexity: "triads", label: "predominant cadence", roman: ["ii", "V", "I"], chords: [{deg:2,q:"min"},{deg:5,q:"maj"},{deg:1,q:"maj"}] },
  { id: "M_T_6415", tonality: "major", complexity: "triads", label: "submediant color", roman: ["vi", "IV", "I", "V"], chords: [{deg:6,q:"min"},{deg:4,q:"maj"},{deg:1,q:"maj"},{deg:5,q:"maj"}] },
  { id: "M_T_3415", tonality: "major", complexity: "triads", label: "mediant color", roman: ["iii", "IV", "I", "V"], chords: [{deg:3,q:"min"},{deg:4,q:"maj"},{deg:1,q:"maj"},{deg:5,q:"maj"}] },

  { id: "M_7_251", tonality: "major", complexity: "sevenths", label: "jazz cadence", roman: ["ii7", "V7", "Imaj7"], chords: [{deg:2,q:"min7"},{deg:5,q:"dom7"},{deg:1,q:"maj7"}] },
  { id: "M_7_1625", tonality: "major", complexity: "sevenths", label: "circle start", roman: ["Imaj7", "vi7", "ii7", "V7"], chords: [{deg:1,q:"maj7"},{deg:6,q:"min7"},{deg:2,q:"min7"},{deg:5,q:"dom7"}] },
  { id: "M_7_1451", tonality: "major", complexity: "sevenths", label: "seventh cadence", roman: ["Imaj7", "IVmaj7", "V7", "Imaj7"], chords: [{deg:1,q:"maj7"},{deg:4,q:"maj7"},{deg:5,q:"dom7"},{deg:1,q:"maj7"}] },
  { id: "M_7_3625", tonality: "major", complexity: "sevenths", label: "sequential flow", roman: ["iii7", "vi7", "ii7", "V7"], chords: [{deg:3,q:"min7"},{deg:6,q:"min7"},{deg:2,q:"min7"},{deg:5,q:"dom7"}] },
  { id: "M_7_4561", tonality: "major", complexity: "sevenths", label: "color motion", roman: ["IVmaj7", "V7", "vi7", "Imaj7"], chords: [{deg:4,q:"maj7"},{deg:5,q:"dom7"},{deg:6,q:"min7"},{deg:1,q:"maj7"}] },

  { id: "m_T_151", tonality: "minor", complexity: "triads", label: "minor authentic", roman: ["i", "V", "i"], chords: [{deg:1,q:"min"},{deg:5,q:"maj",source:"harmonic"},{deg:1,q:"min"}] },
  { id: "m_T_1451", tonality: "minor", complexity: "triads", label: "minor cadence", roman: ["i", "iv", "V", "i"], chords: [{deg:1,q:"min"},{deg:4,q:"min"},{deg:5,q:"maj",source:"harmonic"},{deg:1,q:"min"}] },
  { id: "m_T_b67i", tonality: "minor", complexity: "triads", label: "Aeolian motion", roman: ["i", "♭VI", "♭VII", "i"], chords: [{deg:1,q:"min"},{deg:6,q:"maj",source:"natural"},{deg:7,q:"maj",source:"natural"},{deg:1,q:"min"}] },
  { id: "m_T_iiVi", tonality: "minor", complexity: "triads", label: "minor predominant", roman: ["ii°", "V", "i"], chords: [{deg:2,q:"dim",source:"harmonic"},{deg:5,q:"maj",source:"harmonic"},{deg:1,q:"min"}] },
  { id: "m_T_ivb6Vi", tonality: "minor", complexity: "triads", label: "expanded minor", roman: ["iv", "♭VI", "V", "i"], chords: [{deg:4,q:"min"},{deg:6,q:"maj",source:"natural"},{deg:5,q:"maj",source:"harmonic"},{deg:1,q:"min"}] },

  { id: "m_7_iiVi", tonality: "minor", complexity: "sevenths", label: "minor ii-V-i", roman: ["iiø7", "V7", "i7"], chords: [{deg:2,q:"halfDim7",source:"harmonic"},{deg:5,q:"dom7",source:"harmonic"},{deg:1,q:"min7"}] },
  { id: "m_7_iivV", tonality: "minor", complexity: "sevenths", label: "minor cadence", roman: ["i7", "iv7", "V7", "i7"], chords: [{deg:1,q:"min7"},{deg:4,q:"min7"},{deg:5,q:"dom7",source:"harmonic"},{deg:1,q:"min7"}] },
  { id: "m_7_b6b7i", tonality: "minor", complexity: "sevenths", label: "Aeolian seventh color", roman: ["i7", "♭VImaj7", "♭VII7", "i7"], chords: [{deg:1,q:"min7"},{deg:6,q:"maj7",source:"natural"},{deg:7,q:"dom7",source:"natural"},{deg:1,q:"min7"}] },
  { id: "m_7_iiVPic", tonality: "minor", complexity: "sevenths", label: "Picardy close", roman: ["iiø7", "V7", "Imaj7"], chords: [{deg:2,q:"halfDim7",source:"harmonic"},{deg:5,q:"dom7",source:"harmonic"},{deg:1,q:"maj7"}] }
];

const whiteMajorRoots = [48, 50, 53, 55, 57];
const whiteMinorRoots = [45, 48, 50, 53, 55];
const allMajorRoots = [48,49,50,51,52,53,54,55,56,57,58,59];
const allMinorRoots = [45,46,47,48,49,50,51,52,53,54,55,56];

let keyRange = "white";
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

function getPool() {
  const tonalities = getSelectedTonalities();
  const complexity = getComplexity();
  return progressionLibrary.filter((item) => {
    if (!tonalities.includes(item.tonality)) return false;
    if (complexity === "all") return true;
    return item.complexity === complexity;
  });
}

function randomItem(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function shuffle(array) {
  return array.slice().sort(() => Math.random() - 0.5);
}

function newQuestion() {
  const pool = getPool();
  if (pool.length < 3) {
    setStatus("3択を作るには候補が足りません。設定を増やしてください。", "incorrect");
    return;
  }

  clearFeedback();
  const correctProg = randomItem(pool);
  const tonicMidi = chooseTonic(correctProg.tonality);
  const chordCount = correctProg.chords.length;

  let distractorPool = pool.filter((p) => p.id !== correctProg.id && p.tonality === correctProg.tonality && p.chords.length === chordCount);
  if (distractorPool.length < 2) distractorPool = pool.filter((p) => p.id !== correctProg.id && p.tonality === correctProg.tonality);
  if (distractorPool.length < 2) distractorPool = pool.filter((p) => p.id !== correctProg.id);

  const allChoices = shuffle([correctProg, ...shuffle(distractorPool).slice(0, 2)]).map((progression) => buildChoice(progression, tonicMidi));
  const correctChoice = allChoices.find((item) => item.id === correctProg.id);

  currentQuestion = {
    number: totalCount + 1,
    renderId: `q-${Date.now()}-${Math.random().toString(16).slice(2)}`,
    tonality: correctProg.tonality,
    tonicMidi,
    tempo: getTempo(),
    playback: getPlayback(),
    correct: correctChoice,
    choices: allChoices
  };

  hasAnsweredCurrentQuestion = false;
  questionStartTime = null;
  latestResponseTimeSec = null;
  currentTimeEl.textContent = "--";
  answerText.textContent = "";
  analysisText.textContent = "";
  notationEl.innerHTML = "";
  questionDisplay.textContent = correctProg.tonality === "major" ? "MAJOR" : "MINOR";

  renderChoices();
  setStatus(`${correctProg.tonality === "major" ? "長調" : "短調"} / 4声体風のコード進行です。`);
  playCurrentQuestion();
}

function buildChoice(progression, tonicMidi) {
  const voiced = voiceLeadProgression(progression, tonicMidi);
  const choice = {
    ...progression,
    tonicMidi,
    voiced
  };
  choice.abc = buildGrandStaffAbc(choice, voiced);
  choice.midiSummary = voiced.map(chord => chord.join("-")).join(" | ");
  return choice;
}

function chooseTonic(tonality) {
  if (keyRange === "all") return randomItem(tonality === "major" ? allMajorRoots : allMinorRoots);
  return randomItem(tonality === "major" ? whiteMajorRoots : whiteMinorRoots);
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
      <span class="choice-meta">${choice.tonality === "major" ? "Major" : "Minor"} / ${choice.label}</span>
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
    release: 1.3,
    baseUrl: "https://tonejs.github.io/audio/salamander/"
  }).toDestination();
  piano.volume.value = -8;

  fallbackSynth = new Tone.PolySynth(Tone.Synth, {
    oscillator: { type: "triangle" },
    envelope: { attack: 0.01, decay: 0.08, sustain: 0.42, release: 0.45 }
  }).toDestination();
  fallbackSynth.volume.value = -14;

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
  const beatSec = 60 / currentQuestion.tempo;
  const progression = currentQuestion.correct;
  const playback = currentQuestion.playback;

  if (!hasAnsweredCurrentQuestion) {
    questionStartTime = performance.now();
    latestResponseTimeSec = null;
    currentTimeEl.textContent = "0.0s";
  }

  const durations = getBeatDurations(progression.voiced.length);
  let cursor = now;

  progression.voiced.forEach((voicing, index) => {
    const durBeats = durations[index];
    const chordDur = durBeats === 2 ? "2n" : "4n";

    if (playback === "arpeggio" || playback === "both") {
      voicing.forEach((midi, noteIndex) => {
        instrument.triggerAttackRelease(midiToToneNote(midi), "8n", cursor + noteIndex * 0.08);
      });
    }

    if (playback === "block" || playback === "both") {
      const blockStart = playback === "both" ? cursor + 0.34 : cursor;
      instrument.triggerAttackRelease(voicing.map(midiToToneNote), chordDur, blockStart);
    }

    cursor += durBeats * beatSec;
  });

  setStatus(`${progression.tonality === "major" ? "長調" : "短調"} / 4声体風のヴォイシングで再生しています。`);
}

function getBeatDurations(count) {
  if (count === 3) return [1, 1, 2];
  if (count === 4) return [1, 1, 1, 1];
  return Array.from({ length: count }, () => 1);
}

function voiceLeadProgression(progression, tonicMidi) {
  const infos = progression.chords.map((chord) => buildChordInfo(chord, progression.tonality, tonicMidi));
  let prevVoicing = null;
  return infos.map((info, index) => {
    const voicing = chooseBestVoicing(info, prevVoicing, index === 0);
    prevVoicing = voicing;
    return voicing;
  });
}

function buildChordInfo(chordDef, tonality, tonicMidi) {
  const scaleSource = chordDef.source || (tonality === "minor" ? "natural" : "major");
  const rootPc = mod12(tonicMidi + degreeToSemitone(chordDef.deg, scaleSource));
  const pcs = buildChordPitchClasses(rootPc, chordDef.q);
  return {
    ...chordDef,
    tonality,
    rootPc,
    pcs,
    bassPc: pcs[0],
    essentialPcs: getEssentialPcs(rootPc, pcs, chordDef.q)
  };
}

function degreeToSemitone(deg, source) {
  const major = {1:0, 2:2, 3:4, 4:5, 5:7, 6:9, 7:11};
  const naturalMinor = {1:0, 2:2, 3:3, 4:5, 5:7, 6:8, 7:10};
  const harmonicMinor = {1:0, 2:2, 3:3, 4:5, 5:7, 6:8, 7:11};
  const sourceMap = source === "major" ? major : source === "harmonic" ? harmonicMinor : naturalMinor;
  return sourceMap[deg];
}

function buildChordPitchClasses(rootPc, quality) {
  const patterns = {
    maj: [0, 4, 7],
    min: [0, 3, 7],
    dim: [0, 3, 6],
    maj7: [0, 4, 7, 11],
    min7: [0, 3, 7, 10],
    dom7: [0, 4, 7, 10],
    halfDim7: [0, 3, 6, 10]
  };
  return (patterns[quality] || patterns.maj).map((interval) => mod12(rootPc + interval));
}

function getEssentialPcs(rootPc, pcs, quality) {
  if (pcs.length === 4) return [rootPc, pcs[1], pcs[3]];
  return [rootPc, pcs[1], pcs[2]];
}

function chooseBestVoicing(info, prevVoicing, isFirst) {
  const bassCandidates = midiCandidatesForPc(info.bassPc, 36, 52);
  const upperPcCombos = generateUpperPcCombos(info);
  let best = null;
  let bestScore = Infinity;

  bassCandidates.forEach((bass) => {
    upperPcCombos.forEach((pcCombo) => {
      const lowNotes = midiCandidatesForPc(pcCombo[0], 52, 64);
      const midNotes = midiCandidatesForPc(pcCombo[1], 56, 69);
      const highNotes = midiCandidatesForPc(pcCombo[2], 60, 76);

      lowNotes.forEach((low) => {
        midNotes.forEach((mid) => {
          highNotes.forEach((high) => {
            if (!(bass < low && low < mid && mid < high)) return;
            if (mid - low > 12) return;
            if (high - mid > 12) return;
            if (high - low > 19) return;

            const voicing = [bass, low, mid, high];
            if (!coversHarmony(info, voicing)) return;

            const score = scoreVoicing(info, voicing, prevVoicing, isFirst);
            if (score < bestScore) {
              bestScore = score;
              best = voicing;
            }
          });
        });
      });
    });
  });

  return best || fallbackVoicing(info);
}

function generateUpperPcCombos(info) {
  const pcs = info.pcs;
  const combos = [];

  if (pcs.length === 4) {
    permutations([pcs[1], pcs[2], pcs[3]]).forEach((combo) => combos.push(combo));
  } else {
    permutations([pcs[1], pcs[2], pcs[0]]).forEach((combo) => combos.push(combo));
    permutations([pcs[1], pcs[2], pcs[2]]).forEach((combo) => combos.push(combo));
  }

  const seen = new Set();
  return combos.filter((combo) => {
    const key = combo.join("-");
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function permutations(values) {
  if (values.length <= 1) return [values.slice()];
  const out = [];
  values.forEach((value, index) => {
    const rest = values.slice(0, index).concat(values.slice(index + 1));
    permutations(rest).forEach((perm) => out.push([value, ...perm]));
  });
  return out;
}

function coversHarmony(info, voicing) {
  const pcs = new Set(voicing.map(mod12));
  return info.essentialPcs.every((pc) => pcs.has(pc));
}

function scoreVoicing(info, voicing, prevVoicing, isFirst) {
  const [bass, low, mid, high] = voicing;
  let score = 0;

  score += rangePenalty(bass, 38, 50, 1.5);
  score += rangePenalty(low, 54, 62, 1.0);
  score += rangePenalty(mid, 58, 67, 1.0);
  score += rangePenalty(high, 62, 74, 1.2);

  if (isFirst) {
    score += Math.abs(low - 55) * 0.6 + Math.abs(mid - 60) * 0.6 + Math.abs(high - 64) * 0.6;
  }

  if (info.pcs.length === 4 && mod12(high) === info.rootPc) score += 4;
  if (info.q === "dom7" && mod12(high) === info.pcs[3]) score -= 2;

  if (prevVoicing) {
    const motions = voicing.map((note, i) => note - prevVoicing[i]);
    score += motions.reduce((sum, motion) => sum + Math.abs(motion), 0) * 1.8;

    motions.forEach((motion, i) => {
      const limit = i === 0 ? 7 : 5;
      if (Math.abs(motion) > limit) score += (Math.abs(motion) - limit) * 6;
    });

    for (let i = 0; i < voicing.length; i += 1) {
      if (mod12(voicing[i]) === mod12(prevVoicing[i])) score -= 4;
      if (voicing[i] === prevVoicing[i]) score -= 8;
    }

    const signs = motions.filter((motion) => motion !== 0).map(Math.sign);
    if (signs.length >= 3 && signs.every((sign) => sign === signs[0])) score += 18;
    score += parallelPenalty(prevVoicing, voicing);
  }

  return score;
}

function parallelPenalty(prevVoicing, voicing) {
  let penalty = 0;
  for (let i = 0; i < prevVoicing.length; i += 1) {
    for (let j = i + 1; j < prevVoicing.length; j += 1) {
      const prevInterval = Math.abs(prevVoicing[j] - prevVoicing[i]) % 12;
      const currInterval = Math.abs(voicing[j] - voicing[i]) % 12;
      const dirA = Math.sign(voicing[i] - prevVoicing[i]);
      const dirB = Math.sign(voicing[j] - prevVoicing[j]);
      const similar = dirA !== 0 && dirA === dirB;
      if (similar && prevInterval === currInterval && (currInterval === 0 || currInterval === 7)) penalty += 24;
    }
  }
  return penalty;
}

function fallbackVoicing(info) {
  const bass = midiCandidatesForPc(info.bassPc, 38, 50)[0];
  const pcs = info.pcs.length === 4 ? [info.pcs[1], info.pcs[2], info.pcs[3]] : [info.pcs[1], info.pcs[0], info.pcs[2]];
  const ranges = [[54,60],[58,65],[62,72]];
  const uppers = pcs.map((pc, idx) => midiCandidatesForPc(pc, ranges[idx][0], ranges[idx][1])[0]);
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

function mod12(value) {
  return ((value % 12) + 12) % 12;
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
    tonality: currentQuestion.correct.tonality,
    roman: currentQuestion.correct.roman.join(" - "),
    selectedRoman: selected?.roman.join(" - ") || "",
    tonic: midiToNoteName(currentQuestion.tonicMidi),
    label: currentQuestion.correct.label,
    abc: currentQuestion.correct.abc,
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

  answerText.textContent = `正解：${currentQuestion.correct.roman.join(" - ")} / ${currentQuestion.correct.tonality === "major" ? "長調" : "短調"} / 主音 ${midiToNoteName(currentQuestion.tonicMidi)}`;
  analysisText.textContent = "演奏と楽譜は同じ4声MIDI配列から生成しています。";
  renderAbc("notation", currentQuestion.correct.abc, 420);
}


function abcKeyFromTonicMidi(tonality, tonicMidi) {
  const pc = mod12(tonicMidi);
  const majorKeys = {
    0: "C", 1: "Db", 2: "D", 3: "Eb", 4: "E", 5: "F",
    6: "F#", 7: "G", 8: "Ab", 9: "A", 10: "Bb", 11: "B"
  };
  const minorKeys = {
    0: "Cm", 1: "C#m", 2: "Dm", 3: "Ebm", 4: "Em", 5: "Fm",
    6: "F#m", 7: "Gm", 8: "Abm", 9: "Am", 10: "Bbm", 11: "Bm"
  };
  return tonality === "minor" ? minorKeys[pc] : majorKeys[pc];
}

function abcKeyLine(progression) {
  if (!Number.isFinite(progression.tonicMidi)) return "K:C";
  return `K:${abcKeyFromTonicMidi(progression.tonality, progression.tonicMidi)}`;
}

// buildGrandStaffAbc uses the exact same voiced MIDI arrays used for playback.
// Do not recompute pitches here; this keeps sound and notation identical.
// buildGrandStaffAbc uses the exact same voiced MIDI arrays used for playback.
// Sound and notation are generated from the same source: choice.voiced.
function buildGrandStaffAbc(progression, voiced) {
  const durations = getBeatDurations(voiced.length);
  const treble = [];
  const bass = [];

  voiced.forEach((notes, index) => {
    const dur = durations[index];
    // notes = [bass, tenor, alto, soprano]
    treble.push(`[${notes.slice(1).map(midiToAbc).join("")}]${durToAbc(dur)}`);
    bass.push(`${midiToAbc(notes[0])}${durToAbc(dur)}`);
  });

  return [
    "X:1",
    "M:4/4",
    "L:1/4",
    "K:C",
    "%%staves {1 2}",
    "V:1 clef=treble",
    "V:2 clef=bass",
    `[V:1] ${treble.join(" ")} |`,
    `[V:2] ${bass.join(" ")} |`
  ].join("\n");
}

function durToAbc(dur) {
  return dur === 2 ? "2" : "";
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
  document.querySelectorAll(".choice-card").forEach((card) => card.classList.remove("selected-correct", "selected-incorrect"));
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
      <span>${item.tonic} / ${item.roman} / ${formatResponseTime(item.responseTimeSec)}</span>
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
  const pc = mod12(midi);
  const octave = Math.floor(midi / 12) - 1;
  return `${names[pc]}${octave}`;
}

function midiToNoteName(midi) {
  return midiToToneNote(midi);
}

function midiToAbc(midi) {
  // Final absolute ABC octave mapping.
  // MIDI 48 = C3 = C,
  // MIDI 60 = C4 = middle C = C
  // MIDI 72 = C5 = c
  // This matches Tone.js note names: C4 is middle C.
  const names = ["C", "^C", "D", "^D", "E", "F", "^F", "G", "^G", "A", "^A", "B"];
  const pc = mod12(midi);
  const octave = Math.floor(midi / 12) - 1;
  let name = names[pc];

  if (octave >= 5) {
    name = name.toLowerCase() + "'".repeat(octave - 5);
  } else if (octave <= 3) {
    name = name + ",".repeat(4 - octave);
  }

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
    const avgTime = answeredWithTime.length ? answeredWithTime.reduce((sum, item) => sum + item.responseTimeSec, 0) / answeredWithTime.length : null;

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

    for (const item of resultLog) {
      if (y > 238) {
        doc.addPage();
        y = 18;
      }

      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.text(`${String(item.number).padStart(2, "0")}  ${item.tonic}  ${item.roman}`, 16, y);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.text(`Your answer: ${item.selectedRoman || "-"} / ${item.isCorrect ? "OK" : "NG"} / Time: ${formatResponseTime(item.responseTimeSec)}`, 16, y + 6);
      doc.text(`Function: ${item.label}`, 16, y + 12);

      if (item.abc) {
        try {
          const notation = await abcToPngDataUrl(item.abc, 620);
          const maxWidth = 178;
          const maxHeight = 32;
          const scale = Math.min(maxWidth / notation.widthMm, maxHeight / notation.heightMm);
          const imgW = notation.widthMm * scale;
          const imgH = notation.heightMm * scale;

          doc.addImage(notation.dataUrl, "PNG", 16 + (maxWidth - imgW) / 2, y + 16, imgW, imgH);
          y += 22 + imgH;
        } catch (notationError) {
          console.error(notationError);
          doc.setFontSize(8);
          doc.text("[Notation could not be rendered]", 16, y + 18);
          y += 30;
        }
      } else {
        y += 28;
      }
      y += 6;
    }

    doc.save("chord-progression-practice-result.pdf");
    setStatus("楽譜入りの結果PDFを出力しました。", "correct");
  } catch (error) {
    console.error(error);
    setStatus("PDF作成中にエラーが発生しました。", "incorrect");
  } finally {
    exportButton.disabled = false;
  }
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

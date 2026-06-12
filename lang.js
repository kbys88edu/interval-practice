(() => {
  const translations = {
    // Common
    "HOME": "HOME",
    "INTERVALS": "INTERVALS",
    "CHORDS": "CHORDS",
    "MINOR": "MINOR",
    "KEYS": "KEYS",
    "MODES": "MODES",
    "SIG": "SIGNATURE",
    "RHYTHM": "RHYTHM",
    "INDEX": "INDEX",
    "SETTINGS": "SETTINGS",
    "RANGE": "RANGE",
    "ANSWER": "ANSWER",
    "CHOOSE ONE": "CHOOSE ONE",
    "QUESTION": "QUESTION",
    "CURRENT QUESTION": "CURRENT QUESTION",
    "RESULT LOG": "RESULT LOG",
    "NOTATION": "NOTATION",
    "NOTATION / ANALYSIS": "NOTATION / ANALYSIS",
    "ANSWER / NOTATION": "ANSWER / NOTATION",
    "ANSWER MAP": "ANSWER MAP",
    "PRACTICE SUITE": "PRACTICE SUITE",
    "NOTE": "NOTE",
    "NEW": "NEW",
    "PLAY": "PLAY",
    "SHOW": "SHOW",
    "PDF": "PDF",
    "CHECK": "CHECK",
    "RESET": "RESET",
    "ALL": "ALL",
    "NONE": "NONE",
    "QUESTIONS": "QUESTIONS",
    "CORRECT": "CORRECT",
    "RATE": "RATE",
    "TIME": "TIME",
    "MODE": "MODE",
    "SOUND": "SOUND",
    "METER": "METER",
    "6/8では8分音符単位で6回クリックします。強拍は高いクリックです。": "In 6/8, the metronome clicks six eighth-note pulses. Strong beats use the higher click.",
    "CONTENT": "CONTENT",
    "TEMPO": "TEMPO",
    "PRESET": "PRESET",
    "CLEF": "CLEF",
    "KEY TYPE": "KEY TYPE",
    "KEY POOL": "KEY POOL",
    "QUESTION TYPE": "QUESTION TYPE",
    "TONIC RANGE": "TONIC RANGE",
    "INVERSION": "INVERSION",
    "RELATIONS": "RELATIONS",
    "SIGNATURE / KEY / ANSWER / EXPORT": "SIGNATURE / KEY / ANSWER / EXPORT",
    "LISTEN / ANSWER / NOTATE / EXPORT": "LISTEN / ANSWER / NOTATE / EXPORT",
    "SCALE / PHRASE / DRONE / EXPORT": "SCALE / PHRASE / DRONE / EXPORT",
    "KEY / RELATION / ANSWER / EXPORT": "KEY / RELATION / ANSWER / EXPORT",
    "LISTEN / CHOOSE / NOTATE / EXPORT": "LISTEN / CHOOSE / NOTATE / EXPORT",

    // Main page
    "Ear Training\nand Theory Tools": "Ear Training\nand Theory Tools",
    "音程、コード、短音階、近親調、教会旋法、調号、リズムをブラウザで練習するための教材です。\n        各ページはスマホ対応、結果ログ、PDF出力に対応しています。": "Browser-based practice tools for intervals, chords, minor scales, related keys, modes, key signatures, and rhythm.\n        Each page supports mobile layout, result logs, and PDF export.",
    "音程": "Intervals",
    "和音": "Chords",
    "短音階": "Minor scales",
    "近親調": "Related keys",
    "教会旋法": "Modes",
    "調号": "Key signatures",
    "リズム": "Rhythm",
    "2度から7度までの音程を、上行・下行・同時音程で聞き分けます。": "Identify intervals from 2nds to 7ths in ascending, descending, and harmonic forms.",
    "三和音、七の和音、応用コードを、同時・分散・転回形で練習します。": "Practice triads, seventh chords, advanced chords, arpeggiations, and inversions.",
    "自然短音階、和声短音階、旋律短音階を、上行・下行・往復で聞き分けます。": "Identify natural, harmonic, and melodic minor scales in ascending, descending, and up-down forms.",
    "主調を見て、同主調・下属調・属調・平行調を答えます。": "Given a tonic key, answer the parallel, subdominant, dominant, and relative keys.",
    "教会旋法を、スケール・短い旋法フレーズ・主音ドローン付きフレーズで聞き分けます。": "Identify church modes through scales, short modal phrases, and tonic-drone phrases.",
    "調号を見て調を答える練習と、調名から調号を答える練習を行います。": "Practice identifying keys from signatures and signatures from key names.",
    "演奏された1小節のリズムを聴き、3つの譜例から正しいものを選びます。": "Listen to a one-bar rhythm and choose the correct notation from three options.",
    "リアルピアノ音源、楽譜表示、PDF出力には外部CDNを使用します。\n        オンライン環境での使用を前提としています。": "Real piano sounds, notation rendering, and PDF export use external CDN libraries.\n        The tools are intended for use online.",


    "調名を見て、調号の数だけを選んでください。": "Look at the key name and choose only the number of accidentals.",
    "METER": "METER",
    "6/8では8分音符単位で6回クリックします。強拍は高いクリックです。": "In 6/8, the metronome clicks six eighth-note pulses. Strong beats use the higher click.",


    "コード進行": "Chord progressions",
    "コード進行聞き取り": "Chord Progression Practice",
    "長調": "Major",
    "短調": "Minor",
    "終止": "Cadences",
    "全て": "All",
    "ブロック+分散": "Block + arpeggio",
    "演奏された短いコード進行を聴き、3つのローマ数字から正しい進行を選びます。": "Listen to a short chord progression and choose the correct Roman numerals from three options.",
    "NEW を押して、演奏されたコード進行を3つの選択肢から選んでください。": "Press NEW, then choose the performed progression from three options.",


    "三和音": "Triads",
    "7の和音": "Seventh chords",
    "コード進行を3つの選択肢から選んでください。": "Choose the correct chord progression from three options.",

    // Japanese UI
    "出題範囲を選び、NEW を押してください。": "Choose a range, then press NEW.",
    "NEW を押してください。": "Press NEW.",
    "まだ解答履歴がありません。": "No answer history yet.",
    "上行": "Ascending",
    "下行": "Descending",
    "往復": "Up and down",
    "同時": "Harmonic",
    "ブロック": "Block",
    "分散 上行": "Arpeggio up",
    "分散 下行": "Arpeggio down",
    "根音": "Root",
    "第1": "1st",
    "第2": "2nd",
    "第3": "3rd",
    "リアルピアノ": "Real piano",
    "ソフトピアノ": "Soft piano",
    "サイン波": "Sine",
    "ウォームシンセ": "Warm synth",
    "オルガン": "Organ",
    "プラック": "Pluck",
    "白鍵": "White keys",
    "全調": "All keys",
    "初級": "Beginner",
    "中級": "Intermediate",
    "上級": "Advanced",
    "自然短音階": "Natural minor",
    "和声短音階": "Harmonic minor",
    "旋律短音階": "Melodic minor",
    "基本調": "Basic keys",
    "基本": "Basic",
    "全調号": "All signatures",
    "長調・短調": "Major and minor",
    "長調のみ": "Major only",
    "短調のみ": "Minor only",
    "ト音記号": "Treble clef",
    "ヘ音記号": "Bass clef",
    "調号 → 調": "Signature → key",
    "調 → 調号": "Key → signature",
    "調名を入力": "Enter key name",
    "調号を選択": "Choose key signature",
    "例：ト長調 / G dur / e moll": "Example: G major / G dur / e moll",
    "例：♯1、♭3、調号なし": "Example: ♯1, ♭3, no signature",
    "同主調": "Parallel key",
    "下属調": "Subdominant key",
    "属調": "Dominant key",
    "平行調": "Relative key",
    "1か所": "One item",
    "図全体": "Full diagram",
    "三連符": "Triplets",
    "16分音符": "Sixteenths",
    "タイ": "Ties",
    "表示された拍子のリズムを聴き、同じ拍子で表示された3つの譜例から選んでください。": "Listen to the rhythm in the displayed meter and choose the correct notation from three examples in the same meter.",
    "Wood": "Wood",
    "Low click": "Low click",

    // Mode names
    "アイオニアン": "Ionian",
    "ドリアン": "Dorian",
    "フリジアン": "Phrygian",
    "リディアン": "Lydian",
    "ミクソリディアン": "Mixolydian",
    "エオリアン": "Aeolian",
    "ロクリアン": "Locrian"
  };

  function normalizeText(text) {
    return text.replace(/\s+/g, " ").trim();
  }

  function translateNodeText(node, lang) {
    if (node.nodeType !== Node.TEXT_NODE) return;
    const raw = node.nodeValue;
    const trimmed = raw.trim();
    if (!trimmed) return;

    if (!node.__jpOriginal) node.__jpOriginal = raw;

    if (lang === "ja") {
      node.nodeValue = node.__jpOriginal;
      return;
    }

    const direct = translations[trimmed];
    if (direct) {
      node.nodeValue = raw.replace(trimmed, direct);
      return;
    }

    const normalized = normalizeText(trimmed);
    const normalizedEntry = Object.entries(translations).find(([key]) => normalizeText(key) === normalized);
    if (normalizedEntry) {
      node.nodeValue = raw.replace(trimmed, normalizedEntry[1]);
    }
  }

  function translateAttributes(root, lang) {
    const attrMap = {
      "例：G dur / ト長調 / e moll": "Example: G major / G dur / e moll",
      "例：ト長調 / G dur / e moll": "Example: G major / G dur / e moll",
      "例：♯1、♭3、調号なし": "Example: ♯1, ♭3, no signature"
    };

    root.querySelectorAll("[placeholder]").forEach((el) => {
      if (!el.dataset.jpPlaceholder) el.dataset.jpPlaceholder = el.getAttribute("placeholder");
      if (lang === "ja") {
        el.setAttribute("placeholder", el.dataset.jpPlaceholder);
      } else {
        el.setAttribute("placeholder", attrMap[el.dataset.jpPlaceholder] || el.dataset.jpPlaceholder);
      }
    });

    root.querySelectorAll("option").forEach((el) => {
      if (!el.dataset.jpText) el.dataset.jpText = el.textContent;
      if (lang === "ja") {
        el.textContent = el.dataset.jpText;
      } else {
        el.textContent = translations[el.dataset.jpText.trim()] || el.dataset.jpText;
      }
    });
  }

  function walkText(root, lang) {
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode(node) {
        const parent = node.parentElement;
        if (!parent) return NodeFilter.FILTER_REJECT;
        if (["SCRIPT", "STYLE"].includes(parent.tagName)) return NodeFilter.FILTER_REJECT;
        return NodeFilter.FILTER_ACCEPT;
      }
    });

    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    nodes.forEach((node) => translateNodeText(node, lang));
  }

  function addLanguageToggle() {
    if (document.querySelector(".language-toggle")) return;

    const top = document.querySelector(".top-count") || document.querySelector(".topbar") || document.body;
    const wrap = document.createElement("span");
    wrap.className = "language-toggle";
    wrap.innerHTML = `
      <button type="button" class="lang-btn" data-lang-set="ja">JP</button>
      <button type="button" class="lang-btn" data-lang-set="en">EN</button>
    `;
    top.prepend(wrap);

    wrap.querySelectorAll("[data-lang-set]").forEach((button) => {
      button.addEventListener("click", () => setLanguage(button.dataset.langSet));
    });
  }

  function setLanguage(lang) {
    document.documentElement.lang = lang === "en" ? "en" : "ja";
    localStorage.setItem("earTrainingLanguage", lang);
    walkText(document.body, lang);
    translateAttributes(document.body, lang);
    document.querySelectorAll(".lang-btn").forEach((btn) => {
      btn.classList.toggle("active", btn.dataset.langSet === lang);
    });
    document.dispatchEvent(new CustomEvent("earTrainingLanguageChanged", { detail: { lang } }));
  }

  window.EarTrainingLang = {
    setLanguage,
    getLanguage() {
      return localStorage.getItem("earTrainingLanguage") || "ja";
    },
    translateText(text) {
      const lang = localStorage.getItem("earTrainingLanguage") || "ja";
      if (lang === "ja") return text;
      return translations[text] || text;
    }
  };

  document.addEventListener("DOMContentLoaded", () => {
    addLanguageToggle();
    setLanguage(localStorage.getItem("earTrainingLanguage") || "ja");

    // Dynamic app text is generated after load in some tools.
    const observer = new MutationObserver(() => {
      const lang = localStorage.getItem("earTrainingLanguage") || "ja";
      if (lang === "en") {
        observer.disconnect();
        walkText(document.body, "en");
        translateAttributes(document.body, "en");
        observer.observe(document.body, { childList: true, subtree: true });
      }
    });
    observer.observe(document.body, { childList: true, subtree: true });
  });
})();

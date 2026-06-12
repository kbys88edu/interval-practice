(() => {
  const dictionaries = {
    en: {
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
    "LEVEL": "LEVEL",
    "CHORD TYPES": "CHORD TYPES",
    "LESSONS": "LESSONS",
    "LISTEN / ANSWER / NOTATE / EXPORT": "LISTEN / ANSWER / NOTATE / EXPORT",
    "LISTEN / CHOOSE / NOTATE / EXPORT": "LISTEN / CHOOSE / NOTATE / EXPORT",
    "SCALE / PHRASE / DRONE / EXPORT": "SCALE / PHRASE / DRONE / EXPORT",
    "KEY / RELATION / ANSWER / EXPORT": "KEY / RELATION / ANSWER / EXPORT",
    "SIGNATURE / KEY / ANSWER / EXPORT": "SIGNATURE / KEY / ANSWER / EXPORT",
    "Browser-based ear training and theory practice tools": "Browser-based ear training and theory practice tools",
    "Intervals / Chords / Progressions / Melody / Minor scales / Related keys / Modes / Key signatures / Rhythm": "Intervals / Chords / Progressions / Melody / Minor scales / Related keys / Modes / Key signatures / Rhythm",
    "Ear Training\nand Theory Tools": "Ear Training\nand Theory Tools",
    "Ear Training and Theory Tools": "Ear Training and Theory Tools",
    "音程、コード、コード進行、旋律聴音、短音階、近親調、教会旋法、調号、リズムをブラウザで練習するための教材です。 各ページはスマホ対応、結果ログ、PDF出力に対応しています。": "Browser-based materials for practicing intervals, chords, chord progressions, melodic dictation, minor scales, related keys, modes, key signatures, and rhythm. Each page supports mobile layout, result logs, and PDF export.",
    "音程、コード、短音階、近親調、教会旋法、調号、リズムをブラウザで練習するための教材です。 各ページはスマホ対応、結果ログ、PDF出力に対応しています。": "Browser-based materials for practicing intervals, chords, minor scales, related keys, modes, key signatures, and rhythm. Each page supports mobile layout, result logs, and PDF export.",
    "β / 開発中": "β / In development",
    "このページは現在ベータ版です。教材・レッスン用の試作ツールとして調整中のため、表示・記譜・音声再生は今後変更される可能性があります。": "This page is currently in beta. It is being adjusted as a prototype tool for lessons and teaching materials, so display, notation, and audio playback may change.",
    "レッスンと併用できる聴音・理論トレーニングツールです。": "Ear-training and theory tools designed to be used alongside lessons.",
    "作曲、音楽理論、ソルフェージュ、DTM、電子音響の個人レッスンをご希望の方は、atelier composition son のレッスンページをご覧ください。": "For private lessons in composition, music theory, solfège, DTM, and electroacoustic music, please visit the atelier composition son lesson page.",
    "レッスンを見る": "View lessons",
    "無料相談へ": "Free consultation",
    "個別レッスンで、聴く力・読む力・作る力をつなげる": "Connect listening, reading, and composing through individual lessons",
    "このツールは自主練習用です。和声、ソルフェージュ、作曲、DTM、電子音響を体系的に学びたい場合は、 レッスンで課題設定、添削、作品制作まで扱えます。": "These tools are for self-practice. In lessons, harmony, solfège, composition, DTM, and electroacoustic music can be developed through assignments, corrections, and project work.",
    "音程": "Intervals",
    "和音": "Chords",
    "短音階": "Minor scales",
    "近親調": "Related keys",
    "教会旋法": "Modes",
    "調号": "Key signature",
    "リズム": "Rhythm",
    "コード進行": "Chord progressions",
    "旋律聴音": "Melodic dictation",
    "2度から7度までの音程を、上行・下行・同時音程で聞き分けます。": "Identify intervals from 2nds to 7ths in ascending, descending, and harmonic forms.",
    "三和音、七の和音、応用コードを、同時・分散・転回形で練習します。": "Practice triads, seventh chords, advanced chords, arpeggiations, and inversions.",
    "自然短音階、和声短音階、旋律短音階を、上行・下行・往復で聞き分けます。": "Identify natural, harmonic, and melodic minor scales in ascending, descending, and up-down forms.",
    "主調を見て、同主調・下属調・属調・平行調を答えます。": "Given a tonic key, answer the parallel, subdominant, dominant, and relative keys.",
    "教会旋法を、スケール・短い旋法フレーズ・主音ドローン付きフレーズで聞き分けます。": "Identify modes through scales, short modal phrases, and tonic-drone phrases.",
    "調号を見て調を答える練習と、調名から調号を答える練習を行います。": "Practice identifying keys from signatures and signatures from key names.",
    "演奏された1小節のリズムを聴き、3つの譜例から正しいものを選びます。": "Listen to a one-bar rhythm and choose the correct notation from three options.",
    "演奏された短いコード進行を聴き、3つのローマ数字から正しい進行を選びます。": "Listen to a short chord progression and choose the correct Roman numerals from three options.",
    "リアルピアノ音源、楽譜表示、PDF出力には外部CDNを使用します。 オンライン環境での使用を前提としています。": "Real piano sounds, notation rendering, and PDF export use external CDN libraries. These tools are intended for use online.",
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
    "上行分散": "Arpeggio up",
    "下行分散": "Arpeggio down",
    "根音": "Root",
    "基本形": "Root position",
    "第1": "1st",
    "第2": "2nd",
    "第3": "3rd",
    "第1転回形": "1st inversion",
    "第2転回形": "2nd inversion",
    "第3転回形": "3rd inversion",
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
    "中級：色彩で答える": "Intermediate: answer by color",
    "上級：譜例3択": "Advanced: notation choices",
    "中級：楽譜を見ず、コードの色彩感をボタンから選びます。": "Intermediate: choose the chord type by sound color, without notation.",
    "上級：譜例を見て3択から選びます。": "Advanced: choose from three notation examples.",
    "レベルを選び、NEW を押してください。中級はコード種別、上級は譜例3択です。": "Choose a level, then press NEW. Intermediate asks for chord type; advanced uses three notation choices.",
    "聴いて、コードの種類をボタンから選んでください。": "Listen, then choose the chord type from the buttons.",
    "聴いて、譜例だけを見て右側の3択を選んでください。": "Listen, then choose from the three notation choices.",
    "再生中。コードの種類をボタンから選んでください。": "Playing. Choose the chord type from the buttons.",
    "再生中。譜例だけを見て右側の3択を選んでください。": "Playing. Choose from the three notation choices.",
    "譜例を見て選んでください": "Choose by reading the notation",
    "自然短音階": "Natural minor",
    "和声短音階": "Harmonic minor",
    "旋律短音階": "Melodic minor",
    "基本調": "Basic keys",
    "基本": "Basic",
    "全調号": "All signatures",
    "長調・短調": "Major and minor",
    "長調のみ": "Major only",
    "短調のみ": "Minor only",
    "長調": "Major",
    "短調": "Minor",
    "終止": "Cadences",
    "全て": "All",
    "ブロック+分散": "Block + arpeggio",
    "ト音記号": "Treble clef",
    "ヘ音記号": "Bass clef",
    "調号 → 調": "Signature → key",
    "調 → 調号": "Key → signature",
    "調名を入力": "Enter key name",
    "調号を選択": "Choose key signature",
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
    "6/8では8分音符単位で6回クリックします。強拍は高いクリックです。": "In 6/8, the metronome clicks six eighth-note pulses. Strong beats use the higher click.",
    "調名を見て、調号の数だけを選んでください。": "Look at the key name and choose only the number of accidentals.",
    "三和音": "Triads",
    "7の和音": "Seventh chords",
    "七和音": "Seventh chords",
    "応用": "Advanced",
    "コード進行を3つの選択肢から選んでください。": "Choose the correct chord progression from three options.",
    "正解": "Correct",
    "不正解": "Incorrect",
    "選択": "Selected",
    "構成音": "Chord tones",
    "先に NEW を押してください。": "Press NEW first.",
    "スコアと履歴をリセットしました。": "Score and history reset.",
    "PDFに出力する解答履歴がありません。": "There is no answer history to export to PDF.",
    "PDFライブラリを読み込めませんでした。インターネット接続を確認してください。": "Could not load the PDF library. Please check your internet connection.",
    "正解譜例と選択譜例を含むPDFを出力しました。": "Exported a PDF including correct and selected notation.",
    "アイオニアン": "Ionian",
    "ドリアン": "Dorian",
    "フリジアン": "Phrygian",
    "リディアン": "Lydian",
    "ミクソリディアン": "Mixolydian",
    "エオリアン": "Aeolian",
    "ロクリアン": "Locrian",
    "OPEN": "OPEN",
    "Interval Practice": "Interval Practice",
    "Chord Practice": "Chord Practice",
    "Minor Scale Practice": "Minor Scale Practice",
    "Related Keys": "Related Keys",
    "Mode Practice": "Mode Practice",
    "Key Signature Practice": "Key Signature Practice",
    "Rhythm Practice": "Rhythm Practice",
    "Chord Progression Practice": "Chord Progression Practice",
    "Melodic Dictation": "Melodic Dictation"
,
        "全調号モードにしました。": "All signatures mode.",
        "基本調号モードにしました。": "Basic signatures mode.",
        "調号を見て調を答えてください。": "Look at the key signature and answer the key.",
        "調名 ?": "Key name?",
        "調名回答": "Key-name answer",
        "正解調号": "Correct signature",
        "回答調号": "Selected signature",
        "回答": "Answer",
        "結果PDFを出力しました。": "Exported the result PDF.",
        "PDF作成中にエラーが発生しました。": "An error occurred while creating the PDF.",
        "出題範囲が空です。": "The question range is empty.",
        "この問題は回答済みです。NEW を押してください。": "This question has already been answered. Press NEW.",
        "調号→調": "Signature → key",
        "調→調号": "Key → signature",
        "調号なし": "No signature",
        "変ハ長調": "C-flat major",
        "変ト長調": "G-flat major",
        "変ニ長調": "D-flat major",
        "変イ長調": "A-flat major",
        "変ホ長調": "E-flat major",
        "変ロ長調": "B-flat major",
        "ヘ長調": "F major",
        "ハ長調": "C major",
        "ト長調": "G major",
        "ニ長調": "D major",
        "イ長調": "A major",
        "ホ長調": "E major",
        "ロ長調": "B major",
        "嬰ヘ長調": "F-sharp major",
        "嬰ハ長調": "C-sharp major",
        "変イ短調": "A-flat minor",
        "変ホ短調": "E-flat minor",
        "変ロ短調": "B-flat minor",
        "ヘ短調": "F minor",
        "ハ短調": "C minor",
        "ト短調": "G minor",
        "ニ短調": "D minor",
        "イ短調": "A minor",
        "ホ短調": "E minor",
        "ロ短調": "B minor",
        "嬰ヘ短調": "F-sharp minor",
        "嬰ハ短調": "C-sharp minor",
        "嬰ト短調": "G-sharp minor",
        "嬰ニ短調": "D-sharp minor",
        "嬰イ短調": "A-sharp minor"},
    fr: {
    "HOME": "ACCUEIL",
    "INTERVALS": "INTERVALLES",
    "CHORDS": "ACCORDS",
    "MINOR": "MINEUR",
    "KEYS": "TONALITÉS",
    "MODES": "MODES",
    "SIG": "ARMURE",
    "RHYTHM": "RYTHME",
    "INDEX": "INDEX",
    "SETTINGS": "RÉGLAGES",
    "RANGE": "ÉTENDUE",
    "ANSWER": "RÉPONSE",
    "CHOOSE ONE": "CHOISIR",
    "QUESTION": "QUESTION",
    "CURRENT QUESTION": "QUESTION EN COURS",
    "RESULT LOG": "HISTORIQUE",
    "NOTATION": "PARTITION",
    "NOTATION / ANALYSIS": "PARTITION / ANALYSE",
    "ANSWER / NOTATION": "RÉPONSE / PARTITION",
    "ANSWER MAP": "CARTE DES RÉPONSES",
    "PRACTICE SUITE": "SUITE D’EXERCICES",
    "NOTE": "NOTE",
    "NEW": "NOUVEAU",
    "PLAY": "ÉCOUTER",
    "SHOW": "AFFICHER",
    "PDF": "PDF",
    "CHECK": "VÉRIFIER",
    "RESET": "RÉINITIALISER",
    "ALL": "TOUT",
    "NONE": "AUCUN",
    "QUESTIONS": "QUESTIONS",
    "CORRECT": "JUSTES",
    "RATE": "TAUX",
    "TIME": "TEMPS",
    "MODE": "MODE",
    "SOUND": "SON",
    "METER": "MESURE",
    "CONTENT": "CONTENU",
    "TEMPO": "TEMPO",
    "PRESET": "PRÉRÉGLAGE",
    "CLEF": "CLÉ",
    "KEY TYPE": "TYPE DE TONALITÉ",
    "KEY POOL": "TONALITÉS",
    "QUESTION TYPE": "TYPE DE QUESTION",
    "TONIC RANGE": "REGISTRE DE TONIQUE",
    "INVERSION": "RENVERSEMENT",
    "RELATIONS": "RELATIONS",
    "LEVEL": "NIVEAU",
    "CHORD TYPES": "TYPES D’ACCORDS",
    "LESSONS": "COURS",
    "LISTEN / ANSWER / NOTATE / EXPORT": "ÉCOUTER / RÉPONDRE / NOTER / EXPORTER",
    "LISTEN / CHOOSE / NOTATE / EXPORT": "ÉCOUTER / CHOISIR / NOTER / EXPORTER",
    "SCALE / PHRASE / DRONE / EXPORT": "GAMME / PHRASE / BOURDON / EXPORT",
    "KEY / RELATION / ANSWER / EXPORT": "TONALITÉ / RELATION / RÉPONSE / EXPORT",
    "SIGNATURE / KEY / ANSWER / EXPORT": "ARMURE / TONALITÉ / RÉPONSE / EXPORT",
    "Browser-based ear training and theory practice tools": "Outils d’entraînement auditif et de théorie musicale dans le navigateur",
    "Intervals / Chords / Progressions / Melody / Minor scales / Related keys / Modes / Key signatures / Rhythm": "Intervalles / Accords / Progressions / Mélodie / Gammes mineures / Tonalités voisines / Modes / Armures / Rythme",
    "Ear Training\nand Theory Tools": "Outils de formation auditive\net de théorie musicale",
    "Ear Training and Theory Tools": "Outils de formation auditive et de théorie musicale",
    "音程、コード、コード進行、旋律聴音、短音階、近親調、教会旋法、調号、リズムをブラウザで練習するための教材です。 各ページはスマホ対応、結果ログ、PDF出力に対応しています。": "Matériel pour travailler dans le navigateur les intervalles, accords, progressions, dictées mélodiques, gammes mineures, tonalités voisines, modes, armures et rythmes. Chaque page est adaptée au mobile et propose un historique ainsi qu’un export PDF.",
    "音程、コード、短音階、近親調、教会旋法、調号、リズムをブラウザで練習するための教材です。 各ページはスマホ対応、結果ログ、PDF出力に対応しています。": "Matériel pour travailler dans le navigateur les intervalles, accords, gammes mineures, tonalités voisines, modes, armures et rythmes. Chaque page est adaptée au mobile et propose un historique ainsi qu’un export PDF.",
    "β / 開発中": "β / En développement",
    "このページは現在ベータ版です。教材・レッスン用の試作ツールとして調整中のため、表示・記譜・音声再生は今後変更される可能性があります。": "Cette page est actuellement en version bêta. Elle est ajustée comme outil pédagogique et prototype pour les cours ; l’affichage, la notation et la lecture audio peuvent encore évoluer.",
    "レッスンと併用できる聴音・理論トレーニングツールです。": "Outils de formation auditive et de théorie à utiliser en complément des cours.",
    "作曲、音楽理論、ソルフェージュ、DTM、電子音響の個人レッスンをご希望の方は、atelier composition son のレッスンページをご覧ください。": "Pour des cours individuels de composition, théorie musicale, solfège, MAO et musique électroacoustique, consultez la page des cours d’atelier composition son.",
    "レッスンを見る": "Voir les cours",
    "無料相談へ": "Consultation gratuite",
    "個別レッスンで、聴く力・読む力・作る力をつなげる": "Relier l’écoute, la lecture et la création par des cours individuels",
    "このツールは自主練習用です。和声、ソルフェージュ、作曲、DTM、電子音響を体系的に学びたい場合は、 レッスンで課題設定、添削、作品制作まで扱えます。": "Ces outils sont destinés à l’entraînement autonome. Pour étudier l’harmonie, le solfège, la composition, la MAO ou l’électroacoustique de manière structurée, les cours peuvent inclure des exercices, des corrections et un accompagnement de projet.",
    "音程": "Intervalles",
    "和音": "Accords",
    "短音階": "Gammes mineures",
    "近親調": "Tonalités voisines",
    "教会旋法": "Modes",
    "調号": "Armure",
    "リズム": "Rythme",
    "コード進行": "Progressions d’accords",
    "旋律聴音": "Dictée mélodique",
    "2度から7度までの音程を、上行・下行・同時音程で聞き分けます。": "Reconnaître les intervalles de la seconde à la septième, ascendants, descendants et harmoniques.",
    "三和音、七の和音、応用コードを、同時・分散・転回形で練習します。": "Travailler les triades, accords de septième et accords avancés, en bloc, arpégés et renversés.",
    "自然短音階、和声短音階、旋律短音階を、上行・下行・往復で聞き分けます。": "Reconnaître les gammes mineures naturelle, harmonique et mélodique, ascendantes, descendantes et aller-retour.",
    "主調を見て、同主調・下属調・属調・平行調を答えます。": "À partir d’une tonalité principale, répondre avec la tonalité homonyme, sous-dominante, dominante et relative.",
    "教会旋法を、スケール・短い旋法フレーズ・主音ドローン付きフレーズで聞き分けます。": "Reconnaître les modes à partir de gammes, de courtes phrases modales et de phrases avec bourdon de tonique.",
    "調号を見て調を答える練習と、調名から調号を答える練習を行います。": "S’exercer à identifier une tonalité à partir de l’armure, ou l’armure à partir du nom de la tonalité.",
    "演奏された1小節のリズムを聴き、3つの譜例から正しいものを選びます。": "Écouter un rythme d’une mesure et choisir la bonne notation parmi trois propositions.",
    "演奏された短いコード進行を聴き、3つのローマ数字から正しい進行を選びます。": "Écouter une courte progression d’accords et choisir les bons chiffres romains parmi trois propositions.",
    "リアルピアノ音源、楽譜表示、PDF出力には外部CDNを使用します。 オンライン環境での使用を前提としています。": "Les sons de piano, le rendu de partition et l’export PDF utilisent des bibliothèques CDN externes. Ces outils sont prévus pour une utilisation en ligne.",
    "出題範囲を選び、NEW を押してください。": "Choisissez une étendue, puis appuyez sur NOUVEAU.",
    "NEW を押してください。": "Appuyez sur NOUVEAU.",
    "まだ解答履歴がありません。": "Aucun historique pour le moment.",
    "上行": "Ascendant",
    "下行": "Descendant",
    "往復": "Aller-retour",
    "同時": "Harmonique",
    "ブロック": "Bloc",
    "分散 上行": "Arpège ascendant",
    "分散 下行": "Arpège descendant",
    "上行分散": "Arpège ascendant",
    "下行分散": "Arpège descendant",
    "根音": "Fondamentale",
    "基本形": "État fondamental",
    "第1": "1er",
    "第2": "2e",
    "第3": "3e",
    "第1転回形": "1er renversement",
    "第2転回形": "2e renversement",
    "第3転回形": "3e renversement",
    "リアルピアノ": "Piano réaliste",
    "ソフトピアノ": "Piano doux",
    "サイン波": "Onde sinusoïdale",
    "ウォームシンセ": "Synthé chaud",
    "オルガン": "Orgue",
    "プラック": "Son pincé",
    "白鍵": "Touches blanches",
    "全調": "Toutes les tonalités",
    "初級": "Débutant",
    "中級": "Intermédiaire",
    "上級": "Avancé",
    "中級：色彩で答える": "Intermédiaire : répondre par la couleur",
    "上級：譜例3択": "Avancé : 3 choix de notation",
    "中級：楽譜を見ず、コードの色彩感をボタンから選びます。": "Intermédiaire : choisir le type d’accord à l’oreille, sans partition.",
    "上級：譜例を見て3択から選びます。": "Avancé : choisir parmi trois exemples notés.",
    "レベルを選び、NEW を押してください。中級はコード種別、上級は譜例3択です。": "Choisissez un niveau, puis NOUVEAU. Intermédiaire : type d’accord ; avancé : trois choix notés.",
    "聴いて、コードの種類をボタンから選んでください。": "Écoutez, puis choisissez le type d’accord avec les boutons.",
    "聴いて、譜例だけを見て右側の3択を選んでください。": "Écoutez, puis choisissez parmi les trois notations.",
    "再生中。コードの種類をボタンから選んでください。": "Lecture en cours. Choisissez le type d’accord.",
    "再生中。譜例だけを見て右側の3択を選んでください。": "Lecture en cours. Choisissez parmi les trois notations.",
    "譜例を見て選んでください": "Choisissez à partir de la notation",
    "自然短音階": "Mineur naturel",
    "和声短音階": "Mineur harmonique",
    "旋律短音階": "Mineur mélodique",
    "基本調": "Tonalités de base",
    "基本": "Base",
    "全調号": "Toutes les armures",
    "長調・短調": "Majeur et mineur",
    "長調のみ": "Majeur seulement",
    "短調のみ": "Mineur seulement",
    "長調": "Majeur",
    "短調": "Mineur",
    "終止": "Cadences",
    "全て": "Tout",
    "ブロック+分散": "Bloc + arpège",
    "ト音記号": "Clé de sol",
    "ヘ音記号": "Clé de fa",
    "調号 → 調": "Armure → tonalité",
    "調 → 調号": "Tonalité → armure",
    "調名を入力": "Entrer le nom de la tonalité",
    "調号を選択": "Choisir l’armure",
    "同主調": "Tonalité homonyme",
    "下属調": "Sous-dominante",
    "属調": "Dominante",
    "平行調": "Relative",
    "1か所": "Un élément",
    "図全体": "Diagramme complet",
    "三連符": "Triolets",
    "16分音符": "Doubles croches",
    "タイ": "Liaisons",
    "表示された拍子のリズムを聴き、同じ拍子で表示された3つの譜例から選んでください。": "Écoutez le rythme dans la mesure indiquée et choisissez la bonne notation parmi trois exemples dans la même mesure.",
    "6/8では8分音符単位で6回クリックします。強拍は高いクリックです。": "En 6/8, le métronome clique six croches ; les temps forts utilisent un clic plus aigu.",
    "調名を見て、調号の数だけを選んでください。": "Regardez le nom de la tonalité et choisissez seulement le nombre d’altérations.",
    "三和音": "Triades",
    "7の和音": "Accords de septième",
    "七和音": "Accords de septième",
    "応用": "Avancé",
    "コード進行を3つの選択肢から選んでください。": "Choisissez la bonne progression parmi trois propositions.",
    "正解": "Correct",
    "不正解": "Incorrect",
    "選択": "Choix",
    "構成音": "Notes de l’accord",
    "先に NEW を押してください。": "Appuyez d’abord sur NOUVEAU.",
    "スコアと履歴をリセットしました。": "Score et historique réinitialisés.",
    "PDFに出力する解答履歴がありません。": "Aucun historique à exporter en PDF.",
    "PDFライブラリを読み込めませんでした。インターネット接続を確認してください。": "Impossible de charger la bibliothèque PDF. Vérifiez la connexion internet.",
    "正解譜例と選択譜例を含むPDFを出力しました。": "PDF exporté avec la notation correcte et la notation choisie.",
    "アイオニアン": "Ionien",
    "ドリアン": "Dorien",
    "フリジアン": "Phrygien",
    "リディアン": "Lydien",
    "ミクソリディアン": "Mixolydien",
    "エオリアン": "Éolien",
    "ロクリアン": "Locrien",
    "Interval Practice": "Pratique des intervalles",
    "Chord Practice": "Pratique des accords",
    "Minor Scale Practice": "Gammes mineures",
    "Related Keys": "Tonalités voisines",
    "Mode Practice": "Pratique des modes",
    "Key Signature Practice": "Armures",
    "Rhythm Practice": "Rythme",
    "Chord Progression Practice": "Progressions d’accords",
    "Melodic Dictation": "Dictée mélodique",
    "OPEN": "OUVRIR",
    "composition / theory / solfège / DTM / electroacoustic music": "composition / théorie / solfège / MAO / musique électroacoustique",
    "atelier composition son": "atelier composition son"
,
        "全調号モードにしました。": "Mode toutes les armures.",
        "基本調号モードにしました。": "Mode armures de base.",
        "調号を見て調を答えてください。": "Regardez l’armure et indiquez la tonalité.",
        "調名 ?": "Tonalité ?",
        "調名回答": "Réponse par nom de tonalité",
        "正解調号": "Armure correcte",
        "回答調号": "Armure choisie",
        "回答": "Réponse",
        "結果PDFを出力しました。": "PDF de résultats exporté.",
        "PDF作成中にエラーが発生しました。": "Erreur lors de la création du PDF.",
        "出題範囲が空です。": "La plage de questions est vide.",
        "この問題は回答済みです。NEW を押してください。": "Cette question a déjà reçu une réponse. Appuyez sur NOUVEAU.",
        "調号→調": "Armure → tonalité",
        "調→調号": "Tonalité → armure",
        "調号なし": "Sans armure",
        "変ハ長調": "do bémol majeur",
        "変ト長調": "sol bémol majeur",
        "変ニ長調": "ré bémol majeur",
        "変イ長調": "la bémol majeur",
        "変ホ長調": "mi bémol majeur",
        "変ロ長調": "si bémol majeur",
        "ヘ長調": "fa majeur",
        "ハ長調": "do majeur",
        "ト長調": "sol majeur",
        "ニ長調": "ré majeur",
        "イ長調": "la majeur",
        "ホ長調": "mi majeur",
        "ロ長調": "si majeur",
        "嬰ヘ長調": "fa dièse majeur",
        "嬰ハ長調": "do dièse majeur",
        "変イ短調": "la bémol mineur",
        "変ホ短調": "mi bémol mineur",
        "変ロ短調": "si bémol mineur",
        "ヘ短調": "fa mineur",
        "ハ短調": "do mineur",
        "ト短調": "sol mineur",
        "ニ短調": "ré mineur",
        "イ短調": "la mineur",
        "ホ短調": "mi mineur",
        "ロ短調": "si mineur",
        "嬰ヘ短調": "fa dièse mineur",
        "嬰ハ短調": "do dièse mineur",
        "嬰ト短調": "sol dièse mineur",
        "嬰ニ短調": "ré dièse mineur",
        "嬰イ短調": "la dièse mineur"}
  };

  function normalizeText(text) {
    return String(text || "").replace(/\s+/g, " ").trim();
  }

  function lookup(text, lang) {
    if (lang === "ja") return text;
    const dict = dictionaries[lang] || {};
    const raw = String(text || "");
    const trimmed = raw.trim();
    if (!trimmed) return text;

    if (dict[trimmed]) return dict[trimmed];

    const normalized = normalizeText(trimmed);
    if (dict[normalized]) return dict[normalized];

    const entry = Object.entries(dict).find(([key]) => normalizeText(key) === normalized);
    return entry ? entry[1] : text;
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

    const translated = lookup(trimmed, lang);
    if (translated && translated !== trimmed) {
      node.nodeValue = raw.replace(trimmed, translated);
    }
  }

  function translateAttributes(root, lang) {
    root.querySelectorAll("[placeholder]").forEach((el) => {
      if (!el.dataset.jpPlaceholder) el.dataset.jpPlaceholder = el.getAttribute("placeholder");
      if (lang === "ja") {
        el.setAttribute("placeholder", el.dataset.jpPlaceholder);
      } else {
        el.setAttribute("placeholder", lookup(el.dataset.jpPlaceholder, lang));
      }
    });

    root.querySelectorAll("option").forEach((el) => {
      if (!el.dataset.jpText) el.dataset.jpText = el.textContent;
      el.textContent = lang === "ja" ? el.dataset.jpText : lookup(el.dataset.jpText, lang);
    });

    root.querySelectorAll("[aria-label]").forEach((el) => {
      if (!el.dataset.jpAriaLabel) el.dataset.jpAriaLabel = el.getAttribute("aria-label");
      el.setAttribute("aria-label", lang === "ja" ? el.dataset.jpAriaLabel : lookup(el.dataset.jpAriaLabel, lang));
    });
  }

  function walkText(root, lang) {
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
      acceptNode(node) {
        const parent = node.parentElement;
        if (!parent) return NodeFilter.FILTER_REJECT;
        if (["SCRIPT", "STYLE"].includes(parent.tagName)) return NodeFilter.FILTER_REJECT;
        if (parent.closest(".abcjs-container, svg")) return NodeFilter.FILTER_REJECT;
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
      <button type="button" class="lang-btn" data-lang-set="ja">JA</button>
      <button type="button" class="lang-btn" data-lang-set="en">EN</button>
      <button type="button" class="lang-btn" data-lang-set="fr">FR</button>
    `;
    top.prepend(wrap);

    wrap.querySelectorAll("[data-lang-set]").forEach((button) => {
      button.addEventListener("click", () => setLanguage(button.dataset.langSet));
    });
  }

  function setLanguage(lang) {
    const normalized = ["ja", "en", "fr"].includes(lang) ? lang : "ja";
    document.documentElement.lang = normalized;
    localStorage.setItem("earTrainingLanguage", normalized);
    walkText(document.body, normalized);
    translateAttributes(document.body, normalized);
    document.querySelectorAll(".lang-btn").forEach((btn) => {
      btn.classList.toggle("active", btn.dataset.langSet === normalized);
    });
    document.dispatchEvent(new CustomEvent("earTrainingLanguageChanged", { detail: { lang: normalized } }));
  }

  window.EarTrainingLang = {
    setLanguage,
    getLanguage() {
      return localStorage.getItem("earTrainingLanguage") || "ja";
    },
    translateText(text) {
      const lang = localStorage.getItem("earTrainingLanguage") || "ja";
      return lookup(text, lang);
    }
  };

  document.addEventListener("DOMContentLoaded", () => {
    addLanguageToggle();
    setLanguage(localStorage.getItem("earTrainingLanguage") || "ja");

    let translating = false;
    const observer = new MutationObserver(() => {
      const lang = localStorage.getItem("earTrainingLanguage") || "ja";
      if (lang === "ja" || translating) return;
      translating = true;
      observer.disconnect();
      walkText(document.body, lang);
      translateAttributes(document.body, lang);
      observer.observe(document.body, { childList: true, subtree: true });
      translating = false;
    });
    observer.observe(document.body, { childList: true, subtree: true });
  });
})();

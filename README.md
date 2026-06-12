# Ear Training Tools

Static browser-based practice tools.

Published structure:

- `/` main index
- `/intervals/` interval trainer
- `/chords/` chord trainer
- `/minor-scales/` minor scale trainer
- `/related-keys/` related key trainer

GitHub Pages URL example:

`https://kbys88edu.github.io/interval-ear-trainer/`

## Notes

Some functions use external CDN libraries:

- Tone.js
- abcjs
- jsPDF

Real piano sounds and PDF export require an internet connection.

- `/modes/` mode trainer


## Range update

Interval and chord trainers use treble-range notes up to A5 where possible.

- `/key-signatures/` key signature trainer

- `/rhythm/` rhythm dictation trainer


Mode Practice now includes 10 phrase variants per mode.


## Language toggle

All pages include a JP / EN language toggle. The selected language is saved in localStorage.

- `/progressions/` chord progression trainer

- Rhythm section rebuilt from scratch with strict same-meter choices and stable 6/8 metronome

- Chord progression playback uses four-part-style voice leading

- UI adjusted so notation is centered and rhythm/progression choices fit more easily in one screen

- progressions page rebuilt from scratch with four-part-style voicing, seventh chords, and centered notation

- Rhythm section rebuilt on a strict 16th-note notation grid with more dotted rhythms

- progression PDF export includes notation for each answer

- related-key subdominant calculation corrected: subdominant is IV (+5), dominant is V (+7)

- progressions rebuilt final compact layout with notation choices, seventh chords, PDF notation, and voice-leading

- rhythm PDF includes correct and selected notation; rhythm beaming grouped by beat

- progressions clean PC layout rebuilt with mobile layout preserved

- rhythm final clean rebuild: beat-based beaming, 16th-note integrity, dotted rhythms, PDF correct/selected notation

- melodic dictation page added: 1–2 bar melodies, notation choices, PDF correct/selected notation

- progression audio/notation octave fixed; notation now uses the same voiced MIDI arrays as playback

- final progressions octave and stale-notation fix; Melodic Dictation card added correctly to index grid

- chord theory-aware enharmonic spelling fixed: e.g. E7 = E-G#-B-D, B7 = B-D#-F#-A, dim7 uses diminished seventh spelling

- melodic dictation harmonic 2-bar version: implied harmony, dotted rhythms, triplets, PDF correct/selected notation

- melodic final rebuilt with unit timing, beat-grouped beaming, passing/neighbor/suspension tones, and robust synth playback

- melodic dictation now includes 16th notes and random all-key output across 24 major/minor keys

- key signature practice outputs correct signature and selected answer/signature on screen and in PDF

- melodic notation now explicitly beams eighth notes within quarter-note beat units

- fixed melodic all-key mode: removed obsolete key selection validation

- melodic notation now uses key-aware spelling; redundant accidentals are suppressed when key signature already covers the note

- melodic notation final accidental fix: flat keys stay flat-key spellings; redundant sharps removed; naturals used correctly for raised minor leading tones

- melodic dictation now supports 3/4 and 6/8 with meter-specific beaming and count-in

- chord notation now uses root spelling and key-signature-aware theory spelling instead of raw MIDI spelling

- fixed chord notation context: minor-quality chords use minor key signatures, avoiding sharp enharmonics in flat minor keys

- chord progression notation now uses key signatures and chord-degree spelling, correcting flat-key and enharmonic notation

- chord progressions rebuilt from zero with key-signature and theory-spelling notation engine

- chords rebuilt from zero with explicit root spelling and theory-correct dominant seventh spelling

- chord progressions final flat-key fix: explicit per-voice key signatures and flat-preference fallback

- fixed chord page UI after rebuild: chord type options and answer buttons now render and playback works

- fixed chords page like progressions: answer choices now render in the existing answer area and no longer require missing #choice-list

- fixed chord page layout: settings left, question center, three answer choices right; matches progressions behavior

- index page now includes a beta/development notice.

- melodic dictation octave sync fix: playback and notation now share the same MIDI data, with safer melodic range.

- index page now includes atelier composition son branding and lesson CTAs.
- latest chords intermediate/advanced JS is included when available.

- added French language option and expanded English/French translations across common UI, index, and dynamic labels.

- fixed chord answer logging and PDF export for intermediate mode.

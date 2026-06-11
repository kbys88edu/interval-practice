# Chords

Rebuilt from zero.

Features:
- Three-choice chord ear training
- Block, ascending arpeggio, descending arpeggio
- Triads, sevenths, suspended chords, add9 chords
- Root spelling is explicit, not guessed from MIDI
- Chord notation is generated from root spelling + chord quality + chord-tone degree
- Dominant seventh spelling is theory-correct:
  - E7 = E G# B D
  - B7 = B D# F# A
  - Db7 = Db F Ab Cb
  - F7 = F A C Eb
- Key signatures are shown in notation
- Diatonic notes covered by the key signature do not receive redundant accidentals
- PDF export includes correct and selected notation

- UI compatibility fixed: chord type checkboxes and answer buttons are generated for the existing HTML layout.

- Fixed HTML/app mismatch: the 3 answer choices now render into #answer-buttons, matching the existing Chords layout like the Progressions page.

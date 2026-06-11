# Chord Progression Practice

Rebuilt from scratch.

Features:
- compact PC layout with visible global buttons and score
- three answer cards on one screen
- notation inside each answer choice
- centered answer notation
- PDF export with notation for each answered progression
- triads and seventh chords
- four-part-style voicing
- voice-leading scoring: common tones, small motion, and parallel perfect interval avoidance

- Final clean PC CSS override added; mobile layout preserved

- audio and notation octave mapping fixed: MIDI 60 maps to ABC middle C, matching playback octave
- notation is generated from the exact same voiced MIDI arrays used for playback

- final octave/stale-render fix: unique ABC render IDs per question, K:C explicit MIDI notation, and shared voiced MIDI source

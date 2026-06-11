# Melodic Dictation

Final rebuilt melodic dictation page.

Features:
- Fixed 2-bar melodic dictation
- Unit-based timing identical to rhythm page
- Beat-grouped notation: notes are beamed by quarter-note units in 4/4
- Count-in only, then melody plays without metronome
- Internal Tone.js synth playback to avoid sample-load silence
- Implied harmony such as I-V-I, ii-V-I, i-V-i, iv-V-i
- Strong beats prioritize chord tones
- Passing tones, neighbor tones, suspensions, resolutions, and cadential tones
- Rhythms include quarters, eighths, dotted rhythms, dotted quarters, and triplets
- Three notation choices
- PDF export includes correct and selected notation

- Added sixteenth-note rhythm patterns.
- Key selection changed to full random across 24 major/minor keys.

- eighth-note beaming within quarter beats is now explicit for melodic notation

- removed obsolete key checkbox validation; melody now always selects from all keys randomly

- key-aware melodic spelling: diatonic notes covered by the key signature no longer show redundant accidentals

- final accidental spelling fix: diatonic notes use plain letters under the key signature; chromatic alterations use absolute ABC accidentals, including naturals such as =B in C minor

- Added 3/4 and 6/8 meters to melodic dictation.
- Beaming is grouped by quarter-note units in 3/4 and 4/4, and by dotted-quarter units in 6/8.

- fixed octave synchronization: playback uses the exact MIDI value used for notation; melodic range constrained to avoid sudden octave displacement.

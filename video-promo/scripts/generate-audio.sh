#!/bin/bash
# Synthesizes background music + UI sound effects for the LettrePro promo
# videos entirely with ffmpeg (no external audio sources are reachable from
# this sandbox), so everything here is generated, not sampled/licensed audio.
# Tuned for a soft, ASMR-leaning feel: gentle attacks, warm/low-passed tones,
# generous reverb tails, low volumes.
set -e

OUT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)/public/audio"
mkdir -p "$OUT_DIR"
cd "$OUT_DIR"

# ---------- click.mp3: soft muffled tap for cursor clicks ----------
ffmpeg -y -f lavfi -i "anoisesrc=color=pink:duration=0.09:amplitude=0.5" \
  -af "bandpass=f=700:width_type=h:w=800,afade=t=in:st=0:d=0.008,afade=t=out:st=0.02:d=0.07,aecho=0.5:0.4:30:0.2,volume=0.8" \
  -ar 44100 click.mp3 -loglevel error

# ---------- type-tick.mp3: soft muffled tick, meant to be looped fast ----------
ffmpeg -y -f lavfi -i "anoisesrc=color=pink:duration=0.04:amplitude=0.5" \
  -af "bandpass=f=1000:width_type=h:w=900,afade=t=in:st=0:d=0.006,afade=t=out:st=0.012:d=0.028,volume=0.55" \
  -ar 44100 type-tick.mp3 -loglevel error

# ---------- ding-correct.mp3: soft 2-note ascending bell (quiz correct answer) ----------
ffmpeg -y -f lavfi -i "sine=frequency=1046.5:duration=0.7:sample_rate=44100" \
          -f lavfi -i "sine=frequency=1318.5:duration=0.7:sample_rate=44100" \
  -filter_complex "\
[0:a]afade=t=in:st=0:d=0.02,afade=t=out:st=0.15:d=0.55,volume=0.32[a]; \
[1:a]adelay=110|110,afade=t=in:st=0:d=0.02,afade=t=out:st=0.15:d=0.55,volume=0.32[b]; \
[a][b]amix=inputs=2:duration=longest:dropout_transition=0,aecho=0.7:0.55:55:0.32,volume=0.9" \
  -ar 44100 ding-correct.mp3 -loglevel error

# ---------- reward-chime.mp3: soft 4-note ascending arpeggio, gentle sparkle ----------
ffmpeg -y -f lavfi -i "sine=frequency=783.99:duration=0.9:sample_rate=44100" \
          -f lavfi -i "sine=frequency=987.77:duration=0.9:sample_rate=44100" \
          -f lavfi -i "sine=frequency=1174.66:duration=0.9:sample_rate=44100" \
          -f lavfi -i "sine=frequency=1567.98:duration=0.9:sample_rate=44100" \
          -f lavfi -i "anoisesrc=color=pink:duration=0.6:amplitude=0.35" \
  -filter_complex "\
[0:a]afade=t=in:st=0:d=0.03,afade=t=out:st=0.2:d=0.65,volume=0.26[a]; \
[1:a]adelay=130|130,afade=t=in:st=0:d=0.03,afade=t=out:st=0.2:d=0.65,volume=0.26[b]; \
[2:a]adelay=260|260,afade=t=in:st=0:d=0.03,afade=t=out:st=0.2:d=0.65,volume=0.26[c]; \
[3:a]adelay=390|390,afade=t=in:st=0:d=0.04,afade=t=out:st=0.1:d=0.75,volume=0.28[d]; \
[4:a]adelay=390|390,bandpass=f=5500:width_type=h:w=3000,afade=t=in:st=0:d=0.05,afade=t=out:st=0.1:d=0.4,volume=0.2[e]; \
[a][b][c][d][e]amix=inputs=5:duration=longest:dropout_transition=0,aecho=0.7:0.55:60:0.35,volume=1.0" \
  -ar 44100 reward-chime.mp3 -loglevel error

# ---------- logo-swell.mp3: soft warm pad swell for the logo glow intro ----------
ffmpeg -y -f lavfi -i "sine=frequency=130.81:duration=1.6:sample_rate=44100" \
          -f lavfi -i "sine=frequency=196.00:duration=1.6:sample_rate=44100" \
          -f lavfi -i "sine=frequency=261.63:duration=1.6:sample_rate=44100" \
  -filter_complex "\
[0:a]afade=t=in:st=0:d=1.2,afade=t=out:st=1.2:d=0.4,volume=0.4[a]; \
[1:a]afade=t=in:st=0:d=1.2,afade=t=out:st=1.2:d=0.4,volume=0.28[b]; \
[2:a]afade=t=in:st=0.15:d=1.2,afade=t=out:st=1.2:d=0.4,volume=0.18[c]; \
[a][b][c]amix=inputs=3:duration=longest:dropout_transition=0,aecho=0.6:0.4:70:0.35" \
  -ar 44100 logo-swell.mp3 -loglevel error

# ---------- bg-music.mp3: soft, breathy ambient pad bed for the whole video ----------
DURATION="${1:-19}"
ffmpeg -y -f lavfi -i "sine=frequency=130.81:duration=$DURATION:sample_rate=44100" \
          -f lavfi -i "sine=frequency=196.00:duration=$DURATION:sample_rate=44100" \
          -f lavfi -i "sine=frequency=261.63:duration=$DURATION:sample_rate=44100" \
          -f lavfi -i "sine=frequency=392.00:duration=$DURATION:sample_rate=44100" \
  -filter_complex "\
[0:a]volume=0.16[a]; \
[1:a]volume=0.11[b]; \
[2:a]tremolo=f=0.15:d=0.6,volume=0.07[c]; \
[3:a]tremolo=f=0.1:d=0.7,volume=0.045[d]; \
[a][b][c][d]amix=inputs=4:duration=longest:dropout_transition=0, \
aecho=0.6:0.4:80:0.3, \
afade=t=in:st=0:d=3,afade=t=out:st=$((DURATION-3)):d=3,volume=1.1" \
  -ar 44100 bg-music.mp3 -loglevel error

echo "done: $(ls -1 "$OUT_DIR")"

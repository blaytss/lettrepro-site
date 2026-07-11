#!/bin/bash
# Synthesizes background music + UI sound effects for the LettrePro promo
# videos entirely with ffmpeg (no external audio sources are reachable from
# this sandbox), so everything here is generated, not sampled/licensed audio.
set -e

OUT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)/public/audio"
mkdir -p "$OUT_DIR"
cd "$OUT_DIR"

# ---------- click.mp3: short UI tap for cursor clicks ----------
ffmpeg -y -f lavfi -i "anoisesrc=color=white:duration=0.045:amplitude=0.9" \
  -af "highpass=f=2500,afade=t=out:st=0:d=0.045,volume=2.0" \
  -ar 44100 click.mp3 -loglevel error

# ---------- type-tick.mp3: single key tick, meant to be looped fast ----------
ffmpeg -y -f lavfi -i "anoisesrc=color=white:duration=0.02:amplitude=0.8" \
  -af "highpass=f=3200,afade=t=out:st=0:d=0.02,volume=1.4" \
  -ar 44100 type-tick.mp3 -loglevel error

# ---------- ding-correct.mp3: 2-note ascending chime (quiz correct answer) ----------
ffmpeg -y -f lavfi -i "sine=frequency=1046.5:duration=0.5:sample_rate=44100" \
          -f lavfi -i "sine=frequency=1318.5:duration=0.5:sample_rate=44100" \
  -filter_complex "\
[0:a]afade=t=out:st=0.08:d=0.42,volume=0.55[a]; \
[1:a]adelay=90|90,afade=t=out:st=0.08:d=0.42,volume=0.55[b]; \
[a][b]amix=inputs=2:duration=longest:dropout_transition=0,aecho=0.6:0.4:35:0.22,volume=1.3" \
  -ar 44100 ding-correct.mp3 -loglevel error

# ---------- reward-chime.mp3: bigger 4-note ascending arpeggio + sparkle ----------
ffmpeg -y -f lavfi -i "sine=frequency=783.99:duration=0.7:sample_rate=44100" \
          -f lavfi -i "sine=frequency=987.77:duration=0.7:sample_rate=44100" \
          -f lavfi -i "sine=frequency=1174.66:duration=0.7:sample_rate=44100" \
          -f lavfi -i "sine=frequency=1567.98:duration=0.7:sample_rate=44100" \
          -f lavfi -i "anoisesrc=color=white:duration=0.5:amplitude=0.5" \
  -filter_complex "\
[0:a]afade=t=out:st=0.15:d=0.55,volume=0.42[a]; \
[1:a]adelay=110|110,afade=t=out:st=0.15:d=0.55,volume=0.42[b]; \
[2:a]adelay=220|220,afade=t=out:st=0.15:d=0.55,volume=0.42[c]; \
[3:a]adelay=330|330,afade=t=out:st=0.05:d=0.65,volume=0.46[d]; \
[4:a]adelay=330|330,highpass=f=6000,afade=t=out:st=0.05:d=0.45,volume=0.5[e]; \
[a][b][c][d][e]amix=inputs=5:duration=longest:dropout_transition=0,aecho=0.6:0.4:45:0.25,volume=1.5" \
  -ar 44100 reward-chime.mp3 -loglevel error

# ---------- logo-swell.mp3: soft rising pad swell for the logo glow intro ----------
ffmpeg -y -f lavfi -i "sine=frequency=130.81:duration=1.4:sample_rate=44100" \
          -f lavfi -i "sine=frequency=196.00:duration=1.4:sample_rate=44100" \
          -f lavfi -i "sine=frequency=261.63:duration=1.4:sample_rate=44100" \
  -filter_complex "\
[0:a]afade=t=in:st=0:d=1.0,afade=t=out:st=1.0:d=0.4,volume=0.5[a]; \
[1:a]afade=t=in:st=0:d=1.0,afade=t=out:st=1.0:d=0.4,volume=0.35[b]; \
[2:a]afade=t=in:st=0.1:d=1.0,afade=t=out:st=1.0:d=0.4,volume=0.25[c]; \
[a][b][c]amix=inputs=3:duration=longest:dropout_transition=0,aecho=0.5:0.3:60:0.3" \
  -ar 44100 logo-swell.mp3 -loglevel error

# ---------- bg-music.mp3: soft ambient tech pad bed for the whole video ----------
DURATION="${1:-19}"
ffmpeg -y -f lavfi -i "sine=frequency=130.81:duration=$DURATION:sample_rate=44100" \
          -f lavfi -i "sine=frequency=196.00:duration=$DURATION:sample_rate=44100" \
          -f lavfi -i "sine=frequency=261.63:duration=$DURATION:sample_rate=44100" \
          -f lavfi -i "sine=frequency=392.00:duration=$DURATION:sample_rate=44100" \
  -filter_complex "\
[0:a]volume=0.22[a]; \
[1:a]volume=0.16[b]; \
[2:a]tremolo=f=0.18:d=0.5,volume=0.10[c]; \
[3:a]tremolo=f=0.1:d=0.6,volume=0.07[d]; \
[a][b][c][d]amix=inputs=4:duration=longest:dropout_transition=0, \
afade=t=in:st=0:d=2.5,afade=t=out:st=$((DURATION-3)):d=3,volume=1.4" \
  -ar 44100 bg-music.mp3 -loglevel error

echo "done: $(ls -1 "$OUT_DIR")"

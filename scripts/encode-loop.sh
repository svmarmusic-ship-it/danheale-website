#!/usr/bin/env bash
# Turn a short Seedance cinemagraph into a small, seamlessly looping web clip + poster JPEG.
#
# Seamless loop: the final 0.5 s is crossfaded into the first 0.5 s, and that blended half-second
# becomes the end of the clip, so the last frame lands exactly on the frame the loop restarts from.
# The clip loses 0.5 s of length and gains an invisible seam regardless of how well the model
# matched its start and end frames. Encoded 1280x720, CRF 30, GOP 24, no audio, faststart.
#
# Usage: scripts/encode-loop.sh <raw.mp4> <basename>
#   -> assets/videos/<basename>.mp4 and assets/images/<basename>-poster.jpg
set -euo pipefail
IN="${1:?usage: $0 <raw.mp4> <basename>}"; NAME="${2:?basename}"
X=0.5
D=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$IN")
BODY_END=$(python3 -c "print(round($D - $X, 4))")
ffmpeg -y -v error -i "$IN" -filter_complex "
  [0:v]split=3[h][b][t];
  [h]trim=0:$X,setpts=PTS-STARTPTS[head];
  [b]trim=$X:$BODY_END,setpts=PTS-STARTPTS[body];
  [t]trim=$BODY_END:$D,setpts=PTS-STARTPTS[tail];
  [tail][head]xfade=transition=fade:duration=$X:offset=0[seam];
  [body][seam]concat=n=2:v=1,scale=1280:-2,format=yuv420p[out]" \
  -map "[out]" -an -c:v libx264 -preset slow -crf 30 -g 24 -keyint_min 24 -sc_threshold 0 \
  -movflags +faststart "assets/videos/$NAME.mp4"
ffmpeg -y -v error -i "assets/videos/$NAME.mp4" -frames:v 1 -q:v 4 "assets/images/$NAME-poster.jpg"
printf "%s: " "$NAME"; ffprobe -v error -show_entries format=duration:stream=nb_frames -of csv=p=0 "assets/videos/$NAME.mp4" | tr '\n' ' '
ls -l "assets/videos/$NAME.mp4" "assets/images/$NAME-poster.jpg" | awk '{printf "%.0f KB %s  ", $5/1024, $9}'; echo

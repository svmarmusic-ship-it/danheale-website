#!/usr/bin/env bash
# Build the hero background loop from a raw AI-generated clip.
#
# The hero plays this as a normal muted, looping <video> (it is not scroll-scrubbed), so the
# output is optimised for page weight, not for seeking: standard GOP, CRF 27, no audio.
# The raw clip opens on a close-up and ends on a wide, calm frame, so a straight loop would
# jump-cut every 15 s. Instead the clip is played forward then in reverse (ping-pong), which
# gives a seamless 30 s loop with no visible seam.
#
# Usage: scripts/swap-bg-video.sh assets/videos/danheale-scroll-background-raw.mp4
set -euo pipefail
INPUT="${1:?usage: $0 <input.mp4>}"
# This site serves static files from the repo root, so the production file lives under assets/.
OUTPUT="assets/videos/bg.mp4"
ffmpeg -y -i "$INPUT" \
  -filter_complex "[0:v]split[a][b];[b]reverse[r];[a][r]concat=n=2:v=1[out]" -map "[out]" \
  -an -c:v libx264 -preset slow -crf 27 -g 48 -pix_fmt yuv420p \
  -movflags +faststart "$OUTPUT"
# First frame of the raw clip doubles as the <video poster>, so playback starts without a jump.
ffmpeg -y -v error -i "$INPUT" -frames:v 1 -vf "scale=1920:-2" -q:v 3 assets/images/hero-video-poster.jpg
echo "Encoded hero loop to $OUTPUT and poster to assets/images/hero-video-poster.jpg"

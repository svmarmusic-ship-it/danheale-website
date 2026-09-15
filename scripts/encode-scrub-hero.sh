#!/usr/bin/env bash
# Build the all-keyframe hero clip used for the pinned scroll-scrubbed walkthrough.
#
# This is a different encode from scripts/swap-bg-video.sh's bg.mp4 (a standard-GOP
# ping-pong loop, fine for passive autoplay but not for scrubbing). Scroll-scrubbing
# means seeking to an arbitrary frame every scroll event, in either direction — that
# needs every frame to be its own keyframe (GOP 1), or seeks fall back to decoding
# forward from the last keyframe and stutter.
#
# Trimmed to the first 8s of the raw clip: that's the window with the clearest
# camera motion (push-in, orbit); the rest of the 15s source either settles or
# is redundant for a short 1.5-2 viewport-height pinned scrub, and scrubbing
# through unused seconds wastes both scroll distance and download weight.
#
# Usage: scripts/encode-scrub-hero.sh assets/videos/danheale-scroll-background-raw.mp4
set -euo pipefail
INPUT="${1:?usage: $0 <input.mp4>}"
OUTPUT="assets/videos/bg-scrub.mp4"
DURATION=8
ffmpeg -y -i "$INPUT" -t "$DURATION" \
  -an -c:v libx264 -preset slow -crf 18 \
  -g 1 -keyint_min 1 -sc_threshold 0 -pix_fmt yuv420p \
  -movflags +faststart "$OUTPUT"
ffmpeg -y -v error -i "$OUTPUT" -frames:v 1 -q:v 3 assets/images/hero-scrub-poster.jpg
echo "Encoded all-keyframe scrub hero (${DURATION}s) to $OUTPUT and poster to assets/images/hero-scrub-poster.jpg"

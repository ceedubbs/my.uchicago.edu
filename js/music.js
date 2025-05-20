import { MUSIC_INTERVAL } from "./constants.js";
export const musicInterval = MUSIC_INTERVAL;

export let musicTracks = [];
export let trackNames = [
  "Minecraft",
  "Living-Mice",
  "Moog-City",
  "Sweden",
  "Subwoofer-Lullaby",
  "Mice-On-Venus",
];
export let trackFiles = [
  "/assets/music/Minecraft.mp3",
  "/assets/music/Living-Mice.mp3",
  "/assets/music/Moog-City.mp3",
  "/assets/music/Sweden.mp3",
  "/assets/music/Subwoofer-Lullaby.mp3",
  "/assets/music/Mice-On-Venus.mp3",
];

export let currentTrackIndex = -1;
export let previousTracks = [];
export function playMusicTrack(index) {
  // Stop all tracks first
  for (let t of musicTracks) t.stop();
  musicTracks[index].play();
  currentTrackIndex = index;
  // Update previousTracks
  previousTracks.push(index);
  if (previousTracks.length > 2) previousTracks.shift();
}

export function pickNextTrack() {
  let available = [];
  for (let i = 0; i < musicTracks.length; i++) {
    if (i !== currentTrackIndex && !previousTracks.includes(i))
      available.push(i);
  }
  // If fewer than possible (e.g. just started), allow all except current
  if (available.length === 0) {
    for (let i = 0; i < musicTracks.length; i++) {
      if (i !== currentTrackIndex) available.push(i);
    }
  }
  let nextIndex = available[Math.floor(Math.random() * available.length)];
  return nextIndex;
}
export function setCurrentTrackIndex(idx) {
  currentTrackIndex = idx;
}

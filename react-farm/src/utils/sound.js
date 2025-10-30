function playFile(path) {
  try {
    const audio = new Audio(path);
    audio.volume = 0.7;
    // Allow overlapping plays by not reusing a single element
    audio.play().catch(() => {});
  } catch (e) {
    // ignore
  }
}

export function playPick() {
  playFile('/sound/pick.mp3');
}

export function playSuccess() {
  playFile('/sound/success.mp3');
}

export function playHarvest() {
  playFile('/sound/harvest.mp3');
}



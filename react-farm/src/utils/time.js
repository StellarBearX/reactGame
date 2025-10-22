export function createGameTime(start = new Date(), speed = 60) {
  // speed = 60 หมายถึง 1 วินาทีจริง = 1 นาทีในเกม
  let current = new Date(start);

  return {
    getTime: () => current,
    tick: () => {
      current = new Date(current.getTime() + 1000 * speed);
      return current;
    },
  };
}

// Helper functions for game time
export function getDayNightCycle(startTime) {
  const now = Date.now();
  const elapsed = now - startTime;

  // 1 day = 60 seconds
  const dayDuration = 60 * 1000;
  const phase = Math.floor((elapsed % (2 * dayDuration)) / dayDuration);
  return phase === 0 ? "day" : "night";
}

export function getGameDay(startTime) {
  const now = Date.now();
  const elapsed = now - startTime;
  // 1 day = 60 seconds
  const dayDuration = 60 * 1000;
  return Math.floor(elapsed / dayDuration) + 1;
}

// --- Helper functions for crop growth ---
export function calculateGrowthProgress(plantedAt, growTime) {
  if (!plantedAt) return 0;
  const elapsed = Date.now() - plantedAt;
  return Math.min((elapsed / growTime) * 100, 100);
}

export function isFullyGrown(plantedAt, growTime) {
  return calculateGrowthProgress(plantedAt, growTime) >= 100;
}

export function getTimeRemaining(plantedAt, growTime) {
  if (!plantedAt) return growTime;
  const elapsed = Date.now() - plantedAt;
  return Math.max(growTime - elapsed, 0);
}

export function formatTime(ms) {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}

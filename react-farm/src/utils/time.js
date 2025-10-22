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
// ✅ เพิ่มฟังก์ชันเหล่านี้ต่อท้ายไฟล์ time.js ที่มีอยู่

/**
 * คำนวณช่วงเวลาในวัน (สำหรับ StatusBar)
 * @param {number} gameStartTime - เวลาเริ่มเกม
 * @returns {Object} ข้อมูลช่วงเวลา
 */
export function getTimeOfDay(gameStartTime) {
  const elapsed = Date.now() - gameStartTime;
  const dayDuration = 60 * 1000; // 60 วินาที = 1 วัน
  const timeInDay = elapsed % dayDuration;
  const hour = Math.floor((timeInDay / dayDuration) * 24);
  
  if (hour >= 6 && hour < 12) {
    return { 
      period: 'เช้า', 
      emoji: '🌅', 
      color: 'bg-amber-200',
      textColor: 'text-amber-900' 
    };
  }
  
  if (hour >= 12 && hour < 18) {
    return { 
      period: 'บ่าย', 
      emoji: '☀️', 
      color: 'bg-yellow-300',
      textColor: 'text-yellow-900' 
    };
  }
  
  if (hour >= 18 && hour < 21) {
    return { 
      period: 'เย็น', 
      emoji: '🌇', 
      color: 'bg-orange-300',
      textColor: 'text-orange-900' 
    };
  }
  
  return { 
    period: 'กลางคืน', 
    emoji: '🌙', 
    color: 'bg-indigo-900',
    textColor: 'text-indigo-100' 
  };
}

/**
 * แปลงเวลาจริงเป็นสตริง
 * @param {Date} date - วันที่
 * @returns {string} เวลาในรูปแบบ HH:MM
 */
export function formatRealTime(date) {
  return date.toLocaleTimeString('th-TH', { 
    hour: '2-digit', 
    minute: '2-digit',
    hour12: false 
  });
}

/**
 * คำนวณเวลาในเกมเป็นชั่วโมง:นาที
 * @param {number} gameStartTime - เวลาเริ่มเกม
 * @returns {Object} { hour, minute }
 */
export function getGameTime(gameStartTime) {
  const elapsed = Date.now() - gameStartTime;
  const dayDuration = 60 * 1000; // 60 วินาที = 1 วัน
  const timeInDay = elapsed % dayDuration;
  const totalMinutes = Math.floor((timeInDay / dayDuration) * 1440); // 1440 นาทีใน 1 วัน
  const hour = Math.floor(totalMinutes / 60);
  const minute = totalMinutes % 60;
  return { hour, minute };
}
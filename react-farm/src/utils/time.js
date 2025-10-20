// utils/time.js

/**
 * คำนวณ % การเติบโตของพืช
 * @param {number} plantedAt - เวลาที่ปลูก (timestamp)
 * @param {number} growTime - เวลาที่ต้องใช้ในการเติบโต (ms)
 * @returns {number} เปอร์เซ็นต์การเติบโต (0-100)
 */
export const calculateGrowthProgress = (plantedAt, growTime) => {
  if (!plantedAt) return 0;
  const elapsed = Date.now() - plantedAt;
  return Math.min((elapsed / growTime) * 100, 100);
};

/**
 * เช็คว่าพืชโตเต็มที่แล้วหรือยัง
 * @param {number} plantedAt - เวลาที่ปลูก (timestamp)
 * @param {number} growTime - เวลาที่ต้องใช้ในการเติบโต (ms)
 * @returns {boolean} โตแล้ว = true, ยังไม่โต = false
 */
export const isFullyGrown = (plantedAt, growTime) => {
  if (!plantedAt) return false;
  return Date.now() - plantedAt >= growTime;
};

/**
 * คำนวณว่าตอนนี้เป็นกลางวันหรือกลางคืน
 * @param {number} startTime - เวลาเริ่มเกม (timestamp)
 * @param {number} cycleDuration - ระยะเวลา 1 รอบวัน-คืน (ms) default = 30000 (30 วินาที)
 * @returns {string} 'day' หรือ 'night'
 */
export const getDayNightCycle = (startTime, cycleDuration = 30000) => {
  const elapsed = Date.now() - startTime;
  const progress = (elapsed % cycleDuration) / cycleDuration;
  return progress < 0.5 ? 'day' : 'night';
};

/**
 * แปลง milliseconds เป็นข้อความแสดงเวลา
 * @param {number} ms - เวลาเป็น milliseconds
 * @returns {string} เช่น "8s", "1m 30s", "2m"
 */
export const formatTime = (ms) => {
  const totalSeconds = Math.floor(ms / 1000);
  
  if (totalSeconds < 60) {
    return `${totalSeconds}s`;
  }
  
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  
  if (seconds === 0) {
    return `${minutes}m`;
  }
  
  return `${minutes}m ${seconds}s`;
};

/**
 * คำนวณเวลาที่เหลือจนกว่าพืชจะโตเต็มที่
 * @param {number} plantedAt - เวลาที่ปลูก (timestamp)
 * @param {number} growTime - เวลาที่ต้องใช้ในการเติบโต (ms)
 * @returns {number} เวลาที่เหลือเป็น ms (ถ้าโตแล้วจะ return 0)
 */
export const getTimeRemaining = (plantedAt, growTime) => {
  if (!plantedAt) return 0;
  const elapsed = Date.now() - plantedAt;
  const remaining = growTime - elapsed;
  return Math.max(remaining, 0);
};

/**
 * สร้าง interval สำหรับอัพเดต growth progress
 * @param {Function} callback - ฟังก์ชันที่จะเรียกเมื่ออัพเดต
 * @param {number} plantedAt - เวลาที่ปลูก
 * @param {number} growTime - เวลาเติบโต
 * @param {number} updateInterval - ความถี่ในการอัพเดต (ms) default = 100
 * @returns {number} interval ID
 */
export const startGrowthInterval = (
  callback, 
  plantedAt, 
  growTime, 
  updateInterval = 100
) => {
  const interval = setInterval(() => {
    const progress = calculateGrowthProgress(plantedAt, growTime);
    callback(progress);
    
    if (progress >= 100) {
      clearInterval(interval);
    }
  }, updateInterval);
  
  return interval;
};

/**
 * คำนวณเวลาในเกม (จำนวนวันที่ผ่านไป)
 * @param {number} startTime - เวลาเริ่มเกม
 * @param {number} dayDuration - ระยะเวลา 1 วัน (ms) default = 60000 (1 นาที)
 * @returns {number} จำนวนวันที่ผ่านไป
 */
export const getGameDay = (startTime, dayDuration = 60000) => {
  const elapsed = Date.now() - startTime;
  return Math.floor(elapsed / dayDuration) + 1;
};
// src/data/market.js
// ระบบตลาดแบบ Dynamic พร้อมราคาที่เปลี่ยนแปลง

export const MARKET_EVENTS = {
  // เหตุการณ์สุ่มที่ส่งผลต่อราคา
  tomato_shortage: {
    id: 'tomato_shortage',
    name: 'ขาดแคลนมะเขือเทศ',
    description: 'โรคระบาดทำให้มะเขือเทศขาดแคลน',
    duration: 3, // จำนวนวัน
    effects: {
      tomato: { multiplier: 1.2, type: 'price_up' }
    },
    emoji: '🍅',
    color: '#ef4444'
  },
  
  wheat_harvest: {
    id: 'wheat_harvest',
    name: 'ฤดูเก็บเกี่ยวข้าวสาลี',
    description: 'ผลผลิตข้าวสาลีล้นตลาด',
    duration: 2,
    effects: {
      wheat: { multiplier: 0.8, type: 'price_down' }
    },
    emoji: '🌾',
    color: '#f59e0b'
  },
  
  pumpkin_festival: {
    id: 'pumpkin_festival',
    name: 'เทศกาลฟักทอง',
    description: 'ความต้องการฟักทองเพิ่มขึ้น',
    duration: 4,
    effects: {
      pumpkin: { multiplier: 1.5, type: 'price_up' }
    },
    emoji: '🎃',
    color: '#f97316'
  },
  
  carrot_demand: {
    id: 'carrot_demand',
    name: 'เทรนด์สุขภาพ',
    description: 'คนหันมาสนใจสุขภาพมากขึ้น',
    duration: 3,
    effects: {
      carrot: { multiplier: 1.3, type: 'price_up' }
    },
    emoji: '🥕',
    color: '#f97316'
  },
  
  corn_surplus: {
    id: 'corn_surplus',
    name: 'ข้าวโพดล้นตลาด',
    description: 'ผลผลิตข้าวโพดมากเกินไป',
    duration: 2,
    effects: {
      corn: { multiplier: 0.7, type: 'price_down' }
    },
    emoji: '🌽',
    color: '#fbbf24'
  }
};

export const SEASONAL_MODIFIERS = {
  spring: {
    name: 'ฤดูใบไม้ผลิ',
    emoji: '🌸',
    modifiers: {
      tomato: 1.1, // มะเขือเทศราคาดีในฤดูใบไม้ผลิ
      carrot: 1.0,
      corn: 0.9,
      wheat: 1.0,
      pumpkin: 0.8
    }
  },
  
  summer: {
    name: 'ฤดูร้อน',
    emoji: '☀️',
    modifiers: {
      tomato: 1.2, // มะเขือเทศราคาดีมากในฤดูร้อน
      carrot: 0.9,
      corn: 1.1,
      wheat: 0.8,
      pumpkin: 0.7
    }
  },
  
  autumn: {
    name: 'ฤดูใบไม้ร่วง',
    emoji: '🍂',
    modifiers: {
      tomato: 0.8,
      carrot: 1.1,
      corn: 1.0,
      wheat: 1.3, // ข้าวสาลีราคาดีในฤดูใบไม้ร่วง
      pumpkin: 1.4 // ฟักทองราคาดีมากในฤดูใบไม้ร่วง
    }
  },
  
  winter: {
    name: 'ฤดูหนาว',
    emoji: '❄️',
    modifiers: {
      tomato: 0.6,
      carrot: 1.2, // แครอทราคาดีในฤดูหนาว
      corn: 0.9,
      wheat: 1.1,
      pumpkin: 1.0
    }
  }
};

// ราคาพื้นฐานของพืช (จะถูกปรับตามฤดูกาลและเหตุการณ์)
export const BASE_PRICES = {
  tomato: 150,
  carrot: 45,
  corn: 150,
  wheat: 10,
  pumpkin: 450
};

// คำนวณราคาปัจจุบันตามฤดูกาลและเหตุการณ์
export function calculateCurrentPrices(gameDay, activeEvents = []) {
  const season = getCurrentSeason(gameDay);
  const seasonalModifier = SEASONAL_MODIFIERS[season];
  
  const prices = {};
  
  // คำนวณราคาพื้นฐาน + ฤดูกาล
  Object.keys(BASE_PRICES).forEach(cropId => {
    let price = BASE_PRICES[cropId] * seasonalModifier.modifiers[cropId];
    
    // คำนวณผลกระทบจากเหตุการณ์
    activeEvents.forEach(eventId => {
      const event = MARKET_EVENTS[eventId];
      if (event && event.effects[cropId]) {
        const effect = event.effects[cropId];
        if (effect.type === 'price_up') {
          price *= effect.multiplier;
        } else if (effect.type === 'price_down') {
          price *= effect.multiplier;
        }
      }
    });
    
    prices[cropId] = Math.round(price);
  });
  
  return {
    prices,
    season,
    seasonalModifier,
    activeEvents
  };
}

// คำนวณฤดูกาลปัจจุบันจากวันในเกม
export function getCurrentSeason(gameDay) {
  const seasons = ['spring', 'summer', 'autumn', 'winter'];
  const seasonIndex = Math.floor((gameDay - 1) / 7) % 4; // เปลี่ยนฤดูทุก 7 วัน
  return seasons[seasonIndex];
}

// สร้างเหตุการณ์สุ่ม
export function generateRandomEvent() {
  const eventIds = Object.keys(MARKET_EVENTS);
  const randomEventId = eventIds[Math.floor(Math.random() * eventIds.length)];
  return MARKET_EVENTS[randomEventId];
}

// ตรวจสอบว่าเหตุการณ์ยังคงอยู่หรือไม่
export function isEventActive(eventStartDay, eventDuration, currentDay) {
  return currentDay < eventStartDay + eventDuration;
}

// คำนวณเทรนด์ราคา (เปรียบเทียบกับวันก่อน)
export function calculatePriceTrend(currentPrices, previousPrices) {
  const trends = {};
  
  Object.keys(currentPrices).forEach(cropId => {
    const current = currentPrices[cropId];
    const previous = previousPrices[cropId] || current;
    
    if (current > previous) {
      trends[cropId] = { direction: 'up', change: current - previous, percentage: ((current - previous) / previous * 100).toFixed(1) };
    } else if (current < previous) {
      trends[cropId] = { direction: 'down', change: previous - current, percentage: ((previous - current) / previous * 100).toFixed(1) };
    } else {
      trends[cropId] = { direction: 'stable', change: 0, percentage: 0 };
    }
  });
  
  return trends;
}

// src/data/contracts.js
// ระบบ Trade Contracts - งานและรางวัล

export const CONTRACT_TYPES = {
  delivery: {
    id: 'delivery',
    name: 'งานส่งของ',
    emoji: '📦',
    description: 'ส่งสินค้าตามจำนวนที่กำหนด'
  },
  
  production: {
    id: 'production',
    name: 'งานผลิต',
    emoji: '🏭',
    description: 'ผลิตสินค้าแปรรูปตามจำนวนที่กำหนด'
  },
  
  collection: {
    id: 'collection',
    name: 'งานเก็บรวบรวม',
    emoji: '🎯',
    description: 'เก็บรวบรวมสินค้าหลายชนิด'
  }
};

export const CONTRACT_REWARDS = {
  money: {
    type: 'money',
    name: 'เงิน',
    emoji: '💰',
    description: 'ได้รับเงินเพิ่ม'
  },
  
  xp: {
    type: 'xp',
    name: 'ประสบการณ์',
    emoji: '⭐',
    description: 'ได้รับประสบการณ์เพิ่ม'
  },
  
  seeds: {
    type: 'seeds',
    name: 'เมล็ดพันธุ์',
    emoji: '🌱',
    description: 'ได้รับเมล็ดพันธุ์พิเศษ'
  },
  
  items: {
    type: 'items',
    name: 'ของพิเศษ',
    emoji: '🎁',
    description: 'ได้รับของพิเศษ'
  }
};

// ตัวอย่างสัญญา
export const SAMPLE_CONTRACTS = [
  {
    id: 'contract_001',
    type: 'delivery',
    title: 'ส่งมะเขือเทศให้ร้านอาหาร',
    description: 'ร้านอาหารต้องการมะเขือเทศสด 15 ชิ้น สำหรับทำเมนูพิเศษ',
    requirements: {
      tomato: 15
    },
    deadline: 3, // จำนวนวัน
    rewards: [
      { type: 'money', amount: 500 },
      { type: 'xp', amount: 100 }
    ],
    difficulty: 'easy',
    emoji: '🍅'
  },
  
  {
    id: 'contract_002',
    type: 'delivery',
    title: 'ส่งข้าวสาลีให้โรงสี',
    description: 'โรงสีต้องการข้าวสาลี 50 ชิ้น สำหรับผลิตแป้ง',
    requirements: {
      wheat: 50
    },
    deadline: 5,
    rewards: [
      { type: 'money', amount: 800 },
      { type: 'xp', amount: 150 },
      { type: 'seeds', item: 'wheat', amount: 10 }
    ],
    difficulty: 'medium',
    emoji: '🌾'
  },
  
  {
    id: 'contract_003',
    type: 'collection',
    title: 'จัดส่งผักหลากชนิด',
    description: 'ตลาดต้องการผักหลากชนิดสำหรับงานเทศกาล',
    requirements: {
      tomato: 10,
      carrot: 20,
      corn: 5
    },
    deadline: 4,
    rewards: [
      { type: 'money', amount: 1200 },
      { type: 'xp', amount: 200 }
    ],
    difficulty: 'medium',
    emoji: '🥬'
  },
  
  {
    id: 'contract_004',
    type: 'delivery',
    title: 'ส่งฟักทองให้ร้านขนม',
    description: 'ร้านขนมต้องการฟักทอง 8 ชิ้น สำหรับทำขนมพิเศษ',
    requirements: {
      pumpkin: 8
    },
    deadline: 6,
    rewards: [
      { type: 'money', amount: 2000 },
      { type: 'xp', amount: 300 },
      { type: 'items', item: 'special_pumpkin_seed', amount: 3 }
    ],
    difficulty: 'hard',
    emoji: '🎃'
  }
];

// สร้างสัญญาใหม่แบบสุ่ม
export function generateRandomContract(gameDay, playerLevel = 1) {
  const baseContracts = [...SAMPLE_CONTRACTS];
  
  // เลือกสัญญาตามระดับผู้เล่น
  let availableContracts = baseContracts.filter(contract => {
    if (playerLevel < 5) return contract.difficulty === 'easy';
    if (playerLevel < 10) return ['easy', 'medium'].includes(contract.difficulty);
    return true; // ระดับสูงสามารถทำได้ทุกอย่าง
  });
  
  // สุ่มเลือกสัญญา
  const randomContract = availableContracts[Math.floor(Math.random() * availableContracts.length)];
  
  // สร้างสัญญาใหม่พร้อมข้อมูลเฉพาะ
  const newContract = {
    ...randomContract,
    id: `contract_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    startDay: gameDay,
    deadline: gameDay + randomContract.deadline,
    status: 'active', // active, completed, expired
    progress: {},
    createdAt: Date.now()
  };
  
  // เริ่มต้น progress สำหรับแต่ละ requirement
  Object.keys(newContract.requirements).forEach(itemId => {
    newContract.progress[itemId] = 0;
  });
  
  return newContract;
}

// ตรวจสอบความคืบหน้าสัญญา
export function updateContractProgress(contract, inventory) {
  const updatedContract = { ...contract };
  let totalProgress = 0;
  let totalRequired = 0;
  
  Object.keys(contract.requirements).forEach(itemId => {
    const required = contract.requirements[itemId];
    const available = inventory[itemId] || 0;
    const progress = Math.min(available, required);
    
    updatedContract.progress[itemId] = progress;
    totalProgress += progress;
    totalRequired += required;
  });
  
  // คำนวณเปอร์เซ็นต์ความคืบหน้า
  updatedContract.completionPercentage = totalRequired > 0 ? (totalProgress / totalRequired) * 100 : 0;
  
  // ตรวจสอบว่าสัญญาเสร็จสิ้นหรือไม่
  if (updatedContract.completionPercentage >= 100) {
    updatedContract.status = 'ready_to_complete';
  } else {
    updatedContract.status = 'active';
  }
  
  return updatedContract;
}

// ตรวจสอบว่าสัญญาหมดอายุหรือไม่
export function isContractExpired(contract, currentDay) {
  return currentDay > contract.deadline;
}

// คำนวณเวลาที่เหลือ
export function getTimeRemaining(contract, currentDay) {
  const remaining = contract.deadline - currentDay;
  return Math.max(0, remaining);
}

// ประเมินความยากของสัญญา
export function getContractDifficulty(contract) {
  const totalItems = Object.values(contract.requirements).reduce((sum, count) => sum + count, 0);
  const timePressure = contract.deadline;
  
  if (totalItems <= 15 && timePressure >= 5) return 'easy';
  if (totalItems <= 30 && timePressure >= 3) return 'medium';
  return 'hard';
}

// คำนวณรางวัลที่ได้รับ
export function calculateContractRewards(contract) {
  const rewards = {};
  
  contract.rewards.forEach(reward => {
    if (reward.type === 'money') {
      rewards.money = (rewards.money || 0) + reward.amount;
    } else if (reward.type === 'xp') {
      rewards.xp = (rewards.xp || 0) + reward.amount;
    } else if (reward.type === 'seeds') {
      if (!rewards.seeds) rewards.seeds = {};
      rewards.seeds[reward.item] = (rewards.seeds[reward.item] || 0) + reward.amount;
    } else if (reward.type === 'items') {
      if (!rewards.items) rewards.items = {};
      rewards.items[reward.item] = (rewards.items[reward.item] || 0) + reward.amount;
    }
  });
  
  return rewards;
}

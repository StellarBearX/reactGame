// src/state/farmSlice.js
// ✅ ข้อ 5: Redux Toolkit Slice (15%)

import { createSlice } from '@reduxjs/toolkit';
import { CROPS_DATA } from '../data/crops.js';

const INITIAL_STATE = {
  money: 5,
  plots: Array(4).fill(null).map((_, i) => ({
    id: i,
    crop: null,
    plantedAt: null,
    isGrown: false,
  })),
  produceInventory: {},
  seedInventory: {},
  gameStartTime: Date.now(),
  selectedSeed: null,
  currentPage: 'farm',
  // 🎮 ระบบ XP & Level
  level: 1,
  xp: 0,
  maxXp: 100,
  // 📊 Statistics
  statistics: {
    totalPlanted: 0,
    totalHarvested: 0,
    totalEarned: 0,
    totalSpent: 0,
    cropsPlanted: {},
    cropsHarvested: {},
  },
  // 🏪 ระบบตลาด Dynamic Market
  market: {
    currentPrices: {},
    previousPrices: {},
    priceTrends: {},
    activeEvents: [],
    currentSeason: 'spring',
    lastPriceUpdate: Date.now(),
    marketHistory: []
  },
  // 📋 ระบบ Trade Contracts
  contracts: {
    activeContracts: [],
    completedContracts: [],
    contractHistory: [],
    lastContractGeneration: Date.now()
  },
  // 🏭 ระบบ Processing & Crafting
  crafting: {
    stations: {
      mill: { unlocked: false, level: 0 },
      kitchen: { unlocked: false, level: 0 },
      workshop: { unlocked: false, level: 0 }
    },
    craftingQueue: [],
    processedInventory: {},
    recipes: {},
    craftingHistory: []
  },
  // 🎯 ระบบ Skills & Perks
  skills: {
    farming: { level: 1, xp: 0, perks: [] },
    cooking: { level: 1, xp: 0, perks: [] },
    trading: { level: 1, xp: 0, perks: [] }
  },
  // 🎮 ระบบ Tutorial & Help
  tutorial: {
    hasSeenWelcome: false,
    completedTutorials: [],
    showHints: true
  }
};


const farmSlice = createSlice({
  name: 'farm',
  initialState: INITIAL_STATE,
  reducers: {
    // ========================================
    // Money Management
    // ========================================
    addMoney: (state, action) => {
      state.money += action.payload;
    },
    
    spendMoney: (state, action) => {
      state.money -= action.payload;
    },

    // ========================================
    // Seed Management
    // ========================================
    selectSeed: (state, action) => {
      state.selectedSeed = action.payload;
    },
    
    clearSelectedSeed: (state) => {
      state.selectedSeed = null;
    },

    // ✅ แก้ไข: ซื้อเมล็ดแล้วเพิ่มเข้า seedInventory
    buySeeds: (state, action) => {
  const cropId = action.payload;
  const crop = CROPS_DATA[cropId];

  if (state.money >= crop.seedPrice) {
    state.money -= crop.seedPrice;
    state.selectedSeed = cropId;

    if (!state.seedInventory[cropId]) {
      state.seedInventory[cropId] = 0;
    }
    state.seedInventory[cropId] += 1;
  }
},

    // ========================================
    // Farming Actions
    // ========================================
    plantCrop: (state, action) => {
      const plotId = action.payload;
      if (!state.selectedSeed) return;

      const plot = state.plots.find(p => p.id === plotId);
      if (plot && !plot.crop) {
        plot.crop = state.selectedSeed;
        plot.plantedAt = Date.now();
        plot.isGrown = false;
        
        // 📊 อัพเดทสถิติ
        state.statistics.totalPlanted += 1;
        if (!state.statistics.cropsPlanted[state.selectedSeed]) {
          state.statistics.cropsPlanted[state.selectedSeed] = 0;
        }
        state.statistics.cropsPlanted[state.selectedSeed] += 1;
        
        // 🎮 ให้ XP เพียงเล็กน้อยในการปลูก
        state.xp += 5;
        
        // ✅ ลดเมล็ดในกระเป๋า
        if (state.seedInventory[state.selectedSeed] > 0) {
          state.seedInventory[state.selectedSeed] -= 1;
          if (state.seedInventory[state.selectedSeed] === 0) {
            delete state.seedInventory[state.selectedSeed];
          }
        }
        
        state.selectedSeed = null;
        
        // ⭐ Level up logic
        if (state.xp >= state.maxXp) {
          const excessXp = state.xp - state.maxXp;
          state.level += 1;
          state.maxXp = Math.floor(100 * Math.pow(1.5, state.level - 2));
          state.xp = excessXp;
        }
      }
    },

    harvestCrop: (state, action) => {
      const plotId = action.payload;
      const plot = state.plots.find(p => p.id === plotId);
      
      if (!plot || !plot.crop) return;

      const crop = CROPS_DATA[plot.crop];
      
      // เพิ่มเงิน
      state.money += crop.sellPrice;
      
      // 📊 อัพเดทสถิติ
      state.statistics.totalHarvested += 1;
      state.statistics.totalEarned += crop.sellPrice;
      if (!state.statistics.cropsHarvested[plot.crop]) {
        state.statistics.cropsHarvested[plot.crop] = 0;
      }
      state.statistics.cropsHarvested[plot.crop] += 1;
      
      // 🎮 ให้ XP เมื่อเก็บเกี่ยว (พืชต่างกันให้ XP ต่างกัน)
      const xpGain = crop.sellPrice * 2;
      state.xp += xpGain;
      
      // ✅ เพิ่มผลผลิตเข้า produceInventory
      if (!state.produceInventory[plot.crop]) {
        state.produceInventory[plot.crop] = 0;
      }
      state.produceInventory[plot.crop] += 1;
      
      // ล้างช่องปลูก
      plot.crop = null;
      plot.plantedAt = null;
      plot.isGrown = false;
      
      // ⭐ Level up logic
      if (state.xp >= state.maxXp) {
        const excessXp = state.xp - state.maxXp;
        state.level += 1;
        state.maxXp = Math.floor(100 * Math.pow(1.5, state.level - 2));
        state.xp = excessXp;
        
      // 🌱 เมื่อถึงเลเวล 10 ให้เพิ่มพื้นที่เพาะปลูก
      if (state.level % 10 === 0 && state.plots.length < 20) {
        const newPlots = Array(1).fill(null).map((_, i) => ({
        id: state.plots.length + i,
        crop: null,
        plantedAt: null,
        isGrown: false,
      }));
    state.plots.push(...newPlots);
  }

  // 🏅 ตัวอย่าง unlock อย่างอื่น
  if (state.level === 2) {
    // Unlock achievement for first level up
  }
      }
    },

    markPlotGrown: (state, action) => {
      const plotId = action.payload;
      const plot = state.plots.find(p => p.id === plotId);
      if (plot) {
        plot.isGrown = true;
      }
    },

    // ========================================
    // Quest System
    // ========================================
    addQuest: (state, action) => {
      const quest = action.payload;
      if (!state.activeQuests.some(q => q.id === quest.id)) {
        state.activeQuests.push(quest);
      }
    },
    
    completeQuest: (state, action) => {
      const questId = action.payload;
      const questIndex = state.activeQuests.findIndex(q => q.id === questId);
      if (questIndex !== -1) {
        const quest = state.activeQuests[questIndex];
        state.activeQuests.splice(questIndex, 1);
        state.completedQuests.push(questId);
        // ให้ rewards
        if (quest.reward) {
          if (quest.reward.money) {
            state.money += quest.reward.money;
          }
          if (quest.reward.xp) {
            state.xp += quest.reward.xp;
          }
        }
      }
    },
    
    // ========================================
    // Navigation
    // ========================================
    setPage: (state, action) => {
      state.currentPage = action.payload;
    },

    // ========================================
    // Market System
    // ========================================
    updateMarketPrices: (state, action) => {
      const { prices, season, activeEvents, trends } = action.payload;
      state.market.previousPrices = { ...state.market.currentPrices };
      state.market.currentPrices = prices;
      state.market.currentSeason = season;
      state.market.activeEvents = activeEvents;
      state.market.priceTrends = trends;
      state.market.lastPriceUpdate = Date.now();
      
      // บันทึกประวัติตลาด
      state.market.marketHistory.push({
        day: Math.floor((Date.now() - state.gameStartTime) / (60 * 1000)) + 1,
        prices: { ...prices },
        season,
        activeEvents: [...activeEvents],
        timestamp: Date.now()
      });
      
      // เก็บเฉพาะประวัติ 30 วันล่าสุด
      if (state.market.marketHistory.length > 30) {
        state.market.marketHistory = state.market.marketHistory.slice(-30);
      }
    },
    
    addMarketEvent: (state, action) => {
      const event = action.payload;
      if (!state.market.activeEvents.includes(event.id)) {
        state.market.activeEvents.push(event.id);
      }
    },
    
    removeMarketEvent: (state, action) => {
      const eventId = action.payload;
      state.market.activeEvents = state.market.activeEvents.filter(id => id !== eventId);
    },

    // ========================================
    // Contract System
    // ========================================
    addContract: (state, action) => {
      const contract = action.payload;
      state.contracts.activeContracts.push(contract);
      state.contracts.lastContractGeneration = Date.now();
    },
    
    updateContractProgress: (state, action) => {
      const { contractId, progress } = action.payload;
      const contract = state.contracts.activeContracts.find(c => c.id === contractId);
      if (contract) {
        contract.progress = progress;
        
        // คำนวณเปอร์เซ็นต์ความคืบหน้า
        const totalRequired = Object.values(contract.requirements).reduce((sum, count) => sum + count, 0);
        const totalProgress = Object.values(progress).reduce((sum, count) => sum + count, 0);
        contract.completionPercentage = totalRequired > 0 ? (totalProgress / totalRequired) * 100 : 0;
        
        if (contract.completionPercentage >= 100) {
          contract.status = 'ready_to_complete';
        }
      }
    },
    
    completeContract: (state, action) => {
      const contractId = action.payload;
      const contractIndex = state.contracts.activeContracts.findIndex(c => c.id === contractId);
      
      if (contractIndex !== -1) {
        const contract = state.contracts.activeContracts[contractIndex];
        contract.status = 'completed';
        contract.completedAt = Date.now();
        
        // ลบสินค้าจาก inventory ตามที่ส่งมอบ
        Object.keys(contract.requirements).forEach(itemId => {
          const requiredAmount = contract.requirements[itemId];
          if (state.produceInventory[itemId]) {
            state.produceInventory[itemId] -= requiredAmount;
            if (state.produceInventory[itemId] <= 0) {
              delete state.produceInventory[itemId];
            }
          }
        });
        
        // ย้ายไปยังรายการที่เสร็จสิ้น
        state.contracts.completedContracts.push(contract);
        state.contracts.activeContracts.splice(contractIndex, 1);
        
        // ให้รางวัล
        contract.rewards.forEach(reward => {
          if (reward.type === 'money') {
            state.money += reward.amount;
          } else if (reward.type === 'xp') {
            state.xp += reward.amount;
          } else if (reward.type === 'seeds') {
            if (!state.seedInventory[reward.item]) {
              state.seedInventory[reward.item] = 0;
            }
            state.seedInventory[reward.item] += reward.amount;
          }
        });
        
        // อัพเดทสถิติ
        state.statistics.totalEarned += contract.rewards.reduce((sum, r) => sum + (r.type === 'money' ? r.amount : 0), 0);
      }
    },
    
    expireContract: (state, action) => {
      const contractId = action.payload;
      const contractIndex = state.contracts.activeContracts.findIndex(c => c.id === contractId);
      
      if (contractIndex !== -1) {
        const contract = state.contracts.activeContracts[contractIndex];
        contract.status = 'expired';
        contract.expiredAt = Date.now();
        
        state.contracts.contractHistory.push(contract);
        state.contracts.activeContracts.splice(contractIndex, 1);
      }
    },

    // ========================================
    // Crafting System
    // ========================================
    unlockStation: (state, action) => {
      const stationId = action.payload;
      if (state.crafting.stations[stationId]) {
        state.crafting.stations[stationId].unlocked = true;
        state.crafting.stations[stationId].level = 1;
      }
    },
    
    startCrafting: (state, action) => {
      const { recipeId, stationId } = action.payload;
      const recipe = action.payload.recipe;
      
      // ตรวจสอบว่ามีวัตถุดิบครบหรือไม่
      let canCraft = true;
      for (const [itemId, requiredAmount] of Object.entries(recipe.inputs)) {
        const availableAmount = state.produceInventory[itemId] || 0;
        if (availableAmount < requiredAmount) {
          canCraft = false;
          break;
        }
      }
      
      if (canCraft) {
        // ลบวัตถุดิบ
        for (const [itemId, requiredAmount] of Object.entries(recipe.inputs)) {
          state.produceInventory[itemId] -= requiredAmount;
          if (state.produceInventory[itemId] <= 0) {
            delete state.produceInventory[itemId];
          }
        }
        
        // เพิ่มงานลงคิว
        const craftingJob = {
          id: `craft_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          recipeId,
          stationId,
          startTime: Date.now(),
          craftingTime: recipe.craftingTime,
          status: 'in_progress',
          recipe
        };
        
        state.crafting.craftingQueue.push(craftingJob);
      }
    },
    
    completeCrafting: (state, action) => {
      const jobId = action.payload;
      const jobIndex = state.crafting.craftingQueue.findIndex(j => j.id === jobId);
      
      if (jobIndex !== -1) {
        const job = state.crafting.craftingQueue[jobIndex];
        
        // เพิ่มผลผลิต
        for (const [itemId, amount] of Object.entries(job.recipe.outputs)) {
          if (!state.crafting.processedInventory[itemId]) {
            state.crafting.processedInventory[itemId] = 0;
          }
          state.crafting.processedInventory[itemId] += amount;
        }
        
        // ให้ XP
        state.xp += job.recipe.xpReward;
        
        // บันทึกประวัติ
        state.crafting.craftingHistory.push({
          ...job,
          completedAt: Date.now(),
          status: 'completed'
        });
        
        // ลบออกจากคิว
        state.crafting.craftingQueue.splice(jobIndex, 1);
      }
    },
    
    sellProcessedItem: (state, action) => {
      const { itemId, amount, price } = action.payload;
      
      if (state.crafting.processedInventory[itemId] >= amount) {
        state.crafting.processedInventory[itemId] -= amount;
        if (state.crafting.processedInventory[itemId] <= 0) {
          delete state.crafting.processedInventory[itemId];
        }
        
        state.money += price * amount;
        state.statistics.totalEarned += price * amount;
      }
    },

    // ========================================
    // Skills System
    // ========================================
    addSkillXP: (state, action) => {
      const { skillType, amount } = action.payload;
      
      if (state.skills[skillType]) {
        state.skills[skillType].xp += amount;
        
        // ตรวจสอบเลเวลอัพ
        const currentLevel = state.skills[skillType].level;
        const requiredXP = currentLevel * 100; // 100 XP ต่อเลเวล
        
        if (state.skills[skillType].xp >= requiredXP) {
          state.skills[skillType].level += 1;
          state.skills[skillType].xp -= requiredXP;
        }
      }
    },

    // ========================================
    // Tutorial System
    // ========================================
    markWelcomeSeen: (state) => {
      state.tutorial.hasSeenWelcome = true;
    },
    
    completeTutorial: (state, action) => {
      const tutorialId = action.payload;
      if (!state.tutorial.completedTutorials.includes(tutorialId)) {
        state.tutorial.completedTutorials.push(tutorialId);
      }
    },
    
    toggleHints: (state) => {
      state.tutorial.showHints = !state.tutorial.showHints;
    },

    // ========================================
    // Game Control
    // ========================================
    resetGame: (state) => {
      return {
        ...INITIAL_STATE,
        gameStartTime: Date.now(),
      };
    },
  },
});

// ✅ Export actions
export const {
  addMoney,
  spendMoney,
  selectSeed,
  clearSelectedSeed,
  buySeeds,
  plantCrop,
  harvestCrop,
  markPlotGrown,
  setPage,
  // Market actions
  updateMarketPrices,
  addMarketEvent,
  removeMarketEvent,
  // Contract actions
  addContract,
  updateContractProgress,
  completeContract,
  expireContract,
  // Crafting actions
  unlockStation,
  startCrafting,
  completeCrafting,
  sellProcessedItem,
  // Skills actions
  addSkillXP,
  // Tutorial actions
  markWelcomeSeen,
  completeTutorial,
  toggleHints,
  // Game control
  resetGame,
} = farmSlice.actions;

// ✅ Export reducer
export default farmSlice.reducer;
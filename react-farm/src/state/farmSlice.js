// src/state/farmSlice.js
// ✅ ข้อ 5: Redux Toolkit Slice (15%)

import { createSlice } from '@reduxjs/toolkit';
import { CROPS_DATA } from '../data/crops.js';

const INITIAL_STATE = {
  money: 100,
  plots: Array(12).fill(null).map((_, i) => ({
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
        
        // Unlock ข้อมูลต่างๆ เมื่อ level up
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
  resetGame,
} = farmSlice.actions;

// ✅ Export reducer
export default farmSlice.reducer;
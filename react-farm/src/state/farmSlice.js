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
        
        // ✅ ลดเมล็ดในกระเป๋า
        if (state.seedInventory[state.selectedSeed] > 0) {
          state.seedInventory[state.selectedSeed] -= 1;
          if (state.seedInventory[state.selectedSeed] === 0) {
            delete state.seedInventory[state.selectedSeed];
          }
        }
        
        state.selectedSeed = null;
      }
    },

    harvestCrop: (state, action) => {
      const plotId = action.payload;
      const plot = state.plots.find(p => p.id === plotId);
      
      if (!plot || !plot.crop) return;

      const crop = CROPS_DATA[plot.crop];
      
      // เพิ่มเงิน
      state.money += crop.sellPrice;
      
      // ✅ เพิ่มผลผลิตเข้า produceInventory
      if (!state.produceInventory[plot.crop]) {
        state.produceInventory[plot.crop] = 0;
      }
      state.produceInventory[plot.crop] += 1;
      
      // ล้างช่องปลูก
      plot.crop = null;
      plot.plantedAt = null;
      plot.isGrown = false;
    },

    markPlotGrown: (state, action) => {
      const plotId = action.payload;
      const plot = state.plots.find(p => p.id === plotId);
      if (plot) {
        plot.isGrown = true;
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
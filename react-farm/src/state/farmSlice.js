/**
 * ============================================
 * 📁 farmSlice.js - Redux Slice หลักของเกม
 * ============================================
 * 
 * ไฟล์นี้เป็น Redux Slice ที่จัดการ State และ Actions ทั้งหมดของเกม
 * ใช้ Redux Toolkit's createSlice เพื่อลด boilerplate code
 * 
 * หน้าที่หลัก:
 * 1. กำหนด Initial State ของแอป
 * 2. สร้าง Reducers (Actions) สำหรับอัพเดท State
 * 3. Export Actions เพื่อให้ Components เรียกใช้
 * 4. Export Reducer เพื่อใช้ใน store.js
 * 
 * State Structure:
 * - money: เงินของเล่น
 * - plots: แปลงปลูก (array of plot objects)
 * - seedInventory: เมล็ดในกระเป๋า (object: { cropId: count })
 * - produceInventory: ผลผลิตในกระเป๋า (object: { cropId: count })
 * - level, xp, maxXp: ระบบเลเวล
 * - statistics: สถิติการเล่น
 * - market: ข้อมูลตลาด (ราคา, ฤดูกาล, เหตุการณ์)
 * - contracts: สัญญาการค้า
 * - crafting: ระบบแปรรูป
 * - skills: ระบบทักษะ
 * - tutorial: ระบบสอนเล่น
 * 
 * การเชื่อมโยง:
 * - store.js: Import reducer นี้ไปใช้
 * - Components: ใช้ useSelector และ useDispatch เพื่อเข้าถึง State และ Actions
 * - data/crops.js: ใช้ข้อมูลพืช
 */

import { createSlice } from '@reduxjs/toolkit'; // 🔗 Redux Toolkit: ใช้สร้าง Slice
import { CROPS_DATA } from '../data/crops.js'; // 🔗 ข้อมูลพืชทั้งหมด

/**
 * INITIAL_STATE: State เริ่มต้นของเกม
 * 
 * ใช้เมื่อเริ่มเกมใหม่ หรือ resetGame()
 * ต้อง match กับ structure ใน store.js (state.farm)
 */
const INITIAL_STATE = {
  // 💰 เงินเริ่มต้น
  money: 5,
  
  // 🌾 แปลงปลูก: เริ่มต้น 4 แปลง (สูงสุด 12 แปลง)
  plots: Array(4).fill(null).map((_, i) => ({
    id: i,
    crop: null, // ID ของพืชที่ปลูก (เช่น 'tomato')
    plantedAt: null, // Timestamp เมื่อปลูก
    isGrown: false, // พืชเติบโตเต็มที่แล้วหรือยัง
  })),
  
  // 📦 กระเป๋า: เก็บผลผลิต (object: { cropId: count })
  produceInventory: {},
  
  // 🌱 กระเป๋า: เก็บเมล็ดพันธุ์ (object: { cropId: count })
  seedInventory: {},
  
  // ⏰ เวลาเริ่มเกม (ใช้คำนวณวัน/เวลาในเกม)
  gameStartTime: Date.now(),
  
  // 🌱 เมล็ดที่เลือกไว้สำหรับปลูก
  selectedSeed: null,
  
  // 📄 หน้าที่เปิดอยู่ ('farm', 'shop', 'inventory', 'stats')
  currentPage: 'farm',
  
  // 🎮 ระบบ XP & Level
  level: 1, // เลเวลปัจจุบัน
  xp: 0, // XP ปัจจุบัน
  maxXp: 100, // XP ที่ต้องใช้ถึงเลเวลถัดไป
  
  // 📊 สถิติการเล่น
  statistics: {
    totalPlanted: 0, // ปลูกทั้งหมด
    totalHarvested: 0, // เก็บเกี่ยวทั้งหมด
    totalEarned: 0, // รายได้รวม
    totalSpent: 0, // ใช้จ่ายรวม
    cropsPlanted: {}, // ปลูกแต่ละชนิด (object: { cropId: count })
    cropsHarvested: {}, // เก็บเกี่ยวแต่ละชนิด (object: { cropId: count })
  },
  
  // 🏪 ระบบตลาด Dynamic Market (ราคาเปลี่ยนแปลงตามฤดูกาลและเหตุการณ์)
  market: {
    currentPrices: {}, // ราคาปัจจุบัน (object: { cropId: price })
    previousPrices: {}, // ราคาเมื่อวาน (ใช้คำนวณเทรนด์)
    priceTrends: {}, // เทรนด์ราคา (up/down/stable)
    activeEvents: [], // เหตุการณ์ที่กำลังเกิดขึ้น (เช่น 'tomato_shortage')
    currentSeason: 'spring', // ฤดูกาลปัจจุบัน ('spring', 'summer', 'autumn', 'winter')
    lastPriceUpdate: Date.now(), // เวลาที่อัพเดทราคาครั้งล่าสุด
    marketHistory: [] // ประวัติราคา (เก็บ 30 วันล่าสุด)
  },
  
  // 📋 ระบบ Trade Contracts (สัญญาการค้า)
  contracts: {
    activeContracts: [], // สัญญาที่รับอยู่ (สูงสุด 3 สัญญา)
    completedContracts: [], // สัญญาที่ทำสำเร็จ
    contractHistory: [], // ประวัติสัญญา
    lastContractGeneration: Date.now() // เวลาที่สร้างสัญญาครั้งล่าสุด (ใช้คำนวณสัญญาใหม่)
  },
  
  // 🏭 ระบบ Processing & Crafting (แปรรูปสินค้า)
  crafting: {
    stations: {
      mill: { unlocked: false, level: 0 }, // โรงสี (ปลดล็อกที่เลเวล 3)
      kitchen: { unlocked: false, level: 0 }, // ครัว (ปลดล็อกที่เลเวล 5)
      workshop: { unlocked: false, level: 0 } // โรงงาน (ปลดล็อกที่เลเวล 8)
    },
    craftingQueue: [], // คิวงานแปรรูป
    processedInventory: {}, // สินค้าที่แปรรูปแล้ว (object: { itemId: count })
    recipes: {}, // สูตรแปรรูป
    craftingHistory: [] // ประวัติการแปรรูป
  },
  
  // 🎯 ระบบ Skills & Perks (ทักษะ)
  skills: {
    farming: { level: 1, xp: 0, perks: [] }, // ทักษะการทำฟาร์ม
    cooking: { level: 1, xp: 0, perks: [] }, // ทักษะการทำอาหาร
    trading: { level: 1, xp: 0, perks: [] } // ทักษะการค้า
  },
  
  // 🎮 ระบบ Tutorial & Help (สอนเล่น)
  tutorial: {
    hasSeenWelcome: false, // เห็น Welcome Screen แล้วหรือยัง
    completedTutorials: [], // Tutorial ที่ทำเสร็จแล้ว
    showHints: true // แสดงคำแนะนำหรือไม่
  }
};


/**
 * farmSlice: Redux Slice หลัก
 * 
 * ใช้ createSlice จาก Redux Toolkit เพื่อ:
 * 1. สร้าง Reducer และ Actions อัตโนมัติ
 * 2. ใช้ Immer เพื่อเขียน mutable code (แต่จริงๆ แล้วเป็น immutable)
 * 3. ลด boilerplate code
 */
const farmSlice = createSlice({
  name: 'farm', // ชื่อของ slice (ใช้ใน DevTools)
  initialState: INITIAL_STATE, // State เริ่มต้น
  reducers: {
    // ========================================
    // 💰 Money Management - จัดการเงิน
    // ========================================
    
    /**
     * addMoney: เพิ่มเงิน
     * @param {number} action.payload - จำนวนเงินที่เพิ่ม
     * 
     * ใช้เมื่อ: เก็บเกี่ยวพืช, ทำสัญญาสำเร็จ
     */
    addMoney: (state, action) => {
      state.money += action.payload;
    },
    
    /**
     * spendMoney: ใช้เงิน
     * @param {number} action.payload - จำนวนเงินที่ใช้
     * 
     * ใช้เมื่อ: ซื้อเมล็ด, ซื้อแปลง, ปลดล็อกสถานี
     */
    spendMoney: (state, action) => {
      state.money -= action.payload;
    },

    // ========================================
    // 🌱 Seed Management - จัดการเมล็ดพันธุ์
    // ========================================
    
    /**
     * selectSeed: เลือกเมล็ดสำหรับปลูก
     * @param {string} action.payload - ID ของเมล็ด (เช่น 'tomato')
     * 
     * ใช้เมื่อ: ผู้เล่นเลือกเมล็ดจาก Inventory
     * 
     * Flow:
     * 1. ตั้ง selectedSeed = cropId
     * 2. เมื่อคลิกแปลงว่าง → ใช้ selectedSeed ปลูก
     */
    selectSeed: (state, action) => {
      state.selectedSeed = action.payload;
    },
    
    /**
     * clearSelectedSeed: ยกเลิกการเลือกเมล็ด
     * 
     * ใช้เมื่อ: ผู้เล่นคลิกเมล็ดที่เลือกอยู่ หรือเมล็ดหมด
     */
    clearSelectedSeed: (state) => {
      state.selectedSeed = null;
    },

    /**
     * buySeeds: ซื้อเมล็ดพันธุ์
     * @param {string} action.payload - ID ของเมล็ด (เช่น 'tomato')
     * 
     * ใช้เมื่อ: ผู้เล่นซื้อเมล็ดจาก Shop
     * 
     * Flow:
     * 1. ตรวจสอบว่าเงินพอหรือไม่
     * 2. ลดเงินตาม seedPrice
     * 3. เพิ่มเมล็ดเข้า seedInventory
     * 4. เลือกเมล็ดนั้นเป็น selectedSeed อัตโนมัติ
     * 
     * 🔗 เรียกจาก: Shop.js
     */
    buySeeds: (state, action) => {
      const cropId = action.payload;
      const crop = CROPS_DATA[cropId]; // 🔗 ดึงข้อมูลพืชจาก CROPS_DATA

      if (state.money >= crop.seedPrice) {
        state.money -= crop.seedPrice; // ลดเงิน
        state.selectedSeed = cropId; // เลือกเมล็ดที่ซื้อ

        // เพิ่มเมล็ดเข้า seedInventory
        if (!state.seedInventory[cropId]) {
          state.seedInventory[cropId] = 0;
        }
        state.seedInventory[cropId] += 1;
      }
    },

    // ========================================
    // 🌾 Farming Actions - การทำฟาร์ม
    // ========================================
    
    /**
     * plantCrop: ปลูกพืช
     * @param {number} action.payload - ID ของแปลง (plot.id)
     * 
     * ใช้เมื่อ: ผู้เล่นคลิกแปลงว่าง + มีเมล็ดเลือกอยู่
     * 
     * Flow:
     * 1. ตรวจสอบว่ามี selectedSeed หรือไม่
     * 2. หาแปลงตาม plotId
     * 3. ตรวจสอบว่าแปลงว่างหรือไม่
     * 4. ปลูกพืช: ตั้ง crop, plantedAt, isGrown = false
     * 5. อัพเดทสถิติ: totalPlanted, cropsPlanted
     * 6. ให้ XP: 5 XP (เล็กน้อย)
     * 7. ลดเมล็ดใน seedInventory (ถ้าหมด → ยกเลิกการเลือก)
     * 8. ตรวจสอบ Level Up
     * 
     * 🔗 เรียกจาก: Plot.js
     */
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
        
        // ✅ ลดเมล็ดในกระเป๋า และคงสถานะการเลือกจนกว่าจะหมดสต็อก
        if (state.seedInventory[state.selectedSeed] > 0) {
          state.seedInventory[state.selectedSeed] -= 1;
          if (state.seedInventory[state.selectedSeed] === 0) {
            delete state.seedInventory[state.selectedSeed];
            state.selectedSeed = null; // หมดสต็อก -> ยกเลิกการเลือก
          }
        } else {
          // เผื่อกรณีข้อมูลไม่สอดคล้อง ให้ยกเลิกการเลือก
          state.selectedSeed = null;
        }
        
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
      
      // ใช้ราคาตลาดหรือราคาพื้นฐานถ้าไม่มีราคาตลาด
      const sellPrice = state.market.currentPrices[plot.crop] || crop.sellPrice;
      
      // เพิ่มเงิน
      state.money += sellPrice;
      
      // 📊 อัพเดทสถิติ
      state.statistics.totalHarvested += 1;
      state.statistics.totalEarned += sellPrice;
      if (!state.statistics.cropsHarvested[plot.crop]) {
        state.statistics.cropsHarvested[plot.crop] = 0;
      }
      state.statistics.cropsHarvested[plot.crop] += 1;
      
      // 🎮 ให้ XP เมื่อเก็บเกี่ยว (พืชต่างกันให้ XP ต่างกัน)
      const xpGain = sellPrice * 2;
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
        
      // 🌱 เมื่อถึงเลเวล 10 ให้เพิ่มพื้นที่เพาะปลูก (ถ้ายังไม่ครบ 12 แปลง)
      if (state.level % 10 === 0 && state.plots.length < 12) {
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
    // Plot Expansion
    // ========================================
    buyPlot: (state, action) => {
      const plotPrice = action.payload || 50; // Base price 50
      const maxPlots = 12; // 4x3 grid
      
      if (state.money >= plotPrice && state.plots.length < maxPlots) {
        state.money -= plotPrice;
        const newPlot = {
          id: state.plots.length,
          crop: null,
          plantedAt: null,
          isGrown: false,
        };
        state.plots.push(newPlot);
        state.statistics.totalSpent += plotPrice;
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
      // Enforce max of 3 active contracts
      if (state.contracts.activeContracts.length >= 3) {
        return;
      }
      // Prevent duplicate IDs
      const exists = state.contracts.activeContracts.some(c => c.id === contract.id);
      if (exists) {
        return;
      }
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
      
      // Combine raw produce and processed items for checking and consumption
      const combinedInventory = {
        ...state.produceInventory,
        ...state.crafting.processedInventory
      };
      
      // ตรวจสอบว่ามีวัตถุดิบครบหรือไม่
      let canCraft = true;
      for (const [itemId, requiredAmount] of Object.entries(recipe.inputs)) {
        const availableAmount = combinedInventory[itemId] || 0;
        if (availableAmount < requiredAmount) {
          canCraft = false;
          break;
        }
      }
      
      if (canCraft) {
        // ลบวัตถุดิบ (จาก produceInventory หรือ processedInventory)
        for (const [itemId, requiredAmount] of Object.entries(recipe.inputs)) {
          // Try to consume from produceInventory first
          if (state.produceInventory[itemId] && state.produceInventory[itemId] >= requiredAmount) {
          state.produceInventory[itemId] -= requiredAmount;
          if (state.produceInventory[itemId] <= 0) {
            delete state.produceInventory[itemId];
            }
          } else if (state.crafting.processedInventory[itemId] && state.crafting.processedInventory[itemId] >= requiredAmount) {
            // Consume from processedInventory
            state.crafting.processedInventory[itemId] -= requiredAmount;
            if (state.crafting.processedInventory[itemId] <= 0) {
              delete state.crafting.processedInventory[itemId];
            }
          } else {
            // Split consumption between both inventories if needed
            let remaining = requiredAmount;
            if (state.produceInventory[itemId]) {
              const takeFromProduce = Math.min(remaining, state.produceInventory[itemId]);
              state.produceInventory[itemId] -= takeFromProduce;
              if (state.produceInventory[itemId] <= 0) {
                delete state.produceInventory[itemId];
              }
              remaining -= takeFromProduce;
            }
            if (remaining > 0 && state.crafting.processedInventory[itemId]) {
              state.crafting.processedInventory[itemId] -= remaining;
              if (state.crafting.processedInventory[itemId] <= 0) {
                delete state.crafting.processedInventory[itemId];
              }
            }
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
      // Clear API-related localStorage data
      try {
        localStorage.removeItem('api_contracts');
        localStorage.removeItem('api_market');
      } catch (error) {
        // Silently handle localStorage errors
      }
      
      const resetTime = Date.now();
      
      return {
        ...INITIAL_STATE,
        gameStartTime: resetTime,
        contracts: {
          ...INITIAL_STATE.contracts,
          lastContractGeneration: resetTime, // Reset countdown timer to start from 5:00
        },
      };
    },

    // ========================================
    // Cheat Codes
    // ========================================
    cheatUnlockAll: (state) => {
      // Max out money
      state.money = 999999999;
      
      // Max out level and XP
      state.level = 100;
      state.xp = 0;
      state.maxXp = 100;
      
      // Max out all skills
      Object.keys(state.skills).forEach(skillType => {
        state.skills[skillType].level = 100;
        state.skills[skillType].xp = 0;
      });
      
      // Unlock all crafting stations
      Object.keys(state.crafting.stations).forEach(stationId => {
        state.crafting.stations[stationId].unlocked = true;
        state.crafting.stations[stationId].level = 10;
      });
      
      // Add lots of seeds for all crops
      Object.keys(CROPS_DATA).forEach(cropId => {
        if (!state.seedInventory[cropId]) {
          state.seedInventory[cropId] = 0;
        }
        state.seedInventory[cropId] += 100;
      });
      
      // Add lots of produce for all crops
      Object.keys(CROPS_DATA).forEach(cropId => {
        if (!state.produceInventory[cropId]) {
          state.produceInventory[cropId] = 0;
        }
        state.produceInventory[cropId] += 100;
      });
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
  buyPlot,
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
  // Cheat codes
  cheatUnlockAll,
} = farmSlice.actions;

// ✅ Export reducer
export default farmSlice.reducer;
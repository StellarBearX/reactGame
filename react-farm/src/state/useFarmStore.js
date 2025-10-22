import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CROPS_DATA } from '../data/crops.js';

const INITIAL_STATE = {
  money: 100,
  plots: Array(12).fill(null).map((_, i) => ({
    id: i,
    crop: null,
    plantedAt: null,
    isGrown: false,
  })),
  produceInventory: {}, // <--- เปลี่ยนชื่อจาก 'inventory'
  seedInventory: {},    // <--- เพิ่มที่เก็บเมล็ด
  gameStartTime: Date.now(),
  selectedSeed: null,
  currentPage: 'farm', 
};

const useFarmStore = create(
  persist(
    (set, get) => ({
      ...INITIAL_STATE,

      // Crop Data
      getCropData: () => CROPS_DATA,
      getCrop: (cropId) => CROPS_DATA[cropId],

      // Money Management
      addMoney: (amount) => set((state) => ({ 
        money: state.money + amount 
      })),
      
      spendMoney: (amount) => set((state) => ({ 
        money: state.money - amount 
      })),

      // Seed Selection
      selectSeed: (cropId) => set({ selectedSeed: cropId }),
      clearSelectedSeed: () => set({ selectedSeed: null }),
      

      // Buy Seeds
      buySeeds: (cropId) => {
        const state = get();
        const crop = CROPS_DATA[cropId];
        
        if (state.money >= crop.seedPrice) {
          set({
            money: state.money - crop.seedPrice,
            selectedSeed: cropId,
          });
          return true;
        }
        return false;
      },

      // Plant Crop
      plantCrop: (plotId) => {
        const state = get();
        const cropId = state.selectedSeed;
        if (!state.selectedSeed) return false;

        set((state) => ({
          plots: state.plots.map((p) =>
            p.id === plotId
              ? {
                  ...p,
                  crop: state.selectedSeed,
                  plantedAt: Date.now(),
                  isGrown: false,
                }
              : p
          ),
          selectedSeed: null,
        }));
        return true;
      },

      // Harvest Crop
      harvestCrop: (plotId) => {
        const state = get();
        const plot = state.plots.find((p) => p.id === plotId);
        
        if (!plot || !plot.crop) return false;

        const crop = CROPS_DATA[plot.crop];
        
        set((state) => ({
          money: state.money + crop.sellPrice,
          inventory: {
            ...state.inventory,
            [plot.crop]: (state.inventory[plot.crop] || 0) + 1,
          },
          plots: state.plots.map((p) =>
            p.id === plotId
              ? { ...p, crop: null, plantedAt: null, isGrown: false }
              : p
          ),
        }));
        return true;
      },

      // Mark plot as grown (called by timer)
      markPlotGrown: (plotId) => {
        set((state) => ({
          plots: state.plots.map((p) =>
            p.id === plotId ? { ...p, isGrown: true } : p
          ),
        }));
      },

      // Reset Game
      resetGame: () => set({
        ...INITIAL_STATE,
        gameStartTime: Date.now(),
      }),

      // Get total inventory count
      getInventoryCount: () => {
        const state = get();
       return Object.values(state.seedInventory).reduce((sum, count) => sum + count, 0);
      },

      // ========================================
      // ✅ ฟังก์ชันที่เพิ่มเข้ามา
      // ========================================
      
      // Navigation (สำหรับ Menu)
      setPage: (page) => set({ currentPage: page }),
      
      // Helper: Get current day
      getCurrentDay: () => {
        const state = get();
        const elapsed = Date.now() - state.gameStartTime;
        const dayDuration = 60 * 1000; // 60 วินาที = 1 วัน
        return Math.floor(elapsed / dayDuration) + 1;
      },

      // Helper: Can afford check
      canAfford: (amount) => {
        return get().money >= amount;
      },
    }),
    {
      name: 'farm-storage',
      partialize: (state) => ({
        money: state.money,
        plots: state.plots,
       produceInventory: state.produceInventory,
        seedInventory: state.seedInventory,       
        gameStartTime: state.gameStartTime,
        currentPage: state.currentPage, 
      }),
    }
  )
);

export default useFarmStore;
// state/useFarmStore.js
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CROPS_DATA } from '../data/crops.js';

const INITIAL_STATE = {
  money: 50,
  plots: Array(12).fill(null).map((_, i) => ({
    id: i,
    crop: null,
    plantedAt: null,
    isGrown: false,
  })),
  inventory: {},
  gameStartTime: Date.now(),
  selectedSeed: null,
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
        return Object.values(state.inventory).reduce((sum, count) => sum + count, 0);
      },
    }),
    {
      name: 'farm-storage',
      partialize: (state) => ({
        money: state.money,
        plots: state.plots,
        inventory: state.inventory,
        gameStartTime: state.gameStartTime,
      }),
    }
  )
);

export default useFarmStore;
// src/state/store.js
import { configureStore } from '@reduxjs/toolkit';
import farmReducer from './farmSlice.js';

const loadState = () => {
  try {
    const serializedState = localStorage.getItem('farm-storage');
    if (serializedState === null) {
      return undefined; // ✅ ให้ใช้ initial state
    }
    const parsed = JSON.parse(serializedState);
    
    // ✅ ตรวจสอบว่ามี seedInventory หรือยัง
    if (!parsed.seedInventory) {
      parsed.seedInventory = {};
    }
    if (!parsed.produceInventory) {
      parsed.produceInventory = {};
    }
    
    return parsed;
  } catch (err) {
    console.error('Error loading state:', err);
    return undefined;
  }
};

const saveState = (state) => {
  try {
    const serializedState = JSON.stringify(state.farm);
    localStorage.setItem('farm-storage', serializedState);
  } catch (err) {
    console.error('Error saving state:', err);
  }
};

const persistedState = loadState();

const store = configureStore({
  reducer: {
    farm: farmReducer,
  },
  preloadedState: persistedState ? { farm: persistedState } : undefined,
});
store.subscribe(() => {
  saveState(store.getState());
});

export default store;
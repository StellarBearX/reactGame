// src/app/store.js
import { configureStore } from '@reduxjs/toolkit';
import farmReducer from '../features/farm/farmSlice';
import { persistStore, persistReducer, FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

// เราจะ persist แค่ state ของ farm
const persistConfig = {
  key: 'farm-storage-rtk', // ใช้ key ใหม่ (หรือ key เดิมก็ได้)
  storage,
  whitelist: ['farm'], // บอกว่าให้บันทึกแค่ 'farm' slice
};

const persistedReducer = persistReducer(
  persistConfig,
  // ในอนาคตถ้ามี slice อื่น ให้รวมใน combineReducers
  farmReducer 
);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);
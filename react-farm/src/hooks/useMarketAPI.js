// src/hooks/useMarketAPI.js
// Custom hook for fetching market data via GET method
import { useState, useEffect } from 'react';
import { getMarketData } from '../services/api.js';
import { calculateCurrentPrices } from '../data/market.js';

export const useMarketAPI = (gameDay, activeEvents = []) => {
  const [marketData, setMarketData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMarketData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // ✅ GET method - Fetch market data from API
        const response = await getMarketData();
        
        // Check if API returned valid data
        if (response && response.data) {
          setMarketData(response.data);
        } else {
          // Fallback to local calculation if API returns null/undefined
          throw new Error('No market data from API');
        }
      } catch (err) {
        // Expected: No API server, fallback to local calculation (normal behavior)
        // Only log if it's not the expected "no data" error
        if (err.message !== 'No market data from API') {
          console.warn('Market API error, using local calculation:', err);
        }
        
        // Fallback to local calculation
        try {
          const localPrices = calculateCurrentPrices(gameDay, activeEvents);
          setMarketData(localPrices);
        } catch (localErr) {
          setError(localErr);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchMarketData();
  }, [gameDay, activeEvents]);

  return { marketData, loading, error };
};

export default useMarketAPI;


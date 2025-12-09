import { useState, useCallback } from 'react';
import { matchFamilies } from '../services/api';

export const useGiftMatching = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [results, setResults] = useState(null);
  const [attempts, setAttempts] = useState(0);

  const performMatching = useCallback(async (families, sendEmails = false) => {
    setLoading(true);
    setError(null);
    setAttempts(0);

    try {
      const data = await matchFamilies(families, sendEmails);
      
      if (data.success) {
        setResults(data.matches);
        setAttempts(data.attempt || 1);
      } else {
        setError(data.error || 'Unknown error occurred');
      }
    } catch (err) {
      const errorMessage = err.error || err.message || 'Failed to match families';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const clearResults = useCallback(() => {
    setResults(null);
    setError(null);
    setAttempts(0);
  }, []);

  return {
    loading,
    error,
    results,
    attempts,
    performMatching,
    clearResults,
  };
};

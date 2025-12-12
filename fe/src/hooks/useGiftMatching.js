import { useState, useCallback } from 'react';
import { draftMembers } from '../services/api';

export const useGiftMatching = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [results, setResults] = useState(null);
  const [attempts, setAttempts] = useState(0);
  const [groups, setGroups] = useState(null);

  const performMatching = useCallback(async (groupsData, sendEmails = false) => {
    setLoading(true);
    setError(null);
    setAttempts(0);

    try {
      const data = await draftMembers(groupsData, sendEmails);
      
      if (data.success) {
        setResults(data.matches);
        setGroups(groupsData);
        setAttempts(data.attempt || 1);
      } else {
        setError(data.error || 'Unknown error occurred');
      }
    } catch (err) {
      const errorMessage = err.error || err.message || 'Failed to match groups';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const clearResults = useCallback(() => {
    setResults(null);
    setGroups(null);
    setError(null);
    setAttempts(0);
  }, []);

  return {
    loading,
    error,
    results,
    attempts,
    groups,
    performMatching,
    clearResults,
  };
};

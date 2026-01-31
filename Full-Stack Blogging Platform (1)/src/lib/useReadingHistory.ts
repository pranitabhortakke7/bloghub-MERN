import { useState, useEffect } from 'react';

interface HistoryItem {
  postId: string;
  timestamp: string;
  title: string;
}

export function useReadingHistory() {
  const [history, setHistory] = useState<HistoryItem[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('reading-history');
    if (saved) {
      setHistory(JSON.parse(saved));
    }
  }, []);

  const addToHistory = (postId: string, title: string) => {
    const newItem: HistoryItem = {
      postId,
      title,
      timestamp: new Date().toISOString(),
    };
    
    // Remove duplicates and add new item at the beginning
    const updated = [
      newItem,
      ...history.filter(h => h.postId !== postId),
    ].slice(0, 50); // Keep last 50 items
    
    setHistory(updated);
    localStorage.setItem('reading-history', JSON.stringify(updated));
  };

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem('reading-history');
  };

  return {
    history,
    addToHistory,
    clearHistory,
  };
}

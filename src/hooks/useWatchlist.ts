import { useState, useEffect } from 'react';
import { Movie } from '../types';

export function useWatchlist() {
  const [watchlist, setWatchlist] = useState<Movie[]>(() => {
    const saved = localStorage.getItem('zestyyflix_watchlist');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('zestyyflix_watchlist', JSON.stringify(watchlist));
  }, [watchlist]);

  const addToWatchlist = (movie: Movie) => {
    setWatchlist(prev => {
      if (prev.find(m => m.id === movie.id)) return prev;
      return [...prev, movie];
    });
  };

  const removeFromWatchlist = (id: number) => {
    setWatchlist(prev => prev.filter(m => m.id !== id));
  };

  const isInWatchlist = (id: number) => {
    return watchlist.some(m => m.id === id);
  };

  return { watchlist, addToWatchlist, removeFromWatchlist, isInWatchlist };
}

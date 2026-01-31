import { useState, useEffect } from 'react';
import { toast } from 'sonner@2.0.3';

interface BookmarkedPost {
  postId: string;
  timestamp: string;
}

export function useBookmarks() {
  const [bookmarks, setBookmarks] = useState<BookmarkedPost[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('bookmarks');
    if (saved) {
      setBookmarks(JSON.parse(saved));
    }
  }, []);

  const addBookmark = (postId: string) => {
    const newBookmark: BookmarkedPost = {
      postId,
      timestamp: new Date().toISOString(),
    };
    
    const updated = [newBookmark, ...bookmarks.filter(b => b.postId !== postId)];
    setBookmarks(updated);
    localStorage.setItem('bookmarks', JSON.stringify(updated));
    toast.success('Added to reading list');
  };

  const removeBookmark = (postId: string) => {
    const updated = bookmarks.filter(b => b.postId !== postId);
    setBookmarks(updated);
    localStorage.setItem('bookmarks', JSON.stringify(updated));
    toast.success('Removed from reading list');
  };

  const isBookmarked = (postId: string) => {
    return bookmarks.some(b => b.postId === postId);
  };

  const toggleBookmark = (postId: string) => {
    if (isBookmarked(postId)) {
      removeBookmark(postId);
    } else {
      addBookmark(postId);
    }
  };

  return {
    bookmarks,
    addBookmark,
    removeBookmark,
    isBookmarked,
    toggleBookmark,
  };
}

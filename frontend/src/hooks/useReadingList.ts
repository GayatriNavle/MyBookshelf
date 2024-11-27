import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
    fetchReadingList,
    addToReadingList,
    updateReadingProgress,
    markAsFinished,
    deleteFromReadingList, // Ensure this is imported
  } from '../lib/api';
export const useReadingList = (userId: string) => {
  const queryClient = useQueryClient();

  // Fetch the reading list
  const { data: readingList = [], isLoading } = useQuery({
    queryKey: ['readingList', userId],
    queryFn: () => fetchReadingList(userId),
  });

  // Add a book to the reading list
  const addBook = useMutation({
    mutationFn: (bookId: string) => addToReadingList(userId, bookId),
    onSuccess: () => queryClient.invalidateQueries(['readingList', userId]),
  });

  // Update reading progress
  const updateProgress = useMutation({
    mutationFn: ({ readingId, progress }: { readingId: string; progress: number }) =>
      updateReadingProgress(readingId, progress),
    onSuccess: () => queryClient.invalidateQueries(['readingList', userId]),
  });

  // Mark a book as finished
  const finishBook = useMutation({
    mutationFn: (readingId: string) => markAsFinished(readingId),
    onSuccess: () => queryClient.invalidateQueries(['readingList', userId]),
  });

  // Delete a book from the reading list
  const deleteBook = useMutation({
    mutationFn: (readingId: string) => deleteFromReadingList(readingId),
    onSuccess: () => queryClient.invalidateQueries(['readingList', userId]),
  });

  return {
    readingList,
    isLoading,
    addBook,
    updateProgress,
    finishBook,
    deleteBook,
  };
};
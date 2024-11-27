import React, { useEffect, useState } from 'react';
import { fetchBookContent, updateReadingProgress } from '../lib/api';

export const BookReader = ({ totalPages, readingId, initialPage }) => {
  const [bookContent, setBookContent] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(initialPage || 0);

  useEffect(() => {
    setCurrentPage(initialPage);
  }, [initialPage]);
  console.log("initialPage",initialPage);
  useEffect(() => {
    const loadBookContent = async () => {
      try {
        const content = await fetchBookContent();
        const lines = content.split('\n');
        const groupedPages = [];
        const linesPerPage = 23; // Define lines per page

        for (let i = 0; i < lines.length; i += linesPerPage) {
          groupedPages.push(lines.slice(i, i + linesPerPage).join('\n'));
        }

        setBookContent(groupedPages);
      } catch (error) {
        console.error('Error fetching book content:', error);
      }
    };

    loadBookContent();
  }, []);

  const handleNextPage = async () => {
    if (currentPage < bookContent.length - 1) {
      const newPage = currentPage + 1;
      setCurrentPage(newPage);
      await saveProgress(newPage);
    }
  };

  const handlePreviousPage = async () => {
    if (currentPage > 0) {
      const newPage = currentPage - 1;
      setCurrentPage(newPage);
      await saveProgress(newPage);
    }
  };

  const calculateProgress = () =>
    Math.round(((currentPage + 1) / bookContent.length) * 100);

  const saveProgress = async (page: number) => {
    if (!readingId) return;
    const progress = Math.round(((page + 1) / bookContent.length) * 100);

    try {
      await updateReadingProgress(readingId, progress);
      console.log(`Progress updated to ${progress}%`);
    } catch (error) {
      console.error('Error updating progress:', error);
    }
  };

  if (bookContent.length === 0) {
    return <div className="text-center text-gray-600">Loading book...</div>;
  }

  return (
    <div className="p-6 bg-gray-50 rounded-lg shadow-lg max-w-4xl mx-auto">
      <div
        className="book-content p-6 text-gray-700 border rounded-md bg-white overflow-y-auto"
        style={{
          height: '30rem', // Adjust height for 15–20 lines (480px recommended)
          fontSize: '1.125rem', // Larger font size for readability
          lineHeight: '1.75rem', // Adjust line spacing
        }}
      >
        {bookContent[currentPage]}
      </div>
      <div className="controls flex justify-between mt-4">
        <button
          onClick={handlePreviousPage}
          disabled={currentPage === 0}
          className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 disabled:opacity-50"
        >
          Previous
        </button>
        <span className="text-gray-500">
          Page {currentPage + 1} of {bookContent.length}
        </span>
        <button
          onClick={handleNextPage}
          disabled={currentPage === bookContent.length - 1}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
        >
          Next
        </button>
      </div>

      {/* Progress Bar */}
      <div className="progress-bar mt-4 w-full bg-gray-200 rounded-full">
        <div
          className="h-2 bg-emerald-500 rounded-full"
          style={{ width: `${calculateProgress()}%` }}
        ></div>
      </div>
      <p className="text-sm text-gray-500 mt-2">{calculateProgress()}% completed</p>
    </div>
  );
};
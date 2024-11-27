import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';

const GOOGLE_BOOKS_API = 'https://www.googleapis.com/books/v1/volumes';

export const BookSearch = () => {
  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  const handleSearch = async () => {
    if (!query) return;
    try {
      const response = await fetch(`${GOOGLE_BOOKS_API}?q=${query}`);
      const data = await response.json();
      setSearchResults(data.items || []);
    } catch (error) {
      console.error('Error fetching books:', error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex gap-4 mb-6">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search books..."
          className="flex-1 border px-4 py-2 rounded-lg"
        />
        <button onClick={handleSearch} className="bg-blue-500 text-white px-6 py-2 rounded-lg">
          Search
        </button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {searchResults.map((book) => (
          <div key={book.id} className="border rounded-lg p-4">
            <img
              src={book.volumeInfo.imageLinks?.thumbnail || 'https://via.placeholder.com/150'}
              alt={book.volumeInfo.title}
              className="w-full h-40 object-cover rounded-md"
            />
            <h3 className="text-lg font-semibold mt-2">{book.volumeInfo.title}</h3>
            <p className="text-sm text-gray-500">{book.volumeInfo.authors?.join(', ')}</p>
            <a
              href={`/book/${book.id}`}
              className="text-blue-500 hover:underline mt-2 inline-block"
            >
              View Details
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};
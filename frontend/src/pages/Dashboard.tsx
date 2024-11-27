import React from 'react';
import { Link } from 'react-router-dom';
import { useReadingList } from '../hooks/useReadingList'; // Custom hook for backend integration
import { useQuery } from '@tanstack/react-query';
import { fetchBooksByCategory } from '../lib/api';
import { BookSearch } from '../components/BookSearch';
import { useAuthStore } from '../lib/store';

export function Dashboard() {
  const user = useAuthStore((state) => state.user);
  const userId = user?._id;
  const { readingList, isLoading: loadingReadingList } = useReadingList(userId);

  const renderBooks = (title, books) => (
    <section className="mb-12">
      <h2 className="text-2xl font-semibold mb-6">{title}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {books.map((entry) => (
          <Link
            key={entry._id}
            to={`/book/${entry.bookId}`}
            className="block bg-white rounded-lg shadow-md hover:shadow-lg transition p-4 w-96"
          >
            {/* Book Cover */}
            <img
              src={entry.cover}
              alt={entry.title}
              className="w-full h-80 object-contain rounded-md mb-4"
            />

            {/* Book Details */}
            <h3 className="text-xl font-semibold text-gray-800 line-clamp-2">
              {entry.title}
            </h3>
            <p className="text-md text-gray-500">{entry.author}</p>
            {
            title!="Completed" ? <div className="mt-2">
            <div className="h-2 bg-gray-200 rounded-full">
              <div
                className="h-2 bg-emerald-500 rounded-full"
                style={{ width: `${entry.progress}%` }}
              ></div>
            </div>
            <p className="text-xs text-gray-400 mt-1">{entry.progress}% completed</p>
          </div>:  <div className="mt-2">
              <div className="h-2 bg-gray-200 rounded-full">
                <div
                  className="h-2 bg-emerald-500 rounded-full"
                  style={{ width: `${entry.progress}%` }}
                ></div>
              </div>
              <p className="text-xs text-gray-400 mt-1">{entry.progress}% completed</p>
            </div>
            }
            
          </Link>
        ))}
      </div>
    </section>
  );

  return (
    <main className="container mx-auto px-4 py-8">
      {/* Header */}
      <header className="mb-12">
        <h1 className="text-4xl font-bold text-gray-800">Welcome Back!</h1>
        <p className="text-lg text-gray-600 mt-2">
          Track your reading journey and discover new favorites.
        </p>
      </header>

      {/* Book Search */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Search for Books</h2>
        <BookSearch />
      </section>

      {/* Currently Reading Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-6">📚 Currently Reading</h2>
        {loadingReadingList ? (
          <div>Loading...</div>
        ) : (
          renderBooks(
            'Currently Reading',
            readingList.filter((entry) => entry.status === 'Currently Reading')
          )
        )}
      </section>

      {/* Completed Section */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-6">✅ Completed</h2>
        {loadingReadingList ? (
          <div>Loading...</div>
        ) : (
          renderBooks(
            'Completed',
            readingList.filter((entry) => entry.status === 'Finished')
          )
        )}
      </section>
    </main>
  );
}
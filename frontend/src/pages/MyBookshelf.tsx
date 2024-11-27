import React from 'react';
import { BookSearch } from '../components/BookSearch';

export function MyBookshelf() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">My Bookshelf</h1>
        <BookSearch />
      </div>
    </div>
  );
}
import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Library, Search } from 'lucide-react';
import { useAuthStore } from '../lib/store';

export const Header: React.FC = () => {
  const { user, logout } = useAuthStore();
  console.log('user', user );  
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 font-semibold text-xl">
          <Library className="w-6 h-6 text-emerald-600" />
          <span>Bookshelf</span>
        </Link>

        {/* Search */}
        <div className="flex-1 max-w-md mx-8">
          <div className="relative">
            {/* <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="search"
              placeholder="Search books..."
              className="w-full pl-10 pr-4 py-2 rounded-full border border-gray-200 focus:outline-none focus:border-emerald-500"
            /> */}
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex items-center gap-6">
          <Link
            to="/reading"
            className="flex items-center gap-2 text-gray-600 hover:text-emerald-600 transition-colors"
          >
            <BookOpen className="w-5 h-5" />
            <span>Reading Now</span>
          </Link>

          {/* User */}
          {user ? (
            <div className="relative">
              <button className="text-gray-600 hover:text-emerald-600">
                {user.name}
              </button>
              <button
                onClick={logout}
                className="ml-4 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link
              to="/auth"
              className="text-gray-600 hover:text-emerald-600 transition-colors"
            >
              Login
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
};
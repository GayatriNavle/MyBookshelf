import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { Header } from './components/Header';
import { Dashboard } from './pages/Dashboard';
import { MyBookshelf } from './pages/MyBookshelf';
import { BookPreview } from './pages/BookPreview';
import { AuthPage } from './pages/AuthPage';
import { ForgotPassword } from './pages/ForgotPassword';
import { auth } from './lib/firebase';
import { useAuthStore } from './lib/store';
import { queryClient } from './lib/api';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  const [loading, setLoading] = useState(true); // Loading state for auth check
  const isAuthenticated = useAuthStore((state) => !!state.user); // Check authentication
  const setUser = useAuthStore((state) => state.setUser);

  // Check user authentication on load
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        // Set user data in Zustand store
        const userData = {
          id: user.uid,
          name: user.displayName || 'Anonymous',
          email: user.email,
        };
        setUser(userData);
      } else {
        setUser(null); // Clear user state
      }
      setLoading(false); // Finish loading after auth state check
    });

    return () => unsubscribe(); // Cleanup subscription
  }, [setUser]);

  // Show a loader while checking auth state
  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  // Private route wrapper
  const PrivateRoute = ({ children }) => {
    return isAuthenticated ? children : <Navigate to="/auth" />;
  };

  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="min-h-screen bg-gray-50">
          {isAuthenticated && <Header />}
          <Routes>
            <Route
              path="/"
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/bookshelf"
              element={
                <PrivateRoute>
                  <MyBookshelf />
                </PrivateRoute>
              }
            />
            <Route
              path="/book/:id"
              element={
                <PrivateRoute>
                  <BookPreview />
                </PrivateRoute>
              }
            />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="*" element={<Navigate to={isAuthenticated ? "/" : "/auth"} />} />
          </Routes>
          <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
        </div>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
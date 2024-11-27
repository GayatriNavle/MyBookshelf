import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'; // Add Navigate
import { QueryClientProvider } from '@tanstack/react-query';
import { Header } from './components/Header';
import { Dashboard } from './pages/Dashboard';
import { MyBookshelf } from './pages/MyBookshelf';
import { BookPreview } from './pages/BookPreview';
import { AuthPage } from './pages/AuthPage'; // Import the AuthPage
import { auth } from './lib/firebase';
import { useAuthStore } from './lib/store';
import { queryClient } from './lib/api';
import { ForgotPassword } from './pages/ForgotPassword';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Import styles

function App() {
  const [loading, setLoading] = useState(false); // Loading state during authentication check
  const isAuthenticated = useAuthStore((state) => !!state.user); // Determine if user is authenticated
  const setUser = useAuthStore((state) => state.setUser);
  // useEffect(() => {
  //   const unsubscribe = auth.onAuthStateChanged((user) => {
  //     if (user) {
  //       // Extract user data if using Firebase
  //       const userData = {
  //         id: user.uid,
  //         name: user.displayName || 'Anonymous',
  //         email: user.email,
  //       };
  //       setUser(userData); // Set user in Zustand store
  //     } else {
  //       setUser(null); // Clear user state
  //     }
  //     setLoading(false); // Finish loading after auth state check
  //   });
  //   return () => unsubscribe();
  // }, [setUser]);

  if (loading) {
    return <div className="text-center py-8">Loading...</div>; // Show a loader while checking auth state
  }

  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="min-h-screen bg-gray-50">
              <Header />
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/bookshelf" element={<MyBookshelf />} />
                <Route path="/book/:id" element={<BookPreview />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/auth" element={<AuthPage />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="*" element={<Navigate to="/auth" />} /> {/* Redirect all invalid routes */}
            </Routes>
            <ToastContainer position="top-right" autoClose={3000} hideProgressBar />

        </div>
      </Router>
    </QueryClientProvider>
  );
}

export default App;



// <div className="min-h-screen bg-gray-50">
// {isAuthenticated ? (
//   <>
//     <Header />
//     <Routes>
//       <Route path="/" element={<Dashboard />} />
//       <Route path="/bookshelf" element={<MyBookshelf />} />
//       <Route path="/book/:id" element={<BookPreview />} />
//       <Route path="/forgot-password" element={<ForgotPassword />} />
//       <Route path="*" element={<Navigate to="/" />} /> {/* Redirect invalid routes */}
//     </Routes>
//   </>
// ) : (
//   <Routes>
//     <Route path="/auth" element={<AuthPage />} />
//     <Route path="/forgot-password" element={<ForgotPassword />} />
//     <Route path="*" element={<Navigate to="/auth" />} /> {/* Redirect all invalid routes */}
//   </Routes>
// )}
// </div>
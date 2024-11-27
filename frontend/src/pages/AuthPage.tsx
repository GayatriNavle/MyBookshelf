import React, { useState } from 'react';
import { register, login, setAuthToken } from '../lib/api';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../lib/store';

export function AuthPage() {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { setUser, setToken } = useAuthStore(); // Access Zustand actions

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null); // Reset error state
    try {
      // Validate inputs
      if (!email || !password || (isSignUp && !name)) {
        setError('Please fill in all required fields.');
        return;
      }
  
      let response;
      if (isSignUp) {
        response = await register(name, email, password);
        alert('Registration successful! Please log in.');
      } else {
        response = await login(email, password);
        alert('Login successful!');
      }
  
      // Log response to debug
      console.log('API Response:', response);
  
      // Save user and token to Zustand state
      setUser(response.user);
      setToken(response.token);
  
      // Set token in Axios for future authenticated requests
      setAuthToken(response.token);
  
      // Redirect user to the dashboard
      navigate('/');
    } catch (err: any) {
      // Handle errors
      console.error('Authentication Error:', err);
      setError(err.response?.data?.message || err.message || 'Something went wrong');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-semibold mb-6 text-center">
          {isSignUp ? 'Sign Up' : 'Log In'}
        </h2>
        {error && (
          <div className="bg-red-100 text-red-600 p-3 rounded-md mb-4">{error}</div>
        )}
        <form onSubmit={handleAuth} className="space-y-4">
          {isSignUp && (
            <div>
              <label className="block text-sm font-medium text-gray-700">Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition"
          >
            {isSignUp ? 'Sign Up' : 'Log In'}
          </button>
        </form>
        <div className="mt-4 text-center">
          {isSignUp ? 'Already have an account?' : "Don't have an account?"}{' '}
          <button
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-blue-500 hover:underline"
          >
            {isSignUp ? 'Log In' : 'Sign Up'}
          </button>
        </div>
        <div className="mt-4 text-center">
          {!isSignUp && (
            <a href="/forgot-password" className="text-blue-500 hover:underline">
              Forgot Password?
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
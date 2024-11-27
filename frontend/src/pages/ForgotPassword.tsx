import React, { useState } from 'react';
import { sendPasswordReset } from '../lib/firebase';

export function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setLoading(true);

    try {
      const response = await sendPasswordReset(email);
      setMessage(response);
      setEmail('');
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-semibold mb-6 text-center">Forgot Password</h2>
        {message && (
          <div className="bg-green-100 text-green-600 p-3 rounded-md mb-4">
            {message}
          </div>
        )}
        {error && (
          <div className="bg-red-100 text-red-600 p-3 rounded-md mb-4">
            {error}
          </div>
        )}
        <form onSubmit={handleResetPassword} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          <button
            type="submit"
            className={`w-full py-2 px-4 rounded-lg text-white ${loading ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-600'} transition`}
            disabled={loading}
          >
            {loading ? 'Sending...' : 'Send Password Reset Email'}
          </button>
        </form>
        <div className="mt-4 text-center">
          <a
            href="/auth"
            className="text-blue-500 hover:underline"
          >
            Back to Login
          </a>
        </div>
      </div>
    </div>
  );
}
import axios from 'axios';
import { QueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';

const queryClient = new QueryClient();

export { queryClient };
//export const BASE_URL = 'http://localhost:5001/api'; // Replace with your backend URL
 export const BASE_URL = 'http://54.86.202.232:5001/api';
// Search books
export const searchBooks = async (query: string) => {
  try {
    const response = await axios.get(`${BASE_URL}/books/search?q=${encodeURIComponent(query)}`);
    // toast.success('Books fetched successfully!');
    return response.data;
  } catch (error: any) {
    toast.error(error.response?.data?.message || 'Error fetching books.');
    throw error;
  }
};

// Fetch books by category
export const fetchBooksByCategory = async (category: string) => {
  try {
    const response = await axios.get(`${BASE_URL}/books/category/${category}`);
    // toast.success(`Fetched books in category: ${category}`);
    return response.data;
  } catch (error: any) {
    toast.error(error.response?.data?.message || 'Error fetching books by category.');
    throw error;
  }
};

// Add a book to the reading list
export const addToReadingList = async (userId: string, bookId: string) => {
  try {
    const response = await axios.post(`${BASE_URL}/reading`, { userId, bookId });
    toast.success('Book added to your reading list!');
    return response.data;
  } catch (error: any) {
    toast.error(error.response?.data?.message || 'Failed to add book to reading list.');
    throw error;
  }
};


// Mark a book as finished
export const markAsFinished = async (readingId: string) => {
  try {
    const response = await axios.put(`${BASE_URL}/reading/${readingId}/finish`);
    toast.success('Book marked as finished!');
    return response.data;
  } catch (error: any) {
    toast.error(error.response?.data?.message || 'Failed to mark book as finished.');
    throw error;
  }
};

// Fetch the user's reading list
export const fetchReadingList = async (userId: string) => {
  try {
    const response = await axios.get(`${BASE_URL}/reading?userId=${userId}`);
    // toast.success('Fetched your reading list!');
    return response.data;
  } catch (error: any) {
    // toast.error(error.response?.data?.message || 'Failed to fetch reading list.');
    throw error;
  }
};

// Delete a book from the reading list
export const deleteFromReadingList = async (readingId: string) => {
  try {
    const response = await axios.delete(`${BASE_URL}/reading/${readingId}`);
    toast.success('Book removed from your reading list!');
    return response.data;
  } catch (error: any) {
    toast.error(error.response?.data?.message || 'Failed to remove book from reading list.');
    throw error;
  }
};

// Register a new user
export const register = async (name: string, email: string, password: string) => {
  try {
    const response = await axios.post(`${BASE_URL}/auth/signup`, { name, email, password });
    toast.success('Registration successful!');
    return response.data;
  } catch (error: any) {
    toast.error(error.response?.data?.message || 'Registration failed.');
    throw error;
  }
};

// Login a user
export const login = async (email: string, password: string) => {
  try {
    const response = await axios.post(`${BASE_URL}/auth/login`, { email, password });
    toast.success('Login successful!');
    return response.data;
  } catch (error: any) {
    toast.error(error.response?.data?.message || 'Login failed.');
    throw error;
  }
};

// Set token in Axios headers
export const setAuthToken = (token: string | null) => {
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    toast.info('Authorization token set.');
  } else {
    delete axios.defaults.headers.common['Authorization'];
    toast.info('Authorization token removed.');
  }
};

// Save a book to the library
export const saveBookToLibrary = async (book: any) => {
  try {
    const response = await axios.post(`${BASE_URL}/reading`, book, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    toast.success('Book saved to library!');
    return response.data;
  } catch (error: any) {
    toast.error(error.response?.data?.message || 'Failed to save book to library.');
    throw error;
  }
};

// Update reading progress
export const updateReadingProgress = async (readingId: string, progress: number) => {
  const response = await axios.put(`${BASE_URL}/reading/${readingId}/progress`, { progress });
  return response.data;
};

// Fetch book content
export const fetchBookContent = async (): Promise<string> => {
  const response = await axios.get(`${BASE_URL}/reading/book-content`);
  return response.data.content; // Return the content from the response
};

// Fetch reading info by userId and bookId
export const fetchReadingInfo = async (userId: string, bookId: string) => {
  const response = await axios.get(`${BASE_URL}/reading/info`, {
    params: { userId, bookId },
  });
  return response.data;
};

export const addComment = async (bookId: string, userId: string, comment: string) => {
  const response = await axios.post(`${BASE_URL}/reading/comments`, { bookId, userId, comment });
  return response.data;
};

export const fetchComments = async (bookId: string) => {
  const response = await axios.get(`${BASE_URL}/reading/comments`, { params: { bookId } });
  return response.data.comments;
};

export const rateBook = async (bookId: string, rating: number,userId:string) => {
  const response = await axios.post(`${BASE_URL}/reading/rate`, { bookId, rating,userId });
  return response.data;
};

export const fetchUserRating  = async (bookId: string,userId:string) => {
  const response = await axios.get(`${BASE_URL}/reading/rate`, { params: { bookId,userId } });
  return response.data;
};


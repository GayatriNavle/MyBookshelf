import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../lib/store';
import { BookReader } from '../components/BookReader';
import { fetchReadingInfo, addComment, fetchComments, rateBook,fetchUserRating } from '../lib/api';

const GOOGLE_BOOKS_API = 'https://www.googleapis.com/books/v1/volumes';
const READING_LIST_API = 'http://localhost:5001/api/reading'; // Your backend API

export const BookPreview = () => {
  const [readingId, setReadingId] = useState(null);
  const [bookContent, setBookContent] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [progress, setProgress] = useState(0);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [rating, setRating] = useState(0); // Rating by the user
  const { id } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const user = useAuthStore((state) => state.user);
  const userId = user?._id;

  // Fetch book details
  useEffect(() => {
    const fetchBookDetails = async () => {
      try {
        const response = await fetch(`${GOOGLE_BOOKS_API}/${id}`);
        const data = await response.json();
        setBook(data);
      } catch (error) {
        console.error('Error fetching book details:', error);
      }
    };

    fetchBookDetails();
  }, [id]);

  useEffect(() => {
    const fetchReadingData = async () => {
      try {
        if (!userId || !id) return;
  
        const readingInfo = await fetchReadingInfo(userId, id);
        if (readingInfo) {
          setReadingId(readingInfo.id);
          setProgress(readingInfo.progress || 0);
  
          const pages = Math.ceil((readingInfo.progress / 100) * totalPages);
          setCurrentPage(pages || 0);
        }
  
        // Fetch the user's existing rating
        const userRating = await fetchUserRating(id, userId);
        if (userRating) setRating(userRating.rating);
  
        const fetchedComments = await fetchComments(id);
        setComments(fetchedComments || []);
      } catch (err) {
        console.error('Error fetching reading info, rating, or comments:', err);
      }
    };
  
    fetchReadingData();
  }, [userId, id, totalPages]);

  const handleStartReading = async () => {
    if (!book) return;

    const bookDetails = {
      userId,
      bookId: id,
      title: book.volumeInfo.title,
      author: book.volumeInfo.authors?.join(', '),
      cover: book.volumeInfo.imageLinks?.thumbnail || '',
    };

    setIsAdding(true);
    try {
      const response = await fetch(READING_LIST_API, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(bookDetails),
      });

      if (response.ok) {
        const data = await response.json();
        setReadingId(data._id); // Save the newly created reading ID
        alert('Book added to your reading list!');
      } else {
        const errorData = await response.json();
        alert(errorData.message || 'Failed to add book to the reading list.');
      }
    } catch (err) {
      console.error('Error adding book to the reading list:', err);
      alert('An error occurred. Please try again.');
    } finally {
      setIsAdding(false);
    }
  };

  const handleAddComment = async () => {
    if (!newComment) return;
    try {
      await addComment(id, userId, newComment);
      setComments([...comments, { userId, comment: newComment }]);
      setNewComment('');
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  const handleRateBook = async (value:number) => {
    try {
      await rateBook(id, value,userId);
      setRating(value);
    } catch (error) {
      console.error('Error rating book:', error);
    }
  };

  if (!book) {
    return <div className="text-center text-gray-600">Loading...</div>;
  }

  const {
    title,
    subtitle,
    authors,
    publisher,
    publishedDate,
    pageCount,
    description,
    imageLinks,
  } = book.volumeInfo;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-6">
        <div className="flex flex-col md:flex-row gap-6">
          <img
            src={imageLinks?.thumbnail || 'https://via.placeholder.com/150'}
            alt={title}
            className="w-48 h-auto rounded-lg shadow-md"
          />
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-800">{title}</h1>
            {subtitle && <h2 className="text-xl text-gray-600 italic">{subtitle}</h2>}
            <p className="text-lg text-gray-500">{authors?.join(', ')}</p>
            <p className="text-sm text-gray-400 mt-2">
              {publisher && `${publisher},`} {publishedDate}
            </p>
            <p className="mt-4 text-gray-700 leading-relaxed">
              {description && description.substring(0, 300)}...
            </p>
            <div className="mt-6 flex items-center gap-2">
              <span className="text-gray-600">{pageCount} pages</span>
            </div>
          </div>
        </div>

        {progress === 0 && (
          <div className="mt-8">
            <button
              onClick={handleStartReading}
              disabled={isAdding}
              className={`block w-full px-6 py-3 rounded-lg text-white transition ${
                isAdding ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-600'
              }`}
            >
              {isAdding ? 'Adding...' : 'Start Reading'}
            </button>
          </div>
        )}

        {readingId && (
          <BookReader
            bookContent={bookContent}
            totalPages={totalPages}
            readingId={readingId}
            initialPage={currentPage}
          />
        )}

        <div className="mt-8">
          <h3 className="text-xl font-semibold">Rate this Book</h3>
          <div className="flex gap-2 mt-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                className={`text-2xl ${
                  star <= rating ? 'text-yellow-400' : 'text-gray-300'
                }`}
                onClick={() => handleRateBook(star)}
              >
                ★
              </button>
            ))}
          </div>
        </div>

        <div className="mt-8">
          <h3 className="text-xl font-semibold">Comments</h3>
          <div className="space-y-4 mt-4">
            {comments.map((comment, index) => (
              <div key={index} className="p-4 bg-gray-100 rounded-lg">
                <p className="text-gray-700">{comment.comment}</p>
              </div>
            ))}
          </div>
          <div className="mt-4 flex">
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="flex-1 p-2 border rounded-l-lg focus:outline-none"
              placeholder="Add a comment..."
            />
            <button
              onClick={handleAddComment}
              className="bg-blue-500 text-white px-4 py-2 rounded-r-lg"
            >
              Post
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
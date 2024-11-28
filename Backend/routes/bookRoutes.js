const express = require('express');
const { body, param, validationResult } = require('express-validator');
const Book = require('../models/Book');
const router = express.Router();

/**
 * @route   GET /api/books
 * @desc    Fetch all books
 * @access  Public
 */
router.get('/', async (req, res) => {
  try {
    const books = await Book.find();
    res.json(books);
  } catch (error) {
    console.error('Error fetching books:', error.message);
    // res.status(500).json({ error: 'Failed to fetch books' });
  }
});

/**
 * @route   GET /api/books/:id
 * @desc    Fetch a book by ID
 * @access  Public
 */
router.get('/:id', async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }
    res.json(book);
  } catch (error) {
    console.error(`Error fetching book with ID ${req.params.id}:`, error.message);
    res.status(500).json({ message: 'Error fetching book', details: error.message });
  }
});

/**
 * @route   GET /api/books/category/:category
 * @desc    Fetch books by category
 * @access  Public
 */
router.get('/category/:category', async (req, res) => {
  const { category } = req.params;
  try {
    const books = await Book.find({ category });
    if (books.length === 0) {
      return res.status(404).json({ message: `No books found in category: ${category}` });
    }
    res.json(books);
  } catch (error) {
    console.error(`Error fetching books in category ${category}:`, error.message);
    // res.status(500).json({ error: 'Failed to fetch books by category' });
  }
});

/**
 * @route   POST /api/books
 * @desc    Add a new book
 * @access  Public
 */
router.post(
  '/',
  [
    body('title').notEmpty().withMessage('Title is required'),
    body('author').notEmpty().withMessage('Author is required'),
    body('cover').isURL().withMessage('Cover must be a valid URL'),
    body('rating').isFloat({ min: 0, max: 5 }).withMessage('Rating must be between 0 and 5'),
    body('category').notEmpty().withMessage('Category is required'),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, author, cover, rating, category } = req.body;

    try {
      const newBook = new Book({ title, author, cover, rating, category });
      await newBook.save();
      res.status(201).json(newBook);
    } catch (error) {
      console.error('Error adding book:', error.message);
      res.status(400).json({ error: 'Failed to add book', details: error.message });
    }
  }
);

module.exports = router;
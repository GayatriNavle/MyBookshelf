const express = require('express');
const mongoose = require('mongoose');
const ReadingList = require('../models/ReadingList');
const Book = require('../models/Book'); // Reference to the books model
const router = express.Router();
const fs = require('fs');
const path = require('path');

// Add a book to the reading list
router.post('/', async (req, res) => {
  const { userId, bookId, title, author, cover } = req.body;

  try {
    // Validate input
    if (!userId || !bookId || !title || !author || !cover) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    // Check if the book already exists in the reading list
    const existingEntry = await ReadingList.findOne({ userId, bookId });
    if (existingEntry) {
      return res.status(400).json({ message: 'Book already in reading list.' });
    }

    // Add the book to the reading list
    const newEntry = new ReadingList({ userId, bookId, title, author, cover });
    await newEntry.save();

    res.status(201).json(newEntry);
  } catch (error) {
    console.error('Error adding to reading list:', error);
    res.status(500).json({ error: 'Failed to add to reading list', details: error.message });
  }
});
// Fetch the user's reading list
router.get('/', async (req, res) => {
  const { userId } = req.query;

  try {
    const readingList = await ReadingList.find({ userId }).populate('bookId');
    res.json(readingList);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch reading list', details: error.message });
  }
});

// Update reading progress
router.put('/:id/progress', async (req, res) => {
  const { id } = req.params;
  const { progress } = req.body;

  try {
    const entry = await ReadingList.findById(id);
    if (!entry) {
      return res.status(404).json({ message: 'Reading list entry not found' });
    }

    entry.progress = progress;
    entry.updatedAt = Date.now();

    // Automatically mark as finished if progress is 100%
    if (progress === 100) {
      entry.status = 'Finished';
    }

    await entry.save();
    res.json(entry);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update progress', details: error.message });
  }
});

// Mark a book as finished
router.put('/:id/finish', async (req, res) => {
  const { id } = req.params;

  try {
    const entry = await ReadingList.findById(id);
    if (!entry) {
      return res.status(404).json({ message: 'Reading list entry not found' });
    }

    entry.status = 'Finished';
    entry.progress = 100;
    entry.updatedAt = Date.now();

    await entry.save();
    res.json(entry);
  } catch (error) {
    res.status(500).json({ error: 'Failed to mark as finished', details: error.message });
  }
});

// Delete a book from the reading list
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const deletedEntry = await ReadingList.findByIdAndDelete(id);
    if (!deletedEntry) {
      return res.status(404).json({ message: 'Reading list entry not found' });
    }

    res.json({ message: 'Reading list entry deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete entry', details: error.message });
  }
});

router.put('/:id/progress', async (req, res) => {
  const { id } = req.params;
  const { progress } = req.body;

  if (progress < 0 || progress > 100) {
    return res.status(400).json({ message: 'Progress must be between 0 and 100' });
  }

  try {
    const readingEntry = await ReadingList.findById(id);
    if (!readingEntry) {
      return res.status(404).json({ message: 'Reading list entry not found' });
    }

    readingEntry.progress = progress;
    if (progress === 100) {
      readingEntry.status = 'Finished';
    } else {
      readingEntry.status = 'Currently Reading';
    }
    readingEntry.updatedAt = Date.now();

    const updatedEntry = await readingEntry.save();
    res.status(200).json({
      message: 'Progress updated successfully',
      entry: updatedEntry,
    });
  } catch (error) {
    console.error('Error updating progress:', error);
    res.status(500).json({ message: 'Failed to update progress', details: error.message });
  }
});

// Endpoint to fetch the book content
router.get('/book-content', (req, res) => {
  const filePath = path.join(__dirname, '../demoBook.txt'); // Adjust path as needed

  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading file:', err);
      return res.status(500).json({ error: 'Failed to load book content' });
    }
    res.json({ content: data });
  });
});

router.get('/info', async (req, res) => {
  const { userId, bookId } = req.query;

  if (!userId || !bookId) {
    return res.status(400).json({ message: 'userId and bookId are required' });
  }

  try {
    const readingEntry = await ReadingList.findOne({ userId, bookId }).populate('bookId');
    if (!readingEntry) {
      return res.status(404).json({ message: 'Reading information not found' });
    }

    res.json({
      id: readingEntry._id,
      bookId: readingEntry.bookId._id,
      title: readingEntry.bookId.title,
      author: readingEntry.bookId.author,
      cover: readingEntry.bookId.cover,
      progress: readingEntry.progress,
      status: readingEntry.status,
      createdAt: readingEntry.createdAt,
      updatedAt: readingEntry.updatedAt,
    });
  } catch (error) {
    console.error('Error fetching reading info:', error);
    res.status(500).json({ message: 'Failed to fetch reading info', details: error.message });
  }
});

router.post('/comments', async (req, res) => {
  const { userId, bookId, comment } = req.body;

  if (!userId || !bookId || !comment) {
    return res.status(400).json({ message: 'userId, bookId, and comment are required' });
  }

  try {
    const readingEntry = await ReadingList.findOne({ userId, bookId });
    if (!readingEntry) {
      return res.status(404).json({ message: 'Book not found in reading list' });
    }

    readingEntry.comments.push({ userId, comment });
    await readingEntry.save();

    res.status(200).json({ message: 'Comment added successfully', comments: readingEntry.comments });
  } catch (error) {
    console.error('Error adding comment:', error);
    res.status(500).json({ message: 'Failed to add comment', details: error.message });
  }
});

// Get comments for a book
router.get('/comments', async (req, res) => {
  const { bookId } = req.query;

  if (!bookId) {
    return res.status(400).json({ message: 'bookId is required' });
  }

  try {
    const readingEntries = await ReadingList.find({ bookId });
    if (!readingEntries.length) {
      return res.status(404).json({ message: 'No comments found for this book' });
    }

    const comments = readingEntries.flatMap((entry) => entry.comments);
    res.status(200).json({ comments });
  } catch (error) {
    console.error('Error fetching comments:', error);
    res.status(500).json({ message: 'Failed to fetch comments', details: error.message });
  }
});

// Rate a book
router.post('/rate', async (req, res) => {
  const { userId, bookId, rating } = req.body;

  if (!userId || !bookId || !rating) {
    return res.status(400).json({ message: 'userId, bookId, and rating are required' });
  }

  if (rating < 1 || rating > 5) {
    return res.status(400).json({ message: 'Rating must be between 1 and 5' });
  }

  try {
    const readingEntry = await ReadingList.findOne({ userId, bookId });
    if (!readingEntry) {
      return res.status(404).json({ message: 'Book not found in reading list' });
    }

    readingEntry.rating = rating;
    await readingEntry.save();

    res.status(200).json({ message: 'Rating updated successfully', rating: readingEntry.rating });
  } catch (error) {
    console.error('Error rating book:', error);
    res.status(500).json({ message: 'Failed to update rating', details: error.message });
  }
});

// Get user's rating for a book
router.get('/rate', async (req, res) => {
  const { userId, bookId } = req.query;

  if (!userId || !bookId) {
    return res.status(400).json({ message: 'userId and bookId are required' });
  }

  try {
    const readingEntry = await ReadingList.findOne({ userId, bookId });
    if (!readingEntry || !readingEntry.rating) {
      return res.status(404).json({ message: 'No rating found for this book by this user' });
    }

    res.json({ rating: readingEntry.rating });
  } catch (error) {
    console.error('Error fetching user rating:', error);
    res.status(500).json({ message: 'Failed to fetch user rating', details: error.message });
  }
});
module.exports = router;
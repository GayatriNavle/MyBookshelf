const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const bookRoutes = require('./routes/bookRoutes');
const readingRoutes = require('./routes/readingRoutes');
const { protect } = require('./middleware/authMiddleware');

require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/books', protect, bookRoutes); // Protect book routes
app.use('/api/reading', protect, readingRoutes); // Protect reading routes

// Database Connection
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(process.env.PORT || 5001, () => {
      console.log(`Server running on http://localhost:${process.env.PORT || 5001}`);
    });
  })
  .catch((error) => console.error('MongoDB connection error:', error));
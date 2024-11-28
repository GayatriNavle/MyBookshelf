const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const bookRoutes = require('./routes/bookRoutes');
const readingRoutes = require('./routes/readingRoutes');
const { protect } = require('./middleware/authMiddleware');
require('dotenv').config();

// Initialize Express app
const app = express();

// Middleware for parsing JSON and handling CORS
const corsOptions = {
  origin: ['http://54.86.202.232','http://localhost:5173/'], // Add your frontend's IP or domain
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};
app.use(cors(corsOptions));
// app.use(cors());

app.use(express.json());

// Routes
app.use('/api/auth', authRoutes); // Authentication routes
app.use('/api/books', protect, bookRoutes); // Protect book routes
app.use('/api/reading', protect, readingRoutes); // Protect reading routes

// Catch-all route for missing endpoints
app.use((req, res, next) => {
  res.status(404).json({ message: 'Endpoint not found' });
});

// Error-handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'An internal server error occurred' });
});

// Connect to MongoDB and start the server
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Connected to MongoDB');
    const PORT = process.env.PORT || 5001;
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Failed to connect to MongoDB:', error.message);
    process.exit(1); // Exit process if DB connection fails
  });
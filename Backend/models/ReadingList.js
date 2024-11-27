const mongoose = require('mongoose');

const ReadingListSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  bookId: { type: String, required: true },
  title: String,
  author: String,
  cover: String,
  progress: { type: Number, default: 0 },
  status: { type: String, default: 'Currently Reading' },
  comments: [
    {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      comment: { type: String, required: true },
    },
  ],
  rating: { type: Number, min: 1, max: 5 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('ReadingList', ReadingListSchema);
const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Customer',
    required: [true, 'Customer reference is required']
  },
  rating: {
    type: Number,
    required: [true, 'Rating is required'],
    min: [1, 'Rating must be at least 1'],
    max: [5, 'Rating cannot be more than 5']
  },
  comments: {
    type: String,
    trim: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Feedback', feedbackSchema);

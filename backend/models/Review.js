const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    reviewID: { type: String, required: true, unique: true, minlength: 5, maxlength: 5 },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Customer',     // Links to your User model
        required: true
    },

    bookId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Book',     // Links to your Book model
        required: true
    },

    rating: {
        type: Number,
        required: true,
        min: 1,  // Matches minimum: 1
        max: 5   // Matches maximum: 5
    },

    comment: {
        type: String
    },

    reviewDate: {
        type: Date,
        required: true,
        default: Date.now // Automatically sets the current date/time
    }
});

module.exports = mongoose.model('Review', reviewSchema);
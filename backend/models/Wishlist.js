const mongoose = require('mongoose');
const WishlistSchema = new mongoose.Schema({
    wishlistID: { type: String, required: true, unique: true, minlength: 5, maxlength: 5 },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Customer'
    },
    bookId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Book'
    }
});

module.exports = mongoose.model('Wishlist', WishlistSchema);
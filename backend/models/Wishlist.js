const mongoose = require('mongoose');

const WishlistSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'Account', required: true },
    books: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Book' }]
});

module.exports = mongoose.models.Wishlist || mongoose.model('Wishlist', WishlistSchema);
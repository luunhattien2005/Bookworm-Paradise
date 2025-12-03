const mongoose = require('mongoose');

// 1. Create a "Sub-schema" for the items inside the cart
const CartItemSchema = new mongoose.Schema({
    bookId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Book', // Link to the Book model
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        min: 1,
        default: 1
    }
}, { _id: false }); // _id: false stops Mongoose from creating a unique ID for every single item line


// 2. Your Main Cart Schema
const CartSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    items: [CartItemSchema],

    // Optional: Add a timestamp to know when they last updated the cart
    // updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Cart', CartSchema);
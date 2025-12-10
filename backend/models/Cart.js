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
    },

    subTotal: { type: mongoose.Decimal128 },
}, { _id: false }); // _id: false stops Mongoose from creating a unique ID for every single item line


// 2.  Main Cart Schema
const CartSchema = new mongoose.Schema({
    cartID: { type: String, required: true, unique: true, minlength: 5, maxlength: 5 },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Customer',
        required: true
    },

    items: [CartItemSchema],

    totalAmount: { type: mongoose.Decimal128, default: 0 },
});

module.exports = mongoose.model('Cart', CartSchema);
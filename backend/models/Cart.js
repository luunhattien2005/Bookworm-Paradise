const mongoose = require('mongoose');

const CartItemSchema = new mongoose.Schema({
    book: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true },
    quantity: { type: Number, required: true, min: 1 },
    subTotal: { type: Number, default: 0 }
});

const CartSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'Account', required: true, unique: true },
    items: [CartItemSchema],
    totalAmount: { type: Number, default: 0 }
});

module.exports = mongoose.model('Cart', CartSchema);
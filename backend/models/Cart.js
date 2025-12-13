const mongoose = require('mongoose');

const CartItemSchema = new mongoose.Schema({
    book: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true },
    quantity: { type: Number, required: true, min: 1 },
});

const CartSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'Account', required: true, unique: true },
    items: [CartItemSchema],
    // totalAmount cũng nên tính toán động (dynamic) thay vì lưu cứng
});

module.exports = mongoose.model('Cart', CartSchema);
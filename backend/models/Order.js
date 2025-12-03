const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
    bookId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Book',     // Links to Book model
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        min: 1
    },
    price: {
        type: Number,
        required: true
    }
}, { _id: false }); // Optional: suppresses creating an _id for each line item

// 2. The Main Order Schema
const orderSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',     // Links to User model
        required: true
    },

    orderDate: {
        type: Date,
        required: true,
        default: Date.now // Automatically sets the date to "now"
    },

    totalAmount: {
        type: Number,
        required: true
    },

    paymentMethod: {
        type: String,
        required: true,
        enum: ['Tiền mặt', 'Thẻ tín dụng', 'Ví điện tử']
    },

    shippingAddress: {
        type: String,
        required: true
    },

    shippingStatus: {
        type: String,
        required: true,

        enum: ['Pending', 'Shipped', 'Delivered', 'Cancelled'],
        default: 'Pending'
    },

    items: {
        type: [orderItemSchema], // Uses the sub-schema defined above
        required: true
    }
});

module.exports = mongoose.model('Order', orderSchema);
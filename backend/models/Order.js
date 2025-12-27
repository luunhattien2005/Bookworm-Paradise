const mongoose = require('mongoose');

const OrderItemSchema = new mongoose.Schema({
    book: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true } // Giá tại thời điểm chốt đơn
});

const OrderSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'Account', required: true },
    
    items: [OrderItemSchema],
    
    cartAmount: { type: Number, required: true },
    
    paymentMethod: { type: String, enum: ['COD', 'CARD'], default: 'COD' }, 

    shippingMethod: { type: String, enum: ['standard', 'express'], default: 'standard', required: true },
    
    shippingFee: { type: Number, required: true },

    totalAmount: { type: Number, required: true }, // tổng cuối đã bao gồm tiền ship

    status: { 
        type: String, 
        enum: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'], 
        default: 'Pending' 
    },
    
    shippingAddress: { type: String, required: true },
    deliveryNote: { type: String }, 
    
}, { timestamps: true }); 

module.exports = mongoose.models.Order || mongoose.model('Order', OrderSchema);
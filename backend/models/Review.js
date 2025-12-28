const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'Account', required: true },
    book: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true },
    
    // Đổi rating -> star cho khớp frontend
    star: { type: Number, required: true, min: 1, max: 5 },
    
    // Đổi comment -> content, bỏ giới hạn 500 ký tự để lưu HTML
    content: { type: String, required: true }, 

}, { timestamps: true }); 

// Giúp tìm review của sách và lấy cái mới nhất cực nhanh
ReviewSchema.index({ book: 1, createdAt: -1 });
module.exports = mongoose.models.Review || mongoose.model('Review', ReviewSchema);
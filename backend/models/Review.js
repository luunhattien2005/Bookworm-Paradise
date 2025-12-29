const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'Account', required: true },
    book: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true },
    
    star: { type: Number, required: true, min: 1, max: 5 },
    
    content: { type: String, required: true }, 

}, { timestamps: true }); 

ReviewSchema.index({ book: 1, createdAt: -1 });
module.exports = mongoose.models.Review || mongoose.model('Review', ReviewSchema);
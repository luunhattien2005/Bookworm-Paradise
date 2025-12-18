const mongoose = require('mongoose');

const BookSchema = new mongoose.Schema({
    title: { type: String, required: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'Author', required: true },
    tags: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Tag' }],
    
    description: { type: String },
    price: { type: Number, required: true, min: 0 },
    publisher: { type: String },
    publicationYear: { type: Number }, 

    soldQuantity: { type: Number, default: 0 },
    stockQuantity: { type: Number, required: true, min: 0 },
    
    coverImage: { type: String }, 
    
    averageRating: { type: Number, default: 0 },
    isDeleted: { type: Boolean, default: false } 
});

module.exports = mongoose.models.Book || mongoose.model('Book', BookSchema);
const mongoose = require('mongoose');

const BookSchema = new mongoose.Schema({
    name: { type: String, required: true },
    imgURL: { type: String }, 
    slug: { type: String, required: true, unique: true, index: true },

    author: { type: mongoose.Schema.Types.ObjectId, ref: 'Author', required: true },
    tags: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Tag' }],
    
    price: { type: Number, required: true, min: 0 },
    description: { type: String },
    
    provider: { type: String },
    translator: { type: String },
    publisher: { type: String },
    publicationYear: { type: Number }, 
    weight: { type: Number },
    size: { type: String }, // e.g., "15 x 20cm"
    page: { type: Number },
    type: { type: String }, // e.g., "Bìa mềm", "Bìa cứng"

    soldQuantity: { type: Number, default: 0 },
    stockQuantity: { type: Number, required: true, min: 0 },
    
    averageRating: { type: Number, default: 0 },
    isDeleted: { type: Boolean, default: false } 
});

module.exports = mongoose.models.Book || mongoose.model('Book', BookSchema);
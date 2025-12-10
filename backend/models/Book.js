const mongoose = require("mongoose");

const BookSchema = new mongoose.Schema({
    bookID: { type: String, required: true, unique: true },
    isbn: { type: String, required: true },

    price: { type: mongoose.Decimal128, required: true },

    description: { type: String, default: "" },
    publisher: { type: String, default: "" },
    soldQuantity: { type: Number, default: 0 },
    stockQuantity: { type: Number, default: 0 },

    coverImage: { type: String, default: "" },

    isDelete: { type: Boolean, default: false },

    tags: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tag'
    }],

    authorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Author',
        required: true
    }

});

module.exports = mongoose.model("Book", BookSchema);
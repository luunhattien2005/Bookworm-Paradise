const mongoose = require("mongoose");

const BookSchema = new mongoose.Schema({
    title: { type: String, required: true },

    authorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Author',
        required: true
    },

    price: { type: Number, required: true },

    description: { type: String, default: "" },
    stockQuantity: { type: Number, default: 0 },

    coverImage: { type: String, default: "" },

    status: { type: String, default: "available" },

    tags: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tag'
    }]

});

module.exports = mongoose.model("Book", BookSchema);
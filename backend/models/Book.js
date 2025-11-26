const mongoose = require("mongoose");

const BookSchema = new mongoose.Schema({
    title: { type: String, required: true },

    // Atlas: authorId, your version: author
    authorId: { type: String, required: true },
    // OR: authorId: String

    price: { type: Number, required: true },

    description: { type: String, default: "" },
    stockQuantity: { type: Number, default: 0 },

    // Atlas: coverImage, your version: image
    coverImage: { type: String, default: "" },



    status: { type: String, default: "available" },
    tags: { type: [String], default: "" }
});

module.exports = mongoose.model("Book", BookSchema);

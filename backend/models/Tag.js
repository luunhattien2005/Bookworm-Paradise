const mongoose = require('mongoose');

const TagSchema = new mongoose.Schema({
    tagID: { type: String, required: true, unique: true, minlength: 5, maxlength: 5 },
    tagName: {
        type: String,
        required: true,
        unique: true // Good practice: Prevent duplicate tag names
    }
});

module.exports = mongoose.model('Tag', TagSchema);
const mongoose = require('mongoose');

const TagSchema = new mongoose.Schema({
    tagName: {
        type: String,
        required: true,
        unique: true // Good practice: Prevent duplicate tag names
    }
});

module.exports = mongoose.model('Tag', TagSchema);
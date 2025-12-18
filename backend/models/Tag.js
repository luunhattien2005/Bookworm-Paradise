const mongoose = require('mongoose');

const TagSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true }
});

module.exports = mongoose.models.Tag || mongoose.model('Tag', TagSchema);
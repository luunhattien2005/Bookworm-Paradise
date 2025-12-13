const mongoose = require('mongoose');

const AuthorSchema = new mongoose.Schema({
    AuthorName: { type: String, required: true, minlength: 1, maxlength: 50 },
});

module.exports = mongoose.model('Author', AuthorSchema);
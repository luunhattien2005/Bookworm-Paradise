const mongoose = require('mongoose');

const AuthorSchema = new mongoose.Schema({
    AuthorID: { type: String, required: true, unique: true, minlength: 5, maxlength: 5 },
    AuthorName: { type: String, required: true, minlength: 1, maxlength: 50 },
});

module.exports = mongoose.model('Author', AuthorSchema);
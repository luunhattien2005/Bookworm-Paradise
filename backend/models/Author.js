const mongoose = require('mongoose');

const AuthorSchema = new mongoose.Schema({
    fullname: { type: String, required: true }
});

module.exports = mongoose.model('Author', AuthorSchema);
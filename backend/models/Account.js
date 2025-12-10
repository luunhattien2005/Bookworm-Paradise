const mongoose = require('mongoose');

const AccountSchema = new mongoose.Schema({
    UserID: { type: String, required: true, unique: true },
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    fullname: { type: String, required: true },
    phone: { type: String },
    address: { type: String },
    role: { type: String, enum: ['customer', 'admin'], default: 'customer' }
});

module.exports = mongoose.model('Account', AccountSchema);
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    fullName: {
        type: String,
        required: true
    },

    phone: {
        type: String,
        required: true
    },

    email: {
        type: String,
        required: true,
        unique: true // 
    },

    password: {
        type: String,
        required: true
    },

    role: {
        type: String,
        required: true,
        enum: ['Buyer', 'Admin'],
        default: 'Buyer'
    },

    createdDate: {
        type: Date,
        required: true,
        default: Date.now // Automatically sets the date so you don't have to manually send it
    },

    address: {
        type: String,
        required: false
    }
});

module.exports = mongoose.model('User', userSchema);
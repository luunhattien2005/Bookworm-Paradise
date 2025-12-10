const mongoose = require('mongoose');

const CustomerSchema = new mongoose.Schema({
    statusUser: { type: Boolean, default: true },

    accountId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Account',
        required: true
    }
});

module.exports = mongoose.model('Customer', CustomerSchema);
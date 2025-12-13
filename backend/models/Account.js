const mongoose = require('mongoose');

const AccountSchema = new mongoose.Schema({
    // username là Email 
    username: { type: String, required: true, unique: true }, 
    password: { type: String, required: true },
    fullname: { type: String, required: true },
    phone: { type: String },
    address: { type: String },
    role: { type: String, enum: ['customer', 'admin'], default: 'customer' },
    avatar: { type: String }, 
    isBanned: { type: Boolean, default: false }, 
    
    // Phục vụ chức năng Quên mật khẩu
    resetPasswordToken: { type: String },
    resetPasswordExpire: { type: Date } 
}); 

module.exports = mongoose.model('Account', AccountSchema);
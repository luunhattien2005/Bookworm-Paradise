const mongoose = require('mongoose');

const AccountSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true }, 
    username: { type: String, required: true, unique: true, maxlength: 15 }, 
    password: { type: String, required: true },
    fullname: { type: String, required: true },
    sex: { type: String, default: 'Others' },
    birthday: { type: Date },
    phone: { type: String, maxlength: 11 },
    address: { type: String },
    role: { type: String, enum: ['customer', 'admin'], default: 'customer' },
    avatar: { type: String }, 
    isBanned: { type: Boolean, default: false }, 
    
    // Phục vụ chức năng Quên mật khẩu
    resetPasswordToken: { type: String },
    resetPasswordExpire: { type: Date } 
}); 

module.exports = mongoose.models.Account || mongoose.model('Account', AccountSchema);
const Account = require('../models/Account');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

// Cấu hình gửi mail (Lấy từ file .env)
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

const accountController = {

    // 1. Đăng ký
    register: async (req, res) => {
    try {
        const { username, email, password, fullname, phone, address } = req.body; 

        // Kiểm tra xem username HOẶC email đã tồn tại chưa
        const existingUser = await Account.findOne({ 
            $or: [{ username }, { email }] 
        });

        if (existingUser) {
            const message = existingUser.username === username 
                ? "Tên đăng nhập đã tồn tại!" 
                : "Email đã tồn tại!";
            return res.status(400).json({ message });
        }

        const newAccount = new Account({
            username, email, password, fullname, phone, address, // sửa
            role: 'customer'
        });

            await newAccount.save();
            res.status(201).json({ message: "Đăng ký thành công!", account: newAccount });
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    },

    // 2. Đăng nhập 
    login: async (req, res) => {
        try {
            const { identity, password } = req.body; 

            // Tìm user bằng username HOẶC email
            const user = await Account.findOne({ 
                $or: [{ username: identity }, { email: identity }] 
            });
            
            if (!user) return res.status(404).json({ message: "Tài khoản không tồn tại" });
            
            // 2. Check mật khẩu
            if (user.password !== password) return res.status(401).json({ message: "Sai mật khẩu!" });
            
            // 3. Check có bị Ban
            if (user.isBanned) {
                return res.status(403).json({ message: "Tài khoản của bạn đã bị khóa bởi Admin!" });
            }

            // d. Tạo Token (Thẻ bài)
            const token = jwt.sign(
                { id: user._id, role: user.role },
                process.env.JWT_SECRET,
                { expiresIn: '1d' }
            );

            res.json({
                message: "Đăng nhập thành công",
                token,
                user: {
                    _id: user._id,
                    username: user.username,
                    fullname: user.fullname,
                    role: user.role,
                    avatar: user.avatar
                }
            });
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    },

    // 3. Quên mật khẩu
    forgotPassword: async (req, res) => {
        try {
            const { email } = req.body;
            // username chính là email
            const user = await Account.findOne({ username: email });
            if (!user) return res.status(404).json({ message: "Email chưa đăng ký!" });

            // Tạo mật khẩu mới ngẫu nhiên 6 ký tự
            const newPassword = Math.random().toString(36).slice(-6);
            user.password = newPassword;
            
            // Dọn dẹp token cũ nếu có
            user.resetPasswordToken = undefined;
            user.resetPasswordExpire = undefined;
            
            await user.save();

            // Gửi mail
            await transporter.sendMail({
                from: process.env.EMAIL_USER,
                to: email,
                subject: 'Mật khẩu mới - Bookworm Paradise',
                text: `Chào bạn, mật khẩu mới của bạn là: ${newPassword}. Vui lòng đăng nhập và đổi lại mật khẩu ngay.`
            });

            res.json({ message: "Đã gửi mật khẩu mới vào email của bạn!" });
        } catch (err) {
            res.status(500).json({ message: "Lỗi gửi mail: " + err.message });
        }
    },

    
    // Khu dành cho người đăng nhập
    // 4. Lấy tất cả user 
    getAllAccounts: async (req, res) => {
        try {
            const accounts = await Account.find().select('-password');
            res.json(accounts);
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    },

    // 5. Xem profile
    getAccountById: async (req, res) => {
        try {
            const account = await Account.findById(req.params.id).select('-password');
            if (!account) return res.status(404).json({ message: 'Không tìm thấy user' });
            res.json(account);
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    },

    // 6. Cập nhật thông tin
    updateAccount: async (req, res) => {
        try {
            const updateData = { ...req.body };
            
            if (req.file) {
                updateData.avatar = req.file.path; 
            }

            const account = await Account.findByIdAndUpdate(req.params.id, updateData, { new: true });
            if (!account) return res.status(404).json({ message: 'Không tìm thấy user' });

            res.json({ message: "Cập nhật thành công!", account });
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    },

    // 7. Ban user 
    banAccount: async (req, res) => {
        try {
            const account = await Account.findByIdAndUpdate(
                req.params.id, 
                { isBanned: true }, 
                { new: true }
            );

            if (!account) return res.status(404).json({ message: 'Không tìm thấy user' });
            
            res.json({ message: `Đã BAN (khóa) tài khoản ${account.username} thành công.` });
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    },
    
    // 8. Xóa user (hàm ẩn, không dùng thật)
    deleteAccount: async (req, res) => {
        try {
            const result = await Account.findByIdAndDelete(req.params.id);
            if (!result) return res.status(404).json({ message: 'Không tìm thấy user để xóa' });
            
            res.json({ message: "Đã xóa tài khoản vĩnh viễn khỏi Database" });
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    }
};

module.exports = accountController;
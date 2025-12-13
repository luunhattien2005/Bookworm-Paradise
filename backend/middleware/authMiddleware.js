const jwt = require('jsonwebtoken');

// Kiểm tra xem user đã đăng nhập chưa
const verifyToken = (req, res, next) => {
    // Lấy vé từ Header gửi lên
    const token = req.header('Authorization');
    
    // Nếu không có vé trả về
    if (!token) return res.status(401).json({ message: "Truy cập bị từ chối! Bạn chưa đăng nhập." });

    try {
        // Vé thường có dạng "Bearer chuoi_token..." cắt bỏ chữ Bearer đi
        const actualToken = token.startsWith("Bearer ") ? token.slice(7, token.length) : token;

        // Kiểm tra vé thật hay giả
        const verified = jwt.verify(actualToken, process.env.JWT_SECRET);
        req.user = verified; 
        next(); 
    } catch (err) {
        res.status(400).json({ message: "Token không hợp lệ!" });
    }
};

// Kiểm tra xem có phải Admin không
const verifyAdmin = (req, res, next) => {
    verifyToken(req, res, () => {
        if (req.user.role === 'admin') {
            next(); 
        } else {
            res.status(403).json({ message: "Bạn không có quyền thực hiện hành động này!" });
        }
    });
};

module.exports = { verifyToken, verifyAdmin };
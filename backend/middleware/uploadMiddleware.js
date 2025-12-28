const multer = require('multer');

const upload = multer({
    storage: multer.memoryStorage(),
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Chỉ cho phép upload ảnh'), false);
        }
    },
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB    
    }
});

module.exports = upload;
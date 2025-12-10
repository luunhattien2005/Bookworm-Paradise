const express = require("express");
const router = express.Router();
const Tag = require("../models/Tag");

// Hàm middleware để lấy Tag theo tagID và xử lý lỗi 404
async function getTag(req, res, next) {
    let tag;
    try {
        tag = await Tag.findOne({ tagID: req.params.tagID });
                         
        if (tag == null) {
            return res.status(404).json({ message: 'Không tìm thấy Tag với ID này.' });
        }
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }

    res.tag = tag;
    next();
}

// Lấy tất cả Tags
router.get("/", async (req, res) => {
    try {
        const tags = await Tag.find().sort({ tagName: 1 }); // Sắp xếp theo tên tag
        res.json(tags);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Lấy thông tin một Tag cụ thể
router.get("/:tagID", getTag, (req, res) => {
    res.json(res.tag);
});

// Tạo Tag mới
router.post("/", async (req, res) => {
    const tag = new Tag({
        tagID: req.body.tagID,
        tagName: req.body.tagName,
    });

    try {
        const newTag = await tag.save();
        res.status(201).json({ message: "Tạo Tag thành công!", tag: newTag });
    } catch (err) {
        // Lỗi 400 thường dành cho lỗi nhập liệu (validation error) hoặc unique key (tagName/tagID đã tồn tại)
        res.status(400).json({ message: err.message });
    }
});

// Cập nhật tagName
router.patch("/:tagID", getTag, async (req, res) => {
    // Chỉ cập nhật tagName
    if (req.body.tagName != null) {
        res.tag.tagName = req.body.tagName;
    } else {
        return res.status(400).json({ message: 'Không có thông tin tagName mới để cập nhật.' });
    }

    try {
        const updatedTag = await res.tag.save();
        res.json({ message: "Cập nhật Tag thành công!", tag: updatedTag });
    } catch (err) {
        // Lỗi 400 nếu tagName mới đã tồn tại
        res.status(400).json({ message: err.message });
    }
});

// Xóa Tag
router.delete("/:tagID", getTag, async (req, res) => {
    try {
        await res.tag.deleteOne();
        res.json({ message: 'Xóa Tag thành công.' });
        
        // *LƯU Ý QUAN TRỌNG: Sau khi xóa Tag, bạn PHẢI xử lý các sách đang tham chiếu đến Tag này
        // (Ví dụ: Xóa ObjectId của Tag này khỏi mảng 'tags' trong tất cả các Book documents liên quan)

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Tìm kiếm Tag theo tagName
router.get("/search/:query", async (req, res) => {
    const q = req.params.query;
    try {
        const tags = await Tag.find({
            // Tìm kiếm không phân biệt chữ hoa/thường trên trường tagName
            tagName: { $regex: q, $options: "i" }
        });

        if (tags.length === 0) {
            return res.status(404).json({ message: `Không tìm thấy Tag nào với từ khóa: ${q}` });
        }

        res.json(tags);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
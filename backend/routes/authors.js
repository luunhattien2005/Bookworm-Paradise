const express = require("express");
const router = express.Router();
const Author = require("../models/Author");

// Hàm middleware để lấy tác giả theo AuthorID và xử lý lỗi 404
async function getAuthor(req, res, next) {
    let author;
    try {
        // Tìm kiếm dựa trên trường AuthorID
        author = await Author.findOne({ AuthorID: req.params.authorID });
                         
        if (author == null) {
            return res.status(404).json({ message: 'Không tìm thấy tác giả với ID này.' });
        }
    } catch (err) {
        // Lỗi 500 nếu có lỗi server/database
        return res.status(500).json({ message: err.message });
    }

    res.author = author;
    next();
}

// Lấy tất cả tác giả
router.get("/", async (req, res) => {
    try {
        const authors = await Author.find();
        res.json(authors);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Lấy thông tin một tác giả cụ thể theo AuthorID
router.get("/:authorID", getAuthor, (req, res) => {
    // getAuthor middleware đã xử lý logic và trả về res.author
    res.json(res.author);
});

// Tạo tác giả mới
router.post("/", async (req, res) => {
    // Schema yêu cầu AuthorID (5 ký tự) và AuthorName
    const author = new Author({
        AuthorID: req.body.AuthorID,
        AuthorName: req.body.AuthorName,
    });

    try {
        const newAuthor = await author.save();
        res.status(201).json({ message: "Tạo tác giả thành công!", author: newAuthor });
    } catch (err) {
        // Lỗi 400 thường dành cho lỗi nhập liệu (validation error) hoặc unique key
        res.status(400).json({ message: err.message });
    }
});

// Cập nhật thông tin tác giả
router.patch("/:authorID", getAuthor, async (req, res) => {
    // Chỉ cho phép cập nhật AuthorName (vì AuthorID là unique và thường không thay đổi)
    if (req.body.AuthorName != null) {
        res.author.AuthorName = req.body.AuthorName;
    } else {
        // Trả về 400 nếu không có trường nào để cập nhật
        return res.status(400).json({ message: 'Không có thông tin AuthorName mới để cập nhật.' });
    }

    try {
        const updatedAuthor = await res.author.save();
        res.json({ message: "Cập nhật thành công!", author: updatedAuthor });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Xóa tác giả
router.delete("/:authorID", getAuthor, async (req, res) => {
    try {
        // Xóa cứng tác giả được tìm thấy bởi middleware
        await res.author.deleteOne();
        res.json({ message: 'Xóa tác giả thành công.' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Tìm kiếm tác giả theo AuthorName
router.get("/search/:query", async (req, res) => {
    const q = req.params.query;
    try {
        const authors = await Author.find({
            // Tìm kiếm không phân biệt chữ hoa/thường trên trường AuthorName
            AuthorName: { $regex: q, $options: "i" }
        });

        if (authors.length === 0) {
            return res.status(404).json({ message: `Không tìm thấy tác giả nào với từ khóa: ${q}` });
        }

        res.json(authors);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
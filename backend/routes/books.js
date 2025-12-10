const express = require("express");
const router = express.Router();
const Book = require("../models/Book");

// Hàm middleware để lấy sách theo bookID và xử lý lỗi 404
async function getBook(req, res, next) {
    let book;
    try {
        // Tìm sách và populate (kết nối) thông tin Author và Tags liên quan
        book = await Book.findOne({ bookID: req.params.bookID })
                         .populate('authorId')
                         .populate('tags');
                         
        if (book == null) {
            return res.status(404).json({ message: 'Không tìm thấy sách với ID này.' });
        }
    } catch (err) {
        return res.status(500).json({ message: err.message });
    }

    res.book = book;
    next();
}

// Lấy tất cả sách
router.get("/", async (req, res) => {
    try {
        const books = await Book.find()
                                .populate('authorId') // Lấy thông tin tác giả
                                .populate('tags');    // Lấy thông tin tags
        res.json(books);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Lấy thông tin một cuốn sách cụ thể
router.get("/:bookID", getBook, (req, res) => {
    // getBook middleware đã xử lý logic và trả về res.book
    res.json(res.book);
});

// Tạo sách mới
router.post("/", async (req, res) => {
    const book = new Book({
        bookID: req.body.bookID,
        isbn: req.body.isbn,
        price: req.body.price, // Mongoose sẽ tự động chuyển sang Decimal128 nếu là chuỗi số hợp lệ
        description: req.body.description,
        publisher: req.body.publisher,
        soldQuantity: req.body.soldQuantity,
        stockQuantity: req.body.stockQuantity,
        coverImage: req.body.coverImage,
        tags: req.body.tags, // Cần là mảng các ObjectId hợp lệ
        authorId: req.body.authorId // Cần là ObjectId của Author hợp lệ
    });

    try {
        const newBook = await book.save();
        res.status(201).json({ message: "Tạo sách thành công!", book: newBook });
    } catch (err) {
        // Lỗi 400 cho Validation hoặc Duplicate Key (bookID đã tồn tại)
        res.status(400).json({ message: err.message });
    }
});

// Cập nhật thông tin sách
router.patch("/:bookID", getBook, async (req, res) => {
    // Chỉ cập nhật các trường có trong req.body
    if (req.body.isbn != null) res.book.isbn = req.body.isbn;
    if (req.body.price != null) res.book.price = req.body.price;
    if (req.body.description != null) res.book.description = req.body.description;
    if (req.body.publisher != null) res.book.publisher = req.body.publisher;
    if (req.body.soldQuantity != null) res.book.soldQuantity = req.body.soldQuantity;
    if (req.body.stockQuantity != null) res.book.stockQuantity = req.body.stockQuantity;
    if (req.body.coverImage != null) res.book.coverImage = req.body.coverImage;
    if (req.body.isDelete != null) res.book.isDelete = req.body.isDelete; // Dùng cho xóa mềm
    if (req.body.tags != null) res.book.tags = req.body.tags;
    if (req.body.authorId != null) res.book.authorId = req.body.authorId;

    try {
        const updatedBook = await res.book.save();
        res.json({ message: "Cập nhật thành công!", book: updatedBook });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Xóa mềm sách (chỉ set isDelete = true)
router.delete("/:bookID", getBook, async (req, res) => {
    // Thay vì xóa cứng, chúng ta chỉ set cờ isDelete
    if (res.book.isDelete === true) {
        return res.status(400).json({ message: 'Sách này đã bị xóa mềm trước đó.' });
    }
    
    res.book.isDelete = true;

    try {
        await res.book.save();
        res.json({ message: 'Xóa mềm sách thành công (isDelete = true).' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Tìm kiếm sách theo description hoặc publisher
router.get("/search/:query", async (req, res) => {
    const q = req.params.query;
    try {
        const books = await Book.find({
            $or: [
                { description: { $regex: q, $options: "i" } },
                { publisher: { $regex: q, $options: "i" } }
            ]
        })
        .where('isDelete').equals(false) // Chỉ tìm kiếm những cuốn chưa bị xóa mềm
        .populate('authorId')
        .populate('tags');

        if (books.length === 0) {
            return res.status(404).json({ message: `Không tìm thấy sách nào với từ khóa: ${q}` });
        }

        res.json(books);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
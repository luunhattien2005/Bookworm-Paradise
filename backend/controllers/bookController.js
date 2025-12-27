const Book = require('../models/Book');
const Author = require('../models/Author'); // Import thêm
const Tag = require('../models/Tag');       // Import thêm

const bookController = {

    // ==========================================
    // PHẦN QUẢN LÝ TÁC GIẢ (AUTHOR)
    // ==========================================

    getAllAuthors: async (req, res) => {
        try {
            const authors = await Author.find();
            res.json(authors);
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    },

    createAuthor: async (req, res) => {
        try {
            // Theo Model bạn sửa: { AuthorName: ... }
            const newAuthor = new Author(req.body);
            await newAuthor.save();
            res.status(201).json(newAuthor);
        } catch (err) {
            res.status(400).json({ message: err.message });
        }
    },

    // ==========================================
    // PHẦN QUẢN LÝ TAG (THỂ LOẠI)
    // ==========================================

    getAllTags: async (req, res) => {
        try {
            const tags = await Tag.find();
            res.json(tags);
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    },

    createTag: async (req, res) => {
        try {
            // Theo Model bạn sửa: { name: ... }
            const newTag = new Tag(req.body);
            await newTag.save();
            res.status(201).json(newTag);
        } catch (err) {
            res.status(400).json({ message: err.message });
        }
    },

    // ==========================================
    // PHẦN QUẢN LÝ SÁCH (BOOK / PRODUCT)
    // ==========================================

    // 1. Tìm kiếm sách (SearchBooks)
    searchBooks: async (req, res) => {
        try {
            const { q, tag, author, min, max, page = 1, limit = 20 } = req.query;

            const filter = { isDeleted: false };

            // Search theo tên
            if (q) {
                filter.name = { $regex: q, $options: 'i' };
            }

            // Filter theo tag
            if (tag) {
                filter.tags = tag;
            }

            // Filter theo tác giả
            if (author) {
                filter.author = author;
            }

            if (min || max) {
                filter.price = {};
                if (min) filter.price.$gte = Number(min);
                if (max) filter.price.$lte = Number(max);
            }

            const books = await Book.find(filter)
            .populate('author', 'AuthorName')
            .populate('tags', 'name')
            .limit(limit)
            .skip((page - 1) * limit);

            res.json(books);
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    },

    // 2. Xem chi tiết 1 sách theo slug (ViewBookDetail)
    getBookBySlug: async (req, res) => {
        try {
            const book = await Book.findOne({
                slug: req.params.slug,
                isDeleted: false
            })
            .populate('author', 'AuthorName')
            .populate('tags', 'name');

            if (!book)
                return res.status(404).json({ message: "Không tìm thấy sách" });

            res.json(book);
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    },

    // 3. Xem chi tiết 1 sách (ViewBookDetail)
    getBookById: async (req, res) => {
        try {
            const book = await Book.findById(req.params.id)
                .populate('author', 'AuthorName')
                .populate('tags', 'name');

            if (!book) return res.status(404).json({ message: "Không tìm thấy sách" });
            res.json(book);
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    },


    // 4. Thêm sách mới (AddBook)
    createBook: async (req, res) => {
        try {
            const bookData = req.body;
            
            if (req.file) {
                bookData.imgURL = req.file.path; // SỬA: coverImage -> imgURL
            }

            const newBook = new Book(bookData);
            await newBook.save();
            res.status(201).json({ message: "Thêm sách thành công", book: newBook });
        } catch (err) {
            res.status(400).json({ message: err.message });
        }
    },

    // 5. Cập nhật sách (EditBook)
    updateBook: async (req, res) => {
        try {
            const updateData = req.body;
            if (req.file) {
                updateData.imgURL = req.file.path; // SỬA: coverImage -> imgURL
            }

            const updatedBook = await Book.findByIdAndUpdate(req.params.id, updateData, { new: true });
            if (!updatedBook) return res.status(404).json({ message: "Không tìm thấy sách" });

            res.json({ message: "Cập nhật thành công", book: updatedBook });
        } catch (err) {
            res.status(400).json({ message: err.message });
        }
    },

    // 6. Xóa 1 quyển sách (DeleteBook)
    deleteBook: async (req, res) => {
        try {
            await Book.findByIdAndUpdate(req.params.id, { isDeleted: true });
            res.json({ message: "Đã xóa sách (ẩn khỏi hệ thống)" });
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    }
};

module.exports = bookController;
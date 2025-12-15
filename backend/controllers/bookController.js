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
            // Theo Model bạn sửa: { TagName: ... }
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

    // 1. Lấy tất cả sách (ViewAllBooks)
    getAllBooks: async (req, res) => {
        try {
            // Populate để hiện tên Tác giả/Tag thay vì ID
            const books = await Book.find({ isDeleted: false })
                .populate('author', 'AuthorName')
                .populate('tags', 'TagName');
            res.json(books);
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    },

    // 2. Xem chi tiết 1 sách (ViewBookDetail)
    getBookById: async (req, res) => {
        try {
            const book = await Book.findById(req.params.id)
                .populate('author', 'AuthorName')
                .populate('tags', 'TagName');

            if (!book) return res.status(404).json({ message: "Không tìm thấy sách" });
            res.json(book);
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    },

    // 3. Tìm kiếm sách (SearchBooks)
    searchBooks: async (req, res) => {
        try {
            const keyword = req.params.keyword;
            const books = await Book.find({
                title: { $regex: keyword, $options: 'i' },
                isDeleted: false
            });
            res.json(books);
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    },

    // 4. Thêm sách mới (AddBook)
    createBook: async (req, res) => {
        try {
            const bookData = req.body;

            // Nếu có file ảnh gửi lên
            if (req.file) {
                bookData.coverImage = req.file.path;
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
                updateData.coverImage = req.file.path;
            }

            const updatedBook = await Book.findByIdAndUpdate(req.params.id, updateData, { new: true });
            if (!updatedBook) return res.status(404).json({ message: "Không tìm thấy sách" });

            res.json({ message: "Cập nhật thành công", book: updatedBook });
        } catch (err) {
            res.status(400).json({ message: err.message });
        }
    },

    // 6. Xóa mềm sách (DeleteBook)
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
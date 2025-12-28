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
                filter.tags = { $all: tag.split(',') };
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
    }, 


    // phục vụ home pgae
    // Lấy Top 3 sách có điểm đánh giá cao nhất (Nổi bật)
    getTopRatedBooks: async (req, res) => {
        try {
            const books = await Book.find({ isDeleted: false })
                .sort({ averageRating: -1 }) // Sắp xếp giảm dần
                .limit(3);                   // Lấy 3 cuốn
            res.json(books);
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    },

    // Lấy Top 3 sách bán chạy nhất (Bảng xếp hạng)
    getBestSellerBooks: async (req, res) => {
        try {
            const books = await Book.find({ isDeleted: false })
                .sort({ soldQuantity: -1 }) // Sắp xếp theo số lượng bán
                .limit(3);
            res.json(books);
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    },

    // Lấy sách theo Tag cụ thể (Bộ sưu tập theo mùa)
    // Gọi API: /api/books/seasonal?tag=Mùa Hè
    getBooksByTagName: async (req, res) => {
        try {
            const tagName = req.query.tag || "Mùa Hè"; // Mặc định là 'Mùa Hè' nếu không gửi lên
            
            // 1. Tìm ID của tag tên là "Mùa Hè"
            const tagObj = await Tag.findOne({ name: tagName });
            
            if (!tagObj) {
                // Nếu chưa có tag này thì trả về 3 cuốn ngẫu nhiên hoặc mới nhất để không bị trống web
                const randomBooks = await Book.find({ isDeleted: false }).limit(3);
                return res.json(randomBooks);
            }

            // 2. Tìm sách có chứa tag ID đó
            const books = await Book.find({ 
                tags: tagObj._id, 
                isDeleted: false 
            }).limit(3);

            res.json(books);
        } catch (err) {
            res.status(500).json({ message: err.message });
        }
    }
};

module.exports = bookController;
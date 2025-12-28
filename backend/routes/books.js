const router = require('express').Router();
const bookController = require('../controllers/bookController'); // Nhớ là controller này chứa tất cả logic nhé
const upload = require('../middleware/uploadMiddleware');
const { verifyAdmin } = require('../middleware/authMiddleware');


// ==========================================
// 1. ROUTES CHO TÁC GIẢ (AUTHORS)
// Đường dẫn thực tế: /api/authors
// ==========================================
router.get('/authors', bookController.getAllAuthors);
router.post('/authors', verifyAdmin, bookController.createAuthor);

// ==========================================
// 2. ROUTES CHO THỂ LOẠI (TAGS)
// Đường dẫn thực tế: /api/tags
// ==========================================
router.get('/tags', bookController.getAllTags);
router.post('/tags', verifyAdmin, bookController.createTag);

// ==========================================
// 3. ROUTES CHO SÁCH (BOOKS)
// Đường dẫn thực tế: /api/books
// ==========================================

// Tìm kiếm sách 
router.get('/books', bookController.searchBooks);

// Lấy sách theo slug
router.get('/books/slug/:slug', bookController.getBookBySlug);

// Lấy chi tiết 1 sách
router.get('/books/:id', bookController.getBookById);

// Thêm sách (Admin Only + Upload ảnh)
router.post('/books', verifyAdmin, upload.single('coverImage'), bookController.createBook);

// Sửa sách
router.put('/books/:id', verifyAdmin, upload.single('coverImage'), bookController.updateBook);

// Xóa sách (Soft delete)
router.delete('/books/:id', verifyAdmin, bookController.deleteBook);

// Các hàm cho homepage
router.get('/books/top-rated', bookController.getTopRatedBooks);
router.get('/books/best-sellers', bookController.getBestSellerBooks);
router.get('/books/seasonal', bookController.getBooksByTagName);

module.exports = router;
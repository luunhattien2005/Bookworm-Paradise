const router = require('express').Router();
const bookController = require('../controllers/bookController');
const upload = require('../middleware/uploadMiddleware');
const { verifyAdmin } = require('../middleware/authMiddleware');

// 1. Authors & Tags
router.get('/authors', bookController.getAllAuthors);
router.post('/authors', verifyAdmin, bookController.createAuthor);

router.get('/tags', bookController.getAllTags);
router.post('/tags', verifyAdmin, bookController.createTag);

// ==========================================
// 2. ROUTES ĐẶC BIỆT CHO HOMEPAGE (QUAN TRỌNG: ĐẶT TRÊN CÙNG)
// ==========================================

// Bảng xếp hạng (Top Rated - Theo sao)
router.get('/books/top-rated', bookController.getTopRatedBooks);

// Bán chạy nhất (Best Seller - Theo số lượng bán)
router.get('/books/best-sellers', bookController.getBestSellerBooks);

// Theo mùa (Seasonal - Theo tag)
router.get('/books/seasonal', bookController.getBooksByTagName);


// ==========================================
// 3. CÁC ROUTES SÁCH CƠ BẢN
// ==========================================

// Tìm kiếm chung
router.get('/books', bookController.searchBooks);

// Lấy theo Slug (cho trang chi tiết ProductInfo)
router.get('/books/slug/:slug', bookController.getBookBySlug);

// Lấy theo ID (QUAN TRỌNG: CÁI NÀY PHẢI NẰM DƯỚI CÙNG trong nhóm GET)
router.get('/books/:id', bookController.getBookById);

// --- CÁC ROUTES ADMIN (Thêm/Sửa/Xóa) ---
// (Lưu ý: Nếu dùng Link ảnh thì không cần upload.single nữa, nhưng để đó cũng không sao)
router.post('/books', verifyAdmin, upload.single('image'), bookController.createBook); 
router.put('/books/:id', verifyAdmin, upload.single('image'), bookController.updateBook);
router.delete('/books/:id', verifyAdmin, bookController.deleteBook);

module.exports = router;
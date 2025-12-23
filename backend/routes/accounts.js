const router = require("express").Router();
const accountController = require("../controllers/accountController");
const { verifyToken, verifyAdmin } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

// Authentication
router.post("/register", accountController.register);
router.post("/login", accountController.login);
router.post("/forgot-password", accountController.forgotPassword);
router.get("/me", verifyToken, accountController.getMe);


// Xem profile
router.get("/:id", verifyToken, accountController.getAccountById);
router.put("/me", verifyToken, upload.single('avatar'), accountController.updateAccount);// Mới: Đổi thành /me và thêm upload ảnh


// Khu admin
router.get("/", verifyAdmin, accountController.getAllAccounts);
router.put("/ban/:id", verifyAdmin, accountController.banAccount);

// Xóa tài khoản
router.delete("/:id", verifyAdmin, accountController.deleteAccount);

module.exports = router;
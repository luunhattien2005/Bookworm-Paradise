const router = require("express").Router();
const accountController = require("../controllers/accountController");
const { verifyToken, verifyAdmin } = require("../middleware/authMiddleware");

// Authentication
router.post("/register", accountController.register);
router.post("/login", accountController.login);
router.post("/forgot-password", accountController.forgotPassword);

// Xem profile
router.get("/:id", verifyToken, accountController.getAccountById);
router.put("/:id", verifyToken, accountController.updateAccount);


// Khu admin
router.get("/", verifyAdmin, accountController.getAllAccounts);
router.put("/ban/:id", verifyAdmin, accountController.banAccount);

// Xóa tài khoản
router.delete("/:id", verifyAdmin, accountController.deleteAccount);

module.exports = router;
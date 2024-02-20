const { Router } = require("express");
const authMiddleware = require("../middleware/authMiddleware");

const { loginUser, registerUser } = require("../controllers/userController");
const router = Router();

router.post("/login", loginUser);
router.post("/register", registerUser);
module.exports = router;

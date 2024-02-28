const { Router } = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const { createTesti, getTesti, editTesti, deleteTesti } = require("../controllers/testiController");
const router = Router();
router.post("/", authMiddleware, createTesti);
router.get("/", getTesti);
router.patch("/:id", authMiddleware, editTesti);
router.delete("/:id", authMiddleware, deleteTesti);
module.exports = router;

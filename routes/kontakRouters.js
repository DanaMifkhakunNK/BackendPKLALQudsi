const { Router } = require("express");

const authMiddleware = require("../middleware/authMiddleware");
const { createKontak, editKontak, getKontak } = require("../controllers/kontakController");
const router = Router();
router.post("/", authMiddleware, createKontak);
router.get("/", getKontak);
router.patch("/:id", authMiddleware, editKontak);
module.exports = router;

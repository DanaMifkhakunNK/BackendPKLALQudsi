const { Router } = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const { createGaleri, getGaleri, deleteGaleri } = require("../controllers/galeriController");

const router = Router();
router.post("/", authMiddleware, createGaleri);
router.get("/", getGaleri);
router.delete("/:id", authMiddleware, deleteGaleri);
module.exports = router;

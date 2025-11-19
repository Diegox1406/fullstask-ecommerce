const express = require("express");
const router = express.Router();
const promotionController = require("../controllers/promotionController");

// @route   GET /api/promotions (Leer Todas)
router.get("/", promotionController.getAllPromotions);

// @route   GET /api/promotions/:id (Leer una)
// (NUEVO)
router.get("/:id", promotionController.getPromotionById);

module.exports = router;

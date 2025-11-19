const Promotion = require("../models/Promotion");
const Product = require("../models/Product");

// @desc    Obtener todas las promociones (para el público)
// @route   GET /api/promotions
exports.getAllPromotions = async (req, res) => {
  try {
    const promotions = await Promotion.find({ estado: true }).populate(
      "products",
      "name description price category"
    );
    res.json(promotions);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener promociones" });
  }
};

// ---  LEER POR ID (¡NUEVO!) ---
// @desc    Obtener una promoción por su ID
// @route   GET /api/promotions/:id
exports.getPromotionById = async (req, res) => {
  try {
    const promotion = await Promotion.findById(req.params.id).populate(
      "products",
      "name description price category"
    );

    if (!promotion) {
      return res.status(404).json({ message: "Promoción no encontrada" });
    }
    res.json(promotion);
  } catch (error) {
    res.status(500).json({ message: "Error del servidor" });
  }
};

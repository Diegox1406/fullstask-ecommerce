const Promotion = require("../models/Promotion");
const Product = require("../models/Product");
const cloudinary = require("../config/cloudinary");

const processProducts = (productsInput) => {
  if (typeof productsInput === 'string') {
    return productsInput.split(',').map(id => id.trim()).filter(id => id.length > 0);
  }
  return productsInput;
};

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

exports.getPromotionById = async (req, res) => {
  try {
    const promotion = await Promotion.findById(req.params.id).populate(
      "products",
      "name description price category"
    );
    if (!promotion) return res.status(404).json({ message: "Promoción no encontrada" });
    res.json(promotion);
  } catch (error) {
    res.status(500).json({ message: "Error del servidor" });
  }
};

exports.createPromotion = async (req, res) => {
  try {
    const { name, description, promoPrice, originalPrice, products, estado } = req.body;
    const productIds = processProducts(products);

    if (!name || !promoPrice || !originalPrice || !productIds || productIds.length === 0) {
      return res.status(400).json({ message: "Faltan campos obligatorios (nombre, precios, o IDs de productos)." });
    }
    if (!req.file) return res.status(400).json({ message: "La imagen del combo es obligatoria." });

    const promotion = await Promotion.create({
      name,
      description,
      promoPrice: Number(promoPrice),
      originalPrice: Number(originalPrice),
      products: productIds,
      image: { url: req.file.path, public_id: req.file.filename },
      estado: estado !== undefined ? (estado === 'true') : true,
    });

    res.status(201).json(promotion);
  } catch (error) {
    console.error("Error al crear promoción:", error);
    if (req.file) {
      try { await cloudinary.uploader.destroy(req.file.filename); } catch(e) {}
    }
    if (error.name === 'ValidationError' || error.name === 'CastError') {
      return res.status(400).json({ message: `Error de validación: ${error.message}` });
    }
    res.status(500).json({ message: "Error al crear la promoción." });
  }
};

exports.updatePromotion = async (req, res) => {
  try {
    const { name, description, promoPrice, originalPrice, products, estado } = req.body;
    const promotion = await Promotion.findById(req.params.id);
    if (!promotion) return res.status(404).json({ message: "Promoción no encontrada" });

    if (name !== undefined) promotion.name = name;
    if (description !== undefined) promotion.description = description;
    if (promoPrice !== undefined) promotion.promoPrice = Number(promoPrice);
    if (originalPrice !== undefined) promotion.originalPrice = Number(originalPrice);
    if (estado !== undefined) promotion.estado = (estado === 'true');
    if (products !== undefined) {
      promotion.products = processProducts(products);
      promotion.markModified('products');
    }

    if (req.file) {
      if (promotion.image && promotion.image.public_id) {
        await cloudinary.uploader.destroy(promotion.image.public_id);
      }
      promotion.image = { url: req.file.path, public_id: req.file.filename };
    }

    const updatedPromotion = await promotion.save();
    res.json(updatedPromotion);
  } catch (error) {
    console.error("Error al actualizar la promoción:", error);
    if (req.file) await cloudinary.uploader.destroy(req.file.filename);
    res.status(500).json({ message: "Error al actualizar la promoción." });
  }
};

exports.deletePromotion = async (req, res) => {
  try {
    const deletedPromotion = await Promotion.findByIdAndUpdate(
      req.params.id,
      { estado: false },
      { new: true }
    );
    if (!deletedPromotion) return res.status(404).json({ message: "Promoción no encontrada" });
    res.json({ message: "Promoción desactivada exitosamente" });
  } catch (error) {
    console.error("Error al eliminar:", error);
    res.status(500).json({ message: "Error al eliminar la promoción." });
  }
};

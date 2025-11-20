const express = require("express");
const router = express.Router();

const {
  createProduct,
  deleteProduct,
  updateProduct,
  createCotizacion,
  updateCotizacion,
  deleteCotizacion,
} = require("../controllers/adminController");
const promotionController = require("../controllers/promotionController");
const upload = require("../middleware/uploadMiddleware");
const { protect, admin } = require("../middleware/authMiddleware");

// Aplicar protección a todas las rutas
router.use(protect, admin);

// -----------------------------------------------------------
// RUTAS DE ADMINISTRACIÓN: PRODUCTS
// -----------------------------------------------------------
// (POST /api/admin/products) - Crear
router.post("/products", upload.single("image"), createProduct);
// (PUT /api/admin/products/:id) - Actualizar
router.put("/products/:id", upload.single("image"), updateProduct);
// (DELETE /api/admin/products/:id) - Borrar
router.delete("/products/:id", deleteProduct);

// -----------------------------------------------------------
// RUTAS DE ADMINISTRACIÓN: PROMOTIONS (CORREGIDAS)
// -----------------------------------------------------------
// @route   POST /api/admin/promotions (Crear)
router.post(
  "/promotions",
  upload.single("image"),
  promotionController.createPromotion
);
// @route   PUT /api/admin/promotions/:id (Editar)
router.put(
  "/promotions/:id",
  upload.single("image"),
  promotionController.updatePromotion
);
// @route   DELETE /api/admin/promotions/:id (Eliminar)
router.delete("/promotions/:id", promotionController.deletePromotion);

// -----------------------------------------------------------
// RUTAS DE ADMINISTRACIÓN: COTIZACION
// -----------------------------------------------------------
// (POST /api/admin/cotizacion) - Crear
router.post("/cotizacion", createCotizacion);
// (PUT /api/admin/cotizacion/:id) - Actualizar
router.put("/cotizacion/:id", updateCotizacion);
// (DELETE /api/admin/cotizacion/:id) - Borrar
router.delete("/cotizacion/:id", deleteCotizacion);

module.exports = router;

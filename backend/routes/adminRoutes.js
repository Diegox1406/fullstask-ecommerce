const express = require("express");
const router = express.Router();
// Asegúrate de importar la nueva función
const {
  createProduct,
  deleteProduct,
  updateProduct,
  createCotizacion,
  updateCotizacion,
  deleteCotizacion,
} = require("../controllers/adminController");
const upload = require("../middleware/uploadMiddleware");
const { protect, admin } = require("../middleware/authMiddleware");

// Aplicar protección a todas las rutas
router.use(protect, admin);

// (POST /api/admin/products) - Crear
router.post("/products", upload.single("image"), createProduct);

// @route   POST /api/admin/promotions (Crear)
router.post("/", promotionController.createPromotion);

// (POST /api/admin/cotizacion) - Crear
router.post("/cotizacion", createCotizacion);

// (DELETE /api/admin/products/:id) - Borrar
router.delete("/products/:id", deleteProduct);

// @route   PUT /api/admin/promotions/:id (Editar)
router.put("/:id", promotionController.updatePromotion);

// @route   DELETE /api/admin/promotions/:id (Eliminar)
router.delete("/:id", promotionController.deletePromotion);

// (PUT /api/admin/products/:id) - Actualizar
router.put("/products/:id", upload.single("image"), updateProduct); // <-- AÑADIR ESTA LÍNEA

// (PUT /api/admin/cotizacion/:id) - Actualizar
router.put("/cotizacion/:id", updateCotizacion); // <-- AÑADIR ESTA LÍNEA

// (DELETE /api/admin/cotizacion/:id) - Borrar
router.delete("/cotizacion/:id", deleteCotizacion);

module.exports = router;

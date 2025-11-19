const express = require("express");
const router = express.Router();
const {
  getAllProducts, // <-- Importar
  getAccesorios,
  getSmartphones,
  getOfertas, // <-- Importar
  getNuevos,
  getUsados,
  getReacondicionados,
  getExhibicion,
  getProductById,
} = require("../controllers/productController");

// Rutas específicas
router.get("/", getAllProducts); // <-- Ruta para TODOS los productos
router.get("/accesorios", getAccesorios);
router.get("/accesorios", getSmartphones);
router.get("/ofertas", getOfertas); // <-- Ruta para Ofertas
router.get("/nuevos", getNuevos); // Ruta para productos Nuevos
router.get("/usados", getUsados); // Ruta para productos Usados
router.get("/reacondicionados", getReacondicionados); // Ruta para productos Reacondicionados
router.get("/exhibicion", getExhibicion); // Ruta para productos de Exhibicion

// IMPORTANTE: La ruta dinámica /:id DEBE ir al final.
// De lo contrario, Express pensará que "promociones" es un "id".
router.get("/:id", getProductById);

module.exports = router;

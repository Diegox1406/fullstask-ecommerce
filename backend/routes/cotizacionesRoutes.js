const express = require("express");
const router = express.Router();
const {
  getAllCotizaciones,
  getCotizacionById,
} = require("../controllers/cotizacionController");

// Public routes - anyone can read cotizaciones
router.get("/", getAllCotizaciones);
router.get("/:id", getCotizacionById);

module.exports = router;

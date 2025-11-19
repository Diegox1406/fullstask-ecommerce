const Cotizacion = require("../models/Cotizacion");

// @desc    Obtener TODOS los celulares cotizables
// @route   GET /api/cotizaciones
exports.getAllCotizaciones = async (req, res) => {
  try {
    const cotizaciones = await Cotizacion.find({}); // Un objeto vacío {} trae todo
    res.json(cotizaciones);
  } catch (error) {
    res.status(500).json({ message: "Error del servidor" });
  }
};

// ---  LEER POR ID (¡NUEVO!) ---
// @desc    Obtener una cotizacion por su ID
// @route   GET /api/cotizacion/:id
exports.getCotizacionById = async (req, res) => {
  try {
    const cotizacion = await Cotizacion.findById(req.params.id).populate(
      "cotizaciones",
      "marca modelo año almacenamiento condicion email"
    );

    if (!cotizacion) {
      return res.status(404).json({ message: "Cotizacion no encontrada" });
    }
    res.json(cotizacion);
  } catch (error) {
    res.status(500).json({ message: "Error del servidor" });
  }
};

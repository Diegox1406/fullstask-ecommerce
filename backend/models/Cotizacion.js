const mongoose = require("mongoose");

const CotizacionSchema = new mongoose.Schema(
  {
    marca: { type: String, required: true },
    modelo: { type: String, required: true },
    año: { type: String, required: true },
    almacenamiento: { type: String, required: true },
    estado: { type: Boolean, required: true, default: true },
    email: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Cotizacion", CotizacionSchema);

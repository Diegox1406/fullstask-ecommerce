const mongoose = require("mongoose");

// Este es el esquema para los "Combos" (ej. iPhone + Case + Cargador)
const PromotionSchema = new mongoose.Schema(
  {
    // Nombre del combo, ej: "Paquete Inicio iPhoneKey"
    name: {
      type: String,
      required: true,
      trim: true,
    },
    
    // Descripción de lo que incluye o la oferta
    description: {
      type: String,
      required: true,
    },
    
    // Aquí se guardan los IDs de los productos que componen el combo
    products: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product", // Esto le dice a Mongoose que se refiere al modelo "Product"
        required: true,
      },
    ],
    
    // El precio especial del paquete completo, ej: 2000
    promoPrice: {
      type: Number,
      required: true,
    },

    // El precio real (calculado) de los productos por separado, ej: 2350
    originalPrice: {
      type: Number,
      required: true,
    },

    // Una imagen opcional para el combo en sí
    image: {
      url: { type: String },
      public_id: { type: String },
    },
    
    // Para activar o desactivar la promoción fácilmente
    estado: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true } // Para saber cuándo fue creada/actualizada
);

module.exports = mongoose.model("Promotion", PromotionSchema);
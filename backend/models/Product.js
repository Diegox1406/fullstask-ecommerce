const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true, default: 0 },
    category: {
      type: String,
      required: true,
      enum: ["Accesorio", "Smartphone"],
    },
    image: {
      url: { type: String, required: true },
      public_id: { type: String, required: true }, // ID de Cloudinary
    },
    condicion: {
      type: String,
      required: true,
      enum: ["Nuevo", "Usado", "Reacondicionado", "Exhibicion"],
    },
    oferta: { type: Boolean, required: true, default: false },
    precioOferta: { type: Number, required: true, default: 0 },
    stock: { type: Number, required: true, default: 0 },
    estado: { type: Boolean, required: true, default: true },
  },

  { timestamps: true }
);

module.exports = mongoose.model("Product", ProductSchema);

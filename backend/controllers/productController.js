const Product = require("../models/Product");

// @desc    Obtener TODOS los productos
// @route   GET /api/products
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find({}); // Un objeto vacío {} trae todo
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Error del servidor" });
  }
};

// @desc    Obtener todos los accesorios
// @route   GET /api/products/accesorios
exports.getAccesorios = async (req, res) => {
  try {
    const accesorios = await Product.find({ category: "Accesorio" });
    res.json(accesorios);
  } catch (error) {
    res.status(500).json({ message: "Error del servidor" });
  }
};

// @desc    Obtener todas las ofertas
// @route   GET /api/products/ofertas
exports.getOfertas = async (req, res) => {
  try {
    const ofertas = await Product.find({ oferta: true });
    res.json(ofertas);
  } catch (error) {
    res.status(500).json({ message: "Error del servidor" });
  }
};

// @desc    Obtener todos los smartphones
// @route   GET /api/products/smartphones
exports.getSmartphones = async (req, res) => {
  try {
    const smartphones = await Product.find({ category: "Smartphone" });
    res.json(smartphones);
  } catch (error) {
    res.status(500).json({ message: "Error del servidor" });
  }
};

// @desc    Obtener todos los productos nuevos
// @route   GET /api/products/nuevos
exports.getNuevos = async (req, res) => {
  try {
    const nuevos = await Product.find({ condicion: "Nuevo" });
    res.json(nuevos);
  } catch (error) {
    res.status(500).json({ message: "Error del servidor" });
  }
};

// @desc    Obtener todos los productos Usados
// @route   GET /api/products/usados
exports.getUsados = async (req, res) => {
  try {
    const usados = await Product.find({ condicion: "Usado" });
    res.json(usados);
  } catch (error) {
    res.status(500).json({ message: "Error del servidor" });
  }
};

// @desc    Obtener todos los productos reacondicionados
// @route   GET /api/products/reacondicionados
exports.getReacondicionados = async (req, res) => {
  try {
    const reacondicionados = await Product.find({
      condicion: "Reacondicionado",
    });
    res.json(reacondicionados);
  } catch (error) {
    res.status(500).json({ message: "Error del servidor" });
  }
};

// @desc    Obtener todos los productos de exhibicion
// @route   GET /api/products/exhibicion
exports.getExhibicion = async (req, res) => {
  try {
    const exhibicion = await Product.find({ condicion: "Exhibicion" });
    res.json(exhibicion);
  } catch (error) {
    res.status(500).json({ message: "Error del servidor" });
  }
};

// @desc    Search products by name and description
// @route   GET /api/products/search
exports.searchProducts = async (req, res) => {
  try {
    const { q } = req.query;

    if (!q || q.trim().length === 0) {
      return res.status(400).json({ message: "Query parameter is required" });
    }

    const products = await Product.find({
      $and: [
        { estado: true }, // Only search active products
        {
          $or: [
            { name: { $regex: q, $options: "i" } }, // Search in name
            { description: { $regex: q, $options: "i" } }, // Search in description
          ],
        },
      ],
    }).limit(20); // Increased limit since we're searching more fields

    res.json(products);
  } catch (error) {
    console.error("Search error:", error);
    res.status(500).json({
      message: "Error searching products",
      error: error.message,
    });
  }
};

// @desc    Obtener un producto por ID
// @route   GET /api/products/:id
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: "Producto no encontrado" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error del servidor" });
  }
};

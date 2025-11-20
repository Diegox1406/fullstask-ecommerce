const Product = require("../models/Product");
const Promotion = require("../models/Promotion");
const cloudinary = require("../config/cloudinary");
const Cotizacion = require("../models/Cotizacion");

// @desc    Crear un nuevo producto
// @route   POST /api/admin/products
exports.createProduct = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "Por favor, sube una imagen." });
  }

  const { name, description, price, category, condicion, stock } = req.body;

  try {
    const product = new Product({
      name,
      description,
      price: Number(price),
      category,
      condicion,
      stock: Number(stock),
      estado: true, // Por defecto activo
      image: {
        url: req.file.path, // URL de Cloudinary
        public_id: req.file.filename, // ID público de Cloudinary
      },
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    // --- MANEJO DE ERROR MEJORADO ---
    // 1. Muestra el error en tu terminal (para ti)
    console.error("ERROR DETALLADO AL CREAR PRODUCTO:", error);

    // 2. Envía un JSON limpio a Postman
    res.status(500).json({
      message: "Error interno al guardar el producto. Revisa la consola.",
      error: error.message, // Este es el mensaje de error real
    });
  }
};

// @desc    Eliminar un producto
// @route   DELETE /api/admin/products/:id
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }

    // 1. Borrar imagen de Cloudinary
    await cloudinary.uploader.destroy(product.image.public_id);

    // 2. Borrar producto de MongoDB (Forma moderna)
    await product.deleteOne();

    res.json({ message: "Producto eliminado" });
  } catch (error) {
    // --- MANEJO DE ERROR MEJORADO ---
    console.error("ERROR AL ELIMINAR PRODUCTO:", error);
    res.status(500).json({
      message: "Error al eliminar producto",
      error: error.message,
    });
  }
};

// @desc    Actualizar un producto
// @route   PUT /api/admin/products/:id
exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }

    // Actualizar los campos de texto
    product.name = req.body.name || product.name;
    product.description = req.body.description || product.description;
    product.price = req.body.price ? Number(req.body.price) : product.price;
    product.category = req.body.category || product.category;
    product.condicion = req.body.condicion || product.condicion;
    product.stock = req.body.stock ? Number(req.body.stock) : product.stock;
    product.estado =
      req.body.estado !== undefined ? req.body.estado : product.estado;

    // --- Manejo de la Imagen (Importante) ---
    if (req.file) {
      // 1. Borrar la imagen ANTIGUA de Cloudinary
      await cloudinary.uploader.destroy(product.image.public_id);

      // 2. Actualizar con la información de la NUEVA imagen
      product.image = {
        url: req.file.path,
        public_id: req.file.filename,
      };
    }

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } catch (error) {
    // --- MANEJO DE ERROR MEJORADO ---
    console.error("ERROR AL ACTUALIZAR PRODUCTO:", error);
    res.status(500).json({
      message: "Error al actualizar producto",
      error: error.message,
    });
  }
};

// @desc    Crear un nuevo cotizable
// @route   POST /api/admin/cotizacion
exports.createCotizacion = async (req, res) => {
  if (!req.body) {
    return res.status(400).json({
      message:
        "El cuerpo de la solicitud está vacío o no fue recibido correctamente.",
    });
  }

  const { marca, modelo, año, almacenamiento, precioModelo, estado } = req.body;

  try {
    const cotizacion = new Cotizacion({
      marca,
      modelo,
      año,
      almacenamiento,
      precioModelo,
      estado: true, // activo por defecto
    });

    const createdCotizacion = await cotizacion.save();
    res.status(201).json(createdCotizacion);
  } catch (error) {
    // --- MANEJO DE ERROR MEJORADO ---
    // 1. Muestra el error en tu terminal (para ti)
    console.error("ERROR DETALLADO AL CREAR COTIZABLE:", error);

    // 2. Envía un JSON limpio a Postman
    res.status(500).json({
      message: "Error interno al guardar el cotizable. Revisa la consola.",
      error: error.message, // Este es el mensaje de error real
    });
  }
};

// @desc    Crear una nueva promoción (combo)
// @route   POST /api/admin/promotions
exports.createPromotion = async (req, res) => {
  const { name, description, products, promoPrice } = req.body;

  if (!name || !description || !products || !promoPrice) {
    return res.status(400).json({ message: "Faltan campos obligatorios" });
  }
  if (!Array.isArray(products) || products.length === 0) {
    return res.status(400).json({
      message: "El campo 'products' debe ser un array de IDs no vacío",
    });
  }

  try {
    const productsInDb = await Product.find({ _id: { $in: products } });
    if (productsInDb.length !== products.length) {
      return res
        .status(404)
        .json({ message: "Uno o más productos no fueron encontrados" });
    }

    const originalPrice = productsInDb.reduce(
      (sum, product) => sum + product.price,
      0
    );

    const newPromotion = new Promotion({
      name,
      description,
      products,
      promoPrice,
      originalPrice,
    });

    const savedPromotion = await newPromotion.save();
    res.status(201).json(savedPromotion);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al crear la promoción", error });
  }
};

// --- EDITAR (¡NUEVO!) ---
// @desc    Actualizar (Editar) una promoción
// @route   PUT /api/admin/promotions/:id
exports.updatePromotion = async (req, res) => {
  try {
    const { name, description, products, promoPrice, estado } = req.body;

    // Preparamos el objeto con los datos a actualizar
    const updateData = {
      name,
      description,
      promoPrice,
      estado,
      products,
    };

    // Si el admin está cambiando los productos, recalculamos el precio original
    if (products && Array.isArray(products)) {
      if (products.length === 0) {
        return res
          .status(400)
          .json({ message: "El array de productos no puede estar vacío" });
      }

      const productsInDb = await Product.find({ _id: { $in: products } });
      if (productsInDb.length !== products.length) {
        return res
          .status(404)
          .json({ message: "Uno o más productos no fueron encontrados" });
      }
      // Sobreescribimos el precio original con el nuevo cálculo
      updateData.originalPrice = productsInDb.reduce(
        (sum, product) => sum + product.price,
        0
      );
    }

    // Buscamos y actualizamos la promoción
    const updatedPromotion = await Promotion.findByIdAndUpdate(
      req.params.id,
      { $set: updateData }, // $set actualiza solo los campos que vienen en updateData
      { new: true } // {new: true} hace que nos devuelva el documento actualizado
    );

    if (!updatedPromotion) {
      return res.status(404).json({ message: "Promoción no encontrada" });
    }

    res.json(updatedPromotion);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Error al actualizar la promoción", error });
  }
};

// --- ELIMINAR (¡NUEVO!) ---
// @desc    Eliminar (desactivar) una promoción
// @route   DELETE /api/admin/promotions/:id
exports.deletePromotion = async (req, res) => {
  try {
    // Esto es un "soft delete". No la borramos, solo la desactivamos.
    // Es más seguro y puedes "restaurarla" en el futuro.
    const deletedPromotion = await Promotion.findByIdAndUpdate(
      req.params.id,
      { estado: false }, // Simplemente cambiamos el estado
      { new: true }
    );

    if (!deletedPromotion) {
      return res.status(404).json({ message: "Promoción no encontrada" });
    }

    res.json({ message: "Promoción desactivada exitosamente" });
  } catch (error) {
    res.status(500).json({ message: "Error al eliminar la promoción", error });
  }
};

// @desc    Eliminar una cotizacion
// @route   DELETE /api/admin/cotizacion/:id
exports.deleteCotizacion = async (req, res) => {
  try {
    const cotizacion = await Cotizacion.findById(req.params.id);

    if (!cotizacion) {
      return res.status(404).json({ message: "Cotizable no encontrado" });
    }

    // 2. Borrar la cotizacion de MongoDB (Forma moderna)
    await cotizacion.deleteOne();

    res.json({ message: "Cotizable eliminado" });
  } catch (error) {
    // --- MANEJO DE ERROR MEJORADO ---
    console.error("ERROR AL ELIMINAR COTIZABLE:", error);
    res.status(500).json({
      message: "Error al eliminar cotizable",
      error: error.message,
    });
  }
};

// @desc    Actualizar una cotizacion
// @route   PUT /api/admin/cotizacion/:id
exports.updateCotizacion = async (req, res) => {
  try {
    const cotizacionToUpdate = await Cotizacion.findById(req.params.id);

    if (!cotizacionToUpdate) {
      return res.status(404).json({ message: "Cotizacion no encontrada" });
    }

    // Actualizar los campos (email removed)
    cotizacionToUpdate.marca = req.body.marca || cotizacionToUpdate.marca;
    cotizacionToUpdate.modelo = req.body.modelo || cotizacionToUpdate.modelo;
    cotizacionToUpdate.año = req.body.año || cotizacionToUpdate.año;
    cotizacionToUpdate.almacenamiento =
      req.body.almacenamiento || cotizacionToUpdate.almacenamiento;
    cotizacionToUpdate.precioModelo =
      req.body.precioModelo || cotizacionToUpdate.precioModelo;
    cotizacionToUpdate.estado =
      req.body.estado !== undefined
        ? req.body.estado
        : cotizacionToUpdate.estado;

    const updatedCotizacion = await cotizacionToUpdate.save();
    res.json(updatedCotizacion);
  } catch (error) {
    console.error("ERROR AL ACTUALIZAR COTIZACION:", error);
    res.status(500).json({
      message: "Error al actualizar cotizacion",
      error: error.message,
    });
  }
};

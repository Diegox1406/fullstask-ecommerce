const express = require("express");
const dotenv = require("dotenv");

dotenv.config();
// ==========================================================

const connectDB = require("./config/db");
const cors = require("cors");

// Importar rutas
const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");
const adminRoutes = require("./routes/adminRoutes");
const promotionRoutes = require("./routes/promotionRoutes");
const cotizacionesRoutes = require("./routes/cotizacionesRoutes");

// Conectar a la base de datos
connectDB();

const app = express();

// Middlewares
app.use(cors()); // Habilitar CORS
app.use(express.json()); // Para parsear JSON
app.use(express.urlencoded({ extended: true })); // Para parsear form-data

// Rutas API
app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/products", productRoutes);
app.use("/api/promotions", promotionRoutes);
app.use("/api/cotizaciones", cotizacionesRoutes);

// Ruta de prueba
app.get("/", (req, res) => {
  res.send("API del backend funcionando...");
});

// ==========================================================
//           MIDDLEWARE GLOBAL DE MANEJO DE ERRORES
// ==========================================================
// Este middleware atrapará CUALQUIER error que ocurra en la app,
// incluido el error de Multer/Cloudinary, y lo formateará como JSON.
// ¡Debe ir DESPUÉS de todas tus rutas!
// ==========================================================
app.use((err, req, res, next) => {
  // Imprime el error completo en la consola (para ti)
  console.error("--- ERROR GLOBAL ATRAPADO ---");
  console.error(err);
  console.error("-----------------------------");

  // Responde a Postman con un JSON limpio
  res.status(err.status || 500).json({
    message: err.message || "Error interno del servidor.",
    // Si estamos en desarrollo, podemos enviar más detalles
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
});
// ==========================================================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});

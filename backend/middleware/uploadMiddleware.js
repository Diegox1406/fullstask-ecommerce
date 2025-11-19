const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");

// Configura el almacenamiento en Cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "mi-tienda-app", // Carpeta en Cloudinary donde se guardarán
    allowed_formats: ["jpg", "png", "jpeg", "webp"],
  },
});

// Inicializa Multer con el almacenamiento de Cloudinary
const upload = multer({ storage: storage });

module.exports = upload;

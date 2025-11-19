const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Middleware para proteger rutas (requiere inicio de sesión)
const protect = async (req, res, next) => {
  let token;

  // 1. Leer el token del header "Authorization"
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // 2. Obtener el token (quitando "Bearer ")
      token = req.headers.authorization.split(' ')[1];

      // 3. Verificar el token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // 4. Obtener el usuario desde la DB y adjuntarlo a 'req'
      // Excluimos la contraseña de la información del usuario
      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
         return res.status(401).json({ message: 'No autorizado, usuario no encontrado' });
      }

      next(); // Continuar a la siguiente función (el controlador)
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: 'No autorizado, token inválido' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'No autorizado, no hay token' });
  }
};

// Middleware para verificar si el usuario es Admin
const admin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next(); // Es admin, continuar
  } else {
    res.status(403).json({ message: 'No autorizado como administrador' });
  }
};

module.exports = { protect, admin };
import jwt from 'jsonwebtoken';

// Middleware para verificar el token JWT
export const verifyToken = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', ''); // Espera que el token esté en el header Authorization como "Bearer token"

  if (!token) {
    return res.status(403).json({ error: 'Access denied, no token provided' });
  }

  try {
    // Verificar el token con el secreto
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Se guarda la información del usuario en la solicitud para usarla en otras rutas
    next(); // Si todo es correcto, continúa con el siguiente middleware o controlador
  } catch (error) {
    return res.status(400).json({ error: 'Invalid token' });
  }
};

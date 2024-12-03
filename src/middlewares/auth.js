import jwt from 'jsonwebtoken';

// Middleware para verificar el token JWT
export const verifyToken = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', ''); // Obtener el token del header Authorization

  if (!token) {
    return res.status(403).json({ error: 'Access denied, no token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Guardar la información del usuario decodificado en la solicitud
    next(); // Continuar con el siguiente middleware o controlador
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expired, please log in again' });
    } else if (error.name === 'JsonWebTokenError') {
      return res.status(400).json({ error: 'Invalid token, authentication failed' });
    } else {
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
};

// Middleware para verificar si el usuario es administrador
export const authenticateAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Access denied, insufficient privileges' });
  }
  next(); // Si el usuario tiene el rol adecuado, continúa con el siguiente middleware o controlador
};

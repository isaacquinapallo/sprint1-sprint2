import jwt from 'jsonwebtoken';

// Crear token
const createToken = (userInfo) => {
  return jwt.sign(userInfo, process.env.JWT_SECRET, { expiresIn: '1h' });
};

// Verificar token
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer')) {
    return res.status(401).json({ message: 'Token no proporcionado' });
  }
  const token = authHeader.split(' ')[1];
  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: 'Fallo al autenticar el token' });
    }
    req.user = decoded;  // Almacenamos los datos del usuario en `req.user`
    next();
  });
};

// Verificar si el usuario es administrador
const verifyAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'No autorizado, solo administradores' });
  }
  next();
};

export { createToken, verifyToken, verifyAdmin };

import { createAdmin, validateAdmin } from '../models/adminModel.js';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your_secret_key'; // Asegúrate de tener esta variable de entorno

// Función para registrar un nuevo administrador
export const registerAdmin = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'El nombre de usuario y la contraseña son obligatorios' });
  }

  try {
    const newAdmin = await createAdmin(username, password);
    res.status(201).json({ message: 'Administrador registrado exitosamente', admin: newAdmin });
  } catch (error) {
    res.status(500).json({ message: 'Error al registrar al administrador', error });
  }
};

// Función para iniciar sesión y generar el token JWT
export const loginAdmin = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'El nombre de usuario y la contraseña son obligatorios' });
  }

  try {
    const admin = await validateAdmin(username, password);
    
    if (!admin) {
      return res.status(401).json({ message: 'Credenciales incorrectas' });
    }

    // Generar el token JWT
    const token = jwt.sign({ id: admin.id, username: admin.username }, JWT_SECRET, { expiresIn: '1h' });

    res.status(200).json({ message: 'Inicio de sesión exitoso', token });
  } catch (error) {
    res.status(500).json({ message: 'Error al iniciar sesión', error });
  }
};

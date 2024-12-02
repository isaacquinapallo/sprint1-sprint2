import adminModel from '../models/adminModel.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

// Registro de un administrador
export const registerAdmin_controller = async (req, res) => {
  const { name, email, password } = req.body;

  // Verificar si el administrador ya existe
  const existingAdmin = await adminModel.getAdminByEmail(email);
  if (existingAdmin) {
    return res.status(400).json({ error: "El administrador ya existe." });
  }

  // Hashear la contraseña
  const hashedPassword = await bcrypt.hash(password, 10);

  // Registrar el nuevo administrador
  const newAdmin = { name, email, password: hashedPassword };
  const admin = await adminModel.registerAdmin_model(newAdmin);

  res.status(201).json(admin);
};

// Login de administrador
export const loginAdmin_controller = async (req, res) => {
  const { email, password } = req.body;

  const admin = await adminModel.loginAdmin_model(email, password);
  if (admin.error) {
    return res.status(400).json(admin);
  }

  // Crear token JWT
  const token = jwt.sign({ id: admin.id, name: admin.name }, process.env.JWT_SECRET, { expiresIn: '1h' });

  res.status(200).json({ token });
};

// Obtener un administrador por su ID
export const getAdmin_controller = async (req, res) => {
  const { id } = req.params;
  const admin = await adminModel.getAdminById(id);

  if (!admin) {
    return res.status(404).json({ error: "Administrador no encontrado." });
  }

  res.status(200).json(admin);
};

// Controlador para eliminar un administrador por su ID
export const deleteAdmin_controller = async (req, res) => {
  const { id } = req.params; // Obtener el ID del administrador desde los parámetros de la URL

  // Buscar al administrador en la "base de datos" (en este caso, usando el modelo)
  const admin = await adminModel.getAdminById(id);

  if (!admin) {
    return res.status(404).json({ error: "Administrador no encontrado." });
  }

  // Eliminar el administrador de la "base de datos"
  const result = await adminModel.deleteAdminById(id);
  if (result) {
    return res.status(200).json({ message: `Administrador con ID ${id} eliminado correctamente.` });
  } else {
    return res.status(500).json({ error: "Hubo un error al eliminar al administrador." });
  }
};


// Controlador para actualizar un administrador por su ID
export const updateAdmin_controller = async (req, res) => {
  const { id } = req.params;
  const { name, email } = req.body; // Los campos que deseas actualizar

  // Buscar el administrador por ID
  const admin = await adminModel.getAdminById(id);

  if (!admin) {
    return res.status(404).json({ error: "Administrador no encontrado." });
  }

  // Actualizar la información del administrador
  const updatedAdmin = await adminModel.updateAdminById(id, { name, email });

  if (updatedAdmin) {
    return res.status(200).json({ message: "Administrador actualizado correctamente.", updatedAdmin });
  } else {
    return res.status(500).json({ error: "Hubo un error al actualizar al administrador." });
  }
};

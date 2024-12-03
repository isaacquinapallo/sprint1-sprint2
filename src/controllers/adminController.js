import adminModel from '../models/adminModel.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import fs from 'fs/promises';
import { v4 as uuidv4 } from 'uuid'; // Importar uuid
import pkg from 'cloudinary';
const { v2: cloudinary } = pkg;

//---------------------------------------------------------------------------------------------------
// Registrar un nuevo administrador
export const registerAdmin_controller = async (req, res) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password || !role) {
    return res.status(400).json({ error: "Todos los campos son obligatorios (name, email, password, role)." });
  }

  const existingAdmin = await adminModel.getAdminByEmail(email);
  if (existingAdmin) {
    return res.status(400).json({ error: "El administrador ya existe." });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    let avatar = null;
    let public_id = null;

    if (req.file) {
      const uploadResult = await cloudinary.uploader.upload(req.file.path, { folder: "admins" });
      avatar = uploadResult.secure_url;
      public_id = uploadResult.public_id;
    }

    const newAdmin = {
      id: uuidv4(),
      name,
      email,
      password: hashedPassword,
      role,
      avatar,
      public_id,
    };

    // Guardar en base de datos
    const dbData = JSON.parse(await fs.readFile('db.json', 'utf-8'));
    const admins = dbData.admins || [];
    admins.push(newAdmin);

    dbData.admins = admins;
    await fs.writeFile('db.json', JSON.stringify(dbData, null, 2));

    res.status(201).json(newAdmin);
  } catch (error) {
    console.error("Error en el registro del administrador:", error);
    res.status(500).json({ error: "Error al registrar el administrador", details: error.message });
  }
};

//---------------------------------------------------------------------------------------------------
// Login de administrador
export const loginAdmin_controller = async (req, res) => {
  const { email, password } = req.body;

  try {
    const admin = await adminModel.loginAdmin_model(email, password);
    if (admin.error) {
      return res.status(400).json(admin);
    }

    const token = jwt.sign(
      { id: admin.id, name: admin.name, role: admin.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(200).json({ token });
  } catch (error) {
    console.error("Error en el login del administrador:", error);
    res.status(500).json({ error: "Error al iniciar sesión", details: error.message });
  }
};

//---------------------------------------------------------------------------------------------------
// Obtener un administrador por su ID
export const getAdmin_controller = async (req, res) => {
  const { id } = req.params;

  try {
    const admin = await adminModel.getAdminById(id);
    if (!admin) {
      return res.status(404).json({ error: "Administrador no encontrado." });
    }

    res.status(200).json(admin);
  } catch (error) {
    console.error("Error al obtener el administrador:", error);
    res.status(500).json({ error: "Error al obtener el administrador", details: error.message });
  }
};

//---------------------------------------------------------------------------------------------------
// Eliminar un administrador por su ID
export const deleteAdmin_controller = async (req, res) => {
  const { id } = req.params;

  try {
    const admin = await adminModel.getAdminById(id);
    if (!admin) {
      return res.status(404).json({ error: "Administrador no encontrado." });
    }

    if (admin.public_id) {
      await cloudinary.uploader.destroy(admin.public_id);
    }

    const result = await adminModel.deleteAdminById(id);
    if (result) {
      res.status(200).json({ message: `Administrador con ID ${id} eliminado correctamente.` });
    } else {
      res.status(500).json({ error: "Hubo un error al eliminar al administrador." });
    }
  } catch (error) {
    console.error("Error al eliminar el administrador:", error);
    res.status(500).json({ error: "Error al eliminar al administrador", details: error.message });
  }
};

//---------------------------------------------------------------------------------------------------
// Actualizar un administrador por su ID
export const updateAdmin_controller = async (req, res) => {
  const { id } = req.params;
  const { name, email, password, role } = req.body;

  try {
    const admin = await adminModel.getAdminById(id);
    if (!admin) {
      return res.status(404).json({ error: "Administrador no encontrado." });
    }

    let hashedPassword = null;
    if (password) {
      hashedPassword = await bcrypt.hash(password, 10);
    }

    let avatar = admin.avatar;
    let public_id = admin.public_id;

    if (req.file) {
      if (public_id) {
        await cloudinary.uploader.destroy(public_id);
      }

      const cloudinaryResponse = await cloudinary.uploader.upload(req.file.path, { folder: "admins" });
      avatar = cloudinaryResponse.secure_url;
      public_id = cloudinaryResponse.public_id;
    }

    const updatedAdmin = await adminModel.updateAdminById(id, {
      name,
      email,
      role,
      avatar,
      public_id,
      ...(hashedPassword && { password: hashedPassword }),
    });

    if (updatedAdmin) {
      res.status(200).json({ message: "Administrador actualizado correctamente.", updatedAdmin });
    } else {
      res.status(500).json({ error: "Hubo un error al actualizar al administrador." });
    }
  } catch (error) {
    console.error("Error al actualizar el administrador:", error);
    res.status(500).json({ error: error.message });
  }
};

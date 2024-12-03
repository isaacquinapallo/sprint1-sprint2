import adminModel from '../models/adminModel.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';  // Importar uuid
import cloudinary from 'cloudinary';

export const registerAdmin_controller = async (req, res) => {
  const { name, email, password } = req.body;

  // Validación de los campos requeridos
  if (!name || name.trim() === "") {
    return res.status(400).json({ error: "El nombre es requerido." });
  }

  // Verificación si el administrador ya existe
  const existingAdmin = await adminModel.getAdminByEmail(email);
  if (existingAdmin) {
    return res.status(400).json({ error: "El administrador ya existe." });
  }

  try {
    // Hashear la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Subida de imagen de avatar a Cloudinary
    let avatar = null;
    let public_id = null;

    // Verificar si existe una imagen en el formulario
    if (req.body.imageUrl) {
      avatar = req.body.imageUrl;
      public_id = req.body.public_id;
    }

    // Crear el objeto del nuevo administrador
    const newAdmin = { id: uuidv4(), name, email, password: hashedPassword, avatar, public_id };

    // Registro del nuevo administrador en la base de datos (db.json)
    const dbData = JSON.parse(fs.readFileSync('db.json', 'utf-8'));
    const admins = dbData.admins || []; // Obtener admins o inicializar como array vacío

    admins.push(newAdmin);

    // Guardar de nuevo en db.json
    dbData.admins = admins;
    fs.writeFileSync('db.json', JSON.stringify(dbData, null, 2));

    // Devolver la respuesta con el nuevo administrador creado
    res.status(201).json(newAdmin);
  } catch (error) {
    console.error("Error en el registro del administrador:", error);
    res.status(500).json({
      error: "Error al registrar el administrador",
      details: error.message,
    });
  }
};


//---------------------------------------------------------------------------------------------------
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

//---------------------------------------------------------------------------------------------------
// Obtener un administrador por su ID
export const getAdmin_controller = async (req, res) => {
  const { id } = req.params;
  const admin = await adminModel.getAdminById(id);

  if (!admin) {
    return res.status(404).json({ error: "Administrador no encontrado." });
  }

  res.status(200).json(admin);
};

//---------------------------------------------------------------------------------------------------
// Controlador para eliminar un administrador por su ID
export const deleteAdmin_controller = async (req, res) => {
  const { id } = req.params;

  try {
    const admin = await adminModel.getAdminById(id);
    if (!admin) {
      return res.status(404).json({ error: "Administrador no encontrado." });
    }

    if (admin.public_id) {
      await cloudinary.uploader.destroy(admin.public_id); // Eliminar imagen de Cloudinary
    }

    const result = await adminModel.deleteAdminById(id);
    if (result) {
      return res.status(200).json({ message: `Administrador con ID ${id} eliminado correctamente.` });
    } else {
      return res.status(500).json({ error: "Hubo un error al eliminar al administrador." });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al eliminar al administrador." });
  }
};

//---------------------------------------------------------------------------------------------------
// Controlador para actualizar un administrador por su ID
export const updateAdmin_controller = async (req, res) => {
  const { id } = req.params;
  const { name, email, password } = req.body;

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

    // Si se sube una nueva imagen, reemplazar la anterior en Cloudinary
    if (req.files?.imagen) {
      if (public_id) {
        await cloudinary.uploader.destroy(public_id); // Eliminar imagen anterior
      }

      const cloudinaryResponse = await cloudinary.uploader.upload(req.files.imagen.tempFilePath, {
        folder: "admins",
      });
      avatar = cloudinaryResponse.secure_url;
      public_id = cloudinaryResponse.public_id;
      await fs.unlink(req.files.imagen.tempFilePath); // Eliminar archivo temporal
    }

    // Actualizar la información del administrador
    const updatedAdmin = await adminModel.updateAdminById(id, {
      name,
      email,
      avatar,
      public_id,
      ...(hashedPassword && { password: hashedPassword }),
    });

    if (updatedAdmin) {
      return res.status(200).json({
        message: "Administrador actualizado correctamente.",
        updatedAdmin,
      });
    } else {
      return res.status(500).json({ error: "Hubo un error al actualizar al administrador." });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

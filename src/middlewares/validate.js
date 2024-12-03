import { body, validationResult } from 'express-validator';
import multer from 'multer';
import path from 'path';  // Importar el módulo 'path' para manejar rutas de archivos
import { cloudinary } from '../server.js';  // Importar configuración de Cloudinary

// Configuración de almacenamiento para multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');  // Directorio donde se almacenarán los archivos
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));  // Establecer el nombre del archivo
  }
});

// Crear el middleware de multer para cargar un solo archivo
const upload = multer({ storage });

// Middleware para subir la imagen a Cloudinary
export const uploadImage = async (req, res, next) => {
  if (req.file) {
    try {
      const result = await cloudinary.uploader.upload(req.file.path);
      req.body.imageUrl = result.secure_url;  // Guardar la URL de la imagen en la base de datos
      req.body.public_id = result.public_id;  // Guardar public_id para eliminar después si es necesario
    } catch (error) {
      console.error("Error al subir a Cloudinary:", error);  // Imprimir el error detallado
      return res.status(500).json({ error: `Error al subir la imagen a Cloudinary: ${error.message}` });
    }
  }
  next();  // Continuar con la siguiente operación (validación de campos)
};

// Middleware para validar los datos del formulario de registro
export const validateRegistration = [
  upload.single('imagen'),  // 'imagen' es el campo del formulario para la imagen
  uploadImage,  // Middleware que sube la imagen a Cloudinary
  body('name')
    .notEmpty().withMessage('El nombre es obligatorio y no puede estar vacío')
    .trim(),
  body('email')
    .isEmail().withMessage('Por favor, proporcione una dirección de correo electrónico válida'),
  body('password')
    .isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres'),
  (req, res, next) => {
    // Si hay errores en la validación, los devuelve
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();  // Si no hay errores, pasa al siguiente middleware o controlador
  }
];

// Middleware para validar los datos de inicio de sesión
export const validateLogin = [
  body('email')
    .isEmail().withMessage('Por favor, proporcione una dirección de correo electrónico válida'),
  body('password')
    .notEmpty().withMessage('La contraseña es obligatoria'),
  (req, res, next) => {
    // Si hay errores en la validación, los devuelve
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();  // Si no hay errores, pasa al siguiente middleware o controlador
  }
];

// Middleware para validar los datos de actualización (por ejemplo, para estudiantes o administradores)
export const validateUpdate = [
  body('email')
    .optional()
    .isEmail().withMessage('Por favor, proporcione una dirección de correo electrónico válida'),
  body('password')
    .optional()
    .isLength({ min: 6 }).withMessage('La contraseña debe tener al menos 6 caracteres'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();  // Si no hay errores, pasa al siguiente middleware o controlador
  }
];

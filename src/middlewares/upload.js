import multer from 'multer';
import pkg from 'cloudinary'; // Importar cloudinary como CommonJS
import { CloudinaryStorage } from 'multer-storage-cloudinary';

const { v2: cloudinary } = pkg; // Extraer `v2` de `pkg` para compatibilidad

// Configurar almacenamiento en Cloudinary
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'careers', // Carpeta donde se almacenarán las imágenes
    allowed_formats: ['jpg', 'jpeg', 'png'], // Formatos permitidos
    use_filename: true, // Usar el nombre original del archivo
    unique_filename: true, // Asegurarse de que los nombres sean únicos
    resource_type: 'image', // Definir el tipo de recurso como imagen
  },
});

// Configurar middleware de multer
const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // Límite de tamaño de archivo: 5MB
  },
  fileFilter: (req, file, cb) => {
    // Validar el tipo de archivo
    if (!file.mimetype.startsWith('image/')) {
      return cb(new Error('Solo se permiten archivos de imagen'), false);
    }
    cb(null, true);
  },
});

// Manejar errores de Multer
const handleMulterErrors = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    // Errores específicos de multer
    return res.status(400).json({ error: `Error al subir el archivo: ${err.message}` });
  } else if (err) {
    // Otros errores
    return res.status(400).json({ error: err.message });
  }
  next();
};

export { upload, handleMulterErrors };

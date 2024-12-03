import express from 'express';
import dotenv from 'dotenv';
import adminRoutes from './routes/adminRoutes.js';
import careersRoutes from './routes/careersRoutes.js';
import studentsRoutes from './routes/studentsRoutes.js';
import cloudinary from 'cloudinary'; // Importar como CommonJS

const { v2: cloudinaryV2 } = cloudinary; // Extraer `v2` para la configuración

// Cargar variables de entorno
dotenv.config();

// Configurar Cloudinary
cloudinaryV2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Verificar configuración de variables de entorno
console.log('JWT_SECRET:', process.env.JWT_SECRET);
console.log('Cloudinary Config:', {
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Crear instancia de Express
const app = express();

// Establecer puerto
app.set('port', process.env.PORT || 3000);

// Middleware para analizar JSON
app.use(express.json());

// Configurar rutas
app.use('/api', adminRoutes);
app.use('/api', careersRoutes);
app.use('/api', studentsRoutes);

// Manejar rutas no encontradas
app.use((req, res) => res.status(404).json({ error: 'Endpoint no encontrado - 404' }));

// Exportar Cloudinary configurado y la app de Express
export { cloudinaryV2 as cloudinary };
export default app;

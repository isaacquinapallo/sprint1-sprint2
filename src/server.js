import express from 'express';
import dotenv from 'dotenv';
import adminRoutes from './routes/adminRoutes.js';
import careersRoutes from './routes/careersRoutes.js';
import studentsRoutes from './routes/studentsRoutes.js';
import { v2 as cloudinary } from 'cloudinary';

// Cargar variables de entorno
dotenv.config();

// Cargar cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Verificar si JWT_SECRET está configurado correctamente
console.log('JWT_SECRET:', process.env.JWT_SECRET);
//tambien el cloudinary
console.log("Cloudinary Config:", {
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const app = express();

// Variables
app.set('port',process.env.port || 3000)

// Middleware para analizar JSON
app.use(express.json());

// Rutas
app.use('/api', adminRoutes);
app.use('/api', careersRoutes);
app.use('/api', studentsRoutes);

// Manejo de una ruta que no sea encontrada
app.use((req,res)=>res.status(404).send("Endpoint no encontrado - 404"))

// Export nombrado para `cloudinary`
export { cloudinary };

// Export por defecto para `app`
export default app;
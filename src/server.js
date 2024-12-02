import express from 'express';
import dotenv from 'dotenv';
import adminRoutes from './routes/adminRoutes.js';
import careersRoutes from './routes/careersRoutes.js';
import studentsRoutes from './routes/studentsRoutes.js';

// Cargar variables de entorno
dotenv.config();

// Verificar si JWT_SECRET está configurado correctamente
console.log('JWT_SECRET:', process.env.JWT_SECRET);

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

export default app;

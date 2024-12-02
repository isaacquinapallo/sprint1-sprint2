import express from 'express';
import dotenv from 'dotenv';
import adminRoutes from './routes/adminRoutes.js';
import careersRoutes from './routes/careersRoutes.js';
import studentsRoutes from './routes/studentsRoutes.js';

dotenv.config();

const app = express();

// Configuración del puerto
app.set('port', process.env.PORT || 3000);

// Middleware para el parsing de JSON
app.use(express.json());

// Rutas
app.use('/admin', adminRoutes);
app.use('/careers', careersRoutes);
app.use('/students', studentsRoutes);

export default app;

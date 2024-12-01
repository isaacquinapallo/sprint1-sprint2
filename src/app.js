import dotenv from 'dotenv';
import express from 'express';
import bodyParser from 'body-parser';
import adminRoutes from './routes/adminRoutes.js';  // Ruta para el registro y login de admin

dotenv.config();
const app = express();

// Middleware para procesar JSON
app.use(bodyParser.json());

// Rutas de administración
app.use('/api/admin', adminRoutes);

// Rutas de cursos y estudiantes
app.use('/api', courseRoutes);

app.listen(3000, () => {
  console.log('Servidor corriendo en http://localhost:3000');
});

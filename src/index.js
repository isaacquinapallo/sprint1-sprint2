import express from 'express';
import adminRoutes from './routes/adminRoutes.js'; // Asegúrate de que la ruta esté correcta

const app = express();

app.use(express.json()); // Necesario para analizar el cuerpo de las solicitudes
app.use('/api', adminRoutes); // Define que las rutas de /api están en adminRoutes

const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

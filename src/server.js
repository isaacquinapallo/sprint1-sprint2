import express from 'express';
import dotenv from 'dotenv';
import routerStudent from './routers/students_routes.js';
import routerCareer from './routers/careers_routes.js';

dotenv.config();

const app = express();

// Configuración
app.set('port', process.env.PORT || 3000);

// Middlewares
app.use(express.json());

// Rutas
app.get('/', (req, res) => res.send('Server is running'));
app.use('/api', routerStudent);
app.use('/api', routerCareer);

export default app;

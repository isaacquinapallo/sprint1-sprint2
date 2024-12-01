import { Router } from 'express';
import { registerAdmin, loginAdmin } from '../controllers/adminController.js';

const router = Router();

// Ruta para el registro del administrador
router.post('/register', registerAdmin);

// Ruta para el inicio de sesión del administrador
router.post('/login', loginAdmin);

export default router;

import { Router } from 'express';
import { 
  registerAdmin_controller, 
  loginAdmin_controller, 
  updateAdmin_controller, 
  deleteAdmin_controller, 
  getAdmin_controller 
} from '../controllers/adminController.js';
import { verifyToken } from '../middlewares/auth.js';
import { validateRegistration, validateLogin, validateUpdate } from '../middlewares/validate.js';

const router = Router();

// Rutas públicas
router.post('/admins/register', validateRegistration, registerAdmin_controller);
router.post('/admins/login', validateLogin, loginAdmin_controller);

// Rutas privadas
router.get('/admins/:id', verifyToken, getAdmin_controller);
router.put('/admins/:id', verifyToken, validateUpdate, updateAdmin_controller);
router.delete('/admins/:id', verifyToken, deleteAdmin_controller);

export default router;

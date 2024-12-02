import { Router } from 'express';
import { 
  createCareer_controller, 
  getAllCareers_controller, 
  updateCareer_controller, 
  deleteCareer_controller, 
  getCareer_controller 
} from '../controllers/careersController.js';
import { verifyToken } from '../middlewares/auth.js';

const router = Router();

// Rutas públicas
router.get('/careers', getAllCareers_controller);

// Rutas privadas (requieren verificación de token JWT)
router.post('/careers', verifyToken, createCareer_controller);
router.get('/careers/:id', verifyToken, getCareer_controller);
router.put('/careers/:id', verifyToken, updateCareer_controller);
router.delete('/careers/:id', verifyToken, deleteCareer_controller);

export default router;

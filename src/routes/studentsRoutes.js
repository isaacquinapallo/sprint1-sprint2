import { Router } from 'express';
import { 
  registerStudent_controller, 
  loginStudent_controller, 
  updateStudent_controller, 
  deleteStudent_controller, 
  getStudent_controller 
} from '../controllers/studentsController.js';
import { verifyToken } from '../middlewares/auth.js';
import { validateRegistration, validateLogin, validateUpdate } from '../middlewares/validate.js';

const router = Router();

// Rutas públicas
router.post('/students/register', validateRegistration, registerStudent_controller);
router.post('/students/login', validateLogin, loginStudent_controller);

// Rutas privadas
router.get('/students/:id', verifyToken, getStudent_controller);
router.put('/students/:id', verifyToken, validateUpdate, updateStudent_controller);
router.delete('/students/:id', verifyToken, deleteStudent_controller);

export default router;

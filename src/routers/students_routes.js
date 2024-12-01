import { Router } from 'express';
import { 
  loginStudent_controller, 
  registerStudent_controller, 
  updateStudent_controller, 
  deleteStudent_controller, 
  getStudent_controller 
} from '../controllers/students_controller.js';
import { verifyToken } from '../middlewares/auth.js';

const router = Router();

// Rutas públicas
router.post('/students/register', registerStudent_controller);
router.post('/students/login', loginStudent_controller);

// Rutas privadas
router.get('/students/:id', verifyToken, getStudent_controller);
router.put('/students/:id', verifyToken, updateStudent_controller);
router.delete('/students/:id', verifyToken, deleteStudent_controller);

export default router;

import { Router } from 'express';
import {
  listCourses,
  addCourse,
  modifyCourse,
  removeCourse
} from '../controllers/courseController.js';
import { listStudents } from '../controllers/studentController.js';
import { verifyToken } from '../middlewares/auth.js';

const router = Router();

// Rutas públicas (sin autenticación)
router.get('/courses', listCourses);  // Lista todas las carreras

// Rutas privadas (requieren autenticación JWT)
router.post('/courses', verifyToken, addCourse);  // Crear carrera
router.put('/courses/:courseId', verifyToken, modifyCourse);  // Actualizar carrera
router.delete('/courses/:courseId', verifyToken, removeCourse);  // Eliminar carrera

// Listar estudiantes
router.get('/students', verifyToken, listStudents);  // Lista todos los estudiantes

export default router;

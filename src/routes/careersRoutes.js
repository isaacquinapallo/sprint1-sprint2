import express from 'express';
import { upload } from '../middlewares/upload.js'; // Corregir para named export
import { verifyToken, authenticateAdmin } from '../middlewares/auth.js';
import {
  createCareer_controller,
  updateCareer_controller,
  deleteCareer_controller,
  getCareerById_controller,
  getAllCareers_controller,
} from '../controllers/careersController.js';

const router = express.Router();

// Rutas públicas (no requieren autenticación)
router.get('/careers', getAllCareers_controller); // Obtener todas las carreras
router.get('/careers/:id', getCareerById_controller); // Obtener una carrera por ID

// Rutas protegidas (requieren autenticación y permisos de administrador)
router.post(
  '/careers',
  verifyToken,
  authenticateAdmin,
  upload.single('imagen'), // El campo debe coincidir con el nombre en el formulario
  createCareer_controller
); // Crear una carrera

router.put(
  '/careers/:id',
  verifyToken,
  authenticateAdmin,
  upload.single('imagen'), // Manejo de imagen en la actualización
  updateCareer_controller
); // Actualizar una carrera

router.delete(
  '/careers/:id',
  verifyToken,
  authenticateAdmin,
  deleteCareer_controller
); // Eliminar una carrera

export default router;

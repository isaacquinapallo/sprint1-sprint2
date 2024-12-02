import { body, validationResult } from 'express-validator';

// Middleware para validar los datos de registro de un estudiante o administrador
export const validateRegistration = [
  body('email').isEmail().withMessage('Please provide a valid email address'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
  (req, res, next) => {
    // Si hay errores en la validación, los devuelve
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next(); // Si no hay errores, pasa al siguiente middleware o controlador
  }
];

// Middleware para validar los datos de inicio de sesión
export const validateLogin = [
  body('email').isEmail().withMessage('Please provide a valid email address'),
  body('password').notEmpty().withMessage('Password is required'),
  (req, res, next) => {
    // Si hay errores en la validación, los devuelve
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next(); // Si no hay errores, pasa al siguiente middleware o controlador
  }
];

// Middleware para validar los datos de actualización (por ejemplo, para estudiantes o administradores)
export const validateUpdate = [
  body('email').optional().isEmail().withMessage('Please provide a valid email address'),
  body('password').optional().isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next(); // Si no hay errores, pasa al siguiente middleware o controlador
  }
];

import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import studentModel from '../models/students.js';
import { createToken } from '../middlewares/auth.js';

const saltRounds = 10;

// Registro de un estudiante
const registerStudent_controller = async (req, res) => {
  const { password, ...otherData_student } = req.body;
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  const studentData = {
    id: uuidv4(),
    password: hashedPassword,
    ...otherData_student,
  };
  try {
    const student = await studentModel.registerStudent_model(studentData);
    res.status(200).json(student);
  } catch (error) {
    res.status(500).json(error);
  }
};

// Inicio de sesión del estudiante
const loginStudent_controller = async (req, res) => {
  const { mail, password } = req.body;
  try {
    const student = await studentModel.loginStudent_model(mail, password);
    const token = createToken(student);
    res.status(200).json({ student, token });
  } catch (error) {
    res.status(500).json(error);
  }
};

// Actualización de estudiante
const updateStudent_controller = async (req, res) => {
  const { id } = req.params;
  try {
    const student = await studentModel.updateStudent_model(id, req.body);
    res.status(200).json(student);
  } catch (error) {
    req.status(500).json(error);
  }
};

// Eliminación de estudiante
const deleteStudent_controller = async (req, res) => {
  const { id } = req.params;
  try {
    await studentModel.deleteStudent_model(id);
    res.status(200).json({ message: "Estudiante eliminado" });
  } catch (error) {
    res.status(500).json(error);
  }
};

// Obtener un estudiante por ID
const getStudent_controller = async (req, res) => {
  const { id } = req.params;
  try {
    const student = await studentModel.getStudent_ID(id);
    res.status(200).json(student);
  } catch (error) {
    res.status(500).json(error);
  }
};

export {
  registerStudent_controller,
  loginStudent_controller,
  updateStudent_controller,
  deleteStudent_controller,
  getStudent_controller
};

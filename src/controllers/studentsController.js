import studentModel from '../models/studentsModel.js';

// Registrar un nuevo estudiante
export const registerStudent_controller = async (req, res) => {
  const { name, email, password, career } = req.body;

  // Verificar si el estudiante ya existe
  const existingStudent = await studentModel.getStudentByEmail(email);
  if (existingStudent) {
    return res.status(400).json({ error: "El estudiante ya existe." });
  }

  // Registrar el estudiante
  const newStudent = { name, email, password, career };
  const student = await studentModel.registerStudent_model(newStudent);
  res.status(201).json(student);
};

// Login de estudiante
export const loginStudent_controller = async (req, res) => {
  const { email, password } = req.body;

  const student = await studentModel.loginStudent_model(email, password);
  if (student.error) {
    return res.status(400).json(student);
  }

  res.status(200).json(student);
};

// Obtener un estudiante por ID
export const getStudent_controller = async (req, res) => {
  const { id } = req.params;
  const student = await studentModel.getStudent_ID(id);

  if (!student) {
    return res.status(404).json({ error: "Estudiante no encontrado." });
  }

  res.status(200).json(student);
};

// Actualizar información de un estudiante
export const updateStudent_controller = async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;

  const updatedStudent = await studentModel.updateStudent_model(id, updateData);
  if (!updatedStudent) {
    return res.status(404).json({ error: "Estudiante no encontrado." });
  }

  res.status(200).json(updatedStudent);
};

// Eliminar un estudiante
export const deleteStudent_controller = async (req, res) => {
  const { id } = req.params;

  const deletedStudent = await studentModel.deleteStudent_model(id);
  if (!deletedStudent) {
    return res.status(404).json({ error: "Estudiante no encontrado." });
  }

  res.status(200).json({ message: "Estudiante eliminado." });
};

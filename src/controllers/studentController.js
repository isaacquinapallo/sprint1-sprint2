import fs from 'fs-extra';
import path from 'path';

const studentsFile = path.join(__dirname, '../data/students.json');  // Aquí almacenamos los estudiantes

// Listar todos los estudiantes
export const listStudents = async (req, res) => {
  try {
    const students = await fs.readJson(studentsFile);
    res.status(200).json(students);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener los estudiantes', error });
  }
};

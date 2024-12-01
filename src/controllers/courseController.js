import { getAllCourses, createCourse, updateCourse, deleteCourse } from '../models/courseModel.js';

// Listar todas las carreras
export const listCourses = async (req, res) => {
  try {
    const courses = await getAllCourses();
    res.status(200).json(courses);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener las carreras', error });
  }
};

// Crear una nueva carrera
export const addCourse = async (req, res) => {
  const { name, description } = req.body;

  if (!name || !description) {
    return res.status(400).json({ message: 'Nombre y descripción son obligatorios' });
  }

  try {
    const newCourse = await createCourse(name, description);
    res.status(201).json(newCourse);
  } catch (error) {
    res.status(500).json({ message: 'Error al crear la carrera', error });
  }
};

// Actualizar una carrera
export const modifyCourse = async (req, res) => {
  const { courseId } = req.params;
  const { name, description } = req.body;

  try {
    const updatedCourse = await updateCourse(courseId, { name, description });
    if (!updatedCourse) {
      return res.status(404).json({ message: 'Carrera no encontrada' });
    }
    res.status(200).json(updatedCourse);
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar la carrera', error });
  }
};

// Eliminar una carrera
export const removeCourse = async (req, res) => {
  const { courseId } = req.params;

  try {
    const result = await deleteCourse(courseId);
    if (!result) {
      return res.status(404).json({ message: 'Carrera no encontrada' });
    }
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar la carrera', error });
  }
};

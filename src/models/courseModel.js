import fs from 'fs-extra';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

const coursesFile = path.join(__dirname, '../data/courses.json');  // Aquí almacenamos las carreras

// Obtener todas las carreras
export const getAllCourses = async () => {
  return fs.readJson(coursesFile);
};

// Crear una nueva carrera
export const createCourse = async (name, description) => {
  const courses = await getAllCourses();
  const newCourse = {
    id: uuidv4(),
    name,
    description,
  };

  courses.push(newCourse);
  await fs.writeJson(coursesFile, courses);
  return newCourse;
};

// Actualizar una carrera
export const updateCourse = async (courseId, updatedData) => {
  const courses = await getAllCourses();
  const courseIndex = courses.findIndex(course => course.id === courseId);

  if (courseIndex === -1) {
    return null;
  }

  courses[courseIndex] = { ...courses[courseIndex], ...updatedData };
  await fs.writeJson(coursesFile, courses);
  return courses[courseIndex];
};

// Eliminar una carrera
export const deleteCourse = async (courseId) => {
  const courses = await getAllCourses();
  const updatedCourses = courses.filter(course => course.id !== courseId);

  if (updatedCourses.length === courses.length) {
    return null; // No se encontró la carrera
  }

  await fs.writeJson(coursesFile, updatedCourses);
  return { message: 'Carrera eliminada correctamente' };
};

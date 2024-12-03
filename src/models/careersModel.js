import fs from 'fs';
import path from 'path';

const dbPath = path.resolve('./db.json');
const db = JSON.parse(fs.readFileSync(dbPath, 'utf-8'));

// Obtener todas las carreras
export const getAllCareers = async () => db.careers;

// Obtener una carrera por ID
export const getCareerById_model = async (id) => db.careers.find((career) => career.id === Number(id));

// Crear una nueva carrera
export const createCareer_model = async (career) => {
  const newCareer = { id: db.careers.length + 1, ...career };
  db.careers.push(newCareer);
  return newCareer;
};

// Actualizar una carrera
export const updateCareer_model = async (id, updates) => {
  const index = db.careers.findIndex((career) => career.id === Number(id));
  if (index === -1) throw new Error('Carrera no encontrada');
  db.careers[index] = { ...db.careers[index], ...updates };
  return db.careers[index];
};

// Eliminar una carrera
export const deleteCareer_model = async (id) => {
  const index = db.careers.findIndex((career) => career.id === Number(id));
  if (index === -1) throw new Error('Carrera no encontrada');
  db.careers.splice(index, 1);
};

// Exportar como predeterminado
export default {
  getAllCareers,
  getCareerById_model,
  createCareer_model,
  updateCareer_model,
  deleteCareer_model,
};

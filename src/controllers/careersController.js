import careerModel from '../models/careersModel.js';

// Listar todas las carreras
export const getAllCareers_controller = async (req, res) => {
  const careers = await careerModel.getAllCareers_model();
  res.status(200).json(careers);
};

// Crear una nueva carrera
export const createCareer_controller = async (req, res) => {
  const { name } = req.body;

  // Verificar si la carrera ya existe
  const existingCareer = await careerModel.getCareerByName(name);
  if (existingCareer) {
    return res.status(400).json({ error: "La carrera ya existe." });
  }

  // Crear la nueva carrera
  const newCareer = { name };
  const career = await careerModel.createCareer_model(newCareer);
  res.status(201).json(career);
};

// Actualizar una carrera
export const updateCareer_controller = async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  const updatedCareer = await careerModel.updateCareer_model(id, { name });
  if (!updatedCareer) {
    return res.status(404).json({ error: "Carrera no encontrada." });
  }

  res.status(200).json(updatedCareer);
};

// Eliminar una carrera
export const deleteCareer_controller = async (req, res) => {
  const { id } = req.params;

  const deletedCareer = await careerModel.deleteCareer_model(id);
  if (!deletedCareer) {
    return res.status(404).json({ error: "Carrera no encontrada." });
  }

  res.status(200).json({ message: "Carrera eliminada." });
};

// Controlador para obtener una carrera por su ID
export const getCareer_controller = async (req, res) => {
  const { id } = req.params;
  const career = await careersModel.getCareerById(id);

  if (!career) {
    return res.status(404).json({ error: "Carrera no encontrada." });
  }

  res.status(200).json(career);
};

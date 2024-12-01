import { v4 as uuidv4 } from 'uuid';
import careerModel from '../models/careers.js';

const getAllCareers_controller = async (req, res) => {
  try {
    const careers = await careerModel.getAllCareers_model();
    res.status(200).json(careers);
  } catch (error) {
    res.status(500).json(error);
  }
};

const createCareer_controller = async (req, res) => {
  const { name, description } = req.body;
  const newCareer = {
    id: uuidv4(),
    name,
    description
  };
  try {
    const career = await careerModel.createCareer_model(newCareer);
    res.status(201).json(career);
  } catch (error) {
    res.status(500).json(error);
  }
};

const updateCareer_controller = async (req, res) => {
  const { id } = req.params;
  const { name, description } = req.body;
  try {
    const career = await careerModel.updateCareer_model(id, { name, description });
    res.status(200).json(career);
  } catch (error) {
    res.status(500).json(error);
  }
};

const deleteCareer_controller = async (req, res) => {
  const { id } = req.params;
  try {
    await careerModel.deleteCareer_model(id);
    res.status(200).json({ message: 'Carrera eliminada' });
  } catch (error) {
    res.status(500).json(error);
  }
};

export {
  getAllCareers_controller,
  createCareer_controller,
  updateCareer_controller,
  deleteCareer_controller
};

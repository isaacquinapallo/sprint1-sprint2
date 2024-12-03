import careersModel from '../models/careersModel.js';
import pkg from 'cloudinary';
const { v2: cloudinary } = pkg;

// Obtener todas las carreras
export const getAllCareers_controller = async (req, res) => {
  try {
    const careers = await careersModel.getAllCareers();
    res.status(200).json(careers);
  } catch (error) {
    console.error('Error al obtener las carreras:', error);
    res.status(500).json({ error: 'Error al obtener las carreras', details: error.message });
  }
};

// Obtener una carrera por ID
export const getCareerById_controller = async (req, res) => {
  try {
    const { id } = req.params;
    const career = await careersModel.getCareerById_model(id);

    if (!career) {
      return res.status(404).json({ error: 'Carrera no encontrada' });
    }

    res.status(200).json(career);
  } catch (error) {
    console.error('Error al obtener la carrera:', error);
    res.status(500).json({ error: 'Error al obtener la carrera', details: error.message });
  }
};

// Crear una nueva carrera
export const createCareer_controller = async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name || !description) {
      return res.status(400).json({ error: 'El nombre y la descripción son requeridos.' });
    }

    if (!req.file) {
      return res.status(400).json({ error: 'La imagen es requerida.' });
    }

    const result = await cloudinary.uploader.upload(req.file.path, { folder: 'careers' });

    const newCareer = await careersModel.createCareer_model({
      name,
      description,
      imageUrl: result.secure_url,
      public_id: result.public_id,
    });

    res.status(201).json(newCareer);
  } catch (error) {
    console.error('Error al crear la carrera:', error);
    res.status(500).json({ error: 'Error al crear la carrera', details: error.message });
  }
};

// Actualizar una carrera
export const updateCareer_controller = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;

    const career = await careersModel.getCareerById_model(id);
    if (!career) {
      return res.status(404).json({ error: 'Carrera no encontrada' });
    }

    let imageUrl = career.imageUrl;
    let public_id = career.public_id;

    if (req.file) {
      if (public_id) {
        await cloudinary.uploader.destroy(public_id);
      }

      const result = await cloudinary.uploader.upload(req.file.path, { folder: 'careers' });
      imageUrl = result.secure_url;
      public_id = result.public_id;
    }

    const updatedCareer = await careersModel.updateCareer_model(id, {
      name,
      description,
      imageUrl,
      public_id,
    });

    res.status(200).json(updatedCareer);
  } catch (error) {
    console.error('Error al actualizar la carrera:', error);
    res.status(500).json({ error: 'Error al actualizar la carrera', details: error.message });
  }
};

// Eliminar una carrera
export const deleteCareer_controller = async (req, res) => {
  try {
    const { id } = req.params;

    const career = await careersModel.getCareerById_model(id);
    if (!career) {
      return res.status(404).json({ error: 'Carrera no encontrada' });
    }

    if (career.public_id) {
      await cloudinary.uploader.destroy(career.public_id);
    }

    await careersModel.deleteCareer_model(id);

    res.status(200).json({ message: 'Carrera eliminada exitosamente.' });
  } catch (error) {
    console.error('Error al eliminar la carrera:', error);
    res.status(500).json({ error: 'Error al eliminar la carrera', details: error.message });
  }
};

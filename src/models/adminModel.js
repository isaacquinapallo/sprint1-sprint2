import bcrypt from 'bcrypt';
import fs from 'fs-extra';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';

const adminsFile = path.join(__dirname, '../data/admins.json');  // Aquí almacenamos a los administradores

// Función para obtener todos los administradores
export const getAllAdmins = () => {
  return fs.readJson(adminsFile);
};

// Función para crear un nuevo administrador
export const createAdmin = async (username, password) => {
  const admins = await getAllAdmins();
  const newAdmin = {
    id: uuidv4(),
    username,
    password: await bcrypt.hash(password, 10),  // Encriptamos la contraseña
  };

  admins.push(newAdmin);
  await fs.writeJson(adminsFile, admins);
  return newAdmin;
};

// Función para verificar si las credenciales son correctas
export const validateAdmin = async (username, password) => {
  const admins = await getAllAdmins();
  const admin = admins.find((admin) => admin.username === username);

  if (!admin) {
    return null;
  }

  const isPasswordValid = await bcrypt.compare(password, admin.password);
  return isPasswordValid ? admin : null;
};

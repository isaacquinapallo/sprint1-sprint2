import fs from 'fs';
import path from 'path';
import bcrypt from 'bcrypt';

const dbPath = path.resolve('./db.json');

const adminModel = {
  async registerAdmin_model(newAdmin) {
    const db = JSON.parse(fs.readFileSync(dbPath, 'utf-8'));

    // Verificar si el correo ya existe
    const existingAdmin = db.admins.find((admin) => admin.email === newAdmin.email);
    if (existingAdmin) {
      throw new Error("El correo ya está registrado");
    }

    // Hashear la contraseña antes de guardar
    newAdmin.password = await bcrypt.hash(newAdmin.password, 10);
    newAdmin.id = db.admins.length + 1; // Generar un ID único

    db.admins.push(newAdmin);
    fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));

    return newAdmin;
  },

  async loginAdmin_model(email, password) {
    const db = JSON.parse(fs.readFileSync(dbPath, 'utf-8'));

    const admin = db.admins.find((admin) => admin.email === email);
    if (!admin) {
      return { error: "Email or password wrong, try again" };
    }

    const passwordMatch = await bcrypt.compare(password, admin.password);
    if (passwordMatch) {
      return admin;
    } else {
      return { error: "Email or password wrong, try again" };
    }
  },

  async updateAdminById(adminID, updateAdmin) {
    const db = JSON.parse(fs.readFileSync(dbPath, 'utf-8'));
    const index = db.admins.findIndex((admin) => admin.id === parseInt(adminID, 10));

    if (index === -1) {
      throw new Error("Administrador no encontrado");
    }

    if (updateAdmin.password) {
      updateAdmin.password = await bcrypt.hash(updateAdmin.password, 10);
    }

    db.admins[index] = { ...db.admins[index], ...updateAdmin };
    fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));

    return db.admins[index];
  },

  async deleteAdminById(adminID) {
    const db = JSON.parse(fs.readFileSync(dbPath, 'utf-8'));
    const index = db.admins.findIndex((admin) => admin.id === parseInt(adminID, 10));

    if (index === -1) {
      throw new Error("Administrador no encontrado");
    }

    db.admins.splice(index, 1);
    fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));

    return { message: `Administrador con ID ${adminID} eliminado` };
  },

  async getAdminById(adminID) {
    const db = JSON.parse(fs.readFileSync(dbPath, 'utf-8'));
    const admin = db.admins.find((admin) => admin.id === parseInt(adminID, 10));

    if (!admin) {
      throw new Error("Administrador no encontrado");
    }

    return admin;
  },

  async getAdminByEmail(email) {
    const db = JSON.parse(fs.readFileSync(dbPath, 'utf-8'));
    return db.admins.find((admin) => admin.email === email) || null;
  },
};

export default adminModel;

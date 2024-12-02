import bcrypt from 'bcrypt';

const adminModel = {
  async registerAdmin_model(newAdmin) {
    const url = "http://localhost:4000/admins";
    const peticion = await fetch(url, {
      method: "POST",
      body: JSON.stringify(newAdmin),
      headers: { 'Content-Type': "application/json" },
    });
    const data = await peticion.json();
    return data;
  },

  async loginAdmin_model(email, password) {
    const url = "http://localhost:4000/admins";
    const peticion = await fetch(url);
    const admins = await peticion.json();
    const admin = admins.find(admin => admin.email === email);
    if (!admin) {
      return { error: "Email or password wrong, try again" };
    }
    const passwordMatch = await bcrypt.compare(password, admin.password);
    if (admin && passwordMatch) {
      return admin;
    } else {
      return { error: "Email or password wrong, try again" };
    }
  },

  async updateAdmin_model(adminID, updateAdmin) {
    const url = `http://localhost:4000/admins/${adminID}`;
    const peticion = await fetch(url, {
      method: "PUT",
      body: JSON.stringify(updateAdmin),
      headers: { 'Content-Type': "application/json" },
    });
    const data = await peticion.json();
    return data;
  },

  async deleteAdmin_model(adminID) {
    const url = `http://localhost:4000/admins/${adminID}`;
    const peticion = await fetch(url, {
      method: "DELETE",
    });
    const data = await peticion.json();
    return data;
  },

  async getAdmin_ID(adminID) {
    const peticion = await fetch(`http://localhost:4000/admins/${adminID}`);
    const data = await peticion.json();
    return data;
  },

  // Funcion Buscar un administrador por correo electrónico
  async getAdminByEmail(email) {
    const url = "http://localhost:4000/admins";
    const peticion = await fetch(url);
    const admins = await peticion.json();
    const admin = admins.find(admin => admin.email === email); // Buscar por correo
    return admin;
  }
};


export default adminModel;

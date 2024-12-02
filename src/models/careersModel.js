const careerModel = {
  // Obtener todas las carreras
  async getAllCareers_model() {
    const url = "http://localhost:4000/careers";
    const peticion = await fetch(url);
    const careers = await peticion.json();
    return careers;
  },

  // Crear una nueva carrera
  async createCareer_model(newCareer) {
    const url = "http://localhost:4000/careers";
    const peticion = await fetch(url, {
      method: "POST",
      body: JSON.stringify(newCareer),
      headers: { 'Content-Type': "application/json" },
    });
    const data = await peticion.json();
    return data;
  },

  // Actualizar una carrera
  async updateCareer_model(careerID, updateCareer) {
    const url = `http://localhost:4000/careers/${careerID}`;
    const peticion = await fetch(url, {
      method: "PUT",
      body: JSON.stringify(updateCareer),
      headers: { 'Content-Type': "application/json" },
    });
    const data = await peticion.json();
    return data;
  },

  // Eliminar una carrera
  async deleteCareer_model(careerID) {
    const url = `http://localhost:4000/careers/${careerID}`;
    const peticion = await fetch(url, {
      method: "DELETE",
    });
    const data = await peticion.json();
    return data;
  },

  // Obtener una carrera por su nombre
  async getCareerByName(name) {
    const url = `http://localhost:4000/careers?name=${name}`; // Cambié la URL para buscar por nombre
    const peticion = await fetch(url);
    const data = await peticion.json();
    return data.length > 0 ? data[0] : null; // Devuelve la primera coincidencia, si la hay
  },

  // Obtener una carrera por su ID
  async getCareerById(id) {
    const url = `http://localhost:4000/careers/${id}`;
    const peticion = await fetch(url);
    const data = await peticion.json();
    return data;
  }
};

export default careerModel;

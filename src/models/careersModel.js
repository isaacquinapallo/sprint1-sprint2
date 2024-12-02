const careerModel = {
    async getAllCareers_model() {
      const url = "http://localhost:4000/careers";
      const peticion = await fetch(url);
      const careers = await peticion.json();
      return careers;
    },
  
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
  
    async deleteCareer_model(careerID) {
      const url = `http://localhost:4000/careers/${careerID}`;
      const peticion = await fetch(url, {
        method: "DELETE",
      });
      const data = await peticion.json();
      return data;
    },
  
    async getCareer_ID(careerID) {
      const peticion = await fetch(`http://localhost:4000/careers/${careerID}`);
      const data = await peticion.json();
      return data;
    }
  };
  
  export default careerModel;
  
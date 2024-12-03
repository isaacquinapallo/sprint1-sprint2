import studentModel from '../models/studentsModel.js';

export const registerStudent_controller = async (req, res) => {
  const { name, email, password, career, ...otherData } = req.body;

  try {
    // Verificar si el estudiante ya existe
    const existingStudent = await studentModel.getStudentByEmail(email);
    if (existingStudent) {
      return res.status(400).json({ error: "El estudiante ya existe." });
    }

    // Encriptar la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);
    const newStudent = {
      id: uuidv4(),
      name,
      email,
      password: hashedPassword,
      career,
      ...otherData
    };

    // Manejo de la carga de imagen si existe
    if (req.files?.image) {
      const cloudinaryResponse = await cloudinary.uploader.upload(req.files.image.tempFilePath, { folder: "students" });
      newStudent.image = cloudinaryResponse.secure_url;
      newStudent.public_id = cloudinaryResponse.public_id;
      await fs.unlink(req.files.image.tempFilePath);
    }

    // Registrar el estudiante
    const student = await studentModel.registerStudent_model(newStudent);
    res.status(201).json(student);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al registrar al estudiante." });
  }
};

// Login de estudiante
export const loginStudent_controller = async (req, res) => {
  const { email, password } = req.body;

  const student = await studentModel.loginStudent_model(email, password);
  if (student.error) {
    return res.status(400).json(student);
  }

  res.status(200).json(student);
};

// Obtener un estudiante por ID
export const getStudent_controller = async (req, res) => {
  const { id } = req.params;
  const student = await studentModel.getStudent_ID(id);

  if (!student) {
    return res.status(404).json({ error: "Estudiante no encontrado." });
  }

  res.status(200).json(student);
};

// Actualizar información de un estudiante
export const updateStudent_controller = async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;

  const updatedStudent = await studentModel.updateStudent_model(id, updateData);
  if (!updatedStudent) {
    return res.status(404).json({ error: "Estudiante no encontrado." });
  }

  res.status(200).json(updatedStudent);
};

// Eliminar un estudiante
export const deleteStudent_controller = async (req, res) => {
  const { id } = req.params;

  const deletedStudent = await studentModel.deleteStudent_model(id);
  if (!deletedStudent) {
    return res.status(404).json({ error: "Estudiante no encontrado." });
  }

  res.status(200).json({ message: "Estudiante eliminado." });
};

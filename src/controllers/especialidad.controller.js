import EspecialidadModel from "../models/especialidad.model.js";

const EspecialidadController = {
  //*GET /api/especialidades
  getAll: async (req, res) => {
    try {
      const especialidades = await EspecialidadModel.findAll();
      res.status(200).json(especialidades);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  },

  //*GET /api/especialidades/:id
  getById: async (req, res) => {
    try {
      const especialidad = await EspecialidadModel.findById(req.params.id);
      if (!especialidad) {
        return res.status(404).json({ message: "Especialidad no encontrada" });
      }
      res.status(200).json(especialidad);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  },

  //*POST /api/especialidades
  create: async (req, res) => {
    try {
      let { nombre } = req.body;
      const existente = await EspecialidadModel.findByNombre(nombre);
      if (existente) {
        if (!existente.activo) {
          await EspecialidadModel.updateActive(existente.id_especialidad, 1);

          return res.status(200).json({
            message: "Especialidad reactivada correctamente",
            id: existente.id_especialidad,
          });
        }

        return res.status(400).json({
          message: "La especialidad ya existe",
        });
      }

      const id = await EspecialidadModel.create(nombre);

      res.status(201).json({
        message: "Especialidad creada correctamente",
        id,
      });
    } catch (error) {
      console.error(error);

      //*fallback por si hay race condition
      if (error.code === "ER_DUP_ENTRY") {
        return res.status(400).json({
          message: "La especialidad ya existe",
        });
      }

      res.status(500).json({ message: "Error interno del servidor" });
    }
  },

  //*PUT /api/especialidades/:id
  update: async (req, res) => {
    try {
      const { nombre } = req.body;
      const affectedRows = await EspecialidadModel.update(
        req.params.id,
        nombre,
      );
      if (affectedRows === 0) {
        return res.status(404).json({ message: "Especialidad no encontrada" });
      }
      res
        .status(200)
        .json({ message: "Especialidad actualizada correctamente" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  },

  //*DELETE /api/especialidades/:id
  remove: async (req, res) => {
    try {
      const affectedRows = await EspecialidadModel.softDelete(req.params.id);
      if (affectedRows === 0) {
        return res.status(404).json({ message: "Especialidad no encontrada" });
      }
      res.status(200).json({ message: "Especialidad eliminada correctamente" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  },
};

export default EspecialidadController;

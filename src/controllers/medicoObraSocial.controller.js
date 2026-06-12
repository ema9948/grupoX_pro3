// src/controllers/medicoObraSocial.controller.js
import MedicoObraSocialModel from "../models/medicoObraSocial.model.js";
import MedicoModel from "../models/medico.model.js";
import ObraSocialModel from "../models/obraSocial.model.js";

const MedicoObraSocialController = {
  // GET /api/medicos/:idMedico/obras-sociales
  getByMedico: async (req, res) => {
    try {
      const { idMedico } = req.params;

      const medico = await MedicoModel.findById(idMedico);
      if (!medico) {
        return res.status(404).json({ message: "Médico no encontrado" });
      }

      const asociaciones = await MedicoObraSocialModel.findByMedico(idMedico);
      res.status(200).json(asociaciones);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  },

  // POST /api/medicos/:idMedico/obras-sociales
  create: async (req, res) => {
    try {
      const { idMedico } = req.params;
      const { id_obra_social } = req.body;

      // Verificar que existan médico y obra social
      const medico = await MedicoModel.findById(idMedico);
      if (!medico) {
        return res.status(404).json({ message: "Médico no encontrado" });
      }

      const obraSocial = await ObraSocialModel.findById(id_obra_social);
      if (!obraSocial) {
        return res.status(404).json({ message: "Obra social no encontrada" });
      }

      const result = await MedicoObraSocialModel.create(
        idMedico,
        id_obra_social,
      );

      const message = result.reactivated
        ? "Asociación reactivada correctamente"
        : "Asociación creada correctamente";

      res.status(201).json({ message });
    } catch (error) {
      console.error(error);
      if (error.message === "La asociación ya existe") {
        return res.status(400).json({ message: error.message });
      }
      res.status(500).json({ message: "Error interno del servidor" });
    }
  },

  // DELETE /api/medicos/:idMedico/obras-sociales/:idObraSocial
  remove: async (req, res) => {
    try {
      const { idMedico, idObraSocial } = req.params;

      const affectedRows = await MedicoObraSocialModel.softDelete(
        idMedico,
        idObraSocial,
      );

      if (affectedRows === 0) {
        return res.status(404).json({ message: "Asociación no encontrada" });
      }

      res.status(200).json({ message: "Asociación eliminada correctamente" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  },

  // GET /api/medicos/:idMedico/obras-sociales/disponibles
  getAvailable: async (req, res) => {
    try {
      const { idMedico } = req.params;

      const medico = await MedicoModel.findById(idMedico);
      if (!medico) {
        return res.status(404).json({ message: "Médico no encontrado" });
      }

      const disponibles =
        await MedicoObraSocialModel.findAvailableForMedico(idMedico);
      res.status(200).json(disponibles);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  },
};

export default MedicoObraSocialController;

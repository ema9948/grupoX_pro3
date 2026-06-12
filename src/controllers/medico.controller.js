//*src/controllers/medico.controller.js
import MedicoModel from "../models/medico.model.js";
import UsuarioModel from "../models/usuario.model.js";
import pool from "../config/db.js";

const MedicoController = {
  getAll: async (req, res) => {
    try {
      const { id_especialidad } = req.query;
      const medicos = await MedicoModel.findAll(id_especialidad || null);
      res.status(200).json(medicos);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  },

  getById: async (req, res) => {
    try {
      const medico = await MedicoModel.findById(req.params.id);
      if (!medico) {
        return res.status(404).json({ message: "Médico no encontrado" });
      }
      res.status(200).json(medico);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  },

  create: async (req, res) => {
    try {
      const {
        id_usuario,
        id_especialidad,
        matricula,
        descripcion,
        valor_consulta,
      } = req.body;

      //*Solo verificamos que el usuario exista y tenga rol 1
      const usuario = await UsuarioModel.findById(id_usuario);
      if (!usuario) {
        return res.status(404).json({ message: "Usuario no encontrado" });
      }
      if (usuario.rol !== 1) {
        return res
          .status(400)
          .json({ message: "El usuario debe tener rol de médico (rol = 1)" });
      }

      //*Verificamos solo que la matrícula no esté repetida
      const matriculaExistente = await MedicoModel.findByMatricula(matricula);
      if (matriculaExistente) {
        return res
          .status(400)
          .json({ message: "Ya existe un médico con esa matrícula" });
      }

      const id = await MedicoModel.create(
        id_usuario,
        id_especialidad,
        matricula,
        descripcion || null,
        valor_consulta,
      );

      res.status(201).json({
        message: "Médico creado correctamente",
        id_medico: id,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  },

  update: async (req, res) => {
    try {
      const { id_especialidad, matricula, descripcion, valor_consulta } =
        req.body;
      const id = req.params.id;

      // Verificar que la matrícula no pertenezca a otro médico
      const [existe] = await pool.query(
        "SELECT id_medico FROM medicos WHERE matricula = ? AND id_medico != ?",
        [matricula, id],
      );
      if (existe.length > 0) {
        return res
          .status(400)
          .json({ message: "Ya existe otro médico con esa matrícula" });
      }

      const affectedRows = await MedicoModel.update(
        id,
        id_especialidad,
        matricula,
        descripcion,
        valor_consulta,
      );

      if (affectedRows === 0) {
        return res.status(404).json({ message: "Médico no encontrado" });
      }

      res.status(200).json({ message: "Médico actualizado correctamente" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  },

  remove: async (req, res) => {
    try {
      const affectedRows = await MedicoModel.softDelete(req.params.id);
      if (affectedRows === 0) {
        return res.status(404).json({ message: "Médico no encontrado" });
      }
      res.status(200).json({ message: "Médico eliminado correctamente" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  },
};

export default MedicoController;

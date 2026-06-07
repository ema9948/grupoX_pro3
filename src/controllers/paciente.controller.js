// src/controllers/paciente.controller.js
import PacienteModel from '../models/paciente.model.js';
import UsuarioModel from '../models/usuario.model.js';

const PacienteController = {

    getAll: async (req, res) => {
        try {
            const pacientes = await PacienteModel.findAll();
            res.status(200).json(pacientes);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Error interno del servidor" });
        }
    },

    getById: async (req, res) => {
        try {
            const paciente = await PacienteModel.findById(req.params.id);
            if (!paciente) {
                return res.status(404).json({ message: "Paciente no encontrado" });
            }
            res.status(200).json(paciente);
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Error interno del servidor" });
        }
    },

    create: async (req, res) => {
        try {
            const { id_usuario, id_obra_social } = req.body;

            const usuario = await UsuarioModel.findById(id_usuario);
            if (!usuario) {
                return res.status(404).json({ message: "Usuario no encontrado" });
            }
            if (usuario.rol !== 2) {
                return res.status(400).json({ message: "El usuario debe tener rol de paciente (rol = 2)" });
            }

            // Verificamos si el usuario ya es paciente
            const pacienteExistente = await PacienteModel.findByUsuario(id_usuario);
            if (pacienteExistente) {
                return res.status(400).json({ message: "Este usuario ya está registrado como paciente" });
            }

            const id = await PacienteModel.create(id_usuario, id_obra_social);

            res.status(201).json({
                message: "Paciente creado correctamente",
                id_paciente: id
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Error interno del servidor" });
        }
    },

    update: async (req, res) => {
        try {
            const { id_obra_social } = req.body;
            const affectedRows = await PacienteModel.update(req.params.id, id_obra_social);

            if (affectedRows === 0) {
                return res.status(404).json({ message: "Paciente no encontrado" });
            }

            res.status(200).json({ message: "Paciente actualizado correctamente" });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Error interno del servidor" });
        }
    },

    remove: async (req, res) => {
        try {
            const affectedRows = await PacienteModel.softDelete(req.params.id);
            if (affectedRows === 0) {
                return res.status(404).json({ message: "Paciente no encontrado" });
            }
            res.status(200).json({ message: "Paciente eliminado correctamente" });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: "Error interno del servidor" });
        }
    }
};

export default PacienteController;


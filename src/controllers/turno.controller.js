//*src/controllers/turno.controller.js
import TurnoModel from "../models/turno.model.js";
import PacienteModel from "../models/paciente.model.js";
import generateTurnosPDF from "../services/pdf.service.js";
import pool from "../config/db.js";

const TurnoController = {
  create: async (req, res) => {
    try {
      const { id_medico, fecha_hora } = req.body;
      let { id_paciente } = req.body;

      //*Si es paciente (rol 2) el id_paciente se saca automáticamente del token
      //*Si es admin (rol 3) el id_paciente debe venir en el body
      if (req.usuario.rol === 2) {
        const [pacienteRows] = await pool.query(
          "SELECT id_paciente FROM pacientes WHERE id_usuario = ?",
          [req.usuario.id],
        );
        if (pacienteRows.length === 0) {
          return res.status(404).json({
            message: "No se encontró el paciente asociado a tu usuario",
          });
        }
        id_paciente = pacienteRows[0].id_paciente;
      }

      //*Si es admin y no mandó id_paciente
      if (!id_paciente) {
        return res.status(400).json({
          message: "El id_paciente es requerido para el administrador",
        });
      }

      const id_turno = await TurnoModel.create(
        id_medico,
        id_paciente,
        fecha_hora,
      );

      res.status(201).json({
        message: "Turno reservado correctamente",
        id_turno,
      });
    } catch (error) {
      console.error(error);
      if (error.message.includes("No se encontró relación")) {
        return res.status(400).json({ message: error.message });
      }
      res.status(500).json({ message: "Error interno del servidor" });
    }
  },

  getMisTurnos: async (req, res) => {
    try {
      const usuario = req.usuario;
      let turnos;

      if (usuario.rol === 1) {
        //*Médico - buscar su id_medico
        const [medicoRows] = await pool.query(
          "SELECT id_medico FROM medicos WHERE id_usuario = ?",
          [usuario.id],
        );
        if (medicoRows.length === 0) {
          return res.status(404).json({ message: "Médico no encontrado" });
        }
        turnos = await TurnoModel.findByMedico(medicoRows[0].id_medico);
      } else if (usuario.rol === 2) {
        //*Paciente
        const [pacienteRows] = await pool.query(
          "SELECT id_paciente FROM pacientes WHERE id_usuario = ?",
          [usuario.id],
        );

        if (pacienteRows.length === 0) {
          return res.status(404).json({
            message: "No se encontró paciente asociado a este usuario",
          });
        }

        turnos = await TurnoModel.findByPaciente(pacienteRows[0].id_paciente);
      } else if (usuario.rol === 3) {
        //*Admin
        turnos = await TurnoModel.findAll();
      }

      res.status(200).json(turnos);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  },

  //*Marcar turno como atendido (solo el médico que lo tiene)
  marcarAtendido: async (req, res) => {
    try {
      const usuario = req.usuario; //*id_usuario

      //*Obtener el id_medico del usuario logueado
      const [medicoRows] = await pool.query(
        "SELECT id_medico FROM medicos WHERE id_usuario = ?",
        [usuario.id],
      );

      if (medicoRows.length === 0) {
        return res
          .status(403)
          .json({ message: "No eres un médico registrado" });
      }

      const id_medico_logueado = medicoRows[0].id_medico;

      //*Verificar que el turno pertenezca al médico logueado
      const [turno] = await pool.query(
        "SELECT id_medico FROM turnos_reservas WHERE id_turno_reserva = ? AND activo = 1",
        [req.params.id],
      );

      if (turno.length === 0) {
        return res.status(404).json({ message: "Turno no encontrado" });
      }

      if (turno[0].id_medico !== id_medico_logueado) {
        return res
          .status(403)
          .json({ message: "No tienes permiso para atender este turno" });
      }

      const affectedRows = await TurnoModel.marcarAtendido(req.params.id);
      if (affectedRows === 0) {
        return res
          .status(404)
          .json({ message: "Turno no encontrado o ya inactivo" });
      }

      res
        .status(200)
        .json({ message: "Turno marcado como atendido correctamente" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  },

  //*Obtener estadísticas (Solo Admin)
  getEstadisticas: async (req, res) => {
    try {
      const resultados = await TurnoModel.getEstadisticas(); // resultados[0] y [1]

      res.status(200).json({
        message: "Estadísticas obtenidas correctamente",
        estadisticas: {
          generales: resultados[0]?.[0] || {}, // primer conjunto, primer registro
          por_especialidad: resultados[1] || [], // segundo conjunto
        },
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error al obtener estadísticas" });
    }
  },
  //*Generar informe PDF (Solo Admin)
  generarInformePDF: async (req, res) => {
    try {
      const estadisticasData = await TurnoModel.getEstadisticas();
      const turnos = await TurnoModel.findAll();

      // estadisticasData[0] = generales, estadisticasData[1] = por_especialidad
      const estadisticas = {
        generales: estadisticasData[0]?.[0] || {},
        por_especialidad: estadisticasData[1] || [],
      };

      const pdfBuffer = await generateTurnosPDF(estadisticas, turnos);

      res.setHeader("Content-Type", "application/pdf");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename=informe_turnos_${new Date().toISOString().slice(0, 10)}.pdf`,
      );
      res.end(pdfBuffer);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error al generar PDF" });
    }
  },
  //* Cancelar turno (soft delete)
  cancelarTurno: async (req, res) => {
    try {
      const { id } = req.params;
      const usuario = req.usuario;

      const affectedRows = await TurnoModel.cancelar(
        id,
        usuario.id,
        usuario.rol,
      );

      if (affectedRows === 0) {
        return res.status(404).json({
          message: "Turno no encontrado o no tienes permiso para cancelarlo",
        });
      }

      res.status(200).json({ message: "Turno cancelado correctamente" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error interno del servidor" });
    }
  },
};

export default TurnoController;

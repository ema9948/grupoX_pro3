// src/models/medicoObraSocial.model.js
import pool from "../config/db.js";

const MedicoObraSocialModel = {
  // Listar obras sociales de un médico
  findByMedico: async (id_medico) => {
    const [rows] = await pool.query(
      `SELECT mos.*, os.nombre, os.descripcion, os.porcentaje_descuento, os.es_particular
             FROM medicos_obras_sociales mos
             JOIN obras_sociales os ON mos.id_obra_social = os.id_obra_social
             WHERE mos.id_medico = ? AND mos.activo = 1 AND os.activo = 1`,
      [id_medico],
    );
    return rows;
  },

  // Verificar si ya existe la asociación
  exists: async (id_medico, id_obra_social) => {
    const [rows] = await pool.query(
      `SELECT * FROM medicos_obras_sociales 
             WHERE id_medico = ? AND id_obra_social = ?`,
      [id_medico, id_obra_social],
    );
    return rows[0];
  },

  // Crear nueva asociación (o reactivar si existe inactiva)
  create: async (id_medico, id_obra_social) => {
    const existing = await MedicoObraSocialModel.exists(
      id_medico,
      id_obra_social,
    );

    if (existing && !existing.activo) {
      // Reactivar
      const [result] = await pool.query(
        `UPDATE medicos_obras_sociales SET activo = 1 
                 WHERE id_medico = ? AND id_obra_social = ?`,
        [id_medico, id_obra_social],
      );
      return { reactivated: true, affectedRows: result.affectedRows };
    }

    if (existing && existing.activo) {
      throw new Error("La asociación ya existe");
    }

    // Crear nueva
    const [result] = await pool.query(
      `INSERT INTO medicos_obras_sociales (id_medico, id_obra_social, activo) 
             VALUES (?, ?, 1)`,
      [id_medico, id_obra_social],
    );
    return { id: result.insertId, reactivated: false };
  },

  // Soft delete de la asociación
  softDelete: async (id_medico, id_obra_social) => {
    const [result] = await pool.query(
      `UPDATE medicos_obras_sociales SET activo = 0 
             WHERE id_medico = ? AND id_obra_social = ? AND activo = 1`,
      [id_medico, id_obra_social],
    );
    return result.affectedRows;
  },

  // Obtener todas las obras sociales que NO tiene un médico (para el front)
  findAvailableForMedico: async (id_medico) => {
    const [rows] = await pool.query(
      `SELECT * FROM obras_sociales 
             WHERE activo = 1 
             AND id_obra_social NOT IN (
                 SELECT id_obra_social FROM medicos_obras_sociales 
                 WHERE id_medico = ? AND activo = 1
             )`,
      [id_medico],
    );
    return rows;
  },
};

export default MedicoObraSocialModel;

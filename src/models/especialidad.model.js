import pool from "../config/db.js";

const EspecialidadModel = {
  //*Browse - listar todas las especialidades activas
  findAll: async () => {
    const [rows] = await pool.query(
      "SELECT * FROM especialidades WHERE activo = 1",
    );
    return rows;
  },

  //*Read - obtener una especialidad por ID
  findById: async (id) => {
    const [rows] = await pool.query(
      "SELECT * FROM especialidades WHERE id_especialidad = ? AND activo = 1",
      [id],
    );
    return rows[0];
  },

  //*Add - crear nueva especialidad
  create: async (nombre) => {
    const [result] = await pool.query(
      "INSERT INTO especialidades (nombre, activo) VALUES (?, 1)",
      [nombre],
    );
    return result.insertId;
  },

  //*Edit - editar especialidad existente
  update: async (id, nombre) => {
    const [result] = await pool.query(
      "UPDATE especialidades SET nombre = ? WHERE id_especialidad = ? AND activo = 1",
      [nombre, id],
    );
    return result.affectedRows;
  },

  //*Buscar por nombre (incluye activos e inactivos)
  findByNombre: async (nombre) => {
    const [rows] = await pool.query(
      "SELECT * FROM especialidades WHERE nombre = ? LIMIT 1",
      [nombre],
    );
    return rows[0];
  },

  //*Reactivar (o cambiar estado)
  updateActive: async (id, activo) => {
    const [result] = await pool.query(
      "UPDATE especialidades SET activo = ? WHERE id_especialidad = ?",
      [activo, id],
    );
    return result.affectedRows;
  },

  //*Delete - soft delete, marca como inactiva sin borrar el registro
  softDelete: async (id) => {
    const [result] = await pool.query(
      "UPDATE especialidades SET activo = 0 WHERE id_especialidad = ? AND activo = 1",
      [id],
    );
    return result.affectedRows;
  },
};

export default EspecialidadModel;

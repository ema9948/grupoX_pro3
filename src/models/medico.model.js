// src/models/medico.model.js
import pool from "../config/db.js";

const MedicoModel = {
  // Listar todos los médicos
  findAll: async (id_especialidad = null) => {
    let query = `
        SELECT m.*, u.apellido, u.nombres, u.email, u.foto_path, 
               e.id_especialidad, e.nombre as especialidad
        FROM medicos m
        JOIN usuarios u ON m.id_usuario = u.id_usuario
        JOIN especialidades e ON m.id_especialidad = e.id_especialidad
        WHERE u.activo = 1`;

    const params = [];

    if (id_especialidad) {
      query += " AND m.id_especialidad = ?";
      params.push(id_especialidad);
    }

    const [rows] = await pool.query(query, params);
    return rows;
  },

  // Obtener médico por ID
  findById: async (id) => {
    const [rows] = await pool.query(
      `
            SELECT m.*, u.apellido, u.nombres, u.email, u.foto_path, 
                   e.id_especialidad, e.nombre as especialidad
            FROM medicos m
            JOIN usuarios u ON m.id_usuario = u.id_usuario
            JOIN especialidades e ON m.id_especialidad = e.id_especialidad
            WHERE m.id_medico = ? AND u.activo = 1`,
      [id],
    );
    return rows[0];
  },

  // Crear nuevo médico
  create: async (
    id_usuario,
    id_especialidad,
    matricula,
    descripcion,
    valor_consulta,
  ) => {
    const [result] = await pool.query(
      `INSERT INTO medicos 
             (id_usuario, id_especialidad, matricula, descripcion, valor_consulta)
             VALUES (?, ?, ?, ?, ?)`,
      [
        id_usuario,
        id_especialidad,
        matricula,
        descripcion || null,
        valor_consulta,
      ],
    );
    return result.insertId;
  },

  // Actualizar médico
  update: async (
    id,
    id_especialidad,
    matricula,
    descripcion,
    valor_consulta,
  ) => {
    const [result] = await pool.query(
      `UPDATE medicos 
             SET id_especialidad = ?, matricula = ?, descripcion = ?, valor_consulta = ?
             WHERE id_medico = ?`,
      [id_especialidad, matricula, descripcion, valor_consulta, id],
    );
    return result.affectedRows;
  },

  // Soft delete (usamos el activo del usuario asociado)
  softDelete: async (id) => {
    // Desactivamos el usuario asociado al médico
    const [result] = await pool.query(
      `
            UPDATE usuarios u
            JOIN medicos m ON u.id_usuario = m.id_usuario
            SET u.activo = 0 
            WHERE m.id_medico = ?`,
      [id],
    );
    return result.affectedRows;
  },

  // Buscar por matrícula
  findByMatricula: async (matricula) => {
    const [rows] = await pool.query(
      "SELECT * FROM medicos WHERE matricula = ?",
      [matricula],
    );
    return rows[0];
  },
  findByUsuario: async (id_usuario) => {
    const [rows] = await pool.query(
      "SELECT * FROM medicos WHERE id_usuario = ?",
      [id_usuario],
    );
    return rows[0];
  },
};

export default MedicoModel;

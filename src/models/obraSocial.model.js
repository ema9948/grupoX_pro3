import pool from "../config/db.js";

const ObraSocialModel = {
  //*Browse - listar todas
  findAll: async () => {
    const [rows] = await pool.query(
      "SELECT * FROM obras_sociales WHERE activo = 1",
    );
    return rows;
  },

  //*Read - obtener una por ID
  findById: async (id) => {
    const [rows] = await pool.query(
      "SELECT * FROM obras_sociales WHERE id_obra_social = ? AND activo = 1",
      [id],
    );
    return rows[0];
  },

  //*Add - crear nueva
  create: async (nombre, descripcion, porcentaje_descuento, es_particular) => {
    const [result] = await pool.query(
      `INSERT INTO obras_sociales 
             (nombre, descripcion, porcentaje_descuento, es_particular, activo) 
             VALUES (?, ?, ?, ?, 1)`,
      [nombre, descripcion, porcentaje_descuento, es_particular],
    );
    return result.insertId;
  },

  //*Edit - editar
  update: async (
    id,
    nombre,
    descripcion,
    porcentaje_descuento,
    es_particular,
  ) => {
    const [result] = await pool.query(
      `UPDATE obras_sociales 
             SET nombre = ?, descripcion = ?, porcentaje_descuento = ?, es_particular = ?
             WHERE id_obra_social = ? AND activo = 1`,
      [nombre, descripcion, porcentaje_descuento, es_particular, id],
    );
    return result.affectedRows;
  },
  //*Buscar por nombre (incluye activos e inactivos)
  findByNombre: async (nombre) => {
    const [rows] = await pool.query(
      "SELECT * FROM obras_sociales WHERE nombre = ? LIMIT 1",
      [nombre],
    );
    return rows[0];
  },

  //*Reactivar (o cambiar estado)
  updateActive: async (id, activo) => {
    const [result] = await pool.query(
      "UPDATE obras_sociales SET activo = ? WHERE id_obra_social = ?",
      [activo, id],
    );
    return result.affectedRows;
  },
  //*Delete - soft delete
  softDelete: async (id) => {
    const [result] = await pool.query(
      "UPDATE obras_sociales SET activo = 0 WHERE id_obra_social = ? AND activo = 1",
      [id],
    );
    return result.affectedRows;
  },
};

export default ObraSocialModel;

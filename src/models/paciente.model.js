// src/models/paciente.model.js
import pool from '../config/db.js';

const PacienteModel = {

    // Listar todos los pacientes
    findAll: async ({ status = "active" } = {}) => {
        let query = `
            SELECT p.id_paciente, p.id_usuario, p.id_obra_social,
                   u.apellido, u.nombres, u.email, u.foto_path,
                   os.nombre as nombre_obra_social, os.descripcion as descripcion_obra_social
            FROM pacientes p
            JOIN usuarios u ON p.id_usuario = u.id_usuario
            JOIN obras_sociales os ON p.id_obra_social = os.id_obra_social
            WHERE u.activo = 1`;

        const [rows] = await pool.query(query);
        return rows;
    },

    // Obtener paciente por ID
    findById: async (id) => {
        const [rows] = await pool.query(`
            SELECT p.id_paciente, p.id_usuario, p.id_obra_social,
                   u.apellido, u.nombres, u.email, u.foto_path,
                   os.nombre as nombre_obra_social, os.descripcion as descripcion_obra_social
            FROM pacientes p
            JOIN usuarios u ON p.id_usuario = u.id_usuario
            JOIN obras_sociales os ON p.id_obra_social = os.id_obra_social
            WHERE p.id_paciente = ? AND u.activo = 1`,
            [id]
        );
        return rows[0];
    },

    // Crear nuevo paciente
    create: async (id_usuario, id_obra_social) => {
        const [result] = await pool.query(
            `INSERT INTO pacientes (id_usuario, id_obra_social)
             VALUES (?, ?)`,
            [id_usuario, id_obra_social]
        );
        return result.insertId;
    },

    // Actualizar paciente
    update: async (id, id_obra_social) => {
        const [result] = await pool.query(
            `UPDATE pacientes 
             SET id_obra_social = ?
             WHERE id_paciente = ?`,
            [id_obra_social, id]
        );
        return result.affectedRows;
    },

    // Soft delete (desactiva el usuario asociado)
    softDelete: async (id) => {
        const [result] = await pool.query(`
            UPDATE usuarios u
            JOIN pacientes p ON u.id_usuario = p.id_usuario
            SET u.activo = 0 
            WHERE p.id_paciente = ?`,
            [id]
        );
        return result.affectedRows;
    },

    // Verificar si un usuario ya es paciente
    findByUsuario: async (id_usuario) => {
        const [rows] = await pool.query(
            "SELECT * FROM pacientes WHERE id_usuario = ?",
            [id_usuario]
        );
        return rows[0];
    }
};

export default PacienteModel;




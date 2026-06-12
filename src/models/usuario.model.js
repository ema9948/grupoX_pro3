import pool from '../config/db.js';

const UsuarioModel = {

    //*Busca usuario por email y password 
    findByEmailAndPassword: async (email, password) => {
        const [rows] = await pool.query(
            `SELECT id_usuario, rol, email, activo 
             FROM usuarios 
             WHERE email = ? 
             AND contrasenia = SHA2(?, 256) 
             AND activo = 1`,
            [email, password]
        );
        return rows[0];
    },

    //*Buscar usuario por ID 
    findById: async (id) => {
        const [rows] = await pool.query(
            `SELECT id_usuario, rol, apellido, nombres, email, activo 
             FROM usuarios 
             WHERE id_usuario = ? AND activo = 1`,
            [id]
        );
        return rows[0];
    }
};

export default UsuarioModel;
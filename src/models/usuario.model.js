import pool from '../config/db.js';

const UsuarioModel = {

    // Busca usuario por email Y verifica la contraseña con SHA2-256 en la misma query
    // SHA2(password, 256) es la función de MySQL que hashea con SHA-256
    // Solo retorna el usuario si email + password son correctos y está activo
    findByEmailAndPassword: async (email, password) => {
        const [rows] = await pool.query(
            `SELECT * FROM usuarios 
             WHERE email = ? 
             AND contrasenia = SHA2(?, 256) 
             AND activo = 1`,
            [email, password]
        );
        return rows[0];
    }

};

export default UsuarioModel;

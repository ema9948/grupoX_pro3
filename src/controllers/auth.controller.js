import jwt from 'jsonwebtoken';
import pool from '../config/db.js';
import UsuarioModel from '../models/usuario.model.js';

const AuthController = {

    //*POST /api/auth/login
    login: async (req, res) => {
        try {
            const { email, password } = req.body;

            //*Busca el usuario verificando email + password con SHA2 en una sola query
            //*Si no existe o la contraseña es incorrecta devuelve undefined
            const usuario = await UsuarioModel.findByEmailAndPassword(email, password);

            //*Respuesta genérica para no dar pistas de si el email existe o no
            if (!usuario) {
                return res.status(401).json({ message: 'Credenciales inválidas' });
            }

            //*Genera el JWT con datos básicos del usuario
            //*No incluir datos sensibles en el payload, es decodificable
            const token = jwt.sign(
                {
                    id: usuario.id_usuario,
                    rol: usuario.rol,
                    email: usuario.email
                },
                process.env.JWT_SECRET,
                { expiresIn: '8h' }
            );

            res.status(200).json({
                message: 'Login exitoso',
                token
            });

        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Error interno del servidor' });
        }
    },
    //*PUT /api/auth/foto
    subirFoto: async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No se recibió ningún archivo' });
        }

        const foto_path = req.file.filename;
        const id_usuario = req.usuario.id;

        await pool.query(
            'UPDATE usuarios SET foto_path = ? WHERE id_usuario = ?',
            [foto_path, id_usuario]
        );

        res.status(200).json({
            message: 'Foto actualizada correctamente',
            foto_path
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
}

};

export default AuthController;

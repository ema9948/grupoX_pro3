import { Router } from 'express';
import AuthController from '../controllers/auth.controller.js';
import upload from '../middlewares/upload.middleware.js';
import { verifyToken } from '../middlewares/auth.middleware.js';

const router = Router();

/**
 * @swagger
 * /api/v1/auth/login:
 *   post:
 *     summary: Iniciar sesión
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: admin@clinica.com
 *               password:
 *                 type: string
 *                 example: admin123
 *     responses:
 *       200:
 *         description: Login exitoso, devuelve JWT
 *       401:
 *         description: Credenciales inválidas
 */
router.post('/login', AuthController.login);


/**
 * @swagger
 * /api/v1/auth/foto:
 *   put:
 *     summary: Subir foto de perfil
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               foto:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Foto actualizada correctamente
 *       400:
 *         description: Archivo inválido
 */
router.put('/foto', verifyToken, upload.single('foto'), AuthController.subirFoto);

export default router;
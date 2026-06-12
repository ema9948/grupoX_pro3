import { Router } from 'express';
import EspecialidadController from '../controllers/especialidad.controller.js';
import { verifyToken, authorizeRoles } from '../middlewares/auth.middleware.js';
import { especialidadValidator } from '../middlewares/validators/especialidad.validator.js';
import validate from '../middlewares/validate.middleware.js';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Especialidades
 *   description: Gestión de especialidades médicas
 */

/**
 * @swagger
 * /api/v1/especialidades:
 *   get:
 *     summary: Listar todas las especialidades
 *     tags: [Especialidades]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de especialidades
 *       401:
 *         description: Token requerido
 */
router.get('/', verifyToken, authorizeRoles(2, 3), EspecialidadController.getAll);

/**
 * @swagger
 * /api/v1/especialidades/{id}:
 *   get:
 *     summary: Obtener una especialidad por ID
 *     tags: [Especialidades]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Especialidad encontrada
 *       404:
 *         description: Especialidad no encontrada
 */
router.get('/:id', verifyToken, authorizeRoles(2, 3), EspecialidadController.getById);

/**
 * @swagger
 * /api/v1/especialidades:
 *   post:
 *     summary: Crear nueva especialidad
 *     tags: [Especialidades]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nombre
 *             properties:
 *               nombre:
 *                 type: string
 *                 example: Cardiología
 *     responses:
 *       201:
 *         description: Especialidad creada correctamente
 *       400:
 *         description: Datos inválidos
 *       403:
 *         description: Sin permisos
 */
router.post('/', verifyToken, authorizeRoles(3), especialidadValidator, validate, EspecialidadController.create);

/**
 * @swagger
 * /api/v1/especialidades/{id}:
 *   put:
 *     summary: Editar especialidad
 *     tags: [Especialidades]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nombre:
 *                 type: string
 *                 example: Cardiología General
 *     responses:
 *       200:
 *         description: Especialidad actualizada
 *       404:
 *         description: Especialidad no encontrada
 */
router.put('/:id', verifyToken, authorizeRoles(3), especialidadValidator, validate, EspecialidadController.update);

/**
 * @swagger
 * /api/v1/especialidades/{id}:
 *   delete:
 *     summary: Eliminar especialidad (soft delete)
 *     tags: [Especialidades]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Especialidad eliminada
 *       404:
 *         description: Especialidad no encontrada
 */
router.delete('/:id', verifyToken, authorizeRoles(3), EspecialidadController.remove);

export default router;
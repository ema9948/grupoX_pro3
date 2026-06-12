// src/routes/paciente.routes.js
import { Router } from 'express';
import PacienteController from '../controllers/paciente.controller.js';
import { verifyToken, authorizeRoles } from '../middlewares/auth.middleware.js';
import { pacienteValidator } from '../middlewares/validators/paciente.validator.js';
import validate from '../middlewares/validate.middleware.js';

const router = Router();

/**
 * @swagger
 * /api/pacientes:
 *   get:
 *     summary: Listar todos los pacientes (Admin y Pacientes)
 *     tags: [Pacientes]
 *     security:
 *       - bearerAuth: []
 */
router.get('/', verifyToken, authorizeRoles(2, 3), PacienteController.getAll);

/**
 * @swagger
 * /api/pacientes/{id}:
 *   get:
 *     summary: Obtener paciente por ID
 *     tags: [Pacientes]
 *     security:
 *       - bearerAuth: []
 */
router.get('/:id', verifyToken, authorizeRoles(2, 3), PacienteController.getById);

/**
 * @swagger
 * /api/pacientes:
 *   post:
 *     summary: Crear nuevo paciente (Solo Admin)
 *     tags: [Pacientes]
 *     security:
 *       - bearerAuth: []
 */
router.post('/', verifyToken, authorizeRoles(3), pacienteValidator, validate, PacienteController.create);

/**
 * @swagger
 * /api/pacientes/{id}:
 *   put:
 *     summary: Actualizar paciente (Solo Admin)
 *     tags: [Pacientes]
 *     security:
 *       - bearerAuth: []
 */
router.put('/:id', verifyToken, authorizeRoles(3), pacienteValidator, validate, PacienteController.update);

/**
 * @swagger
 * /api/pacientes/{id}:
 *   delete:
 *     summary: Eliminar paciente (soft delete) - Solo Admin
 *     tags: [Pacientes]
 *     security:
 *       - bearerAuth: []
 */
router.delete('/:id', verifyToken, authorizeRoles(3), PacienteController.remove);

export default router;



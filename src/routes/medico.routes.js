// src/routes/medico.routes.js
import { Router } from "express";
import MedicoController from "../controllers/medico.controller.js";
import { verifyToken, authorizeRoles } from "../middlewares/auth.middleware.js";
import {
  medicoCreateValidator,
  medicoUpdateValidator,
} from "../middlewares/validators/medico.validator.js";
import validate from "../middlewares/validate.middleware.js";

const router = Router();

/**
 * @swagger
 * /api/medicos:
 *   get:
 *     summary: Listar todos los médicos
 *     tags: [Médicos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [active, inactive, all]
 *         description: Filtrar por estado
 *     responses:
 *       200:
 *         description: Lista de médicos
 *       401:
 *         description: No autorizado
 */
router.get("/", verifyToken, authorizeRoles(2, 3), MedicoController.getAll);

/**
 * @swagger
 * /api/medicos/{id}:
 *   get:
 *     summary: Obtener médico por ID
 *     tags: [Médicos]
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
 *         description: Datos del médico
 *       404:
 *         description: Médico no encontrado
 */
router.get("/:id", verifyToken, authorizeRoles(2, 3), MedicoController.getById);

/**
 * @swagger
 * /api/medicos:
 *   post:
 *     summary: Crear nuevo médico (Solo Admin)
 *     tags: [Médicos]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [id_usuario, id_especialidad, matricula, valor_consulta]
 *             properties:
 *               id_usuario: { type: integer }
 *               id_especialidad: { type: integer }
 *               matricula: { type: integer }
 *               descripcion: { type: string }
 *               valor_consulta: { type: number }
 *     responses:
 *       201:
 *         description: Médico creado exitosamente
 */
router.post(
  "/",
  verifyToken,
  authorizeRoles(3),
  medicoCreateValidator,
  validate,
  MedicoController.create,
);

/**
 * @swagger
 * /api/medicos/{id}:
 *   put:
 *     summary: Actualizar médico (Solo Admin)
 *     tags: [Médicos]
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
 *               id_especialidad: { type: integer }
 *               matricula: { type: integer }
 *               descripcion: { type: string }
 *               valor_consulta: { type: number }
 *     responses:
 *       200:
 *         description: Médico actualizado
 */
router.put(
  "/:id",
  verifyToken,
  authorizeRoles(3),
  medicoUpdateValidator,
  validate,
  MedicoController.update,
);

/**
 * @swagger
 * /api/medicos/{id}:
 *   delete:
 *     summary: Eliminar médico (soft delete) - Solo Admin
 *     tags: [Médicos]
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
 *         description: Médico eliminado correctamente
 */
router.delete("/:id", verifyToken, authorizeRoles(3), MedicoController.remove);

export default router;

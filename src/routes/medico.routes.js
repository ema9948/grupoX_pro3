// src/routes/medico.routes.js
import { Router } from "express";
import MedicoController from "../controllers/medico.controller.js";
import MedicoObraSocialController from "../controllers/medicoObraSocial.controller.js";
import { verifyToken, authorizeRoles } from "../middlewares/auth.middleware.js";
import {
  medicoCreateValidator,
  medicoUpdateValidator,
} from "../middlewares/validators/medico.validator.js";
import validate from "../middlewares/validate.middleware.js";
import { body } from "express-validator"; // Agregar esta importación

const router = Router();

/**
 * @swagger
 * /api/v1/medicos:
 *   get:
 *     summary: Listar todos los médicos
 *     tags: [Médicos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: id_especialidad
 *         schema:
 *           type: integer
 *         description: Filtrar por especialidad
 *     responses:
 *       200:
 *         description: Lista de médicos
 */
router.get("/", verifyToken, authorizeRoles(2, 3), MedicoController.getAll);

/**
 * @swagger
 * /api/v1/medicos/{id}:
 *   get:
 *     summary: Obtener médico por ID
 *     tags: [Médicos]
 *     security:
 *       - bearerAuth: []
 */
router.get("/:id", verifyToken, authorizeRoles(2, 3), MedicoController.getById);

/**
 * @swagger
 * /api/v1/medicos:
 *   post:
 *     summary: Crear nuevo médico (Solo Admin)
 *     tags: [Médicos]
 *     security:
 *       - bearerAuth: []
 */
router.post(
  "/",
  verifyToken,
  authorizeRoles(3), // ✅ Solo administradores (rol = 3)
  medicoCreateValidator,
  validate,
  MedicoController.create,
);

/**
 * @swagger
 * /api/v1/medicos/{id}:
 *   put:
 *     summary: Actualizar médico (Solo Admin)
 *     tags: [Médicos]
 *     security:
 *       - bearerAuth: []
 */
router.put(
  "/:id",
  verifyToken,
  authorizeRoles(3), // ✅ Solo administradores (rol = 3)
  medicoUpdateValidator,
  validate,
  MedicoController.update,
);

/**
 * @swagger
 * /api/v1/medicos/{id}:
 *   delete:
 *     summary: Eliminar médico (soft delete) - Solo Admin
 *     tags: [Médicos]
 *     security:
 *       - bearerAuth: []
 */
router.delete("/:id", verifyToken, authorizeRoles(3), MedicoController.remove);

// ==============================================
// NUEVAS RUTAS PARA ASOCIAR MÉDICOS CON OBRAS SOCIALES
// ==============================================

/**
 * @swagger
 * /api/v1/medicos/{idMedico}/obras-sociales:
 *   get:
 *     summary: Listar obras sociales asociadas a un médico
 *     tags: [Médicos - Obras Sociales]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: idMedico
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Lista de obras sociales del médico
 */
router.get(
  "/:idMedico/obras-sociales",
  verifyToken,
  authorizeRoles(3), // ✅ Solo administradores
  MedicoObraSocialController.getByMedico,
);

/**
 * @swagger
 * /api/v1/medicos/{idMedico}/obras-sociales:
 *   post:
 *     summary: Asociar un médico con una obra social
 *     tags: [Médicos - Obras Sociales]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: idMedico
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id_obra_social
 *             properties:
 *               id_obra_social:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Asociación creada correctamente
 */
router.post(
  "/:idMedico/obras-sociales",
  verifyToken,
  authorizeRoles(3), // ✅ Solo administradores
  body("id_obra_social")
    .isInt()
    .withMessage("id_obra_social debe ser un número entero"),
  validate,
  MedicoObraSocialController.create,
);

/**
 * @swagger
 * /api/v1/medicos/{idMedico}/obras-sociales/{idObraSocial}:
 *   delete:
 *     summary: Eliminar asociación entre médico y obra social
 *     tags: [Médicos - Obras Sociales]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: idMedico
 *         required: true
 *         schema:
 *           type: integer
 *       - in: path
 *         name: idObraSocial
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Asociación eliminada correctamente
 */
router.delete(
  "/:idMedico/obras-sociales/:idObraSocial",
  verifyToken,
  authorizeRoles(3), // ✅ Solo administradores
  MedicoObraSocialController.remove,
);

/**
 * @swagger
 * /api/v1/medicos/{idMedico}/obras-sociales/disponibles:
 *   get:
 *     summary: Obtener obras sociales disponibles para asociar a un médico
 *     tags: [Médicos - Obras Sociales]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: idMedico
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Lista de obras sociales no asociadas al médico
 */
router.get(
  "/:idMedico/obras-sociales/disponibles",
  verifyToken,
  authorizeRoles(3), // ✅ Solo administradores
  MedicoObraSocialController.getAvailable,
);

export default router;

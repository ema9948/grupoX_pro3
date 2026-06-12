// src/routes/turno.routes.js
import { Router } from "express";
import TurnoController from "../controllers/turno.controller.js";
import { verifyToken, authorizeRoles } from "../middlewares/auth.middleware.js";
import { turnoValidator } from "../middlewares/validators/turno.validator.js";
import validate from "../middlewares/validate.middleware.js";

const router = Router();

/**
 * @swagger
 * /api/turnos:
 *   post:
 *     summary: Crear una reserva de turno (Solo Pacientes)
 *     tags: [Turnos]
 *     security:
 *       - bearerAuth: []
 */
router.post(
  "/",
  verifyToken,
  authorizeRoles(2, 3),
  turnoValidator,
  validate,
  TurnoController.create,
);

/**
 * @swagger
 * /api/turnos/mis-turnos:
 *   get:
 *     summary: Obtener mis turnos según el rol del usuario
 *     tags: [Turnos]
 *     security:
 *       - bearerAuth: []
 */
router.get("/mis-turnos", verifyToken, TurnoController.getMisTurnos);

/**
 * @swagger
 * /api/turnos/{id}/atender:
 *   put:
 *     summary: Marcar un turno como atendido (Solo Médicos)
 *     tags: [Turnos]
 *     security:
 *       - bearerAuth: []
 */
router.put(
  "/:id/atender",
  verifyToken,
  authorizeRoles(1),
  TurnoController.marcarAtendido,
);

/**
 * @swagger
 * /api/turnos/informe-pdf:
 *   get:
 *     summary: Generar informe PDF de turnos (Solo Admin)
 *     tags: [Turnos]
 *     security:
 *       - bearerAuth: []
 *     description: Descarga un PDF con estadísticas y listado de turnos
 */
router.get(
  "/informe-pdf",
  verifyToken,
  authorizeRoles(3),
  TurnoController.generarInformePDF,
);

export default router;
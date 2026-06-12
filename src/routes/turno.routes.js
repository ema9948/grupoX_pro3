//*src/routes/turno.routes.js
import { Router } from "express";
import TurnoController from "../controllers/turno.controller.js";
import { verifyToken, authorizeRoles } from "../middlewares/auth.middleware.js";
import { turnoValidator } from "../middlewares/validators/turno.validator.js";
import validate from "../middlewares/validate.middleware.js";

const router = Router();

/**
 * @swagger
 * /api/v1/turnos:
 *   post:
 *     summary: Crear una reserva de turno (Pacientes y Admin)
 *     tags: [Turnos]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [id_medico, fecha_hora]
 *             properties:
 *               id_medico: { type: integer }
 *               id_paciente: { type: integer, description: "Solo requerido si es Admin" }
 *               fecha_hora: { type: string, format: date-time }
 *     responses:
 *       201:
 *         description: Turno reservado correctamente
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
 * /api/v1/turnos/mis-turnos:
 *   get:
 *     summary: Obtener mis turnos según el rol del usuario
 *     tags: [Turnos]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de turnos del usuario
 */
router.get("/mis-turnos", verifyToken, TurnoController.getMisTurnos);

/**
 * @swagger
 * /api/v1/turnos/{id}/atender:
 *   put:
 *     summary: Marcar un turno como atendido (Solo Médicos)
 *     tags: [Turnos]
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
 *         description: Turno marcado como atendido
 */
router.put(
  "/:id/atender",
  verifyToken,
  authorizeRoles(1),
  TurnoController.marcarAtendido,
);

/**
 * @swagger
 * /api/v1/turnos/informe-pdf:
 *   get:
 *     summary: Generar informe PDF de turnos (Solo Admin)
 *     tags: [Turnos]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Archivo PDF descargable con estadísticas y listado
 *         content:
 *           application/pdf:
 *             schema:
 *               type: string
 *               format: binary
 */
router.get(
  "/informe-pdf",
  verifyToken,
  authorizeRoles(3),
  TurnoController.generarInformePDF,
);

/**
 * @swagger
 * /api/v1/turnos/estadisticas:
 *   get:
 *     summary: Obtener estadísticas de turnos en JSON (Solo Admin)
 *     tags: [Turnos]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Estadísticas de turnos
 */
router.get(
  "/estadisticas",
  verifyToken,
  authorizeRoles(3),
  TurnoController.getEstadisticas,
);
/**
 * @swagger
 * /api/v1/turnos/{id}/cancelar:
 *   delete:
 *     summary: Cancelar un turno (soft delete)
 *     tags: [Turnos]
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
 *         description: Turno cancelado correctamente
 *       404:
 *         description: Turno no encontrado
 */
router.delete(
    '/:id/cancelar',
    verifyToken,
    authorizeRoles(1, 2, 3), // Médicos, pacientes y admin pueden cancelar
    TurnoController.cancelarTurno
);
export default router;

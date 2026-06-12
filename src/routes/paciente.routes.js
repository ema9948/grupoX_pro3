import { Router } from "express";
import PacienteController from "../controllers/paciente.controller.js";
import { verifyToken, authorizeRoles } from "../middlewares/auth.middleware.js";
import { pacienteValidator } from "../middlewares/validators/paciente.validator.js";
import validate from "../middlewares/validate.middleware.js";

const router = Router();

/**
 * @swagger
 * /api/v1/pacientes:
 *   get:
 *     summary: Listar todos los pacientes (Solo Admin)
 *     tags: [Pacientes]
 *     security:
 *       - bearerAuth: []
 */
router.get("/", verifyToken, authorizeRoles(3), PacienteController.getAll);

/**
 * @swagger
 * /api/v1/pacientes/{id}:
 *   get:
 *     summary: Obtener paciente por ID (Solo Admin)
 *     tags: [Pacientes]
 *     security:
 *       - bearerAuth: []
 */
router.get("/:id", verifyToken, authorizeRoles(3), PacienteController.getById);

/**
 * @swagger
 * /api/v1/pacientes:
 *   post:
 *     summary: Crear nuevo paciente (Solo Admin)
 *     tags: [Pacientes]
 *     security:
 *       - bearerAuth: []
 */
router.post(
  "/",
  verifyToken,
  authorizeRoles(3),
  pacienteValidator,
  validate,
  PacienteController.create,
);

/**
 * @swagger
 * /api/v1/pacientes/{id}:
 *   put:
 *     summary: Actualizar paciente (Solo Admin)
 *     tags: [Pacientes]
 *     security:
 *       - bearerAuth: []
 */
router.put(
  "/:id",
  verifyToken,
  authorizeRoles(3),
  pacienteValidator,
  validate,
  PacienteController.update,
);

/**
 * @swagger
 * /api/v1/pacientes/{id}:
 *   delete:
 *     summary: Eliminar paciente (soft delete) - Solo Admin
 *     tags: [Pacientes]
 *     security:
 *       - bearerAuth: []
 */
router.delete(
  "/:id",
  verifyToken,
  authorizeRoles(3),
  PacienteController.remove,
);

export default router;

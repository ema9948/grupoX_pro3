//*src/routes/obraSocial.routes.js
import { Router } from "express";
import ObraSocialController from "../controllers/obraSocial.controller.js";
import { verifyToken, authorizeRoles } from "../middlewares/auth.middleware.js";
import { obraSocialValidator } from "../middlewares/validators/obraSocial.validator.js";
import validate from "../middlewares/validate.middleware.js";

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Obras Sociales
 *   description: Gestión de obras sociales
 */

/**
 * @swagger
 * /api/v1/obras-sociales:
 *   get:
 *     summary: Listar todas las obras sociales (Solo Admin)
 *     tags: [Obras Sociales]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de obras sociales
 */
router.get("/", verifyToken, authorizeRoles(3), ObraSocialController.getAll);

/**
 * @swagger
 * /api/v1/obras-sociales/{id}:
 *   get:
 *     summary: Obtener obra social por ID (Solo Admin)
 *     tags: [Obras Sociales]
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
 *         description: Datos de la obra social
 *       404:
 *         description: Obra social no encontrada
 */
router.get(
  "/:id",
  verifyToken,
  authorizeRoles(3),
  ObraSocialController.getById,
);

/**
 * @swagger
 * /api/v1/obras-sociales:
 *   post:
 *     summary: Crear nueva obra social (Solo Admin)
 *     tags: [Obras Sociales]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [nombre, porcentaje_descuento]
 *             properties:
 *               nombre:
 *                 type: string
 *               descripcion:
 *                 type: string
 *               porcentaje_descuento:
 *                 type: number
 *               es_particular:
 *                 type: boolean
 *     responses:
 *       201:
 *         description: Obra social creada correctamente
 */
router.post(
  "/",
  verifyToken,
  authorizeRoles(3),
  obraSocialValidator,
  validate,
  ObraSocialController.create,
);

/**
 * @swagger
 * /api/v1/obras-sociales/{id}:
 *   put:
 *     summary: Actualizar obra social (Solo Admin)
 *     tags: [Obras Sociales]
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
 *               descripcion:
 *                 type: string
 *               porcentaje_descuento:
 *                 type: number
 *               es_particular:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Obra social actualizada correctamente
 */
router.put(
  "/:id",
  verifyToken,
  authorizeRoles(3),
  obraSocialValidator,
  validate,
  ObraSocialController.update,
);

/**
 * @swagger
 * /api/v1/obras-sociales/{id}:
 *   delete:
 *     summary: Eliminar obra social (soft delete) - Solo Admin
 *     tags: [Obras Sociales]
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
 *         description: Obra social eliminada correctamente
 */
router.delete(
  "/:id",
  verifyToken,
  authorizeRoles(3),
  ObraSocialController.remove,
);

export default router;

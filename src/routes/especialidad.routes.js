import { Router } from 'express';
import EspecialidadController from '../controllers/especialidad.controller.js';
import { verifyToken, authorizeRoles } from '../middlewares/auth.middleware.js';
import { especialidadValidator } from '../middlewares/validators/especialidad.validator.js';
import validate from '../middlewares/validate.middleware.js';

const router = Router();

// Paciente (2) y Admin (3) pueden listar especialidades
router.get('/', verifyToken, authorizeRoles(2, 3), EspecialidadController.getAll);
router.get('/:id', verifyToken, authorizeRoles(2, 3), EspecialidadController.getById);

// Solo Admin (3) puede crear, editar y eliminar
router.post('/', verifyToken, authorizeRoles(3), especialidadValidator, validate, EspecialidadController.create);
router.put('/:id', verifyToken, authorizeRoles(3), especialidadValidator, validate, EspecialidadController.update);
router.delete('/:id', verifyToken, authorizeRoles(3), EspecialidadController.remove);

export default router;
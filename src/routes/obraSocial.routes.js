import { Router } from 'express';
import ObraSocialController from '../controllers/obraSocial.controller.js';
import { verifyToken, authorizeRoles } from '../middlewares/auth.middleware.js';
import { obraSocialValidator } from '../middlewares/validators/obraSocial.validator.js';
import validate from '../middlewares/validate.middleware.js';

const router = Router();

// Solo Admin (3) puede gestionar obras sociales
router.get('/', verifyToken, authorizeRoles(3), ObraSocialController.getAll);
router.get('/:id', verifyToken, authorizeRoles(3), ObraSocialController.getById);
router.post('/', verifyToken, authorizeRoles(3), obraSocialValidator, validate, ObraSocialController.create);
router.put('/:id', verifyToken, authorizeRoles(3), obraSocialValidator, validate, ObraSocialController.update);
router.delete('/:id', verifyToken, authorizeRoles(3), ObraSocialController.remove);

export default router;

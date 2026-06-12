//*src/middlewares/validators/paciente.validator.js
import { body } from 'express-validator';

const pacienteValidator = [
    body('id_usuario')
        .notEmpty().withMessage('El id_usuario es requerido')
        .isInt().withMessage('El id_usuario debe ser un número entero positivo')
        .toInt(),

    body('id_obra_social')
        .notEmpty().withMessage('La obra social es requerida')
        .isInt().withMessage('El id_obra_social debe ser un número entero')
        .toInt()
];

export { pacienteValidator };
import { body } from "express-validator";

const especialidadValidator = [
  body("nombre")
    .notEmpty()
    .withMessage("El nombre es requerido")
    .isString()
    .withMessage("El nombre debe ser texto")
    .isLength({ min: 3, max: 120 })
    .withMessage("El nombre debe tener entre 3 y 120 caracteres")
    .trim(),
];

export { especialidadValidator };

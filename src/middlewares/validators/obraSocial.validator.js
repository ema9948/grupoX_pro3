import { body } from "express-validator";

const obraSocialValidator = [
  body("nombre")
    .notEmpty()
    .withMessage("El nombre es requerido")
    .isString()
    .withMessage("El nombre debe ser texto")
    .isLength({ min: 3, max: 120 })
    .withMessage("El nombre debe tener entre 3 y 120 caracteres")
    .trim(),

  body("descripcion")
    .notEmpty()
    .withMessage("La descripción es requerida")
    .isString()
    .withMessage("La descripción debe ser texto")
    .isLength({ max: 255 })
    .withMessage("La descripción no puede superar los 255 caracteres")
    .trim(),

  body("porcentaje_descuento")
    .notEmpty()
    .withMessage("El porcentaje de descuento es requerido")
    .isDecimal({ decimal_digits: "0,2" })
    .withMessage("El porcentaje debe ser un número decimal")
    .custom((val) => val >= 0 && val <= 100)
    .withMessage("El porcentaje debe estar entre 0 y 100"),

  body("es_particular")
    .notEmpty()
    .withMessage("El campo es_particular es requerido")
    .isIn([0, 1])
    .withMessage("es_particular debe ser 0 o 1"),
];

export { obraSocialValidator };

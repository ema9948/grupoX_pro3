import { body } from "express-validator";

// Para crear: todos los campos requeridos incluyendo id_usuario
const medicoCreateValidator = [
  body("id_usuario")
    .notEmpty()
    .withMessage("El id_usuario es requerido")
    .isInt()
    .withMessage("El id_usuario debe ser un número entero"),

  body("id_especialidad")
    .notEmpty()
    .withMessage("La especialidad es requerida")
    .isInt()
    .withMessage("El id_especialidad debe ser un número entero"),

  body("matricula")
    .notEmpty()
    .withMessage("La matrícula es requerida")
    .isInt()
    .withMessage("La matrícula debe ser un número entero"),

  body("descripcion")
    .optional()
    .isString()
    .withMessage("La descripción debe ser texto")
    .isLength({ max: 1000 })
    .withMessage("La descripción no puede superar los 1000 caracteres")
    .trim(),

  body("valor_consulta")
    .notEmpty()
    .withMessage("El valor de la consulta es requerido")
    .isDecimal({ decimal_digits: "0,2" })
    .withMessage("El valor debe ser un número decimal")
    .custom((val) => val > 0)
    .withMessage("El valor debe ser mayor a 0"),
];

// Para actualizar: no se puede cambiar el usuario
const medicoUpdateValidator = [
  body("id_especialidad")
    .notEmpty()
    .withMessage("La especialidad es requerida")
    .isInt()
    .withMessage("El id_especialidad debe ser un número entero"),

  body("matricula")
    .notEmpty()
    .withMessage("La matrícula es requerida")
    .isInt()
    .withMessage("La matrícula debe ser un número entero"),

  body("descripcion")
    .optional()
    .isString()
    .withMessage("La descripción debe ser texto")
    .isLength({ max: 1000 })
    .withMessage("La descripción no puede superar los 1000 caracteres")
    .trim(),

  body("valor_consulta")
    .notEmpty()
    .withMessage("El valor de la consulta es requerido")
    .isDecimal({ decimal_digits: "0,2" })
    .withMessage("El valor debe ser un número decimal")
    .custom((val) => val > 0)
    .withMessage("El valor debe ser mayor a 0"),
];

export { medicoCreateValidator, medicoUpdateValidator };

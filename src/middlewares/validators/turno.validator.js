import { body } from "express-validator";

const turnoValidator = [
  body("id_medico")
    .notEmpty()
    .withMessage("El id_medico es requerido")
    .isInt()
    .withMessage("El id_medico debe ser un número entero"),

  body("id_paciente")
    .optional()
    .isInt()
    .withMessage("El id_paciente debe ser un número entero"),

  body("fecha_hora")
    .notEmpty()
    .withMessage("La fecha y hora son requeridas")
    .isISO8601()
    .withMessage("La fecha_hora debe tener formato válido (ISO8601)"),
];

export { turnoValidator };

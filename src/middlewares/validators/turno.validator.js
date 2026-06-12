// src/middlewares/validators/turno.validator.js
import { body } from "express-validator";

// Función de validación personalizada para fechas futuras
const isValidFutureDate = (value, { req }) => {
  // Los administradores pueden crear turnos con fechas pasadas (carga histórica)
  if (req.usuario && req.usuario.rol === 3) {
    return true;
  }

  const fechaTurno = new Date(value);
  const ahora = new Date();
  ahora.setMilliseconds(0);

  if (fechaTurno <= ahora) {
    throw new Error(
      "La fecha y hora del turno debe ser posterior al momento actual",
    );
  }

  // Opcional: máximo 6 meses de anticipación
  const seisMeses = new Date();
  seisMeses.setMonth(seisMeses.getMonth() + 6);
  if (fechaTurno > seisMeses) {
    throw new Error(
      "No se pueden reservar turnos con más de 6 meses de anticipación",
    );
  }

  return true;
};

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
    .withMessage("La fecha_hora debe tener formato válido (ISO8601)")
    .custom((value, { req }) => isValidFutureDate(value, { req }))
    .withMessage("La fecha debe ser futura"),
];

export { turnoValidator };

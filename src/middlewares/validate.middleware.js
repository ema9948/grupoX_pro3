import { validationResult } from 'express-validator';

// Middleware genérico que revisa si las validaciones anteriores encontraron errores
const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            message: 'Datos inválidos',
            errors: errors.array()
        });
    }
    next();
};

export default validate;

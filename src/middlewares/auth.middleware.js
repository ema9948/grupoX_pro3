import jwt from 'jsonwebtoken';

// Middleware 1: Verifica que el token JWT exista y sea válido
const verifyToken = (req, res, next) => {
    // El token viene en el header Authorization con formato: "Bearer <token>"
    const authHeader = req.headers['authorization'];

    if (!authHeader) {
        return res.status(401).json({ message: 'Token requerido' });
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Formato de token inválido' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // Guardamos los datos del usuario en req para usarlos en los controllers
        req.usuario = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ message: 'Token inválido o expirado' });
    }
};

// Middleware 2: Verifica que el usuario tenga el rol permitido
// Uso: authorizeRoles(1, 3) → solo médicos y admins
const authorizeRoles = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.usuario.rol)) {
            return res.status(403).json({
                message: 'No tenés permisos para realizar esta acción'
            });
        }
        next();
    };
};

export { verifyToken, authorizeRoles };

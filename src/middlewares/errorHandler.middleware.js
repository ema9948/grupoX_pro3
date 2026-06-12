//*src/middlewares/errorHandler.middleware.js
const errorHandler = (err, req, res, next) => {
    console.error('Error no controlado:', err);

    res.status(500).json({
        message: 'Ocurrió un error interno en el servidor',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
};

export default errorHandler;
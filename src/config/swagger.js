// src/config/swagger.js
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'API Clínica de Turnos - Programación III UNER 2026',
            version: '1.0.0',
            description: 'Backend para sistema de gestión de turnos médicos con autenticación JWT y roles.',
        },
        servers: [
           {
        url: `http://localhost:${process.env.PORT || 3600}/api/v1`,
        description: 'Servidor de desarrollo',
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
            },
        },
    },
    apis: ['./src/routes/*.js'], 
};

const specs = swaggerJsdoc(options);

export { swaggerUi, specs };
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

import authRoutes from './src/routes/auth.routes.js';
import especialidadRoutes from './src/routes/especialidad.routes.js';
import obraSocialRoutes from './src/routes/obraSocial.routes.js';
import medicoRoutes from './src/routes/medico.routes.js';   
import pacienteRoutes from './src/routes/paciente.routes.js';
import turnoRoutes from './src/routes/turno.routes.js';

import { swaggerUi, specs } from './src/config/swagger.js';
import errorHandler from './src/middlewares/errorHandler.middleware.js';

const app = express();

const __dirname = dirname(fileURLToPath(import.meta.url));

// Middlewares globales
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

// Swagger Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

// Health check
app.get('/health', (req, res) => {
    res.json({
        status: 'OK',
        message: 'API Clínica de Turnos funcionando correctamente',
        time: new Date().toISOString()
    });
});

// Rutas
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/especialidades', especialidadRoutes);
app.use('/api/v1/obras-sociales', obraSocialRoutes);
app.use('/api/v1/medicos', medicoRoutes);
app.use('/api/v1/pacientes', pacienteRoutes);
app.use('/api/v1/turnos', turnoRoutes);

// Servir archivos estáticos desde uploads/
app.use('/uploads', express.static(join(__dirname, 'uploads')));

// Middleware de errores 
app.use(errorHandler);



export default app;
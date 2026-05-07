import express from 'express';
import cors from 'cors';
import morgan from 'morgan';

import authRoutes from './src/routes/auth.routes.js';
import especialidadRoutes from './src/routes/especialidad.routes.js';
import obraSocialRoutes from './src/routes/obraSocial.routes.js';

const app = express();

// Middlewares globales
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

// Health check 
app.get('/api/v1/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'API de Clínica funcionando correctamente',
    time: new Date().toISOString()
  });
});

// Rutas
app.use('/api/v1/especialidades', especialidadRoutes);
app.use('/api/v1/obras-sociales', obraSocialRoutes);
app.use('/api/v1/auth', authRoutes);

export default app;
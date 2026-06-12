import 'dotenv/config';
import app from './app.js';
import initDB from './src/config/initDB.js';

const PORT = process.env.PORT || 3600;

//*Primero inicializa la DB, después levanta el servidor
initDB()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`Servidor corriendo en puerto ${PORT}`);
        });
    })
    .catch(err => {
        console.error('Error iniciando la base de datos:', err.message);
        process.exit(1);
    });

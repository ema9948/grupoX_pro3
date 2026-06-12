import multer from 'multer';
import path from 'path';
import fs from 'fs';

const storage = multer.diskStorage({

    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },

    //*Usamos el id del usuario como nombre del archivo
    //*Si ya existe una foto anterior la sobreescribe automáticamente
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        const nombreArchivo = `foto_usuario_${req.usuario.id}${ext}`;

        //*Si ya existe una foto anterior con diferente extensión la borramos
        //*Por ejemplo si antes era .png y ahora sube .jpg
        const extensiones = ['.jpg', '.jpeg', '.png', '.webp'];
        extensiones.forEach(e => {
            const rutaVieja = `uploads/foto_usuario_${req.usuario.id}${e}`;
            if (e !== ext && fs.existsSync(rutaVieja)) {
                fs.unlinkSync(rutaVieja);
            }
        });

        cb(null, nombreArchivo);
    }
});

const fileFilter = (req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png', 'image/webp'];
    if (allowed.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Solo se permiten imágenes JPG, PNG o WEBP'), false);
    }
};

const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 2 * 1024 * 1024 }
});

export default upload;
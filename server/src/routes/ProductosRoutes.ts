import { Router } from 'express';
import { getProductos, crearProducto } from '../controllers/ProductosController';
import { validarJWT, esAdmin } from '../middlewares/authMiddleware';
import multer from 'multer';

const router = Router();
const upload = multer({ dest: 'uploads/' }); // Carpeta temporal donde multer guarda antes de subir

router.get('/', getProductos);

// Middleware upload.single('imagen') busca un campo llamado 'imagen' en el form-data
router.post('/', [validarJWT, esAdmin, upload.single('imagen')], crearProducto);

export default router;
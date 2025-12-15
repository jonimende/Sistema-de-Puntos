import { Router } from 'express';
import { getProductos, crearProducto, eliminarProducto, actualizarProducto } from '../controllers/ProductosController';
import { validarJWT, esAdmin } from '../middlewares/authMiddleware';
import multer from 'multer';
import path from 'path'; 

const router = Router();

const upload = multer({ 
    dest: path.join(process.cwd(), 'uploads') 
}); 

router.get('/', getProductos);

// El resto sigue igual...
router.post('/', [validarJWT, esAdmin, upload.single('imagen')], crearProducto);
router.put('/:id', [validarJWT, esAdmin, upload.single('imagen')], actualizarProducto);
router.delete('/:id', [validarJWT, esAdmin], eliminarProducto);

export default router;
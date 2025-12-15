import { Router } from 'express';
import { getClienteByDni, createCliente } from '../controllers/ClientesController';
import { validarJWT } from '../middlewares/authMiddleware';
import { esAdmin } from '../middlewares/authMiddleware';
const router = Router();

router.get('/:id', validarJWT, getClienteByDni);

// Registrar nuevo cliente
router.post('/', [validarJWT, esAdmin], createCliente);

export default router;
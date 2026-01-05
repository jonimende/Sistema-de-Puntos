import { Router } from 'express';
import { getClienteByDni, createCliente, registerCliente } from '../controllers/ClientesController';
import { validarJWT } from '../middlewares/authMiddleware';
import { esAdmin } from '../middlewares/authMiddleware';
const router = Router();

router.get('/:id', validarJWT, getClienteByDni);

router.post('/registrarse', registerCliente);

router.post('/', [validarJWT, esAdmin], createCliente);

export default router;
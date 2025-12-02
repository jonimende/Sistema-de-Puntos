import { Router } from 'express';
import { sumarPuntos, canjearPuntos } from '../controllers/MovimientoController';
import { validarJWT } from '../middlewares/authMiddleware';
const router = Router();

// Sumar puntos (Compra)
router.post('/sumar', validarJWT, sumarPuntos);

// Restar puntos (Canje)
router.post('/canjear', validarJWT, canjearPuntos);

export default router;
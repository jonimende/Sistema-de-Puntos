import { Router } from 'express';
import { login, crearUsuario } from '../controllers/UsuarioController';
import { validarJWT } from '../middlewares/authMiddleware';
import { esAdmin } from '../middlewares/authMiddleware';
const router = Router();

// Endpoint para loguear (Admin o Vendedor)
router.post('/login', login);

// Endpoint para crear un nuevo vendedor (Esto luego lo protegeremos para que solo Admin pueda)
router.post('/register', [validarJWT, esAdmin], crearUsuario);

export default router;
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { Usuario } from '../models/assosiations';

// Extendemos la interfaz de Request localmente para que TS no se queje
export interface CustomRequest extends Request {
    usuario?: any; 
}

export const validarJWT = async (req: Request, res: Response, next: NextFunction) => {
    // Leer el token del header personalizado 'x-token'
    const token = req.header('x-token');

    if (!token) {
        return res.status(401).json({ msg: 'No hay token en la petición' });
    }

    try {
        // Verificar el token
        const { id }: any = jwt.verify(token, process.env.JWT_SECRET || 'palabrasecretatemporal');

        // Leer el usuario que corresponde al id
        const usuario = await Usuario.findByPk(id);

        if (!usuario) {
            return res.status(401).json({ msg: 'Token no válido - usuario no existe en DB' });
        }

        // Colocar el usuario en la request para que los siguientes middlewares/controladores lo usen
        // Usamos cast (req as any) o la interfaz CustomRequest para asignar
        (req as CustomRequest).usuario = usuario;

        next(); // Continuar con el siguiente middleware o controlador

    } catch (error) {
        console.log(error);
        res.status(401).json({ msg: 'Token no válido' });
    }
};

export const esAdmin = (req: Request, res: Response, next: NextFunction) => {
    // Verificamos si validarJWT ya hizo su trabajo
    if (!(req as CustomRequest).usuario) {
        return res.status(500).json({ msg: 'Se quiere verificar role sin validar el token primero' });
    }

    const { rol, username } = (req as CustomRequest).usuario;

    if (rol !== 'admin') {
        return res.status(401).json({ msg: `${username} no es administrador - No puede hacer esto` });
    }

    next();
};
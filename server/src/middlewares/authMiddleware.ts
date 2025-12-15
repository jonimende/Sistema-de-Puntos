import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import Usuario from '../models/Usuario';
import Cliente from '../models/Clientes';

export const validarJWT = async (req: Request, res: Response, next: NextFunction) => {
    console.log('--- 1. Entrando a validarJWT ---');
    const token = req.header('x-token');

    if (!token) {
        console.log('❌ No hay token en el header');
        return res.status(401).json({ msg: 'No hay token en la petición' });
    }

    try {
        const secret = process.env.JWT_SECRET || 'mi_super_secreta_palabra';
        const payload: any = jwt.verify(token, secret);
        console.log('✅ Token verificado. Payload:', payload);

        const { id, rol } = payload;

        if (rol === 'cliente') {
            const cliente = await Cliente.findByPk(id);
            if (!cliente) return res.status(401).json({ msg: 'Cliente no existe' });
            
            (req as any).usuario = cliente; 
            (req as any).esCliente = true;
            console.log('👤 Usuario (Cliente) asignado a req.usuario');

        } else if (rol === 'admin' || rol === 'user') {
            const usuario = await Usuario.findByPk(id);
            if (!usuario) return res.status(401).json({ msg: 'Usuario no existe' });

            (req as any).usuario = usuario;
            (req as any).esCliente = false;
            console.log('👮 Usuario (Admin/User) asignado a req.usuario');
        } else {
            console.log('⚠️ Rol desconocido:', rol);
        }

        next();

    } catch (error) {
        console.log('❌ Error en validarJWT:', error);
        res.status(401).json({ msg: 'Token no válido' });
    }
};

export const esAdmin = (req: Request, res: Response, next: NextFunction) => {
    console.log('--- 2. Entrando a esAdmin ---');
    
    // Verificamos qué llega acá
    const usuario = (req as any).usuario;
    console.log('🧐 req.usuario es:', usuario ? 'Existe' : 'UNDEFINED');

    if (!usuario) {
        console.log('💥 ERROR CRÍTICO: req.usuario no existe. validarJWT falló o no guardó la variable.');
        return res.status(500).json({ msg: 'Se quiere verificar role sin validar el token primero' });
    }

    const { rol, username, nombre } = usuario;
    console.log(`Rol del usuario: ${rol}`);

    if (rol !== 'admin') {
        return res.status(401).json({ msg: `${username || nombre} no es administrador` });
    }

    console.log('✅ Es Admin, pasando al controlador...');
    next();
};
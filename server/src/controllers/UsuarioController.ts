import { Request, Response } from 'express';
import * as bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Usuario } from '../models/assosiations'; // Importamos desde el archivo de relaciones

export const login = async (req: Request, res: Response) => {
    const { username, password } = req.body;

    try {
        // 1. Verificar si el usuario existe
        const usuario: any = await Usuario.findOne({ where: { username } });
        if (!usuario) {
            return res.status(400).json({ msg: 'Usuario o contraseña incorrectos' });
        }

        // 2. Verificar contraseña
        const validPassword = bcrypt.compareSync(password, usuario.password_hash);
        if (!validPassword) {
            return res.status(400).json({ msg: 'Usuario o contraseña incorrectos' });
        }

        // 3. Generar JWT (Token)
        const token = jwt.sign(
            { id: usuario.id, rol: usuario.rol }, 
            process.env.JWT_SECRET || 'palabrasecretatemporal', 
            { expiresIn: '8h' }
        );

        res.json({
            msg: 'Login exitoso',
            token,
            usuario: { username: usuario.username, rol: usuario.rol }
        });

    } catch (error) {
        res.status(500).json({ msg: 'Error en el servidor', error });
    }
};

export const crearUsuario = async (req: Request, res: Response) => {
    const { username, password, rol } = req.body;

    try {
        // Encriptar contraseña antes de guardar
        const salt = bcrypt.genSaltSync();
        const password_hash = bcrypt.hashSync(password, salt);

        const nuevoUsuario = await Usuario.create({
            username,
            password_hash,
            rol
        });

        res.status(201).json({ msg: 'Usuario creado', usuario: nuevoUsuario });
    } catch (error) {
        res.status(500).json({ msg: 'Error al crear usuario', error });
    }
};
import { Request, Response } from 'express';
import * as bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { applyAssosiations } from '../models/assosiations'; 
import Usuario from '../models/Usuario';
import Cliente from '../models/Clientes'; // Asegurate que la importación sea correcta

export const login = async (req: Request, res: Response) => {
    // El frontend manda un campo 'username', pero si es cliente, ahí vendrá el DNI.
    const { username, password } = req.body;

    try {
        let entidad: any = null; // Aquí guardaremos al usuario O al cliente encontrado
        let rol = '';
        let nombreMostrar = '';
        const usuario: any = await Usuario.findOne({ where: { username } });

        if (usuario) {
            entidad = usuario;
            rol = usuario.rol; // 'admin' o 'user'
            nombreMostrar = usuario.username;
        } else {
            const cliente: any = await Cliente.findOne({ where: { dni: username } });
            
            if (cliente) {
                entidad = cliente;
                rol = 'cliente'; // Forzamos el rol 'cliente'
                nombreMostrar = cliente.nombre;
            }
        }

        if (!entidad) {
            return res.status(400).json({ msg: 'Usuario/DNI o contraseña incorrectos' });
        }

        // Verificar contraseña (ambos modelos tienen el campo password_hash)
        const validPassword = bcrypt.compareSync(password, entidad.password_hash);
        if (!validPassword) {
            return res.status(400).json({ msg: 'Usuario/DNI o contraseña incorrectos' });
        }

        const tokenPayload = {
            id: entidad.id,
            rol: rol,
            username: nombreMostrar,
            // Si es cliente, guardamos el DNI en el token, puede ser útil luego
            dni: rol === 'cliente' ? entidad.dni : null 
        };

        const token = jwt.sign(
            tokenPayload, 
            process.env.JWT_SECRET || 'mi_super_secreta_palabra', 
            { expiresIn: '8h' }
        );

        res.json({
            msg: 'Login exitoso',
            token,
            usuario: { 
                id: entidad.id,
                username: nombreMostrar, 
                rol: rol 
            }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Error en el servidor', error });
    }
};

// La función de crearUsuario la dejamos igual (solo para admins/empleados)
export const crearUsuario = async (req: Request, res: Response) => {
    const { username, password, rol } = req.body;

    try {
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
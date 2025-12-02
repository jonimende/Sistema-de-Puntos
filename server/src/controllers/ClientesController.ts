import { Request, Response } from 'express';
import { Cliente } from '../models/assosiations';
import * as bcrypt from 'bcryptjs';

// Buscar cliente por DNI (Para cuando llega a la caja)
export const getClienteByDni = async (req: Request, res: Response) => {
    const { dni } = req.params;
    try {
        const cliente = await Cliente.findOne({ where: { dni } });
        if (!cliente) {
            return res.status(404).json({ msg: 'Cliente no encontrado' });
        }
        res.json(cliente);
    } catch (error) {
        res.status(500).json({ msg: 'Error al buscar cliente' });
    }
};

// Crear cliente rápido (Desde la caja)
export const createCliente = async (req: Request, res: Response) => {
    const { dni, nombre, email, password } = req.body;
    try {
        // Si viene password (registro web), lo encriptamos. Si es rapido en caja, puede ser null o default.
        let passHash = null;
        if(password) {
             passHash = bcrypt.hashSync(password, 10);
        }

        const nuevoCliente = await Cliente.create({
            dni,
            nombre,
            email,
            password_hash: passHash || 'temporal123' // Fallback si se crea en caja rapido
        });
        res.status(201).json(nuevoCliente);
    } catch (error) {
        res.status(500).json({ msg: 'Error al crear cliente. Posible DNI duplicado.', error });
    }
};
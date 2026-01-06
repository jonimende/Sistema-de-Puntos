import { Request, Response } from 'express';
import { applyAssosiations } from '../models/assosiations';
import Cliente from '../models/Clientes';
import * as bcrypt from 'bcryptjs';
import { Op } from 'sequelize';

// Buscar cliente por DNI (Para cuando llega a la caja)
export const getClienteByDni = async (req: Request, res: Response) => {
    const { id } = req.params; 

    console.log('Controlador ejecutándose. Buscando DNI:', id); // Debug

    try {
        const cliente = await Cliente.findOne({ where: { dni: id } });

        if (!cliente) {
            console.log('Cliente no encontrado en BD');
            return res.status(404).json({ msg: 'Cliente no encontrado' });
        }

        console.log('Cliente encontrado, enviando...');
        res.json(cliente);

    } catch (error) {
        console.error('Error en controlador:', error);
        res.status(500).json({ msg: 'Error al buscar cliente' });
    }
};

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

export const registerCliente = async (req: Request, res: Response) => {
    const { dni, nombre, email, password } = req.body;

    try {
        // 1. Validaciones básicas
        if (!dni || !nombre || !email || !password) {
            return res.status(400).json({ msg: 'Todos los campos son obligatorios para el registro' });
        }

        // 2. Verificar si ya existe un cliente con ese DNI o Email
        const existeCliente = await Cliente.findOne({
            where: {
                [Op.or]: [
                    { dni: dni },
                    { email: email }
                ]
            }
        });

        if (existeCliente) {
            return res.status(400).json({ msg: 'Ya existe un cliente registrado con ese DNI o Email' });
        }

        // 3. Encriptar contraseña
        const passHash = bcrypt.hashSync(password, 10);

        // 4. Crear el cliente
        // Puntos iniciales en 0 por defecto definido en el modelo
        const nuevoCliente = await Cliente.create({
            dni,
            nombre,
            email,
            password_hash: passHash
        });

        // 5. Responder (Opcional: aquí podrías generar y devolver un JWT si quieres que se loguee automáticamente)
        res.status(201).json({ 
            msg: 'Registro exitoso', 
            cliente: {
                id: nuevoCliente.get('id'),
                nombre: nuevoCliente.get('nombre'),
                email: nuevoCliente.get('email')
            }
        });

    } catch (error) {
        console.error('Error en registro:', error);
        res.status(500).json({ msg: 'Error al registrar cliente', error });
    }
};
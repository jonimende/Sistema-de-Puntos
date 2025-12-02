import { Request, Response } from 'express';
import { Movimiento, Cliente } from '../models/assosiations';
import db from '../db'; // Necesitamos db para transacciones si quisieramos hilar fino

export const sumarPuntos = async (req: Request, res: Response) => {
    const { dni, monto_compra, usuario_id } = req.body;

    try {
        // 1. Buscar cliente
        const cliente: any = await Cliente.findOne({ where: { dni } });
        if (!cliente) return res.status(404).json({ msg: 'Cliente no encontrado' });

        // 2. Calcular puntos (10% del monto)
        const puntosGanados = Math.floor(monto_compra * 0.10);

        // 3. Registrar Movimiento
        await Movimiento.create({
            cliente_id: cliente.id,
            usuario_id, // El cajero que hizo la venta
            tipo: 'SUMA',
            monto_compra,
            puntos: puntosGanados
        });

        // 4. Actualizar saldo del cliente
        // Sequelize tiene un metodo magico 'increment'
        await cliente.increment('puntos_actuales', { by: puntosGanados });

        res.json({ 
            msg: `Se sumaron ${puntosGanados} puntos a ${cliente.nombre}`,
            nuevo_saldo: cliente.puntos_actuales + puntosGanados
        });

    } catch (error) {
        res.status(500).json({ msg: 'Error al procesar puntos', error });
    }
};

export const canjearPuntos = async (req: Request, res: Response) => {
    const { dni, puntos_a_canjear, usuario_id } = req.body;

    try {
        const cliente: any = await Cliente.findOne({ where: { dni } });
        if (!cliente) return res.status(404).json({ msg: 'Cliente no encontrado' });

        if (cliente.puntos_actuales < puntos_a_canjear) {
            return res.status(400).json({ msg: 'Puntos insuficientes' });
        }

        // Registrar el canje
        await Movimiento.create({
            cliente_id: cliente.id,
            usuario_id,
            tipo: 'RESTA',
            monto_compra: 0, // Es canje, no compra
            puntos: puntos_a_canjear
        });

        // Restar puntos
        await cliente.decrement('puntos_actuales', { by: puntos_a_canjear });

        res.json({ 
            msg: `Canje exitoso. Se descontaron ${puntos_a_canjear} puntos.`,
            nuevo_saldo: cliente.puntos_actuales - puntos_a_canjear 
        });

    } catch (error) {
        res.status(500).json({ msg: 'Error al canjear', error });
    }
};
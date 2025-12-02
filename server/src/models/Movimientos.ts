import { DataTypes } from 'sequelize';
import db from '../db';

const Movimiento = db.define('Movimiento', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    tipo: {
        type: DataTypes.ENUM('SUMA', 'RESTA'),
        allowNull: false,
    },
    monto_compra: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: true, // Puede ser null si es solo un canje sin compra
    },
    puntos: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    // Las FK se definen mejor en las relaciones, pero los campos existen aqui:
    cliente_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    usuario_id: {
        type: DataTypes.INTEGER,
        allowNull: true // Null si fue una compra online o automatica
    }
}, {
    tableName: 'movimientos',
    timestamps: true,
    updatedAt: false, // Un movimiento historico no deberia actualizarse, solo crearse
    createdAt: 'fecha' // Mapeamos 'createdAt' a 'fecha' como pediste en SQL
});

export default Movimiento;
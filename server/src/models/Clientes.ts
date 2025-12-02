import { DataTypes } from 'sequelize';
import db from '../db';

const Cliente = db.define('Cliente', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    dni: {
        type: DataTypes.STRING(20),
        unique: true,
        allowNull: false,
    },
    nombre: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING(100),
        unique: true,
        allowNull: true, // Puede ser opcional si lo registras rapido en caja
    },
    password_hash: {
        type: DataTypes.STRING(255),
        allowNull: true, // Puede ser null si el cliente aun no se activó la cuenta web
    },
    puntos_actuales: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
    }
}, {
    tableName: 'clientes',
    timestamps: true
});

export default Cliente;
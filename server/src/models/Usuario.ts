import { DataTypes } from 'sequelize';
import db from '../db';

const Usuario = db.define('Usuario', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    username: {
        type: DataTypes.STRING(50),
        unique: true,
        allowNull: false,
    },
    password_hash: {
        type: DataTypes.STRING(255),
        allowNull: false,
    },
    rol: {
        type: DataTypes.ENUM('admin', 'user'),
        defaultValue: 'user',
        allowNull: false,
    },
}, {
    tableName: 'usuarios', // Nombre de la tabla en Postgres
    timestamps: true       // Sequelize maneja created_at y updated_at automáticamente
});

export default Usuario;
import { DataTypes } from 'sequelize';
import db from '../db';

const Producto = db.define('Producto', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    nombre: {
        type: DataTypes.STRING(100),
        allowNull: false,
    },
    descripcion: {
        type: DataTypes.TEXT,
        allowNull: true,
    },
    precio: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
    },
    // Campos para Cloudinary
    imagen_url: {
        type: DataTypes.TEXT, // Text para URLs largas
        allowNull: true,
    },
    imagen_public_id: {
        type: DataTypes.STRING(255), // ID para borrar la foto en Cloudinary
        allowNull: true,
    },
    disponible: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
    }
}, {
    tableName: 'productos',
    timestamps: false // Quizas no te interesa cuando se creó el helado, o ponelo true si queres
});

export default Producto;
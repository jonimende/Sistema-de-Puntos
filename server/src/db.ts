import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';

// 1. Cargar las variables de entorno antes de usar nada
dotenv.config();

// 2. Crear la instancia de Sequelize
const db = new Sequelize(
    process.env.DB_NAME as string,     // Nombre de la base
    process.env.DB_USER as string,     // Usuario
    process.env.DB_PASSWORD as string, // Contraseña
    {
        host: process.env.DB_HOST,
        dialect: 'postgres',
        logging: false, // Pone true si queres ver el SQL en la consola
    }
);

export default db;
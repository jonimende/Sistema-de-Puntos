import { configDotenv } from 'dotenv';
import { Sequelize } from 'sequelize';
configDotenv();

const db = new Sequelize(process.env.DATABASE_URL!, {
    dialect: 'postgres',
    protocol: 'postgres',
    logging: false, 
    dialectOptions: {
        ssl: {
            require: true, 
            rejectUnauthorized: false 
        }
    },
    // --- ESTA ES LA PARTE QUE SOLUCIONA LOS 2 MINUTOS DE ESPERA ---
    pool: {
        max: 5,         // No usar muchas conexiones (Neon Free tiene límite)
        min: 0,         // Permitir que cierre todas si no se usan
        acquire: 30000, // Si tarda más de 30s en conectar, cortar (error rápido, no esperar 2 min)
        idle: 10000     // Si una conexión está libre 10s, cerrarla (evita el "zombie")
    }
});

export default db;

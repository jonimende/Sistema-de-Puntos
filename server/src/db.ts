import { configDotenv } from 'dotenv';
import { Sequelize } from 'sequelize';
configDotenv();
// Asegurate de que esto coincida con tu archivo
const db = new Sequelize(process.env.DATABASE_URL!, {
    dialect: 'postgres',
    protocol: 'postgres',
    logging: false, // Para que no llene los logs
    dialectOptions: {
        ssl: {
            require: true, 
            rejectUnauthorized: false // <--- ESTO ES LA CLAVE MÁGICA
        }
    }
});

export default db;
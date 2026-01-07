import express, { Application, Request, Response, NextFunction } from 'express';
import db from './db';
import cors from 'cors'; 
import { applyAssosiations } from './models/assosiations';
import fs from 'fs'; 

// --- IMPORTACIONES NUEVAS PARA EL ADMIN ---
import bcrypt from 'bcryptjs'; // <--- NUEVO: Para encriptar
import Usuario from './models/Usuario'; // <--- NUEVO: Asegúrate que la ruta a tu modelo Usuario sea esta
// -----------------------------------------

// ... (Todo tu código de crash y middlewares sigue igual) ...

process.on('uncaughtException', (error) => {
  console.error('💥 CRASH DEL SERVIDOR (Excepción no capturada):', error);
});

process.on('unhandledRejection', (reason) => {
  console.error('💥 PROMESA RECHAZADA (Causó cierre):', reason);
});

applyAssosiations();
import usuarioRoutes from './routes/UsuarioRoutes';
import clienteRoutes from './routes/ClientesRoutes';
import movimientoRoutes from './routes/MovimientosRoutes';
import productoRoutes from './routes/ProductosRoutes';

const app: Application = express();
const PORT = process.env.PORT || 3000;

if (!fs.existsSync('./uploads')) {
    console.log('📁 Carpeta "uploads" no existía. Creándola ahora...');
    fs.mkdirSync('./uploads');
}

app.use(cors({
  origin: ["http://localhost:4200", "https://yoheladeria.vercel.app"],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "x-token"],
  credentials: true,
}));

app.use(express.json());

app.use((req: Request, res: Response, next: NextFunction) => {
    console.log(`📢 PETICIÓN LLEGANDO: ${req.method} ${req.url}`);
    next();
});

app.use('/api/usuarios', usuarioRoutes);
app.use('/api/clientes', clienteRoutes);
app.use('/api/movimientos', movimientoRoutes);
app.use('/api/productos', productoRoutes);

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    console.error('🔥 ERROR FATAL ATRAPADO POR EXPRESS:', err);
    res.status(500).json({ 
        msg: 'Ocurrió un error interno en el servidor',
        error: err.message || err 
    });
});

async function main() {
    try {
        await db.authenticate();
        console.log('✅ Base de datos conectada.');
        await db.sync({ force: false });
        
        // --- INICIO: CREAR ADMIN AUTOMÁTICO ---
        // Verifica si ya existe un usuario "admin"
        const adminExiste = await Usuario.findOne({ where: { nombre: 'admin' } });

        if (!adminExiste) {
            console.log('👑 Creando usuario Admin por primera vez...');
            
            // Encriptamos la contraseña
            const salt = bcrypt.genSaltSync(10);
            const hash = bcrypt.hashSync('Yohelados123', salt);

            await Usuario.create({
                nombre: 'admin',
                password: hash, // Guardamos el hash, NO la contraseña plana
                rol: 'admin',
            });

            console.log('✅ USUARIO CREADO: User: admin | Pass: Yohelados123');
        }
        // --- FIN: CREAR ADMIN AUTOMÁTICO ---

        app.listen(PORT, () => {
            console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
            console.log(`🛡️ Sistema anti-crash activado.`);
        });
    } catch (error) {
        console.error('❌ Error al iniciar servidor:', error);
    }
}

main();

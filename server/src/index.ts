import express, { Application, Request, Response, NextFunction } from 'express';
import db from './db';
import cors from 'cors'; 
import { applyAssosiations } from './models/assosiations';
import fs from 'fs'; // Importante para manejar carpetas

// --- 1. SEGURIDAD ANTI-CRASH (Poner esto arriba de todo) ---
// Esto evita que el servidor se cierre en silencio si hay un error grave
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

// --- 2. VERIFICACIÓN DE CARPETA UPLOADS ---
// Si no existe, la crea sola. Multer necesita esto sí o sí.
if (!fs.existsSync('./uploads')) {
    console.log('📁 Carpeta "uploads" no existía. Creándola ahora...');
    fs.mkdirSync('./uploads');
}

// Middlewares Globales
app.use(cors({
  origin: ["http://localhost:4200", "https://yoheladeria.vercel.app"],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  // AGREGADO: 'x-token' para que Angular pueda mandarlo sin problemas
  allowedHeaders: ["Content-Type", "Authorization", "x-token"],
  credentials: true,
}));

app.use(express.json());

// --- 3. LOG DE PETICIONES (El "Portero") ---
// Te avisa cada vez que el Frontend toca la puerta
app.use((req: Request, res: Response, next: NextFunction) => {
    console.log(`📢 PETICIÓN LLEGANDO: ${req.method} ${req.url}`);
    next();
});

// Definición de Rutas
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/clientes', clienteRoutes);
app.use('/api/movimientos', movimientoRoutes);
app.use('/api/productos', productoRoutes);

// --- 4. MANEJADOR DE ERRORES GLOBAL (La "Red de Seguridad") ---
// Si algo explota (Multer, Cloudinary, DB), cae acá y te dice el error real.
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
        
        app.listen(PORT, () => {
            console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
            console.log(`🛡️ Sistema anti-crash activado.`);
        });
    } catch (error) {
        console.error('❌ Error al iniciar servidor:', error);
    }
}

main();
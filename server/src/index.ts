import express, { Application } from 'express';
import db from './db';
import cors from 'cors'; // Importante para que Angular pueda hablar con Express
import { Usuario, Cliente, Producto, Movimiento } from './models/assosiations';

// Importamos las rutas
import usuarioRoutes from './routes/UsuarioRoutes';
import clienteRoutes from './routes/ClientesRoutes';
import movimientoRoutes from './routes/MovimientosRoutes';
import productoRoutes from './routes/ProductosRoutes';

const app: Application = express();
const PORT = process.env.PORT || 3000;

// Middlewares Globales
app.use(cors()); // Habilita peticiones desde otros dominios (Angular)
app.use(express.json());

// Definición de Rutas
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/clientes', clienteRoutes);
app.use('/api/movimientos', movimientoRoutes);
app.use('/api/productos', productoRoutes);

async function main() {
    try {
        await db.authenticate();
        console.log('✅ Base de datos conectada.');
        await db.sync({ force: false });
        
        app.listen(PORT, () => {
            console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
        });
    } catch (error) {
        console.error('❌ Error:', error);
    }
}

main();
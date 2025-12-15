import db from './db';
import { Usuario, Cliente, Producto, Movimiento } from './models/assosiations';
import bcrypt from 'bcryptjs';

const seedDatabase = async () => {
    try {
        // 1. Conectar a la BD
        await db.authenticate();
        
        // 2. Sincronizar (force: true BORRA todo y crea de nuevo para empezar limpio)
        // Si no querés borrar los datos que ya tenés, cambiá a force: false
        await db.sync({ force: true }); 

        console.log('🧹 Base de datos limpia.');

        // -----------------------------------------------------
        // 3. Crear USUARIO ADMIN
        // -----------------------------------------------------
        const salt = bcrypt.genSaltSync(10);
        const hashAdmin = bcrypt.hashSync('admin123', salt); // La contraseña será 'admin123'
        const hashVendedor = bcrypt.hashSync('vendedor123', salt); 

        await Usuario.bulkCreate([
            {
                username: 'admin',
                password_hash: hashAdmin,
                rol: 'admin'
            },
            {
                username: 'cajero',
                password_hash: hashVendedor,
                rol: 'user'
            }
        ]);
        console.log('✅ Usuarios creados (Admin pass: admin123).');

        // -----------------------------------------------------
        // 4. Crear CLIENTE DE PRUEBA
        // -----------------------------------------------------
        await Cliente.create({
            dni: '11111111',
            nombre: 'Juan Perez',
            email: 'juan@test.com',
            password_hash: bcrypt.hashSync('123456', salt), // Pass para la app de cliente
            puntos_actuales: 500
        });
        console.log('✅ Cliente de prueba creado (DNI: 11111111).');

        // -----------------------------------------------------
        // 5. Crear PRODUCTOS
        // -----------------------------------------------------
        await Producto.bulkCreate([
            {
                nombre: 'Cucurucho Super',
                descripcion: 'Tres bochas de sabor artesanal a elección.',
                precio: 2500,
                imagen_url: 'https://cdn.pixabay.com/photo/2020/01/22/20/56/ice-cream-cone-4786317_1280.jpg',
                disponible: true
            },
            {
                nombre: 'Cuarto Kilo',
                descripcion: 'Pote térmico de 250gr. Hasta 3 gustos.',
                precio: 3500,
                imagen_url: 'https://cdn.pixabay.com/photo/2016/03/23/15/00/ice-cream-1274894_1280.jpg',
                disponible: true
            },
            {
                nombre: 'Milkshake Oreo',
                descripcion: 'Batido espumoso con trozos de galleta.',
                precio: 1800,
                imagen_url: 'https://cdn.pixabay.com/photo/2016/09/02/09/27/milkshake-1639016_1280.jpg',
                disponible: true
            }
        ]);
        console.log('✅ Productos de prueba creados.');

        console.log('🚀 SEED EJECUTADO EXITOSAMENTE. CERRANDO...');
        process.exit(0);

    } catch (error) {
        console.error('❌ Error en el seed:', error);
        process.exit(1);
    }
};

seedDatabase();
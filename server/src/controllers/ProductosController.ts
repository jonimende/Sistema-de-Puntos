import { Request, Response } from 'express';
import { applyAssosiations } from '../models/assosiations';
import Producto from '../models/Producto';
import cloudinary from '../lib/cloudinary';
import * as fs from 'fs'; // Usar fs nativo para borrar el archivo temporal

// Importante: Multer guarda el archivo en una carpeta temporal, 
// nosotros lo subimos a Cloudinary y luego borramos ese temporal.

// En controllers/ProductosController.ts

export const crearProducto = async (req: Request, res: Response) => {
    console.log('➡️ 1. Inicio del controlador crearProducto');
    console.log('📦 Body recibido:', req.body);
    console.log('📂 Archivo recibido:', req.file);

    const { nombre, precio, descripcion } = req.body;

    try {
        let imagen_url = null;
        let imagen_public_id = null;

        if (req.file) {
            console.log('☁️ 2. Intentando subir a Cloudinary...');
            
            // ACÁ SUELE FALLAR SI LA CONFIG ESTÁ MAL
            const result = await cloudinary.uploader.upload(req.file.path, {
                folder: 'heladeria_productos'
            });

            console.log('✅ 3. Subida exitosa a Cloudinary:', result.secure_url);
            imagen_url = result.secure_url;
            imagen_public_id = result.public_id;

            try {
                fs.unlinkSync(req.file.path);
                console.log('🗑️ 4. Archivo temporal borrado');
            } catch (err) {
                console.warn('⚠️ No se pudo borrar temporal:', err);
            }
        }

        console.log('💾 5. Guardando en Base de Datos...');
        const nuevoProducto = await Producto.create({
            nombre,
            precio, // Sequelize maneja la conversión de string a numero
            descripcion,
            imagen_url,
            imagen_public_id
        });

        console.log('🎉 6. Producto creado con ID:', nuevoProducto.getDataValue('id'));
        res.status(201).json(nuevoProducto);

    } catch (error) {
        // ESTE LOG ES EL QUE NECESITAMOS VER
        console.error('❌❌ ERROR FATAL EN CONTROLADOR:', error);
        res.status(500).json({ msg: 'Error al crear producto', error });
    }
};

export const getProductos = async (req: Request, res: Response) => {
    const productos = await Producto.findAll({ where: { disponible: true } });
    res.json(productos);
};

export const actualizarProducto = async (req: Request, res: Response) => {
    const { id } = req.params;
    const { nombre, precio, descripcion } = req.body;

    try {
        const producto = await Producto.findByPk(id);
        if (!producto) {
            return res.status(404).json({ msg: 'Producto no encontrado' });
        }

        let datosActualizados: any = { nombre, precio, descripcion };

        // Si suben una NUEVA imagen
        if (req.file) {
            // 1. Borrar la imagen vieja de Cloudinary si existe
            if (producto.getDataValue('imagen_public_id')) {
                await cloudinary.uploader.destroy(producto.getDataValue('imagen_public_id'));
            }

            // 2. Subir la nueva
            const result = await cloudinary.uploader.upload(req.file.path, {
                folder: 'heladeria_productos'
            });

            // 3. Actualizar datos de imagen y borrar temporal
            datosActualizados.imagen_url = result.secure_url;
            datosActualizados.imagen_public_id = result.public_id;
            
            try { fs.unlinkSync(req.file.path); } catch (e) { console.error(e); }
        }

        await producto.update(datosActualizados);
        res.json({ msg: 'Producto actualizado', producto });

    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Error al actualizar', error });
    }
};


export const eliminarProducto = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        const producto = await Producto.findByPk(id);
        if (!producto) {
            return res.status(404).json({ msg: 'Producto no encontrado' });
        }

        // 1. Borrar imagen de Cloudinary
        if (producto.getDataValue('imagen_public_id')) {
            await cloudinary.uploader.destroy(producto.getDataValue('imagen_public_id'));
        }

        // 2. Borrar de la base de datos
        // Opción A: Borrado lógico (si usaste paranoid: true) -> await producto.destroy();
        // Opción B: Borrado físico (desaparece de la tabla) ->
        await producto.destroy(); 

        res.json({ msg: 'Producto eliminado correctamente' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Error al eliminar', error });
    }
};
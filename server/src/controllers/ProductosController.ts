import { Request, Response } from 'express';
import { Producto } from '../models/assosiations';
import cloudinary from '../lib/cloudinary';
import * as fs from 'fs'; // Usar fs nativo para borrar el archivo temporal

// Importante: Multer guarda el archivo en una carpeta temporal, 
// nosotros lo subimos a Cloudinary y luego borramos ese temporal.

export const crearProducto = async (req: Request, res: Response) => {
    const { nombre, precio, descripcion } = req.body;

    try {
        let imagen_url = null;
        let imagen_public_id = null;

        // Si viene un archivo en la request
        if (req.file) {
            // Subir a Cloudinary
            const result = await cloudinary.uploader.upload(req.file.path, {
                folder: 'heladeria_productos' // Nombre de la carpeta en Cloudinary
            });

            imagen_url = result.secure_url;
            imagen_public_id = result.public_id;

            // Borrar archivo temporal del servidor (ya está en la nube)
            try {
                fs.unlinkSync(req.file.path);
            } catch (err) {
                console.warn('No se pudo borrar archivo temporal:', err);
            }
            // Nota: Usamos fs nativo de node
        }

        const nuevoProducto = await Producto.create({
            nombre,
            precio,
            descripcion,
            imagen_url,
            imagen_public_id
        });

        res.status(201).json(nuevoProducto);

    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: 'Error al crear producto', error });
    }
};

export const getProductos = async (req: Request, res: Response) => {
    const productos = await Producto.findAll({ where: { disponible: true } });
    res.json(productos);
};
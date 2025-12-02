import Usuario from './Usuario';
import Cliente from './Clientes';
import Producto from './Producto';
import Movimiento from './Producto';

// 1. Relaciones de Movimientos
// Un Cliente tiene muchos movimientos
Cliente.hasMany(Movimiento, { foreignKey: 'cliente_id', as: 'movimientos' });
Movimiento.belongsTo(Cliente, { foreignKey: 'cliente_id', as: 'cliente' });

// Un Usuario (Vendedor) genera movimientos
Usuario.hasMany(Movimiento, { foreignKey: 'usuario_id', as: 'movimientos' });
Movimiento.belongsTo(Usuario, { foreignKey: 'usuario_id', as: 'usuario' });

// Exportamos los modelos ya relacionados
export { 
    Usuario, 
    Cliente, 
    Producto, 
    Movimiento 
};
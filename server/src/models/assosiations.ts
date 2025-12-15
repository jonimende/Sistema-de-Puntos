import Usuario from './Usuario';
import Cliente from './Clientes';
import Producto from './Producto';
import Movimiento from './Producto';

export function applyAssosiations() {   
Cliente.hasMany(Movimiento, { foreignKey: 'cliente_id', as: 'movimientos' });
Movimiento.belongsTo(Cliente, { foreignKey: 'cliente_id', as: 'cliente' });


Usuario.hasMany(Movimiento, { foreignKey: 'usuario_id', as: 'movimientos' });
Movimiento.belongsTo(Usuario, { foreignKey: 'usuario_id', as: 'usuario' });
}


const env = require('./env.js');
const Sequelize = require('sequelize');
const oracledb = require('oracledb');

const sequelize = new Sequelize(env.DB_NAME, env.DB_USER, env.DB_PASSWORD, {
  host: env.DB_HOST,
  dialect: 'oracle',
  dialectModule: oracledb,
  dialectOptions: {
    connectString: `(description= (retry_count=20)(retry_delay=3)(address=(protocol=tcps)(port=${env.DB_PORT})(host=${env.DB_HOST}))(connect_data=(service_name=${env.DB_NAME}))(security=(ssl_server_dn_match=yes)))`
  },
  pool: {
    max: env.pool.max,
    min: env.pool.min,
    acquire: env.pool.acquire,
    idle: env.pool.idle,
  },
  logging: false, // Opcional: desactiva el logging si no lo necesitas
});

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.Empleado = require('../models/empleado.model.js')(sequelize, Sequelize);
db.Cliente = require('../models/cliente.model.js')(sequelize, Sequelize);
db.Factura = require('../models/factura.model.js')(sequelize, Sequelize);
db.DetalleFactura = require('../models/detallefactura.model.js')(sequelize, Sequelize);
db.MenuGeneral = require('../models/menugeneral.model.js')(sequelize, Sequelize);
db.Mesa = require('../models/mesa.model.js')(sequelize, Sequelize);
db.Usuario = require('../models/usuario.model.js')(sequelize, Sequelize);

module.exports = db;

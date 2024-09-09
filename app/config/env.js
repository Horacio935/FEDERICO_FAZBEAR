
 module.exports = {
  DB_USER: 'C##FAZBEAR',
  DB_PASSWORD: '1234',
  DB_HOST: '127.0.0.1',  // Cambia Pandnaceous por 127.0.0.1 para asegurar la conexión local
  DB_PORT: '1521',
  DB_NAME: 'xe', // Cambia FAZBEAR_DB por xe, que es el servicio que está registrado
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
};

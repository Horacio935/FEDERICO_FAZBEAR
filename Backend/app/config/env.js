module.exports = {
    DB_USER: 'USR_FAZBEAR',
    DB_PASSWORD: 'Fazbear1234.',
    DB_HOST: 'adb.mx-queretaro-1.oraclecloud.com',  // Cambia Pandnaceous por 127.0.0.1 para asegurar la conexión local
    DB_PORT: '1521',
    DB_NAME: 'g0dcfa0c8178520_fazbear_tpurgent.adb.oraclecloud.com', // Cambia FAZBEAR_DB por xe, que es el servicio que está registrado
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  };
  
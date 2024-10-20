module.exports = {
  DB_USER: 'USR_FAZBEAR',
  DB_PASSWORD: 'Fazbear1234.',
  DB_HOST: 'adb.mx-queretaro-1.oraclecloud.com',  // Cambia Pandnaceous por 127.0.0.1 para asegurar la conexión local
  DB_PORT: '1521',
  DB_NAME: 'g18bd7700c4df3e_fazbear_low.adb.oraclecloud.com', // Cambia FAZBEAR_DB por xe, que es el servicio que está registrado
  STRIPE_SECRET_KEY: sk_test_51Q9HPsB93apspbx9AA2EX09UQmgIOAihaA7IGZ4I4EyZh9ya4UqouiaiYTJLtpBLmFq0XdSed99PW8dbIdPwRChd00OQqPtAZ1,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
};
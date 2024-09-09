const express = require('express');
const oracledb = require('oracledb');
const config = require('./app/config/env'); // archivo env.js

const app = express();
const PORT = process.env.PORT || 3000; // Puerto para Express

// Middleware para parsear JSON
app.use(express.json());

// Importar las rutas
const router = require('./app/routers/router.js'); // Asegúrate de que la ruta sea correcta

// Aplicar el prefijo /api a todas las rutas
app.use('/api', router);

// Ruta de prueba para verificar que el servidor está funcionando
app.get('/', (req, res) => {
  res.send('Servidor funcionando');
});

async function init() {
  let connection;

  try {
    connection = await oracledb.getConnection({
      user: config.DB_USER,
      password: config.DB_PASSWORD,
      connectString: `${config.DB_HOST}:${config.DB_PORT}/${config.DB_NAME}`
    });

    console.log('Conectado a Oracle Database');
    const result = await connection.execute('SELECT * FROM usuario');
    console.log(result.rows);
  } catch (err) {
    console.error('Error al conectar:', err);
  } finally {
    if (connection) {
      try {
        await connection.close();
      } catch (err) {
        console.error('Error al cerrar la conexión:', err);
      }
    }
  }
}

// Inicializa la conexión a la base de datos
init();

// Inicia el servidor Express
app.listen(PORT, () => {
  console.log(`Servidor escuchando en puerto ${PORT}`);
});


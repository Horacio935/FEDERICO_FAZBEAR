const express = require('express'); // Solo se requiere una vez
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db.config'); // Importa el modelo de la base de datos

const JWT_SECRET = 'mi_clave_secreta_super_segura';


// Ruta de registro de usuario
router.post('/register', async (req, res) => {
    const { username, password, id_cliente, id_empleado, id_usuario } = req.body; // Añadimos los valores opcionales de cliente y empleado

    // Hashear la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        // Insertar el nuevo usuario en la base de datos Oracle, con FK opcionales
        const result = await db.sequelize.query(
            `INSERT INTO USUARIO (ID_USUARIO, ID_CLIENTE, ID_EMPLEADO, CORREO, CONTRASENIA)
             VALUES (:id_usuario, :id_cliente, :id_empleado, :username, :password)`,
            {
                replacements: {
                    id_usuario: id_usuario,
                    id_cliente: id_cliente || null,  // Si no se pasa ID_CLIENTE, se asigna NULL
                    id_empleado: id_empleado || null, // Si no se pasa ID_EMPLEADO, se asigna NULL
                    username,
                    password: hashedPassword
                },
                type: db.sequelize.QueryTypes.INSERT
            }
        );

        res.status(201).json({ message: 'Usuario registrado exitosamente' });
    } catch (error) {
        console.error('Error al registrar usuario:', error); // Mostrar el error en la consola
        // Devolver el error detallado en la respuesta
        res.status(400).json({ 
            error: 'Error al registrar usuario', 
            details: error.message 
        });
    }
});

/*catch (error) {
        res.status(500).json({
            message: "Failed to create Empleado!",
            error: error.message
        });
    }*/

// Ruta de inicio de sesión
router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    try {
        // Buscar el usuario en la base de datos Oracle
        const [user] = await db.sequelize.query(
            `SELECT * FROM USUARIO WHERE CORREO = :username`,
            {
                replacements: { username },
                type: db.sequelize.QueryTypes.SELECT
            }
        );

        if (!user) {
            return res.status(400).json({ error: 'Usuario no encontrado' });
        }

        // Comparar la contraseña proporcionada con la almacenada
        const isPasswordValid = await bcrypt.compare(password, user.CONTRASENIA);
        if (!isPasswordValid) {
            return res.status(400).json({ error: 'Contraseña incorrecta' });
        }

        // Generar un token JWT válido por 1 hora
        const token = jwt.sign({ id: user.ID }, JWT_SECRET, { expiresIn: '1h' });

        res.json({ token });
    } catch (error) {
        console.error('Error en el inicio de sesión:', error);
        res.status(500).json({ error: 'Error en el inicio de sesión' });
    }
});

// Middleware para verificar token
const verifyToken = (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) return res.status(403).json({ message: 'Token requerido' });

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) return res.status(403).json({ message: 'Token inválido' });
        req.userId = decoded.id;
        next();
    });
};

// Ruta protegida de ejemplo
router.get('/protected', verifyToken, (req, res) => {
    res.json({ message: 'Acceso a ruta protegida' });
});

 
const empleado = require('../controllers/controller.empleado.js');

router.post('/empleado/create', empleado.create);
router.get('/empleado/all', empleado.retrieveAllEmpleados);
router.get('/empleado/onebyid/:id', empleado.getEmpleadoById);
router.put('/empleado/update/:id', empleado.updateById);
router.delete('/empleado/delete/:id', empleado.deleteById);

const cliente = require('../controllers/controller.cliente.js');

router.post('/cliente/create', cliente.create);
router.get('/cliente/all', cliente.retrieveAllClientes);
router.get('/cliente/onebyid/:id', cliente.getClienteById);
router.put('/cliente/update/:id', cliente.updateById);
router.delete('/cliente/delete/:id', cliente.deleteById);

const DetalleFactura = require('../controllers/controller.factura.js');

// Ruta para realizar la compra
router.post('/carrito/compras', DetalleFactura.realizarCompra);
router.get('/clientes/:idCliente/facturas', DetalleFactura.retrieveFacturasByCliente);

const menuGeneral = require('../controllers/controller.menugeneral.js');

router.get('/menugeneral/all', menuGeneral.retrieveAllMenuGenerals);
router.get('/menugeneral/onebyid/:id', menuGeneral.getMenuGeneralById);

const mesa = require('../controllers/controller.mesa.js');

router.get('/mesa/all', mesa.retrieveAllMesas);
router.get('/mesa/onebyid/:id', mesa.getMesaById);

const usuario = require('../controllers/controller.usuario.js');

router.post('/usuario/create', usuario.create);
router.get('/usuario/all', usuario.retrieveAllUsuarios);
router.get('/usuario/onebyid/:id', usuario.getUsuarioById);
router.put('/usuario/update/:id', usuario.updateById);
router.delete('/usuario/delete/:id', usuario.deleteById);

router.get('/test', (req, res) => {
    res.send('Ruta de prueba funcionando');
});


module.exports = router;


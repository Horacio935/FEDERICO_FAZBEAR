const db = require('../config/db.config.js');
const Cliente = db.Cliente;
const Usuario = db.Usuario;
const bcrypt = require('bcrypt');
const moment = require('moment');

async function getNextClienteId() {
    try {
        // Ejecutar el query para obtener el próximo número de la secuencia para ID_CLIENTE
        const result = await db.sequelize.query(`SELECT SEQ_CLIENTE.NEXTVAL AS ID_CLIENTE FROM DUAL`, {
            type: db.Sequelize.QueryTypes.SELECT
        });
        return result[0].ID_CLIENTE;  // Retorna el valor de la secuencia con el nombre correcto
    } catch (err) {
        console.error(err);
        throw new Error('Error al obtener el ID del cliente');
    }
}


async function getNextUsuarioId() {
    try {
        const result = await db.sequelize.query(`SELECT SEQ_USUARIO.NEXTVAL AS ID_USUARIO FROM DUAL`, {
            type: db.Sequelize.QueryTypes.SELECT
        });
        return result[0].ID_USUARIO;
    } catch (err) {
        console.error(err);
        throw new Error('Error al obtener el ID del usuario');
    }
}

exports.create = async (req, res) => {
    let cliente = {};
    let usuario = {};
    
    try {
        // Construir el objeto Cliente
        cliente.idCliente = await getNextClienteId();
        cliente.correo = req.body.correo;
        cliente.nombre = req.body.nombre;
        cliente.apellido = req.body.apellido;
        cliente.nit = req.body.nit;
        cliente.direccion = req.body.direccion;
        cliente.telefono = req.body.telefono;
        cliente.fechaNacimiento = moment(req.body.fechaNacimiento).format('YYYY-MM-DD');
        cliente.fechaCreacion = moment().format('YYYY-MM-DD');
        cliente.ultimaActualizacion = moment().format('YYYY-MM-DD');
        
        // Hashear la contraseña
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        
        // Obtener el próximo ID de Usuario
        usuario.idUsuario = await getNextUsuarioId();
        usuario.idCliente = cliente.idCliente;
        usuario.idEmpleado = null; // Dejar como null para empleados no asignados
        usuario.correo = req.body.correo;
        usuario.contrasenia = hashedPassword;
        
        // Iniciar una transacción
        await db.sequelize.transaction(async (t) => {
            // Crear Cliente
            const clienteResult = await Cliente.create(cliente, { transaction: t });
            
            // Crear Usuario asociado al Cliente
            const usuarioResult = await Usuario.create(usuario, { transaction: t });

            res.status(201).json({
                message: "Cliente y Usuario creados exitosamente",
                cliente: clienteResult,
                usuario: usuarioResult
            });
        });
    } catch (error) {
        console.error('Error al crear Cliente y Usuario:', error);
        res.status(500).json({
            message: "Error al crear Cliente y Usuario",
            error: error.message
        });
    }
};

exports.retrieveAllClientes = async (req, res) => {
    try {
        const clienteInfos = await Cliente.findAll();
        res.status(200).json({
            message: "Successfully retrieved all Clientes' Infos!",
            clientes: clienteInfos
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Error retrieving Clientes!",
            error: error.message
        });
    }
}

exports.getClienteById = async (req, res) => {
    try {
        const clienteId = req.params.id;
        const cliente = await Cliente.findByPk(clienteId);
        
        if (!cliente) {
            return res.status(404).json({
                message: "Cliente with id = " + clienteId + " not found!",
                error: "404"
            });
        }

        res.status(200).json({
            message: "Successfully retrieved Cliente with id = " + clienteId,
            cliente: cliente
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Error retrieving Cliente with id = " + req.params.id,
            error: error.message
        });
    }
}

exports.updateById = async (req, res) => {
    try {
        const clienteId = req.params.id;

        // Find the employee by primary key
        const cliente = await Cliente.findByPk(clienteId);

        if (!cliente) {
            return res.status(404).json({
                message: "Cliente with id = " + clienteId + " not found for update!",
                error: "404"
            });
        }

        // Update the employee with new values
        const updatedObject = {
            nombre: req.body.nombre,
            apellido: req.body.apellido,
            direccion: req.body.direccion,
            nit: req.body.nit,
            telefono: req.body.telefono,
            fechaNacimiento: req.body.fechaNacimiento,
            ultimaActualizacion: new Date()
        };

        // Update the employee
        const updated = await Cliente.update(updatedObject, {
            where: { ID_CLIENTE: clienteId }
        });

        if (updated[0] === 0) {
            // No rows updated
            return res.status(500).json({
                message: "Failed to update Cliente with id = " + clienteId,
                error: "Update failed"
            });
        }

        // Optionally, fetch the updated employee to return
        const updatedCliente = await Cliente.findByPk(clienteId);

        res.status(200).json({
            message: "Cliente updated successfully with id = " + clienteId,
            cliente: updatedCliente
        });
    } catch (error) {
        res.status(500).json({
            message: "Error updating Cliente with id = " + req.params.id,
            error: error.message
        });
    }
}


exports.deleteById = async (req, res) => {
    try {
        const clienteId = req.params.id;
        const cliente = await Cliente.findByPk(clienteId);

        if (!cliente) {
            return res.status(404).json({
                message: "Cliente with id = " + clienteId + " does not exist!",
                error: "404"
            });
        }

        await cliente.destroy();
        res.status(200).json({
            message: "Cliente deleted successfully with id = " + clienteId,
            cliente: cliente
        });
    } catch (error) {
        res.status(500).json({
            message: "Error deleting Cliente with id = " + req.params.id,
            error: error.message
        });
    }
}

exports.getClienteByCorreo = async (req, res) => {
    try {
        const correoCliente = req.params.correo;
        const cliente = await Cliente.findOne({ where: { correo: correoCliente } });
        
        if (!cliente) {
            return res.status(404).json({
                message: "Cliente with correo = " + correoCliente + " not found!",
                error: "404"
            });
        }

        res.status(200).json({
            message: "Successfully retrieved Cliente with correo = " + correoCliente,
            cliente: cliente
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Error retrieving Cliente with correo = " + req.params.correo,
            error: error.message
        });
    }
}

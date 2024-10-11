const db = require('../config/db.config.js');
const Cliente = db.Cliente;
//const moment = require('moment');

exports.create = async (req, res) => {
    let cliente = {};
    const moment = require('moment');
    console.log('Received request body:', req.body); // Agrega esta línea
    try {
        // Building Cliente object from uploading request's body
        //const cliente = {
            cliente.idCliente = req.body.idCliente;
            cliente.correo = req.body.correo;
            cliente.nombre = req.body.nombre,
            cliente.apellido = req.body.apellido,
            cliente.nit = req.body.nit,
            cliente.direccion = req.body.direccion,
            cliente.telefono = req.body.telefono,
            cliente.fechaNacimiento = moment(req.body.Fecha_Nacimiento).format('YYYY-MM-DD'),
            cliente.fechaCreacion = moment(req.body.Fecha_creacion).format('YYYY-MM-DD'), // Asigna la fecha de creación actual
            cliente.ultimaActualizacion = moment(req.body.ultimaActualizacion).format('YYYY-MM-DD') // Asigna la fecha de actualización actual
        //};
    
        // Save to Oracle database
        const result = await Cliente.create(cliente);
    
        // Send success message to client
        res.status(200).json({
            message: "Cliente created successfully with id = " + result.id,
            cliente: result
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to create Cliente!",
            error: error.message
        });
    }
}

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
            correo: req.body.correo,
            nombre: req.body.nombre,
            apellido: req.body.apellido,
            direccion: req.body.direccion,
            nit: req.body.nit,
            telefono: req.body.telefono,
            fechaNacimiento: req.body.fechaNacimiento,
            fechaCreacion: req.body.fechaCreacion,
            ultimaActualizacion: req.body.ultimaActualizacion
        };

        // Update the employee
        const updated = await Cliente.update(updatedObject, {
            where: { id: clienteId }
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
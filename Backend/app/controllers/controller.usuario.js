const db = require('../config/db.config.js');
const Usuario = db.Usuario;
//const moment = require('moment');

exports.create = async (req, res) => {
    let usuario = {};
    const moment = require('moment');
    console.log('Received request body:', req.body); // Agrega esta línea
    try {
        // Building Usuario object from uploading request's body
        //const usuario = {
            usuario.IdUsuario = req.body.IdUsuario;
            usuario.IdCliente = req.body.IdCliente;
            usuario.IdEmpleado = req.body.IdEmpleado,
            usuario.Correo = req.body.Correo,
            usuario.Contrasenia = req.body.Contrasenia 
        //};
    
        // Save to Oracle database
        const result = await Usuario.create(usuario);
    
        // Send success message to client
        res.status(200).json({
            message: "Usuario created successfully with id = " + result.id,
            usuario: result
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to create Usuario!",
            error: error.message
        });
    }
}

exports.retrieveAllUsuarios = async (req, res) => {
    try {
        const usuarioInfos = await Usuario.findAll();
        res.status(200).json({
            message: "Successfully retrieved all Usuarios' Infos!",
            usuarios: usuarioInfos
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Error retrieving Usuarios!",
            error: error.message
        });
    }
}

exports.getUsuarioById = async (req, res) => {
    try {
        const usuarioId = req.params.id;
        const usuario = await Usuario.findByPk(usuarioId);
        
        if (!usuario) {
            return res.status(404).json({
                message: "Usuario with id = " + usuarioId + " not found!",
                error: "404"
            });
        }

        res.status(200).json({
            message: "Successfully retrieved Usuario with id = " + usuarioId,
            usuario: usuario
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Error retrieving Usuario with id = " + req.params.id,
            error: error.message
        });
    }
}

exports.updateById = async (req, res) => {
    try {
        const usuarioId = req.params.id;

        // Find the employee by primary key
        const usuario = await Usuario.findByPk(usuarioId);

        if (!usuario) {
            return res.status(404).json({
                message: "Usuario with id = " + usuarioId + " not found for update!",
                error: "404"
            });
        }

        // Update the employee with new values
        const updatedObject = {
            correo: req.body.correo,
            contrasenia: req.body.contrasenia
        };

        // Update the employee
        const updated = await Usuario.update(updatedObject, {
            where: { id: usuarioId }
        });

        if (updated[0] === 0) {
            // No rows updated
            return res.status(500).json({
                message: "Failed to update Usuario with id = " + usuarioId,
                error: "Update failed"
            });
        }

        // Optionally, fetch the updated employee to return
        const updatedUsuario = await Usuario.findByPk(usuarioId);

        res.status(200).json({
            message: "Usuario updated successfully with id = " + usuarioId,
            usuario: updatedUsuario
        });
    } catch (error) {
        res.status(500).json({
            message: "Error updating Usuario with id = " + req.params.id,
            error: error.message
        });
    }
}


exports.deleteById = async (req, res) => {
    try {
        const usuarioId = req.params.id;
        const usuario = await Usuario.findByPk(usuarioId);

        if (!usuario) {
            return res.status(404).json({
                message: "Usuario with id = " + usuarioId + " does not exist!",
                error: "404"
            });
        }

        await usuario.destroy();
        res.status(200).json({
            message: "Usuario deleted successfully with id = " + usuarioId,
            usuario: usuario
        });
    } catch (error) {
        res.status(500).json({
            message: "Error deleting Usuario with id = " + req.params.id,
            error: error.message
        });
    }
}
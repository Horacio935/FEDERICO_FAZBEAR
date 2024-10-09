const db = require('../config/db.config.js');
const Empleado = db.Empleado;
//const moment = require('moment');

exports.create = async (req, res) => {
    let empleado = {};
    const moment = require('moment');
    console.log('Received request body:', req.body); // Agrega esta línea
    try {
        // Building Empleado object from uploading request's body
        //const empleado = {
            empleado.id = req.body.id;
            empleado.DPI = req.body.DPI;
            empleado.Nombre = req.body.Nombre,
            //empleado.Nombre2 = req.body.Nombre2,
            empleado.Apellido = req.body.Apellido,
            //empleado.Apellido2 = req.body.Apellido2,
            empleado.Direccion = req.body.Direccion,
            empleado.Telefono = req.body.Telefono,
            empleado.Fecha_Nacimiento = moment(req.body.Fecha_Nacimiento).format('YYYY-MM-DD'),
            empleado.Correo = req.body.Correo,
            empleado.Fecha_creacion = moment(req.body.Fecha_creacion).format('YYYY-MM-DD'), // Asigna la fecha de creación actual
            empleado.Fecha_actualizacion = moment(req.body.Fecha_actualizacion).format('YYYY-MM-DD'), // Asigna la fecha de actualización actual
            empleado.Rol_empleado = req.body.Rol_empleado
        //};
    
        // Save to Oracle database
        const result = await Empleado.create(empleado);
    
        // Send success message to client
        res.status(200).json({
            message: "Empleado created successfully with id = " + result.id,
            empleado: result
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to create Empleado!",
            error: error.message
        });
    }
}

exports.retrieveAllEmpleados = async (req, res) => {
    try {
        const empleadoInfos = await Empleado.findAll();
        res.status(200).json({
            message: "Successfully retrieved all Empleados' Infos!",
            empleados: empleadoInfos
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Error retrieving Empleados!",
            error: error.message
        });
    }
}

exports.getEmpleadoById = async (req, res) => {
    try {
        const empleadoId = req.params.id;
        const empleado = await Empleado.findByPk(empleadoId);
        
        if (!empleado) {
            return res.status(404).json({
                message: "Empleado with id = " + empleadoId + " not found!",
                error: "404"
            });
        }

        res.status(200).json({
            message: "Successfully retrieved Empleado with id = " + empleadoId,
            empleado: empleado
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Error retrieving Empleado with id = " + req.params.id,
            error: error.message
        });
    }
}

exports.updateById = async (req, res) => {
    try {
        const empleadoId = req.params.id;

        // Find the employee by primary key
        const empleado = await Empleado.findByPk(empleadoId);

        if (!empleado) {
            return res.status(404).json({
                message: "Empleado with id = " + empleadoId + " not found for update!",
                error: "404"
            });
        }

        // Update the employee with new values
        const updatedObject = {
            DPI: req.body.DPI,
            Nombre: req.body.Nombre,
            //Nombre2: req.body.Nombre2,
            Apellido: req.body.Apellido,
            //Apellido2: req.body.Apellido2,
            Direccion: req.body.Direccion,
            Telefono: req.body.Telefono,
            Fecha_Nacimiento: req.body.Fecha_Nacimiento,
            Correo: req.body.Correo,
            Fecha_actualizacion: req.body.Fecha_actualizacion, // Update the last updated date
            Rol_empleado: req.body.Rol_empleado
        };

        // Update the employee
        const updated = await Empleado.update(updatedObject, {
            where: { id: empleadoId }
        });

        if (updated[0] === 0) {
            // No rows updated
            return res.status(500).json({
                message: "Failed to update Empleado with id = " + empleadoId,
                error: "Update failed"
            });
        }

        // Optionally, fetch the updated employee to return
        const updatedEmpleado = await Empleado.findByPk(empleadoId);

        res.status(200).json({
            message: "Empleado updated successfully with id = " + empleadoId,
            empleado: updatedEmpleado
        });
    } catch (error) {
        res.status(500).json({
            message: "Error updating Empleado with id = " + req.params.id,
            error: error.message
        });
    }
}


exports.deleteById = async (req, res) => {
    try {
        const empleadoId = req.params.id;
        const empleado = await Empleado.findByPk(empleadoId);

        if (!empleado) {
            return res.status(404).json({
                message: "Empleado with id = " + empleadoId + " does not exist!",
                error: "404"
            });
        }

        await empleado.destroy();
        res.status(200).json({
            message: "Empleado deleted successfully with id = " + empleadoId,
            empleado: empleado
        });
    } catch (error) {
        res.status(500).json({
            message: "Error deleting Empleado with id = " + req.params.id,
            error: error.message
        });
    }
}

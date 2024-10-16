const db = require('../config/db.config.js');
const MenuGeneral = db.MenuGeneral;
const moment = require('moment');

exports.create = async (req, res) => {
    try {
        const { idAlimento, idTipoMenu, nombre, descripcion, precio, imagen, fechaCreacion, fechaActualizacion } = req.body;

        if (!idAlimento || !idTipoMenu || !nombre || !descripcion || !precio || !imagen || !fechaCreacion || !fechaActualizacion) {
            return res.status(400).json({
                message: "All fields are required!",
                error: "Validation Error"
            });
        }

        const menuGeneral = await MenuGeneral.create({
            idAlimento: idAlimento,
            idTipoMenu: idTipoMenu,
            nombre: nombre,
            descripcion: descripcion,
            precio: precio,
            imagen: imagen, // Asegúrate de que el formato de la imagen sea correcto
            fechaCreacion: fechaCreacion,
            fechaActualizacion: fechaActualizacion
        });

        res.status(200).json({
            message: "MenuGeneral created successfully with id = " + menuGeneral.idAlimento,
            menuGeneral: menuGeneral
        });
    } catch (error) {
        res.status(500).json({
            message: "Failed to create MenuGeneral!",
            error: error.message
        });
    }
}

exports.retrieveAllMenuGenerals = async (req, res) => {
    try {
        const menuGeneralInfos = await MenuGeneral.findAll();
        res.status(200).json({
            message: "Successfully retrieved all MenuGenerals' Infos!",
            menuGenerals: menuGeneralInfos
        });
    } catch (error) {
        res.status(500).json({
            message: "Error retrieving MenuGenerals!",
            error: error.message
        });
    }
}

exports.getMenuGeneralById = async (req, res) => {
    try {
        const menuGeneralId = req.params.id;
        const menuGeneral = await MenuGeneral.findByPk(menuGeneralId);
        
        if (!menuGeneral) {
            return res.status(404).json({
                message: "MenuGeneral with id = " + menuGeneralId + " not found!",
                error: "404"
            });
        }

        res.status(200).json({
            message: "Successfully retrieved MenuGeneral with id = " + menuGeneralId,
            menuGeneral: menuGeneral
        });
    } catch (error) {
        res.status(500).json({
            message: "Error retrieving MenuGeneral with id = " + req.params.id,
            error: error.message
        });
    }
}

exports.updateById = async (req, res) => {
    try {
        const menuGeneralId = req.params.id;
        const menuGeneral = await MenuGeneral.findByPk(menuGeneralId);

        if (!menuGeneral) {
            return res.status(404).json({
                message: "MenuGeneral with id = " + menuGeneralId + " not found for update!",
                error: "404"
            });
        }

        const updatedObject = {
            idTipoMenu: req.body.idTipoMenu,
            nombre: req.body.nombre,
            descripcion: req.body.descripcion,
            precio: req.body.precio,
            imagen: req.body.imagen, // Asume que se envía como un buffer o base64
            fechaCreacion: moment(req.body.fechaCreacion).format('YYYY-MM-DD'),
            fechaActualizacion: moment(req.body.fechaActualizacion).format('YYYY-MM-DD')
        };

        const updated = await MenuGeneral.update(updatedObject, {
            where: { idAlimento: menuGeneralId }
        });

        if (updated[0] === 0) {
            return res.status(500).json({
                message: "Failed to update MenuGeneral with id = " + menuGeneralId,
                error: "Update failed"
            });
        }

        const updatedMenuGeneral = await MenuGeneral.findByPk(menuGeneralId);

        res.status(200).json({
            message: "MenuGeneral updated successfully with id = " + menuGeneralId,
            menuGeneral: updatedMenuGeneral
        });
    } catch (error) {
        res.status(500).json({
            message: "Error updating MenuGeneral with id = " + req.params.id,
            error: error.message
        });
    }
}

exports.deleteById = async (req, res) => {
    try {
        const menuGeneralId = req.params.id;
        const menuGeneral = await MenuGeneral.findByPk(menuGeneralId);

        if (!menuGeneral) {
            return res.status(404).json({
                message: "MenuGeneral with id = " + menuGeneralId + " does not exist!",
                error: "404"
            });
        }

        await menuGeneral.destroy();
        res.status(200).json({
            message: "MenuGeneral deleted successfully with id = " + menuGeneralId,
            menuGeneral: menuGeneral
        });
    } catch (error) {
        res.status(500).json({
            message: "Error deleting MenuGeneral with id = " + req.params.id,
            error: error.message
        });
    }
}
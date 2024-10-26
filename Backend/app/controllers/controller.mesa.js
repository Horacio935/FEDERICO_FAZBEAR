const db = require('../config/db.config.js');
const Mesa = db.Mesa;

exports.retrieveAllMesas = async (req, res) => {
    try {
        const mesaInfos = await Mesa.findAll();
        res.status(200).json({
            message: "Successfully retrieved all Mesas' Infos!",
            mesas: mesaInfos
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Error retrieving Mesas!",
            error: error.message
        });
    }
}

exports.getMesaById = async (req, res) => {
    try {
        const mesaId = req.params.id;
        const mesa = await Mesa.findByPk(mesaId);
        
        if (!mesa) {
            return res.status(404).json({
                message: "Mesa with id = " + mesaId + " not found!",
                error: "404"
            });
        }

        res.status(200).json({
            message: "Successfully retrieved Mesa with id = " + mesaId,
            mesa: mesa
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message: "Error retrieving Mesa with id = " + req.params.id,
            error: error.message
        });
    }
}

exports.getMesasBySucursal = async (req, res) => {
    try {
        const sucursalId = req.params.sucursalId;
        
        // Usa `Sucursal` para que coincida con el modelo
        const mesas = await Mesa.findAll({ where: { Sucursal: sucursalId } });

        if (!mesas.length) {
            return res.status(404).json({
                message: `No se encontraron mesas para la sucursal con id = ${sucursalId}`,
                error: "404"
            });
        }

        res.status(200).json({
            message: `Mesas obtenidas correctamente para la sucursal con id = ${sucursalId}`,
            mesas: mesas
        });
    } catch (error) {
        console.error('Error al obtener las mesas:', error);
        res.status(500).json({
            message: "Error al obtener las mesas!",
            error: error.message
        });
    }
};

module.exports = (sequelize, Sequelize) => {
    const DetalleFactura = sequelize.define('DetalleFactura', {
        idDetalle: {
            type: Sequelize.INTEGER,
            primaryKey: true,
           // autoIncrement: true,
            field: 'ID_DETALLE'
        },
        noFactura: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            field: 'NO_FACTURA'
        },
        serieFactura: {
            type: Sequelize.STRING,
            field: 'SERIE_FACTURA'
        },
        idAlimento: {
            type: Sequelize.INTEGER,
            field: 'ID_ALIMENTO'
        },
        noReserva: {
            type: Sequelize.INTEGER,
            field: 'NO_RESERVA'
        },
        costo: {
            type: Sequelize.INTEGER,
            field: 'COSTO'
        },
        fechaCompra: {
            type: Sequelize.DATE,
            field: 'FECHA_COMPRA'
        },
        lugarCompra: {
            type: Sequelize.STRING,
            field: 'LUGAR_COMPRA'
        }
    }, {
        tableName: 'DETALLE_FACTURA',
        timestamps: false
    });

    return DetalleFactura;
};
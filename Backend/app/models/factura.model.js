module.exports = (sequelize, Sequelize) => {
    const Factura = sequelize.define('Factura', {
        noFactura: {
            type: Sequelize.INTEGER,
            //autoIncrement: true, 
            primaryKey: true,
            field: 'NO_FACTURA'
        },
        serieFactura: {
            type: Sequelize.STRING,
            primaryKey: true, 
            field: 'SERIE_FACTURA'
        },
        fechaFactura: {
            type: Sequelize.DATE,
            field: 'FECHA_FACTURA'
        },
        idCliente: {
            type: Sequelize.INTEGER,
            field: 'ID_CLIENTE'
        },
        idEmpleado: {
            type: Sequelize.INTEGER,
            field: 'ID_EMPLEADO'
        },
        idSucursal: {
            type: Sequelize.INTEGER,
            field: 'ID_SUCURSAL'
        },
        total: {
            type: Sequelize.FLOAT,
            field: 'TOTAL'
        },
        correo: {
            type: Sequelize.STRING,
            field: 'CORREO'
        }
    }, {
        tableName: 'FACTURA', // Nombre de la tabla en la base de datos
        timestamps: false     // Deshabilitar timestamps
    });

    return Factura;
};
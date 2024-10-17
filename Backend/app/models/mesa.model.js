module.exports = (sequelize, Sequelize) => {
    const Mesa = sequelize.define('mesa', {
        CodigoMesa: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            field: 'CODIGO_MESA'
        },
        Sucursal: {
            type: Sequelize.INTEGER,
            field: 'ID_SUCURSAL'
        },
        NumMesa: {
            type: Sequelize.INTEGER,
            field: 'NUM_MESA'
        },
        Capacidad: {
            type: Sequelize.INTEGER,
            field: 'CAPACIDAD'
        }
    }, {
        tableName: 'MESA', // Asume que la tabla en la base de datos se llama 'CLIENTE'
        timestamps: false     // Desactiva los timestamps si la tabla no los usa
    });

    return Mesa;
};

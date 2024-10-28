module.exports = (sequelize, Sequelize) => {
    const Usuario = sequelize.define('usuario', {
        idUsuario: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            field: 'ID_USUARIO'
        },
        idCliente: {
            type: Sequelize.INTEGER,
            field: 'ID_CLIENTE'
        },
        idEmpleado: {
            type: Sequelize.INTEGER,
            field: 'ID_EMPLEADO'
        },
        correo: {
            type: Sequelize.STRING(70),
            field: 'CORREO'
        },
        contrasenia: {
            type: Sequelize.STRING(255),
            field: 'CONTRASENIA'
        },
    }, {
        tableName: 'USUARIO', // Asume que la tabla en la base de datos se llama 'CLIENTE'
        timestamps: false     // Desactiva los timestamps si la tabla no los usa
    });

    return Usuario;
};

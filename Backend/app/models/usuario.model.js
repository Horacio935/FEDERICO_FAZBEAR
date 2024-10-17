module.exports = (sequelize, Sequelize) => {
    const Usuario = sequelize.define('usuario', {
        IdUsuario: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            field: 'ID_USUARIO'
        },
        IdCliente: {
            type: Sequelize.INTEGER,
            field: 'ID_CLIENTE'
        },
        IdEmpleado: {
            type: Sequelize.INTEGER,
            field: 'ID_EMPLEADO'
        },
        Correo: {
            type: Sequelize.STRING,
            field: 'CORREO'
        },
        Contrasenia: {
            type: Sequelize.STRING,
            field: 'CONTRASENIA'
        }
    }, {
        tableName: 'USUARIO', // Asume que la tabla en la base de datos se llama 'CLIENTE'
        timestamps: false     // Desactiva los timestamps si la tabla no los usa
    });

    return Usuario;
};
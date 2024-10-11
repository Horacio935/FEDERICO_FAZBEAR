module.exports = (sequelize, Sequelize) => {
    const Cliente = sequelize.define('cliente', {
        idCliente: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            field: 'ID_CLIENTE'
        },
        correo: {
            type: Sequelize.STRING(70),
            field: 'CORREO'
        },
        nombre: {
            type: Sequelize.STRING(30),
            field: 'NOMBRE'
        },
        /*nombre2: {
            type: Sequelize.STRING(30),
            field: 'NOMBRE2'
        },*/
        apellido: {
            type: Sequelize.STRING(30),
            field: 'APELLIDO'
        },
        direccion: {
            type: Sequelize.STRING(200),
            field: 'DIRECCION'
        },
        nit: {
            type: Sequelize.STRING(12),
            field: 'NIT'
        },
        telefono: {
            type: Sequelize.INTEGER,
            field: 'TELEFONO'
        },
        fechaNacimiento: {
            type: Sequelize.DATE,
            field: 'FECHA_NACIMIENTO'
        },
        fechaCreacion: {
            type: Sequelize.DATE,
            field: 'FECHA_CREACION'
        },
        ultimaActualizacion: {
            type: Sequelize.DATE,
            field: 'ULTIMA_FECHA_ACT'
        }
    }, {
        tableName: 'CLIENTE', // Asume que la tabla en la base de datos se llama 'CLIENTE'
        timestamps: false     // Desactiva los timestamps si la tabla no los usa
    });

    return Cliente;
};

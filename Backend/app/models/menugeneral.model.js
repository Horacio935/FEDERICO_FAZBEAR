module.exports = (sequelize, Sequelize) => {
    const MenuGeneral = sequelize.define('MenuGeneral', {
        idAlimento: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true, // Asume que el ID es autoincrementable
            field: 'ID_ALIMENTO'
        },
        idTipoMenu: {
            type: Sequelize.INTEGER,
            allowNull: false,
            field: 'ID_TIPO_MENU'
        },
        nombre: {
            type: Sequelize.STRING(25),
            allowNull: false,
            field: 'NOMBRE'
        },
        descripcion: {
            type: Sequelize.STRING(250),
            allowNull: false,
            field: 'DESCRIPCION'
        },
        precio: {
            type: Sequelize.INTEGER,
            allowNull: false,
            field: 'PRECIO'
        },
        imagen: {
            type: Sequelize.BLOB('long'), // Tipo BLOB para imágenes
            allowNull: false,
            field: 'IMAGEN'
        },
        fechaCreacion: {
            type: Sequelize.DATE,
            allowNull: false,
            field: 'FECHA_CREACION'
        },
        fechaActualizacion: {
            type: Sequelize.DATE,
            allowNull: false,
            field: 'FECHA_ACTUALIZACION'
        }
    }, {
        tableName: 'MENU_GENERAL', // Asume que la tabla en la base de datos se llama 'MENU_GENERAL'
        timestamps: false     // Desactiva los timestamps si la tabla no los usa
    });

    MenuGeneral.associate = (models) => {
        MenuGeneral.belongsTo(models.TipoMenu, {
            foreignKey: 'idTipoMenu',
            as: 'tipoMenu'
        });
    };

    return MenuGeneral;
};
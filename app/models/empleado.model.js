module.exports = (sequelize, Sequelize) => {
	const Empleado = sequelize.define('empleado', {	
	  id: {
	    type: Sequelize.INTEGER,  // Cambiado de Sequelize.NUMBER a Sequelize.INTEGER
	    //autoIncrement: true,
            primaryKey: true,
            field: 'ID_EMPLEADO'
        },
	  DPI: {
	    type: Sequelize.BIGINT,  // Cambiado de Sequelize.NUMBER a Sequelize.BIGINT
            field: 'DPI'
	       },
	  Nombre: {
	    type: Sequelize.STRING,
            field: 'NOMBRE'
  	        },
	  /*Nombre2: {
	    type: Sequelize.STRING,
            field: 'NOMBRE2'
	           },*/
	  Apellido: {
	    type: Sequelize.STRING,
            field: 'APELLIDO'
              },
    /*Apellido2: {
            type: Sequelize.STRING,
            field: 'APELLIDO2'
               },*/
    Direccion: {
            type: Sequelize.STRING,
            field: 'DIRECCION'
               },
    Telefono: {
            type: Sequelize.BIGINT,  // Cambiado de Sequelize.NUMBER a Sequelize.BIGINT
            field: 'TELEFONO'
              },
    Fecha_Nacimiento: {
            type: Sequelize.DATE,
            field: 'FECHA_NACIMIENTO'
              },
    Correo: {
            type: Sequelize.STRING,
            field: 'CORREO'
            },
    Fecha_creacion: {
            type: Sequelize.DATE,
            field: 'FECHA_CREACION'
            },
    Fecha_actualizacion: {
            type: Sequelize.DATE,
            field: 'FECHA_ACTUALIZACION'
            },
    Rol_empleado: {
            type: Sequelize.CHAR,
            field: 'ROL_EMPLEADO'
            }
	}, {
        tableName: 'EMPLEADO',  // Mueve esto fuera de la definición de campos
        timestamps: false       // Desactiva los timestamps si tu tabla no los usa
    });
	
	return Empleado;
}

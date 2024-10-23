module.exports = (sequelize, DataTypes) => {
  const Reserva = sequelize.define("Reserva", {
    no_reserva: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      field: 'NO_RESERVA'
    },
    codigo_mesa: {
      type: DataTypes.STRING(4),
      allowNull: false,
      field: 'CODIGO_MESA'
    },
    fecha_reserva: {
      type: DataTypes.DATE,
      allowNull: false,
      field: 'FECHA_RESERVA'
    },
    hora_inicial: {
      type: DataTypes.DATE,
      allowNull: false,
      field: 'HORA_INICIAL'
    },
    hora_final: {
      type: DataTypes.DATE,
      allowNull: false,
      field: 'HORA_FINAL'
    },
    cantidad_personas: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'CANTIDAD_PERSONAS'
    },
    precio: {
      type: DataTypes.FLOAT,
      allowNull: false,
      field: 'PRECIO'
    },
    id_cliente: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: 'ID_CLIENTE'
    },
    correo: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'CORREO'
    }
  }, {
    tableName: "RESERVA",
    timestamps: false
  });

  return Reserva;
};
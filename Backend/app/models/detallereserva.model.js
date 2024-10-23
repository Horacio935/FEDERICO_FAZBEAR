module.exports = (sequelize, DataTypes) => {
  const DetalleReserva = sequelize.define("DetalleReserva", {
    id_detalle_reserva: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      field: 'ID_DETALLE_RESERVA'
    },
    no_reserva: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      allowNull: false,
      field: 'NO_RESERVA'
    },
    codigo_mesa: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'CODIGO_MESA'
    },
    costo: {
      type: DataTypes.FLOAT,
      allowNull: false,
      field: 'COSTO'
    },
    fecha_compra: {
      type: DataTypes.DATE,
      allowNull: false,
      field: 'FECHA_COMPRA'
    },
    lugar_compra: {
      type: DataTypes.STRING,
      allowNull: false,
      field: 'LUGAR_COMPRA'
    }
  }, {
    tableName: "DETALLE_RESERVA",
    timestamps: false
  });

  return DetalleReserva;
};

  
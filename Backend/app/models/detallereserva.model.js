module.exports = (sequelize, DataTypes) => {
    const DetalleReserva = sequelize.define("DetalleReserva", {
      id_detalle_reserva: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false
      },
      codigo_reserva: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false
      },
      codigo_mesa: {
        type: DataTypes.STRING(4),
        allowNull: false
      },
      costo: {
        type: DataTypes.FLOAT,
        allowNull: false
      },
      fecha_compra: {
        type: DataTypes.DATE,
        allowNull: false
      },
      lugar_compra: {
        type: DataTypes.STRING(6),
        allowNull: false
      }
    }, {
      tableName: "DETALLE_RESERVA",
      timestamps: false
    });
  
    return DetalleReserva;
  };
  
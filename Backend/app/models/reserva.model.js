module.exports = (sequelize, DataTypes) => {
    const Reserva = sequelize.define("Reserva", {
      no_reserva: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        allowNull: false
      },
      codigo_mesa: {
        type: DataTypes.STRING(4),
        allowNull: false
      },
      fecha_reserva: {
        type: DataTypes.DATE,
        allowNull: false
      },
      hora_inicial: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      hora_final: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      cantidad_personas: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      precio: {
        type: DataTypes.FLOAT,
        allowNull: false
      },
      id_cliente: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      correo: {
        type: DataTypes.STRING(70),
        allowNull: false
      }
    }, {
      tableName: "RESERVA",
      timestamps: false
    });
  
    return Reserva;
  };
  
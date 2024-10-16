const db = require('../config/db.config.js');
const Factura = db.Factura;  // Modelo Factura
const DetalleFactura = db.DetalleFactura;  // Modelo DetalleFactura

// Función para obtener el siguiente valor de la secuencia

async function getNextFacturaNumber() {
    try {
        // Ejecutar el query para obtener el próximo número de la secuencia
        const result = await db.sequelize.query(`SELECT SEQ_FACTURA.NEXTVAL AS noFactura FROM DUAL`, {
            type: db.Sequelize.QueryTypes.SELECT
        });
        return result[0].NOFACTURA;  // Retorna el valor de la secuencia
    } catch (err) {
        console.error(err);
        throw new Error('Error al obtener el número de factura');
    }
}


// Función para manejar la compra
/*const*/ exports.realizarCompra = async (req, res) => {
  const t = await db.sequelize.transaction(); // Inicia una transacción para asegurarse de que todo se inserte correctamente o se haga rollback

  try {
      const { idCliente, idEmpleado, idSucursal, productos, total, correo } = req.body;

      // Verificar que todos los campos obligatorios están presentes
      if (!idCliente || !idSucursal || !productos || productos.length === 0 || !total || !correo) {
          return res.status(400).json({ message: 'Datos incompletos en la solicitud' });
      }

      // Obtener el siguiente número de factura
      const noFactura = await getNextFacturaNumber();

      // Crear la factura
      const nuevaFactura = await Factura.create({
          noFactura,
          serieFactura: 'A',  // Puedes ajustar la serie de factura
          fechaFactura: new Date(),
          idCliente,
          idEmpleado,
          idSucursal,
          total,
          correo
      }, { transaction: t });

      // Contador autoincrementable para los detalles
      let idDetalleIncremental = 1;

      // Crear los detalles de la factura
      for (let i = 0; i < productos.length; i++) {
          const producto = productos[i];

          // Validar que los datos del producto estén completos
          if (!producto.idAlimento || !producto.lugarCompra || !producto.costo) {
              throw new Error('Datos incompletos en los productos');
          }

          await DetalleFactura.create({
              idDetalle: idDetalleIncremental++,  // Incrementa el valor de idDetalle
              noFactura: nuevaFactura.noFactura,
              serieFactura: nuevaFactura.serieFactura,
              idAlimento: producto.idAlimento,
              noReserva: producto.noReserva || null,
              costo: producto.costo,
              fechaCompra: new Date(),
              lugarCompra: producto.lugarCompra
          }, { transaction: t });
      }

      // Confirmar la transacción
      await t.commit();

      res.status(201).json({ message: 'Compra realizada con éxito', factura: nuevaFactura });
  } catch (error) {
      // Hacer rollback en caso de error
      await t.rollback();
      console.error('Error en la compra:', error);
      res.status(500).json({ message: 'Error al realizar la compra', error });
  }
};
//module.exports = { realizarCompra };

exports.retrieveFacturasByCliente = async (req, res) => {
    try {
        const { idCliente } = req.params;  // Supone que pasas el idCliente como parámetro en la URL

        // Verifica si el cliente existe
       /* const cliente = await Cliente.findByPk(idCliente);
        if (!cliente) {
            return res.status(404).json({
                message: `Cliente con id ${idCliente} no encontrado.`
            });
        }*/

        // Encuentra todas las facturas del cliente
        const facturas = await db.Factura.findAll({
            where: { idCliente: idCliente },
            attributes: ['noFactura', 'serieFactura', 'fechaFactura', 'total'] // Selecciona solo los campos relevantes de la factura
        });

        if (facturas.length === 0) {
            return res.status(404).json({
                message: `No se encontraron facturas para el cliente con id ${idCliente}.`
            });
        }

        res.status(200).json({
            message: `Facturas para el cliente con id ${idCliente} obtenidas exitosamente.`,
            facturas: facturas  // Lista de facturas sin detalles
        });

    } catch (error) {
        console.error("Error al obtener las facturas:", error);
        res.status(500).json({
            message: "Error al obtener las facturas",
            error: error.message
        });
    }
};
const db = require('../config/db.config.js');
const Reserva = db.Reserva;
const DetalleReserva = db.DetalleReserva; 

async function getNextReservaNumber() {
    try {
        // Ejecutar el query para obtener el próximo número de la secuencia
        const result = await db.sequelize.query(`SELECT SEQ_RESERVA.NEXTVAL AS noReserva FROM DUAL`, {
            type: db.Sequelize.QueryTypes.SELECT
        });
        return result[0].NORESERVA;  // Retorna el valor de la secuencia
    } catch (err) {
        console.error(err);
        throw new Error('Error al obtener el número de reserva');
    }
}


exports.realizarReserva = async (req, res) => {
    const t = await db.sequelize.transaction();

    try {
        const { codigoMesaReserva, id_cliente, correo, cantidadPersonas, precio, productos, horaInicial, horaFinal } = req.body;

        // Verificar que todos los campos obligatorios están presentes
        if (!codigoMesaReserva || !id_cliente || !correo || !cantidadPersonas || !precio || productos.length === 0 || !horaInicial || !horaFinal) {
            return res.status(400).json({ message: 'Datos incompletos en la solicitud' });
        }

        // Convertir los campos de hora inicial y final a formato TIMESTAMP WITH TIME ZONE
        const parsedHoraInicial = new Date(horaInicial);  // Asegúrate que el cliente envíe en formato ISO 8601
        const parsedHoraFinal = new Date(horaFinal);

        // Verificar si la conversión fue correcta
        if (isNaN(parsedHoraInicial) || isNaN(parsedHoraFinal)) {
            return res.status(400).json({ message: 'Formato de fecha y hora inválido' });
        }

        // Obtener el siguiente número de reserva
        const noReserva = await getNextReservaNumber();

        // Crear la reserva
        const nuevaReserva = await Reserva.create({
            no_reserva: noReserva,
            codigo_mesa: codigoMesaReserva,
            fecha_reserva: new Date(),
            hora_inicial: parsedHoraInicial,  // Guardar como TIMESTAMP WITH TIME ZONE
            hora_final: parsedHoraFinal,      // Guardar como TIMESTAMP WITH TIME ZONE
            cantidad_personas: cantidadPersonas,
            precio: precio,
            id_cliente: id_cliente,
            correo: correo
        }, { transaction: t });

        // Contador autoincrementable para los detalles
        let idDetalleIncremental = 1;

        // Crear los detalles de la reserva
        for (let i = 0; i < productos.length; i++) {
            const producto = productos[i];

            // Validar que los datos del producto estén completos
            if (!producto.costo || !producto.lugarCompra || !producto.codigoMesaDetalle) {
                throw new Error('Datos incompletos en los productos');
            }

            await DetalleReserva.create({
                id_detalle_reserva: idDetalleIncremental++,  
                no_reserva: nuevaReserva.no_reserva,  
                codigo_mesa: producto.codigoMesaDetalle,  
                costo: producto.costo,
                fecha_compra: new Date(),
                lugar_compra: producto.lugarCompra
            }, { transaction: t });
        }

        // Confirmar la transacción
        await t.commit();

        res.status(201).json({ message: 'Reserva realizada con éxito', reserva: nuevaReserva });
    } catch (error) {
        // Hacer rollback en caso de error
        await t.rollback();
        console.error('Error en la reserva:', error);
        res.status(500).json({ message: 'Error al realizar la reserva', error });
    }
};



exports.retrieveReservasByCliente = async (req, res) => {
    try {
        const { id_cliente } = req.params;  // Supone que pasas el id_cliente como parámetro en la URL

        // Verifica si el cliente existe
       /* const cliente = await Cliente.findByPk(id_cliente);
        if (!cliente) {
            return res.status(404).json({
                message: `Cliente con id ${id_cliente} no encontrado.`
            });
        }*/

        // Encuentra todas las reservas del cliente
        const reservas = await db.Reserva.findAll({
            where: { id_cliente: id_cliente },
            attributes: ['noReserva', 'codigoMesa', 'fechaReserva', 'precio'] // Selecciona solo los campos relevantes de la factura
        });

        if (reservas.length === 0) {
            return res.status(404).json({
                message: `No se encontraron reservas para el cliente con id ${id_cliente}.`
            });
        }

        res.status(200).json({
            message: `Reservass para el cliente con id ${id_cliente} obtenidas exitosamente.`,
            reservas: reservas  // Lista de reservas sin detalles
        });

    } catch (error) {
        console.error("Error al obtener las reservas:", error);
        res.status(500).json({
            message: "Error al obtener las reservas",
            error: error.message
        });
    }
};
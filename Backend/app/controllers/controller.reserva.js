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
    const t = await db.sequelize.transaction(); // Inicia una transacción para asegurar que todo se inserte correctamente o se haga rollback

    try {
        const { codigoMesa, fechaReserva, horaInicial, horaFinal, cantidadPersonas, precio, idCliente, correo, detalles } = req.body;

        // Verificar que todos los campos obligatorios estén presentes
        if (!codigoMesa || !fechaReserva || !horaInicial || !horaFinal || !cantidadPersonas || !precio || !idCliente || !correo || !detalles || detalles.length === 0) {
            return res.status(400).json({ message: 'Datos incompletos en la solicitud' });
        }

        // Obtener el siguiente número de reserva
        const noReserva = await getNextReservaNumber();

        // Crear la reserva
        const nuevaReserva = await Reserva.create({
            no_reserva: noReserva,
            codigo_mesa: codigoMesa,
            fecha_reserva: new Date(fechaReserva),
            hora_inicial: horaInicial,
            hora_final: horaFinal,
            cantidad_personas: cantidadPersonas,
            precio,
            id_cliente: idCliente,
            correo
        }, { transaction: t });

        // Contador autoincrementable para los detalles de la reserva
        let idDetalleIncremental = 1;

        // Crear los detalles de la reserva
        for (let i = 0; i < detalles.length; i++) {
            const detalle = detalles[i];

            // Validar que los datos del detalle estén completos
            if (!detalle.costo || !detalle.fechaCompra || !detalle.lugarCompra) {
                throw new Error('Datos incompletos en los detalles de la reserva');
            }

            await DetalleReserva.create({
                id_detalle_reserva: idDetalleIncremental++,  // Incrementa el valor del id_detalle_reserva
                codigo_reserva: nuevaReserva.no_reserva,
                codigo_mesa: codigoMesa,  // Puede usar el mismo `codigo_mesa` de la reserva
                costo: detalle.costo,
                fecha_compra: new Date(detalle.fechaCompra),
                lugar_compra: detalle.lugarCompra
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

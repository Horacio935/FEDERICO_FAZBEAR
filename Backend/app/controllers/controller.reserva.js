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
        const { codigoMesaReserva, id_cliente, correo, cantidadPersonas, precio, productos, horaInicial, horaFinal, fechaReserva } = req.body;

        // Verificar que todos los campos obligatorios están presentes
        if (!codigoMesaReserva || !id_cliente || !correo || !cantidadPersonas || !precio || productos.length === 0 || !fechaReserva || !horaInicial || !horaFinal) {
            return res.status(400).json({ message: 'Datos incompletos en la solicitud' });
        }

        // Convertir los campos de hora inicial y final a formato TIMESTAMP WITH TIME ZONE
        const parsedHoraInicial = new Date(horaInicial); // Asegúrate que el cliente envíe en formato ISO 8601
        const parsedHoraFinal = new Date(horaFinal);

        // Verificar si las conversiones fueron correctas
        if (isNaN(parsedHoraInicial) || isNaN(parsedHoraFinal)) {
            return res.status(400).json({ message: 'Formato de hora inválido' });
        }

        // Convertir fechaReserva a formato de solo fecha
        const parsedFechaReserva = new Date(fechaReserva); // Parsear la fecha de reserva
        if (isNaN(parsedFechaReserva)) {
            return res.status(400).json({ message: 'Formato de fecha inválido' });
        }

        // Establecer la hora de la fecha de reserva a 00:00:00 (aunque solo se usará la fecha)
        parsedFechaReserva.setHours(0, 0, 0, 0);

        // Obtener el siguiente número de reserva
        const noReserva = await getNextReservaNumber();

        // Crear la reserva
        const nuevaReserva = await Reserva.create({
            no_reserva: noReserva,
            codigo_mesa: codigoMesaReserva,
            fecha_reserva: parsedFechaReserva.toISOString().split('T')[0],  // Insertar solo la fecha
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
        console.error('Error en la reserva:', error.message || error); // Registrar el mensaje de error
        res.status(500).json({ message: 'Error al realizar la reserva', error: error.message || error }); // Enviar el mensaje de error al cliente
    }
};



exports.retrieveReservasByCliente = async (req, res) => {
    try {
        const { idCliente } = req.params;  // Supone que pasas el idCliente como parámetro en la URL

        // Verifica si el cliente existe
       /* const cliente = await Cliente.findByPk(idCliente);
        if (!cliente) {
            return res.status(404).json({
                message: `Cliente con id ${idCliente} no encontrado.`
            });
        }*/

        // Encuentra todas las reservas del cliente
        const reservas = await db.Reserva.findAll({
            where: { id_cliente: idCliente },
            attributes: ['no_reserva', 'codigo_mesa', 'fecha_reserva', 'precio'] // Selecciona solo los campos relevantes de la factura
        });

        if (reservas.length === 0) {
            return res.status(404).json({
                message: `No se encontraron reservas para el cliente con id ${idCliente}.`
            });
        }

        res.status(200).json({
            message: `Reservass para el cliente con id ${idCliente} obtenidas exitosamente.`,
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

exports.verificarmesa = async (req, res) =>{
    /*try{
        const {FechaReserva, HoraInicial, HoraFinal} = req.params;
    }catch (error) {
    }*/
    try {
        // Desestructuramos los valores dinámicos del cuerpo de la solicitud (req.body)
        const { fechaConsulta, horaInicio, horaFin } = req.body;
    
        // Validación básica para asegurarse de que los parámetros se proporcionan
        if (!fechaConsulta || !horaInicio || !horaFin) {
          return res.status(400).json({ message: "Parámetros incompletos" });
        }
    
        // Ejecutar la consulta SQL manualmente usando sequelize.query
        const result = await db.sequelize.query(
            `SELECT res.no_reserva, det.codigo_mesa
            FROM reserva res
            INNER JOIN detalle_reserva det ON res.no_reserva = det.no_reserva
            WHERE (
            (:horaInicio BETWEEN TO_CHAR(res.hora_inicial, 'HH24:MI') AND TO_CHAR(res.hora_final, 'HH24:MI'))
            OR (:horaFin BETWEEN TO_CHAR(res.hora_inicial, 'HH24:MI') AND TO_CHAR(res.hora_final, 'HH24:MI'))
            OR (TO_CHAR(res.hora_inicial, 'HH24:MI') >= :horaInicio AND TO_CHAR(res.hora_final, 'HH24:MI') <= :horaFin))
            AND TRUNC(res.fecha_reserva) = TO_DATE(:fechaConsulta, 'DD/MM/YYYY')`,
          {
            type: db.Sequelize.QueryTypes.SELECT,
            replacements: {
              fechaConsulta,
              horaInicio,
              horaFin
            }
          }
        );
    
        // Retornar los resultados
        res.status(200).json({ result });
      } catch (error) {
        console.error('Error al ejecutar la consulta:', error);
        res.status(500).json({ message: 'Error en la consulta', error });
      }
};

exports.getDetallesByReserva = (req, res) => {
    const { noReserva } = req.params;

    // Validar que idCliente sea un número
    if (isNaN(noReserva)) {
        return res.status(400).json({
            message: "El número de reserva debe ser un valor numérico válido."
        });
    }

    // Convertir el valor de idCliente a número
    const noReservaNumber = parseInt(id_cliente, 10);

    // Buscar registros en la tabla 'detalle_factura' con el número y serie de la factura
    db.DetalleReserva.findAll({
        where: {
            id_cliente: noReservaNumber,
            noReserva: noReserva
        }
    })
    .then(detalleReservas => {
        if (detalleReservas.length === 0) {
            return res.status(404).json({
                message: `No se encontraron detalles para la factura con número ${id_cliente} y serie ${noReserva}.`
            });
        }

        // Retornar los detalles encontrados
        res.status(200).json({
            message: `Detalles de la reserva con número ${id_cliente} y serie ${noReserva} obtenidos exitosamente.`,
            detalles: detalleReservas
        });
    })
    .catch(error => {
        // Manejar errores y mostrar un mensaje genérico
        console.log(error);
        res.status(500).json({
            message: "Ocurrió un error al obtener los detalles de la reserva.",
            error: error.message
        });
    });
};
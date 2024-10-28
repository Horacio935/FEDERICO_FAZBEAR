import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Detalle = () => {
    const [idCliente, setIdCliente] = useState('');
    const [reservas, setReservas] = useState([]);
    const [detallesReserva, setDetallesReserva] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const fetchReservas = async () => {
        if (!idCliente) return;

        setLoading(true);
        setError('');

        try {
            const response = await axios.get(`https://federico-fazbear.onrender.com/api/clientesReserva/${idCliente}/reserva`);
            setReservas(response.data.reservas);
        } catch (err) {
            setError('Error al obtener las reservas');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleReservaClick = async (noReserva) => {
        setLoading(true);
        setError('');

        try {
            const response = await axios.get(`https://federico-fazbear.onrender.com/api/detalle_reserva/${noReserva}`);
            console.log('Detalles de la reserva:', response.data); // Verificar respuesta
            setDetallesReserva(response.data.detalles); // Obtener todos los detalles
        } catch (err) {
            setError('Error al obtener los detalles de la reserva');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h1>Reservas del Cliente</h1>
            <input
                type="number"
                value={idCliente}
                onChange={(e) => setIdCliente(e.target.value)}
                placeholder="Ingrese ID del Cliente"
            />
            <button onClick={fetchReservas}>Cargar Reservas</button>

            {loading && <p>Cargando...</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}

            <ul>
                {reservas.map((reserva) => (
                    <li key={reserva.no_reserva} onClick={() => handleReservaClick(reserva.no_reserva)}>
                        Reserva No: {reserva.no_reserva}, Mesa: {reserva.codigo_mesa}, Fecha: {new Date(reserva.fecha_reserva).toLocaleDateString()}, Precio: ${reserva.precio}
                    </li>
                ))}
            </ul>

            {detallesReserva.length > 0 && (
                <div>
                    <h2>Detalles de la Reserva</h2>
                    {detallesReserva.map((detalle) => (
                        <div key={detalle.id_detalle_reserva}>
                            <p>Número de Reserva: {detalle.no_reserva}</p>
                            <p>Código de Mesa: {detalle.codigo_mesa}</p>
                            <p>Costo: ${detalle.costo}</p>
                            <p>Fecha de Compra: {new Date(detalle.fecha_compra).toLocaleString()}</p>
                            <p>Lugar de Compra: {detalle.lugar_compra}</p>
                            <hr />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Detalle;

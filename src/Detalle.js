import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Detalle = () => {
    const [correo, setCorreo] = useState('');
    const [reservas, setReservas] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [detallesReserva, setDetallesReserva] = useState(null); // Estado para detalles

    const fetchReservas = async () => {
        if (!correo) return;

        setLoading(true);
        setError('');
        setReservas([]);
        setDetallesReserva(null); // Limpiar detalles al cargar nuevas reservas

        try {
            const url = `https://federico-fazbear.onrender.com/api/clientesReserva/${correo}/reserva`;
            const response = await axios.get(url);
            setReservas(response.data.reservas);
        } catch (err) {
            setError('Error al obtener las reservas');
            console.error('Error de API:', err);
        } finally {
            setLoading(false);
        }
    };

    const fetchDetalleReserva = async (noReserva) => {
        try {
            const url = `https://federico-fazbear.onrender.com/api/detalle_reserva/${noReserva}`;
            const response = await axios.get(url);
            setDetallesReserva(response.data.detalles); // Guardar detalles como un array
        } catch (err) {
            setError('Error al obtener los detalles de la reserva');
            console.error('Error de API:', err);
        }
    };

    return (
        <div>
            <h1>Reservas del Cliente</h1>
            <input
                type="email"
                value={correo}
                onChange={(e) => setCorreo(e.target.value)}
                placeholder="Ingrese correo del Cliente"
            />
            <button onClick={fetchReservas}>Cargar Reservas</button>

            {loading && <p>Cargando...</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}

            <ul>
                {reservas.map((reserva) => (
                    <li key={reserva.no_reserva} onClick={() => fetchDetalleReserva(reserva.no_reserva)}>
                        Reserva No: {reserva.no_reserva}, Mesa: {reserva.codigo_mesa}, Fecha: {new Date(reserva.fecha_reserva).toLocaleDateString()}, Precio: ${reserva.precio}
                    </li>
                ))}
            </ul>

            {detallesReserva && (
                <div>
                    <h2>Detalles de la Reserva No: {detallesReserva[0].no_reserva}</h2>
                    {detallesReserva.map((detalle) => (
                        <div key={detalle.id_detalle_reserva}>
                            <p><strong>Código de Mesa:</strong> {detalle.codigo_mesa}</p>
                            <p><strong>Costo:</strong> ${detalle.costo}</p>
                            <p><strong>Fecha de Compra:</strong> {new Date(detalle.fecha_compra).toLocaleString()}</p>
                            <p><strong>Lugar de Compra:</strong> {detalle.lugar_compra}</p>
                            <hr /> {/* Separador para cada mesa */}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Detalle;

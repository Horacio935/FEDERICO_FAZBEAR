import React, { useState, useEffect } from 'react';
import axios from 'axios';

const FacturasCliente = () => {
    const [idCliente, setIdCliente] = useState('');
    const [facturas, setFacturas] = useState([]);
    const [detallesFactura, setDetallesFactura] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const fetchFacturas = async () => {
        if (!idCliente) return;

        setLoading(true);
        setError('');

        try {
            const response = await axios.get(`https://federico-fazbear.onrender.com/api/clientes/${idCliente}/facturas`);
            setFacturas(response.data.facturas); // Configura las facturas
        } catch (err) {
            setError('Error al obtener las facturas');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleFacturaClick = async (noFactura, serieFactura) => {
        setLoading(true);
        setError('');

        try {
            const response = await axios.get(`https://federico-fazbear.onrender.com/api/detalle_factura/${noFactura}/${serieFactura}`);
            console.log('Detalles de la factura:', response.data); // Verificar respuesta
            setDetallesFactura(response.data.detalles); // Obtener todos los detalles
        } catch (err) {
            setError('Error al obtener los detalles de la factura');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h1>Facturas del Cliente</h1>
            <input
                type="number"
                value={idCliente}
                onChange={(e) => setIdCliente(e.target.value)}
                placeholder="Ingrese ID del Cliente"
            />
            <button onClick={fetchFacturas}>Cargar Facturas</button>

            {loading && <p>Cargando...</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}

            <ul>
                {facturas.map((factura) => (
                    <li key={`${factura.noFactura}-${factura.serieFactura}`} onClick={() => handleFacturaClick(factura.noFactura, factura.serieFactura)}>
                        No. Factura: {factura.noFactura}, Serie: {factura.serieFactura}, Fecha: {new Date(factura.fechaFactura).toLocaleDateString()}, Total: ${factura.total}
                    </li>
                ))}
            </ul>

            {detallesFactura.length > 0 && (
                <div>
                    <h2>Detalles de la Factura</h2>
                    {detallesFactura.map((detalle, index) => (
                        <div key={index}>
                            <p>Producto: {detalle.producto}</p>
                            <p>Cantidad: {detalle.cantidad}</p>
                            <p>Precio Unitario: ${detalle.precioUnitario}</p>
                            <p>Total: ${detalle.total}</p>
                            <hr />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default FacturasCliente;

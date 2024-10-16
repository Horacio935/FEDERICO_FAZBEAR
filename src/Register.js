// Register.js
import React, { useState } from 'react';

const Register = () => {
  const [clienteData, setClienteData] = useState({ nombre: '', apellido: '' });
  const [usuarioData, setUsuarioData] = useState({ correo: '', password: '' });
  const [clienteId, setClienteId] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Manejar el registro del cliente
  const handleRegisterCliente = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch('http://localhost:4000/api/cliente/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(clienteData),
      });

      const data = await response.json();

      if (response.ok) {
        setClienteId(data.ID_CLIENTE); // Obtener el ID del cliente
        setSuccess('Cliente registrado. Ahora ingrese correo y contraseña.');
      } else {
        setError(data.error || 'Error al registrar el cliente');
      }
    } catch (err) {
      setError('Error de conexión');
    }
  };

  // Manejar el registro del usuario
  const handleRegisterUsuario = async (e) => {
    e.preventDefault();
    setError('');

    if (!clienteId) {
      setError('Debe registrar el cliente primero');
      return;
    }

    try {
      const response = await fetch('http://localhost:4000/api/usuario/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...usuarioData, clienteId }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess('Usuario registrado con éxito. Ya puede iniciar sesión.');
      } else {
        setError(data.error || 'Error al registrar el usuario');
      }
    } catch (err) {
      setError('Error de conexión');
    }
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center">Registro de Cliente y Usuario</h1>

      {!clienteId ? (
        <form onSubmit={handleRegisterCliente}>
          <div className="mb-3">
            <label className="form-label">Nombre</label>
            <input
              type="text"
              className="form-control"
              value={clienteData.nombre}
              onChange={(e) => setClienteData({ ...clienteData, nombre: e.target.value })}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Apellido</label>
            <input
              type="text"
              className="form-control"
              value={clienteData.apellido}
              onChange={(e) => setClienteData({ ...clienteData, apellido: e.target.value })}
              required
            />
          </div>

          {error && <div className="alert alert-danger">{error}</div>}
          <button type="submit" className="btn btn-primary">Registrar Cliente</button>
        </form>
      ) : (
        <form onSubmit={handleRegisterUsuario}>
          <div className="mb-3">
            <label className="form-label">Correo</label>
            <input
              type="email"
              className="form-control"
              value={usuarioData.correo}
              onChange={(e) => setUsuarioData({ ...usuarioData, correo: e.target.value })}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Contraseña</label>
            <input
              type="password"
              className="form-control"
              value={usuarioData.password}
              onChange={(e) => setUsuarioData({ ...usuarioData, password: e.target.value })}
              required
            />
          </div>

          {error && <div className="alert alert-danger">{error}</div>}
          <button type="submit" className="btn btn-primary">Registrar Usuario</button>
        </form>
      )}

      {success && <div className="alert alert-success">{success}</div>}
    </div>
  );
};

export default Register;

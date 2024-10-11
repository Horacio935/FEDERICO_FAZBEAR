import React, { useState } from 'react';
//import CrudComponent from './Components/CrudComponent';

const App = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [token, setToken] = useState(null);
  const [error, setError] = useState('');

  // Manejar el inicio de sesión
  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    const response = await fetch('http://localhost:4000/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });

    const data = await response.json();

    if (response.ok) {
      setToken(data.token);
      localStorage.setItem('token', data.token); // Guardar token en localStorage
    } else {
      setError(data.error);
    }
  };

  // Cerrar sesión
  const handleLogout = () => {
    setToken(null);
    localStorage.removeItem('token'); // Eliminar token de localStorage
  };

  // Verificar acceso a ruta protegida
  const accessProtectedRoute = async () => {
    const token = localStorage.getItem('token');

    const response = await fetch('http://localhost:4000/api/protected', {
      method: 'GET',
      headers: {
        Authorization: token,
      },
    });

    const data = await response.json();
    alert(data.message);
  };

  return (
    <div className="container mt-5">
      <h1 className="text-center">Federico Fazbear</h1>

      {!token ? (
        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <label className="form-label">Correo</label>
            <input
              type="text"
              className="form-control"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Contraseña</label>
            <input
              type="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && <div className="alert alert-danger">{error}</div>}

          <button type="submit" className="btn btn-primary">
            Iniciar sesión
          </button>
        </form>
      ) : (
        <div>
          <h2 className="text-success">Sesión iniciada</h2>
          <button className="btn btn-danger" onClick={handleLogout}>
            Cerrar sesión
          </button>
          <button className="btn btn-info ml-3" onClick={accessProtectedRoute}>
            Acceder a ruta protegida
          </button>
        </div>
      )}
    </div>
  );
};



export default App;
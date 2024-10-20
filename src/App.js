import React, { useState } from 'react';
//import CrudComponent from './Components/CrudComponent';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import CheckoutForm from './CheckoutForm'; // Importa tu formulario de pago

// Cargar la clave pública de Stripe
const stripePromise = loadStripe('pk_test_51Q9HPsB93apspbx9JgkhovEQGqqD1I6OgQQvticZ2PXSl4SnDv3wag9kAIvTo2r9xIhBI2aNNT5902GHhyeSkQmu00jmBMWQSE');

const App = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [token, setToken] = useState(null);
  const [error, setError] = useState('');

  // Manejar el inicio de sesión
  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    const response = await fetch('https://federico-fazbear.onrender.com/api/login', {
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

    const response = await fetch('https://federico-fazbear.onrender.com/api/protected', {
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

          {/* Componente de pago de Stripe */}
          <Elements stripe={stripePromise}>
            <CheckoutForm />
          </Elements>
        </div>
      )}
    </div>
  );
};



export default App;

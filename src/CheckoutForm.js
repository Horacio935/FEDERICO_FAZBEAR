import React, { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

// Cargar la clave pública de Stripe
const stripePromise = loadStripe('pk_test_51Q9HPsB93apspbx9JgkhovEQGqqD1I6OgQQvticZ2PXSl4SnDv3wag9kAIvTo2r9xIhBI2aNNT5902GHhyeSkQmu00jmBMWQSE');

const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [amount, setAmount] = useState(''); // Estado para almacenar el monto dinámico

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);
    setSuccess(null);

    const cardElement = elements.getElement(CardElement);
    
    // Validamos que el monto ingresado sea un número positivo
    const amountInCents = parseFloat(amount) * 100; // Convertimos a centavos

    if (isNaN(amountInCents) || amountInCents <= 0) {
      setError('Por favor, ingresa un monto válido.');
      return;
    }

    // Llamada a tu backend para crear el PaymentIntent con el monto ingresado
    const response = await fetch('https://federico-fazbear.onrender.com/create-payment-intent', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ amount: amountInCents }), // Monto dinámico en centavos
    });
  
    const { clientSecret } = await response.json();
  
    const { error } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: cardElement,
      },
    });
  
    if (error) {
      setError(error.message);
    } else {
      setSuccess('Pago exitoso');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Monto a pagar (USD):
        <input 
          type="number" 
          value={amount} 
          onChange={(e) => setAmount(e.target.value)} 
          placeholder="Ingresa el monto"
        />
      </label>
      <CardElement />
      <button type="submit" disabled={!stripe}>
        Pagar
      </button>
      {error && <div>{error}</div>}
      {success && <div>{success}</div>}
    </form>
  );
};

export default CheckoutForm;

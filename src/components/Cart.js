import React, { useState } from 'react';
import axios from 'axios';

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [total, setTotal] = useState(0);
  const [orderSubmitted, setOrderSubmitted] = useState(false);

  // Calcular el total del carrito
  const calculateTotal = () => {
    const totalAmount = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
    setTotal(totalAmount);
  };

  const handlePlaceOrder = async () => {
    const orderData = {
      items: cartItems,
      totalAmount: total,
      userEmail: 'user@example.com',  // Este sería el correo del usuario (por ejemplo, extraído del contexto)
      status: 'pending',
    };

    try {
      const response = await axios.post('https://bibliolights-backend.onrender.com/api/orders/create', orderData);
      if (response.status === 201) {
        setOrderSubmitted(true);
        // Enviar correo de confirmación
        await axios.post('https://bibliolights-backend.onrender.com/api/send-confirmation-email', {
          userEmail: 'user@example.com',  // Correo del usuario
          orderDetails: response.data,    // Detalles del pedido
        });
        alert('Pedido realizado con éxito. Se ha enviado un correo de confirmación.');
      }
    } catch (error) {
      console.error('Error al realizar el pedido:', error.message);
    }
  };

  return (
    <div>
      <h2>Carrito de Compras</h2>
      {cartItems.length > 0 ? (
        <ul>
          {cartItems.map((item) => (
            <li key={item._id}>
              <p>{item.title}</p>
              <p>Precio: ${item.price}</p>
              <p>Cantidad: {item.quantity}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>El carrito está vacío.</p>
      )}
      <p>Total: ${total}</p>

      {!orderSubmitted ? (
        <button onClick={handlePlaceOrder}>Realizar Pedido</button>
      ) : (
        <p>Gracias por tu compra. ¡Tu pedido ha sido enviado!</p>
      )}
    </div>
  );
};

export default Cart;

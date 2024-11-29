import React from 'react';

const OrderConfirmation = ({ orderDetails }) => {
  return (
    <div>
      <h2>¡Gracias por tu compra!</h2>
      <p>Tu pedido ha sido recibido. Aquí están los detalles:</p>
      <p>Pedido ID: {orderDetails.orderId}</p>
      <p>Total: ${orderDetails.total}</p>
      <p>Estado: {orderDetails.status}</p>
    </div>
  );
};

export default OrderConfirmation;
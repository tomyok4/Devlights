import React, { useState, useEffect } from 'react';
import axios from 'axios';

const OrderManagement = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get('https://bibliolights-backend.onrender.com/api/orders', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setOrders(response.data);
      } catch (error) {
        console.error('Error al obtener los pedidos:', error.message);
      }
    };

    fetchOrders();
  }, []);

  const handleUpdateOrderStatus = async (orderId, status) => {
    try {
      const response = await axios.put(
        `https://bibliolights-backend.onrender.com/api/orders/${orderId}`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      setOrders(orders.map(order => order._id === orderId ? response.data : order));  // Actualizar el estado del pedido
    } catch (error) {
      console.error('Error al actualizar el estado del pedido:', error.message);
    }
  };

  return (
    <div>
      <h2>Gestión de Pedidos</h2>
      {orders.length > 0 ? (
        <ul>
          {orders.map((order) => (
            <li key={order._id}>
              <p>Pedido ID: {order._id}</p>
              <p>Total: ${order.totalAmount}</p>
              <p>Estado: {order.orderStatus}</p>
              <div>
                <button onClick={() => handleUpdateOrderStatus(order._id, 'approved')}>Aprobar</button>
                <button onClick={() => handleUpdateOrderStatus(order._id, 'rejected')}>Rechazar</button>
                <button onClick={() => handleUpdateOrderStatus(order._id, 'shipped')}>Marcar como Enviado</button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p>No hay pedidos pendientes.</p>
      )}
    </div>
  );
};

export default OrderManagement;

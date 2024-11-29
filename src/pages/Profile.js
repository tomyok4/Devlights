import React, { useState, useEffect, useContext } from 'react';
import AuthContext from '../context/AuthContext';
import axios from 'axios';
import './Profile.css';  // Asegúrate de tener un archivo CSS para estilizar el perfil

const Profile = () => {
  const { user } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('info');  // Control de las pestañas: 'info', 'orders', 'favorites', 'manageBooks'
  const [orders, setOrders] = useState([]);
  const [favorites, setFavorites] = useState([]);

  // Estado para almacenar los datos editados por el usuario
  const [editableUser, setEditableUser] = useState({
    firstName: user.firstName || '',
    lastName: user.lastName || '',
    dob: user.dob || '',
    address: user.address || '',
    city: user.city || '',
    country: user.country || '',
    phoneNumber: user.phoneNumber || '',
  });

  // Obtener el historial de pedidos
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await axios.get('https://bibliolights-backend.onrender.com/api/orders/user', {
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

  // Obtener los libros favoritos del usuario con imágenes
  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const response = await axios.get('https://bibliolights-backend.onrender.com/api/books/user/favorites', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        setFavorites(response.data);
      } catch (error) {
        console.error('Error al obtener los favoritos:', error.message);
      }
    };
    fetchFavorites();
  }, []);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  // Función para actualizar la información del usuario
  const handleSaveUserInfo = async () => {
    try {
      const response = await axios.put(
        'https://bibliolights-backend.onrender.com/api/users/profile',  // URL del backend
        editableUser,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.status === 200) {
        alert('Información actualizada con éxito');
      } else {
        alert('Hubo un problema al actualizar los datos. Intenta nuevamente.');
      }
    } catch (error) {
      console.error('Error al actualizar la información:', error.message);
      alert('Hubo un error al actualizar la información. Intenta nuevamente.');
    }
  };

  return (
    <div className="profileContainer">
      <h2>Perfil de {user.firstName}</h2>

      <div className="tabs">
        <button
          className={`tabButton ${activeTab === 'info' ? 'activeTab' : ''}`}
          onClick={() => handleTabChange('info')}
        >
          Información
        </button>
        <button
          className={`tabButton ${activeTab === 'orders' ? 'activeTab' : ''}`}
          onClick={() => handleTabChange('orders')}
        >
          Historial de Pedidos
        </button>
        <button
          className={`tabButton ${activeTab === 'favorites' ? 'activeTab' : ''}`}
          onClick={() => handleTabChange('favorites')}
        >
          Libros Favoritos
        </button>
      </div>

      <div className="tabContent">
        {activeTab === 'info' && (
          <div className="infoTab">
            <p><strong>Email:</strong> {user.email}</p> {/* El email es solo lectura */}
            <input
              type="text"
              placeholder="Nombre"
              value={editableUser.firstName}
              onChange={(e) => setEditableUser({ ...editableUser, firstName: e.target.value })}
            />
            <input
              type="text"
              placeholder="Apellido"
              value={editableUser.lastName}
              onChange={(e) => setEditableUser({ ...editableUser, lastName: e.target.value })}
            />
            <input
              type="date"
              placeholder="Fecha de Nacimiento"
              value={editableUser.dob}
              onChange={(e) => setEditableUser({ ...editableUser, dob: e.target.value })}
            />
            <input
              type="text"
              placeholder="Dirección"
              value={editableUser.address}
              onChange={(e) => setEditableUser({ ...editableUser, address: e.target.value })}
            />
            <input
              type="text"
              placeholder="Ciudad"
              value={editableUser.city}
              onChange={(e) => setEditableUser({ ...editableUser, city: e.target.value })}
            />
            <input
              type="text"
              placeholder="País"
              value={editableUser.country}
              onChange={(e) => setEditableUser({ ...editableUser, country: e.target.value })}
            />
            <input
              type="text"
              placeholder="Número de Teléfono"
              value={editableUser.phoneNumber}
              onChange={(e) => setEditableUser({ ...editableUser, phoneNumber: e.target.value })}
            />
            <button onClick={handleSaveUserInfo}>Guardar</button>
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="ordersTab">
            {orders.length > 0 ? (
              <ul>
                {orders.map((order) => (
                  <li key={order._id}>
                    <p>Fecha: {new Date(order.orderDate).toLocaleDateString()}</p>
                    <p>Total: ${order.totalAmount}</p>
                    <p>Estado: {order.orderStatus}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No tienes pedidos registrados.</p>
            )}
          </div>
        )}

        {activeTab === 'favorites' && (
          <div className="favoritesTab">
            {favorites.length > 0 ? (
              <ul>
                {favorites.map((book) => (
                  <li key={book._id}>
                    <img src={book.coverImage || '/placeholder.png'} alt={book.title} style={{ width: '50px', height: '75px' }} />
                    <h3>{book.title}</h3>
                    <p>Autor: {book.author}</p>
                    <p>Precio: ${book.price}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No tienes libros en favoritos.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;


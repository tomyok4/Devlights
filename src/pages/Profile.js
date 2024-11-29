import React, { useState, useEffect, useContext } from 'react';
import AuthContext from '../context/AuthContext';
import axios from 'axios';
import './Profile.css';

const Profile = () => {
  const { user } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('info');
  const [orders, setOrders] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [books, setBooks] = useState([]);
  const [newBook, setNewBook] = useState({
    title: '',
    author: '',
    description: '',
    coverImage: '',
    price: 0,
    deliveryTimes: [],
  });

  // Estado editable para la información del usuario
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

  // Obtener los libros favoritos del usuario
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

  // Obtener todos los libros (solo administradores)
  useEffect(() => {
    if (user && user.isAdmin) {
      const fetchBooks = async () => {
        try {
          const response = await axios.get('https://bibliolights-backend.onrender.com/api/books', {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          });
          setBooks(response.data);
        } catch (error) {
          console.error('Error al obtener los libros:', error.message);
        }
      };
      fetchBooks();
    }
  }, [user]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  // Actualizar la información del usuario
  const handleSaveUserInfo = async () => {
    try {
      const response = await axios.put(
        'https://bibliolights-backend.onrender.com/api/users/profile',
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

  // Agregar un nuevo libro
  const handleAddBook = async () => {
    try {
      const response = await axios.post(
        'https://bibliolights-backend.onrender.com/api/admin/books',
        newBook,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json',
          },
        }
      );
      alert('Libro agregado exitosamente');
      setBooks([...books, response.data]);
      setNewBook({ title: '', author: '', description: '', coverImage: '', price: 0, deliveryTimes: [] });
    } catch (error) {
      console.error('Error al agregar el libro:', error.message);
    }
  };

  const handleDeleteBook = async (bookId) => {
    try {
      await axios.delete(`https://bibliolights-backend.onrender.com/api/admin/books/${bookId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setBooks(books.filter((book) => book._id !== bookId));
    } catch (error) {
      console.error('Error al eliminar el libro:', error.message);
    }
  };

  const handleUpdateBook = async (bookId) => {
    try {
      const updatedBook = { ...newBook, _id: bookId };
      const response = await axios.put(
        `https://bibliolights-backend.onrender.com/api/admin/books/${bookId}`,
        updatedBook,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json',
          },
        }
      );
      alert('Libro actualizado exitosamente');
      setBooks(books.map((book) => (book._id === bookId ? response.data : book)));
    } catch (error) {
      console.error('Error al actualizar el libro:', error.message);
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
        {user && user.isAdmin && (
          <>
            <button
              className={`tabButton ${activeTab === 'manageBooks' ? 'activeTab' : ''}`}
              onClick={() => handleTabChange('manageBooks')}
            >
              Gestión de Libros
            </button>
          </>
        )}
      </div>

      <div className="tabContent">
        {activeTab === 'info' && (
          <div className="infoTab">
            <p><strong>Email:</strong> {user.email}</p>
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

        {activeTab === 'manageBooks' && user.isAdmin && (
          <div className="manageBooksTab">
            <h3>Agregar Nuevo Libro</h3>
            <input
              type="text"
              placeholder="Título"
              value={newBook.title}
              onChange={(e) => setNewBook({ ...newBook, title: e.target.value })}
            />
            <input
              type="text"
              placeholder="Autor"
              value={newBook.author}
              onChange={(e) => setNewBook({ ...newBook, author: e.target.value })}
            />
            <textarea
              placeholder="Descripción"
              value={newBook.description}
              onChange={(e) => setNewBook({ ...newBook, description: e.target.value })}
            />
            <input
              type="text"
              placeholder="URL de la imagen"
              value={newBook.coverImage}
              onChange={(e) => setNewBook({ ...newBook, coverImage: e.target.value })}
            />
            <input
              type="number"
              placeholder="Precio"
              value={newBook.price}
              onChange={(e) => setNewBook({ ...newBook, price: e.target.value })}
            />
            <input
              type="text"
              placeholder="Tiempos de entrega (separados por coma)"
              value={newBook.deliveryTimes.join(',')}
              onChange={(e) => setNewBook({ ...newBook, deliveryTimes: e.target.value.split(',') })}
            />
            <button onClick={handleAddBook}>Agregar Libro</button>

            <h3>Libros Existentes</h3>
            <ul>
              {books.map((book) => (
                <li key={book._id} style={{ display: 'flex', alignItems: 'center', marginBottom: '20px' }}>
                  <img
                    src={book.coverImage || '/placeholder.png'}
                    alt={book.title}
                    style={{ width: '50px', height: '75px', objectFit: 'cover', marginRight: '10px' }}
                  />
                  <div style={{ flex: 1 }}>
                    <p><strong>{book.title}</strong></p>
                    <p>Autor: {book.author}</p>
                    <p>Precio: ${book.price}</p>
                  </div>
                  <button onClick={() => handleDeleteBook(book._id)}>Eliminar</button>
                  <button onClick={() => handleUpdateBook(book._id)}>Actualizar</button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;

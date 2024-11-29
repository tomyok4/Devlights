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
    quantity: 0,
  });
  const [editingBook, setEditingBook] = useState(null);

  // Fetch Orders
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

  // Fetch Favorites
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

  // Fetch Books (for admin)
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

  // Add Book
  const handleAddBook = async () => {
    try {
      const { title, author, description, coverImage, price, deliveryTimes, quantity } = newBook;

      if (!title || !author || !coverImage || price <= 0 || quantity <= 0) {
        alert('Por favor, completa todos los campos correctamente.');
        return;
      }

      const response = await axios.post(
        'https://bibliolights-backend.onrender.com/api/admin/books',
        { title, author, description, coverImage, price, deliveryTimes, quantity },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json',
          },
        }
      );

      alert('Libro agregado exitosamente');
      setBooks([...books, response.data]);
      setNewBook({ title: '', author: '', description: '', coverImage: '', price: 0, deliveryTimes: [], quantity: 0 });
    } catch (error) {
      console.error('Error al agregar el libro:', error.message);
    }
  };

  // Delete Book
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

  // Update Book
  const handleUpdateBook = async () => {
    try {
      const updatedBook = { ...editingBook };

      if (!updatedBook.title || !updatedBook.author || updatedBook.price <= 0 || updatedBook.quantity <= 0) {
        alert('Por favor, completa todos los campos correctamente.');
        return;
      }

      const response = await axios.put(
        `https://bibliolights-backend.onrender.com/api/admin/books/${updatedBook._id}`,
        updatedBook,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json',
          },
        }
      );

      alert('Libro actualizado exitosamente');
      setBooks(books.map((book) => (book._id === updatedBook._id ? response.data : book)));
      setEditingBook(null);
    } catch (error) {
      console.error('Error al actualizar el libro:', error.message);
      alert('Hubo un error al actualizar el libro. Intenta nuevamente.');
    }
  };

  return (
    <div className="profileContainer">
      <h2>Perfil de {user.isAdmin ? 'Devlights' : 'Tomas'}</h2>

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
          <button
            className={`tabButton ${activeTab === 'manageBooks' ? 'activeTab' : ''}`}
            onClick={() => handleTabChange('manageBooks')}
          >
            Gestión de Libros
          </button>
        )}
      </div>

      <div className="tabContent">
        {/* Information Tab */}
        {activeTab === 'info' && (
          <div className="infoTab">
            <p><strong>Email:</strong> {user.email}</p>
            {user.isAdmin ? (
              <>
                <p><strong>Nombre:</strong> Devlights</p>
                <p><strong>Apellido:</strong> Bootcamp</p>
                <p><strong>Dirección:</strong> Union 1250 2do Piso</p>
                <p><strong>Ciudad:</strong> Corrientes</p>
                <p><strong>País:</strong> Argentina</p>
                <p><strong>Número de Teléfono:</strong> 3794230003</p>
              </>
            ) : (
              <>
                <p><strong>Nombre:</strong> Tomas</p>
                <p><strong>Apellido:</strong> Segura</p>
                <p><strong>Dirección:</strong> Av Castelli 350</p>
                <p><strong>Ciudad:</strong> Resistencia</p>
                <p><strong>País:</strong> Chaco</p>
                <p><strong>Número de Teléfono:</strong> 3734400174</p>
              </>
            )}
          </div>
        )}

        {/* Orders Tab */}
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

        {/* Favorites Tab */}
        {activeTab === 'favorites' && (
          <div className="favoritesTab">
            {favorites.length > 0 ? (
              <ul>
                {favorites.map((book) => (
                  <li key={book._id}>
                    <img 
                      src={book.coverImage || '/placeholder.png'} 
                      alt={book.title} 
                      style={{ width: '50px', height: '75px' }} 
                    />
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

        {/* Manage Books Tab */}
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
              type="number"
              placeholder="Cantidad"
              value={newBook.quantity}
              onChange={(e) => setNewBook({ ...newBook, quantity: e.target.value })}
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
                  <button onClick={() => {
                    setEditingBook(book);
                    setEditingBook(prevBook => ({
                      ...prevBook,
                      title: `Título: ${book.title}`,
                      author: `Autor: ${book.author}`,
                      description: `Descripción: ${book.description}`,
                      coverImage: book.coverImage,
                      price: book.price,
                      quantity: book.quantity
                    }));
                  }}>Actualizar</button>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Update Book Modal */}
      {editingBook && (
        <div className="updateBookForm">
          <h3>Actualizar Libro</h3>
          <input
            type="text"
            placeholder="Título"
            value={editingBook.title}
            onChange={(e) => setEditingBook({ ...editingBook, title: e.target.value })}
          />
          <input
            type="text"
            placeholder="Autor"
            value={editingBook.author}
            onChange={(e) => setEditingBook({ ...editingBook, author: e.target.value })}
          />
          <textarea
            placeholder="Descripción"
            value={editingBook.description}
            onChange={(e) => setEditingBook({ ...editingBook, description: e.target.value })}
          />
          <input
            type="text"
            placeholder="URL de la imagen"
            value={editingBook.coverImage}
            onChange={(e) => setEditingBook({ ...editingBook, coverImage: e.target.value })}
          />
          <input
            type="number"
            placeholder="Precio"
            value={editingBook.price}
            onChange={(e) => setEditingBook({ ...editingBook, price: e.target.value })}
          />
          <input
            type="number"
            placeholder="Cantidad"
            value={editingBook.quantity}
            onChange={(e) => setEditingBook({ ...editingBook, quantity: e.target.value })}
          />
          <button onClick={handleUpdateBook}>Guardar Cambios</button>
          <button onClick={() => setEditingBook(null)}>Cancelar</button>
        </div>
      )}
    </div>
  );
};

export default Profile;
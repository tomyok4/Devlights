import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { useCart } from '../context/CartContext'; // Importamos useCart para obtener el carrito
import { FaShoppingCart } from 'react-icons/fa'; // Importamos el ícono del carrito
import axios from 'axios'; // Para hacer la solicitud HTTP
import './Navbar.css'; // Importamos el archivo CSS

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const { cart, removeFromCart } = useCart(); // Cambié `removeItem` a `removeFromCart`
  const [isCartOpen, setIsCartOpen] = useState(false); // Para manejar el estado del carrito desplegable
  const navigate = useNavigate(); // Para redirigir a otras páginas

  // Calcular el total del carrito
  const calculateTotal = () => {
    return cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  };

  // Función para manejar la finalización de la orden
  const handleFinalizeOrder = async () => {
    const isConfirmed = window.confirm('¿Estás seguro de que quieres finalizar la orden?');
    
    if (isConfirmed) {
      try {
        // Enviar la orden al backend
        const response = await axios.post('https://bibliolights-backend.onrender.com/api/orders', {
          items: cart,
          total: calculateTotal(),
        });

        // Verificar la respuesta del backend
        console.log('Response from API:', response); // Verificar la respuesta completa
        if (response.status === 200) {
          // Mostrar mensaje de éxito
          alert('Orden finalizada con éxito. ¡Gracias por tu compra!');
          
          // Limpiar el carrito solo si la orden se finalizó correctamente
          cart.clearCart();
        } else {
          alert('Hubo un error al finalizar la orden. Por favor, intenta de nuevo.');
        }
      } catch (error) {
        // Ver detalles del error
        console.error('Error al finalizar la orden:', error.response || error.message); // Ver detalles del error
        alert('Hubo un error al finalizar la orden. Por favor, intenta de nuevo.');
      }
    }
  };

  // Función para eliminar un libro del carrito
  const handleRemoveItem = (itemId) => {
    removeFromCart(itemId); // Cambié `removeItem` por `removeFromCart`
  };

  // Función para cerrar sesión y redirigir al inicio
  const handleLogout = () => {
    logout(); // Cerrar sesión
    navigate('/'); // Redirigir al inicio
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <Link to="/" className="navbar-link">Inicio</Link>

        {/* Carrito de compras con ícono */}
        <div className={`cart-container ${isCartOpen ? 'open' : ''}`}>
          <button 
            onClick={() => setIsCartOpen(!isCartOpen)} 
            className="cart-button"
          >
            <FaShoppingCart className="cart-icon" />
            ({cart.length}) - ${calculateTotal().toFixed(2)}
          </button>

          {/* Desplegar carrito */}
          {isCartOpen && (
            <div className="cart-dropdown">
              {cart.length === 0 ? (
                <p>El carrito está vacío.</p>
              ) : (
                <ul className="cart-list">
                  {cart.map((item) => (
                    <li key={item._id} className="cart-item">
                      <img
                        src={item.coverImage || "/placeholder.png"}
                        alt={item.title}
                        className="cart-item-image"
                      />
                      <div>
                        <p>{item.title} - ${item.price} x {item.quantity}</p>
                      </div>
                      {/* Botón de eliminar */}
                      <button
                        onClick={() => handleRemoveItem(item._id)}
                        className="remove-button"
                      >
                        Eliminar
                      </button>
                    </li>
                  ))}
                </ul>
              )}
              <p><strong>Total: ${calculateTotal().toFixed(2)}</strong></p>

              {/* Botón para finalizar la orden */}
              <button
                onClick={handleFinalizeOrder}
                className="finalize-button"
              >
                Finalizar Orden
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Título centrado */}
      <h1 className="navbar-title">BIBLIOLIGHTS</h1>

      {/* Rutas de usuario */}
      <div className="navbar-right">
        {!user ? (
          <Link to="/login" className="login-button">Iniciar Sesión</Link>
        ) : (
          <div className="profile-container">
            <Link to="/profile" className="navbar-link">Perfil</Link>
            <button onClick={handleLogout} className="logout-button">Cerrar Sesión</button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;


import React, { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { useCart } from '../context/CartContext'; // Importamos useCart para obtener el carrito
import axios from 'axios'; // Para hacer la solicitud HTTP

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const { cart } = useCart(); // Accedemos a los productos en el carrito
  const [isCartOpen, setIsCartOpen] = useState(false); // Para manejar el estado del carrito desplegable

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

  return (
    <nav style={{ backgroundColor: '#4E342E', padding: '10px' }}>
      <ul style={{ display: 'flex', justifyContent: 'space-around', listStyle: 'none', color: '#C5A18C' }}>
        <li>
          <Link to="/">Inicio</Link>
        </li>

        {/* Carrito de compras */}
        <li style={{ position: 'relative' }}>
          <button 
            onClick={() => setIsCartOpen(!isCartOpen)} 
            style={{ background: 'none', border: 'none', color: '#C5A18C', cursor: 'pointer' }}
          >
            Carrito ({cart.length}) - ${calculateTotal().toFixed(2)}
          </button>

          {/* Desplegar carrito */}
          {isCartOpen && (
            <div
              style={{
                position: 'absolute',
                top: '30px',
                right: '0',
                backgroundColor: '#fff',
                padding: '10px',
                width: '250px',
                borderRadius: '5px',
                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
              }}
            >
              {cart.length === 0 ? (
                <p>El carrito está vacío.</p>
              ) : (
                <ul style={{ padding: '0', margin: '0' }}>
                  {cart.map((item) => (
                    <li key={item._id} style={{ padding: '5px 0', borderBottom: '1px solid #ddd', display: 'flex', alignItems: 'center' }}>
                      <img
                        src={item.coverImage || "/placeholder.png"} // Imagen del libro
                        alt={item.title}
                        style={{ width: '40px', height: '60px', objectFit: 'cover', marginRight: '10px' }} // Estilo para la imagen
                      />
                      <div>
                        <p>{item.title} - ${item.price} x {item.quantity}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
              <p><strong>Total: ${calculateTotal().toFixed(2)}</strong></p>

              {/* Botón para finalizar la orden */}
              <button
                onClick={handleFinalizeOrder}
                style={{
                  backgroundColor: '#4E342E',
                  color: '#C5A18C',
                  padding: '10px',
                  width: '100%',
                  border: 'none',
                  cursor: 'pointer',
                  marginTop: '10px',
                }}
              >
                Finalizar Orden
              </button>
            </div>
          )}
        </li>

        {/* Rutas de usuario */}
        {!user ? (
          <li>
            <Link to="/login">Iniciar Sesión</Link>
          </li>
        ) : (
          <li>
            <Link to="/profile">Perfil</Link>
            <button onClick={logout} style={{ background: 'none', border: 'none', color: '#C5A18C', cursor: 'pointer' }}>
              Cerrar Sesión
            </button>
          </li>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;

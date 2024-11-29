import React, { createContext, useContext, useState } from 'react';

// Creamos el contexto del carrito
const CartContext = createContext();

// Proveedor del contexto
export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  // Función para añadir productos al carrito
  const addToCart = (book) => {
    setCart((prevCart) => {
      const existingBook = prevCart.find((item) => item._id === book._id);
      if (existingBook) {
        // Si el libro ya está en el carrito, no añadimos más unidades
        return prevCart;
      } else {
        // Si el libro no está en el carrito, lo añadimos con una unidad
        return [...prevCart, { ...book, quantity: 1 }];
      }
    });
  };

  // Función para eliminar un libro del carrito
  const removeFromCart = (bookId) => {
    setCart((prevCart) => prevCart.filter((item) => item._id !== bookId));
  };

  // Función para limpiar el carrito
  const clearCart = () => {
    setCart([]);
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

// Hook personalizado para consumir el contexto
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext"; // Usamos useAuth para acceder al token y al usuario
import axios from "axios";

import "./BookDetails.css";

const BookDetails = () => {
  const { id } = useParams(); // Obtener el ID del libro desde la URL
  const { addToCart } = useCart();
  const { user, token } = useAuth(); // Usamos useAuth para acceder al token y al usuario
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);

  // Función para obtener los detalles del libro
  const fetchBookDetails = async (id) => {
    try {
      console.log("Fetching details for book with ID:", id); // Verificar el ID del libro
      const response = await axios.get(`https://bibliolights-backend.onrender.com/api/books/${id}`);
      console.log("Book details response:", response.data); // Verificar los datos de la respuesta
      setBook(response.data);
    } catch (error) {
      console.error("Error fetching book details:", error); // Mostrar detalles del error
      setError("Error al obtener los detalles del libro"); // Mensaje de error
    } finally {
      setLoading(false);
    }
  };

  // Función para agregar o quitar de favoritos
  const toggleFavorite = async () => {
    try {
      const res = await fetch(`https://bibliolights-backend.onrender.com/api/books/${id}/favorite`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      if (res.ok) {
        setIsFavorite(!isFavorite);
      } else {
        alert("Hubo un error al agregar a favoritos");
      }
    } catch (error) {
      console.error("Error al agregar a favoritos:", error);
    }
  };

  // Verificar si el libro ya está en favoritos al cargar el componente
  const checkIfFavorite = async () => {
    try {
      const res = await fetch(`https://bibliolights-backend.onrender.com/api/books/user/favorites`, {
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      const favorites = await res.json();
      if (favorites.some((fav) => fav._id === id)) {
        setIsFavorite(true);
      }
    } catch (error) {
      console.error("Error al obtener los favoritos del usuario:", error);
    }
  };

  // Usar useEffect para obtener los detalles del libro y verificar si está en favoritos
  useEffect(() => {
    console.log("ID from URL:", id); // Verificar si el ID está siendo pasado correctamente
    fetchBookDetails(id);
    if (user) {
      checkIfFavorite();
    }
  }, [id, user]); // Dependencias: ID y user

  const handleAddToCart = () => {
    addToCart(book);
    alert(`${book.title} añadido al carrito.`);
  };

  if (loading) return <p>Cargando detalles...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="book-details-container">
      <div className="book-details-content">
        <div className="book-image-section">
          <img
            src={book.coverImage || "/placeholder.png"} 
            alt={book.title}
            className="book-image" 
          />
          <p className="book-price">
            <strong>Precio:</strong> ${book.price}
          </p>
        </div>
        <div className="book-info-section">
          <h2 className="book-title">{book.title}</h2>
          <p className="book-text">
            <strong>Autor:</strong> {book.author}
          </p>
          <p className="book-description">{book.description}</p>
        </div>
      </div>

      <div className="book-action-section">
        <p className="book-text">
          <strong>Cantidad disponible:</strong> {book.quantity}
        </p>
        <button className="add-to-cart-button" onClick={handleAddToCart}>
          Agregar al carrito
        </button>
        
        <button
          onClick={toggleFavorite}
          className="add-to-favorites-button"
          style={{
            backgroundColor: isFavorite ? '#C5A18C' : '#4E342E',
            color: '#fff',
            padding: '10px 20px',
            marginTop: '10px',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          {isFavorite ? "Eliminar de favoritos" : "Agregar a favoritos"}
        </button>
      </div>
    </div>
  );
};

export default BookDetails;

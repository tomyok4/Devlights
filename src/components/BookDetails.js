import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import axios from "axios";

import "./BookDetails.css";

const BookDetails = () => {
  const { id } = useParams();
  const { addToCart } = useCart();
  const { user, token } = useAuth();
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);

  const fetchBookDetails = async (id) => {
    try {
      const response = await axios.get(`https://bibliolights-backend.onrender.com/api/books/${id}`);
      setBook(response.data);
    } catch (error) {
      setError("Error al obtener los detalles del libro");
    } finally {
      setLoading(false);
    }
  };

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

  useEffect(() => {
    fetchBookDetails(id);
    if (user) {
      checkIfFavorite();
    }
  }, [id, user]);

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
        <div className="price-favorite-section">
          <p className="book-price">
            <strong>Precio:</strong> ${book.price}
          </p>
          <div className="favorite-icon" onClick={toggleFavorite}>
            <span style={{ fontSize: '24px', color: isFavorite ? '#f1c40f' : '#ccc' }}>
              {isFavorite ? '★' : '☆'}
            </span>
          </div>
          <p className="book-quantity">
            <strong>Cantidad disponible:</strong> {book.quantity}
          </p>
        </div>
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
      <button className="add-to-cart-button" onClick={handleAddToCart}>
        Agregar al carrito
      </button>
    </div>
  </div>
  );
};

export default BookDetails;
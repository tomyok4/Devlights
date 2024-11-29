import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import AuthContext from "../context/AuthContext"; 
import axios from "axios"; 
import Carrusel from "../components/Carrusel"; 
import './Dashboard.css'; 

const Dashboard = () => {
  const { user } = useContext(AuthContext);  
  const [books, setBooks] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [booksPerPage] = useState(6);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOption, setSortOption] = useState('priceAsc');  

  const navigate = useNavigate();

  // Imágenes del carrusel
  const carouselImages = [
    require('../assets/imagen1dashboard.jpg'),
    require('../assets/imagen2dashboard.jpg'),
    require('../assets/imagen3dashboard.jpg')
  ];

  useEffect(() => {
    const fetchBooksData = async () => {
      try {
        const response = await axios.get('https://bibliolights-backend.onrender.com/api/books');
        setBooks(response.data);
        setTotalPages(Math.ceil(response.data.length / booksPerPage));  
      } catch (error) {
        console.error('Error al obtener los libros:', error.message);
      }
    };

    fetchBooksData();
  }, [booksPerPage]);

  // Filtrar libros por nombre
  const filteredBooks = books.filter((book) =>
    book.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Función para ordenar libros según el criterio seleccionado
  const sortBooks = (books) => {
    switch (sortOption) {
      case 'priceAsc':
        return [...books].sort((a, b) => a.price - b.price); // Ordenar por precio ascendente
      case 'priceDesc':
        return [...books].sort((a, b) => b.price - a.price); // Ordenar por precio descendente
      case 'dateAsc':
        return [...books].sort((a, b) => new Date(a.date) - new Date(b.date)); // Ordenar por fecha ascendente
      case 'dateDesc':
        return [...books].sort((a, b) => new Date(b.date) - new Date(a.date)); // Ordenar por fecha descendente
      case 'availabilityAsc':
        return [...books].sort((a, b) => a.quantity - b.quantity); // Ordenar por disponibilidad ascendente
      case 'availabilityDesc':
        return [...books].sort((a, b) => b.quantity - a.quantity); // Ordenar por disponibilidad descendente
      default:
        return books;
    }
  };

  // Ordenamos los libros filtrados
  const sortedBooks = sortBooks(filteredBooks);

  // Paginación
  const indexOfLastBook = currentPage * booksPerPage;
  const indexOfFirstBook = indexOfLastBook - booksPerPage;
  const currentBooks = sortedBooks.slice(indexOfFirstBook, indexOfLastBook);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleSortChange = (event) => {
    setSortOption(event.target.value);
  };

  const handleViewDetails = (bookId) => {
    navigate(`/books/${bookId}`); // Redirige a la página de detalles del libro
  };

  return (
    <div className="container">
      {/* Carrusel de imágenes */}
      <Carrusel images={carouselImages} />

      <div className="headerContainer">
        <h2 className="header">Catálogo de Libros</h2>
        
        {/* Barra de búsqueda alineada a la derecha */}
        <div className="searchBox">
          <input
            type="text"
            placeholder="Buscar libros..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="searchBar"
          />
        </div>
      </div>

      {/* Contenedor de ordenamiento debajo del título */}
      <div className="sortingContainer">
        <label className="sortLabel">Ordenar por:</label>
        <select onChange={handleSortChange} value={sortOption} className="sortSelect">
          <option value="priceAsc">Precio: de menor a mayor</option>
          <option value="priceDesc">Precio: de mayor a menor</option>
          <option value="dateAsc">Fecha: más antigua a más reciente</option>
          <option value="dateDesc">Fecha: más reciente a más antigua</option>
          <option value="availabilityAsc">Disponibilidad: menos disponible primero</option>
          <option value="availabilityDesc">Disponibilidad: más disponible primero</option>
        </select>
      </div>

      {/* Grid de libros */}
      <div className="grid">
        {currentBooks.length > 0 ? (
          currentBooks.map((book) => (
            <div key={book._id} className="card">
              <img
                src={book.coverImage || "default-image.jpg"}
                alt={book.title}
                className="image"
              />
              <div className="cardTextContainer">
                <h3 className="cardTitle">{book.title}</h3>
                <p className="cardText">Autor: {book.author}</p>
                <p className="cardText">Precio: ${book.price}</p>
                <p className="cardText">Cantidad: {book.quantity}</p>
              </div>
              <button
                className="detailsButton"
                onClick={() => handleViewDetails(book._id)}  
              >
                Más detalles
              </button>
            </div>
          ))
        ) : (
          <p className="noResultsMessage">No se encontraron libros con ese título.</p>
        )}
      </div>

      {/* Paginación */}
      <div className="pagination">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="paginationButton"
        >
          Anterior
        </button>

        {[...Array(totalPages)].map((_, index) => (
          <button
            key={index}
            onClick={() => handlePageChange(index + 1)}
            className={`paginationButton ${
              currentPage === index + 1 ? 'activePaginationButton' : ''
            }`}
          >
            {index + 1}
          </button>
        ))}

        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="paginationButton"
        >
          Siguiente
        </button>
      </div>
    </div>
  );
};

export default Dashboard;




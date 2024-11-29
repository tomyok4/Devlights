import React, { useState, useEffect } from 'react';
import './Carrusel.css';

const Carrusel = ({ images }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Cambia la imagen automáticamente cada 5 segundos
  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentImageIndex((prevIndex) =>
        prevIndex === images.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000); // 5000 ms = 5 segundos

    // Limpiar el intervalo cuando el componente se desmonte
    return () => clearInterval(intervalId);
  }, [images.length]);

  const nextImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevImage = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  if (!images || images.length === 0) {
    return null;
  }

  return (
    <div className="carousel-container">
      <div className="carousel-wrapper">
        <button
          className="carousel-arrow carousel-arrow-left"
          onClick={prevImage}
        >
          &#10094;
        </button>
        <img
          src={images[currentImageIndex]}
          alt={`Slide ${currentImageIndex + 1}`}
          className="carousel-image"
        />
        <button
          className="carousel-arrow carousel-arrow-right"
          onClick={nextImage}
        >
          &#10095;
        </button>
      </div>
      <div className="carousel-dots">
        {images.map((_, index) => (
          <span
            key={index}
            className={`carousel-dot ${index === currentImageIndex ? 'active' : ''}`}
            onClick={() => setCurrentImageIndex(index)}
          ></span>
        ))}
      </div>
    </div>
  );
};

export default Carrusel;

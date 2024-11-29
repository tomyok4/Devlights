import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext'; // Importamos el CartProvider
import Navbar from './components/Navbar';
import LoginRegister from './components/LoginRegister';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import BookDetails from './components/BookDetails'; // Importamos el componente de detalles del libro
import Loading from './components/Loading'; // Importa el componente de Loading
import Footer from './components/Footer'; // Importa el componente de Footer

const App = () => {
  const [isLoading, setIsLoading] = useState(true); // Estado para controlar el Loading

  // Simulamos la carga de datos (puedes usar useEffect para llamar a APIs, etc.)
  useEffect(() => {
    // Aquí simula que los datos están siendo cargados por 3 segundos
    setTimeout(() => {
      setIsLoading(false); // Una vez que la carga haya terminado
    }, 3000); // 3 segundos de carga simulada
  }, []);

  return (
    <AuthProvider>
      <CartProvider> {/* Proveedor del contexto Cart */}
        <Router>
          <Navbar />
          
          {/* Mostrar el Loading mientras los datos están siendo cargados */}
          {isLoading ? (
            <Loading />  // Componente de carga mientras se obtienen los datos
          ) : (
            <Routes>
              <Route path="/" element={<Dashboard />} /> {/* Página principal con todos los libros */}
              <Route path="/login" element={<LoginRegister isLogin={true} />} /> {/* Ruta para el login */}
              <Route path="/register" element={<LoginRegister isLogin={false} />} /> {/* Ruta para el registro */}
              <Route path="/profile" element={<Profile />} /> {/* Ruta para el perfil de usuario */}
              <Route path="/books/:id" element={<BookDetails />} /> {/* Ruta para los detalles del libro */}
            </Routes>
          )}
          
          <Footer /> {/* Footer para todas las páginas */}
        </Router>
      </CartProvider>
    </AuthProvider>
  );
};

export default App;
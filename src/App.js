import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'; // Usamos Routes en lugar de Switch
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext'; // Importamos el CartProvider
import Navbar from './components/Navbar';
import LoginRegister from './components/LoginRegister';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import BookDetails from './components/BookDetails'; // Importamos el componente de detalles del libro

const App = () => {
  return (
    <AuthProvider>
      <CartProvider> {/* Proveedor del contexto Cart */}
        <Router>
          <Navbar />
          <Routes>
            <Route path="/" element={<Dashboard />} /> {/* Página principal con todos los libros */}
            <Route path="/login" element={<LoginRegister isLogin={true} />} /> {/* Ruta para el login */}
            <Route path="/register" element={<LoginRegister isLogin={false} />} /> {/* Ruta para el registro */}
            <Route path="/profile" element={<Profile />} /> {/* Ruta para el perfil de usuario */}
            <Route path="/books/:id" element={<BookDetails />} /> {/* Ruta para los detalles del libro */}
          </Routes>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
};

export default App;


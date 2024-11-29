import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';
import InstagramLogo from '../assets/Instagram.png';
import FacebookLogo from '../assets/Facebook.png';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-top">
        <div className="footer-presentation">
          <h3>Bibliolights</h3>
          <p>Tu librería tecnológica, con una selección única de libros y recursos sobre el futuro de la tecnología, ciencia, innovación y más. Estamos aquí para iluminar tu camino hacia el conocimiento.</p>
        </div>

        <div className="footer-sections">
          <div className="footer-links">
            <h4>Secciones</h4>
            <ul>
              <li><Link to="/" className="footer-link">Inicio</Link></li> {/* Botón de Inicio como enlace */}
              <li><Link to="/about" className="footer-link">Acerca de</Link></li>
              <li><Link to="/contact" className="footer-link">Contacto</Link></li>
              <li><Link to="/terms" className="footer-link">Términos y Condiciones</Link></li>
            </ul>
          </div>

          <div className="footer-social">
            <h4>Síguenos</h4>
            <div className="social-icons">
              <a href="https://www.instagram.com" target="_blank" rel="noopener noreferrer">
                <img src={InstagramLogo} alt="Instagram" className="social-icon" />
              </a>
              <a href="https://www.facebook.com" target="_blank" rel="noopener noreferrer">
                <img src={FacebookLogo} alt="Facebook" className="social-icon" />
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} Bibliolights. Todos los derechos reservados.</p>
      </div>
    </footer>
  );
};

export default Footer;

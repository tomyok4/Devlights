import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import { useContext } from 'react';
import './LoginRegister.css'; // Asegúrate de importar el archivo CSS

const LoginRegister = ({ isLogin }) => {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const url = `https://bibliolights-backend.onrender.com/api/auth/${isLogin ? 'login' : 'register'}`;
    const data = { email, password };

    axios
      .post(url, data)
      .then((response) => {
        login(response.data.token);
        navigate('/');
      })
      .catch((error) => {
        console.error('Error:', error);
        setError('Credenciales incorrectas o ya existe el usuario.');
      });
  };

  return (
    <div className="loginRegisterContainer">
      <h2>{isLogin ? 'Iniciar sesión' : 'Registrarse'}</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">{isLogin ? 'Iniciar sesión' : 'Registrarse'}</button>
      </form>
      {error && <p className="errorMessage">{error}</p>}
      <div className="switchAuth">
        {isLogin ? (
          <p>
            ¿No tienes cuenta? <a href="/register">Regístrate aquí</a>
          </p>
        ) : (
          <p>
            ¿Ya tienes cuenta? <a href="/login">Inicia sesión</a>
          </p>
        )}
      </div>
    </div>
  );
};

export default LoginRegister;
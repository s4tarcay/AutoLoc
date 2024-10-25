import React, { useState } from "react";
import { auth, provider, signInWithPopup } from "./firebase"; // Importa o Firebase
import "./Login.css";
import google from "../../assets/google.svg";
import { useNavigate } from "react-router-dom";

const LoginGoogle = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // Função para autenticar com Google
  const handleGoogleLogin = () => {
    signInWithPopup(auth, provider)
      .then((result) => {
        console.log(result.user); // Informações do usuário autenticado
        navigate("/"); // Redireciona para AutoLocHome após login
      })
      .catch((error) => {
        console.error(error);
        alert("Erro ao autenticar com Google.");
      });
  };

  // Função para autenticar com email e senha
  const handleEmailLogin = (e) => {
    e.preventDefault(); // Impede o comportamento padrão do formulário
    auth.signInWithEmailAndPassword(email, password)
      .then((userCredential) => {
        // Login bem-sucedido
        console.log(userCredential.user);
        navigate("/"); // Redireciona para AutoLocHome após login
      })
      .catch((error) => {
        setError(error.message);
        console.error(error);
      });
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={handleEmailLogin}>
        <div>
          <label htmlFor="email">E-mail:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="password">Senha:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <p style={{ color: "red" }}>{error}</p>} {/* Exibe erro se houver */}
        <button type="submit">Entrar com E-mail e Senha</button>
      </form>
      <hr />
      <button className="google" onClick={handleGoogleLogin}>
        <img
          src={google}
          alt="Login com Google"
          style={{ width: "15px", marginRight: "8px" }}
        />
        Login com Google
      </button>
    </div>
  );
};

export default LoginGoogle;

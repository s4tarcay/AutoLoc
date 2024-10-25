import React, { useState } from "react";
import { auth, provider, signInWithPopup } from "./firebase"; // Importa o Firebase
import "./Login.css";
import google from "../../assets/google.svg";
import { useNavigate } from "react-router-dom";

const LoginGoogle = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  // Função para lidar com o envio do formulário
  const handleSubmit = (event) => {
    event.preventDefault();
    if (email === "user@example.com" && password === "password123") {
      alert("Login realizado com sucesso!");
      setError("");
    } else {
      setError("Credenciais inválidas!");
    }
  };
  // Função para autenticar com Google
  const handleGoogleLogin = () => {
    signInWithPopup(auth, provider)
      .then((result) => {
        console.log(result.user); // Informações do usuário autenticado
        // alert(`Bem-vindo, ${result.user.displayName}!`);
        navigate("/");
      })
      .catch((error) => {
        console.error(error);
        setError("Erro ao autenticar com Google.");
      });
  };
  return (
    <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
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
        {error && <p style={{ color: "red" }}>{error}</p>}{" "}
        {/* Exibe erro se houver */}
        <button className="m-0" type="submit">Entrar</button>
      </form>
      <hr />
      {/* Botão de login com Google */}
      <button className="google m-0" onClick={handleGoogleLogin}>
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

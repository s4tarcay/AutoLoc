import React, { useState } from "react";
import { auth, provider, signInWithPopup } from "./firebase"; // Importa o Firebase
import "./Login.css";
import google from "../../assets/google.svg";
import { useNavigate, Link } from "react-router-dom"; // Importa Link para redirecionar

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

  // Função para fazer login com email e senha
  const handleEmailLogin = async (e) => {
    e.preventDefault();
    try {
      await auth.signInWithEmailAndPassword(email, password);
      navigate("/"); // Redireciona para AutoLocHome após login
    } catch (error) {
      setError("Erro ao fazer login. Verifique suas credenciais.");
      console.error(error);
    }
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
            style={{ border: "1px solid black", borderRadius: "5px" }} // Caixa branca com borda preta
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
            style={{ border: "1px solid black", borderRadius: "5px" }} // Caixa branca com borda preta
          />
        </div>
        {error && <p style={{ color: "red" }}>{error}</p>} {/* Exibe erro se houver */}

        <p className="register">
          Não possui uma conta?{" "}
          <Link to="/registro">Cadastrar-se</Link> {/* Redireciona para Registro */}
        </p>

        <button type="submit">Entrar</button>
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

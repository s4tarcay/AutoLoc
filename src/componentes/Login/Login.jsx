import React, { useState } from "react";
import { auth, provider, signInWithPopup } from "./firebase";
import "./Login.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import google from "../../assets/google.svg";
import { Link } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(
        "http://exemploapi.somee.com/identity/login",
        {
          email,
          password,
          useCookies: false,
          useSessionCookies: false,
        }
      );

      if (response.status === 200) {
        console.log("Login bem-sucedido:", response.data);

        navigate("/home");
      }
    } catch (err) {
      setError("Erro ao fazer login. Tente novamente.");
      console.error(err);
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <div>
          <label htmlFor="email">Email:</label>
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
        <p className="register">
          Não possui uma conta? <Link to={"/register"}>Cadastrar-se</Link>
        </p>
        <button type="submit">Entrar</button>
      </form>

      <hr />
      <button className="google" type="submit">
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

export default Login;

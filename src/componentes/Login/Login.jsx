import React, { useState } from "react";
import { auth, provider, signInWithPopup } from "./firebase";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import google from "../../assets/google.svg";
import { Link } from "react-router-dom";
import "./Login.css"; // Certifique-se de que este CSS está atualizado

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

    // Verifica credenciais do admin
    if (email === "admin" && password === "admin123") {
      console.log("Login admin bem-sucedido");
      navigate("/home");
      setLoading(false);
      return;
    }

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
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(provider);
      console.log("Login com Google bem-sucedido:", result.user);
      navigate("/home");
    } catch (err) {
      setError("Erro ao fazer login com Google. Tente novamente.");
      console.error(err);
    }
  };

  return (
    <div className="login-container d-flex flex-column align-items-center justify-content-center min-vh-100">
      <h2 className="mb-4">Login</h2>
      <form onSubmit={handleLogin} className="w-75 w-md-50">
        <div className="mb-3">
          <label htmlFor="email" className="form-label">Email:</label>
          <input
            type="email"
            id="email"
            className="form-control"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">Senha:</label>
          <input
            type="password"
            id="password"
            className="form-control"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <p className="text-danger">{error}</p>}
        <p className="register">
          Não possui uma conta? <Link to={"/register"}>Cadastrar-se</Link>
        </p>
        <button type="submit" className="btn btn-primary w-100" disabled={loading}>
          {loading ? "Entrando..." : "Entrar"}
        </button>
      </form>

      <hr className="my-4" />
      <button className="btn btn-outline-danger google" onClick={handleGoogleLogin}>
        <img src={google} alt="Login com Google" style={{ width: "20px", marginRight: "8px" }} />
        Login com Google
      </button>
    </div>
  );
};

export default Login;

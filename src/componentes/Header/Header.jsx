import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Header = () => {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const validRoutes = [
    { path: "/cliente", name: "Cliente" },
    { path: "/", name: "Home" },
    { path: "/veiculos", name: "Veículos" },
    { path: "/patio", name: "Pátio" },
    { path: "/login", name: "Login" },
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    const normalizedSearchTerm = searchTerm.toLowerCase().trim();
    const foundRoute = validRoutes.find(
      (route) =>
        route.path.toLowerCase().includes(normalizedSearchTerm) ||
        route.name.toLowerCase().includes(normalizedSearchTerm)
    );

    if (foundRoute) {
      navigate(foundRoute.path);
    } else {
      alert("Rota não encontrada!");
    }
  };

  const toggleNavbar = () => {
    setIsCollapsed(!isCollapsed);
  };

  return (
    <nav
      className="navbar navbar-expand-lg navbar-dark bg-dark"
      aria-label="Fifth navbar example"
    >
      <div className="container-fluid">
        <Link className="navbar-brand" to="/">
          AutoLoc
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          onClick={toggleNavbar}
          aria-expanded={!isCollapsed}
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div
          className={`collapse navbar-collapse ${isCollapsed ? "" : "show"}`}
          id="navbarsExample05"
        >
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            {validRoutes.map((route) => (
              <li className="nav-item" key={route.path}>
                <Link className="nav-link" to={route.path}>
                  {route.name}
                </Link>
              </li>
            ))}
          </ul>
          <form role="search" className="d-flex" onSubmit={handleSearch}></form>
        </div>
      </div>
    </nav>
  );
};

export default Header;

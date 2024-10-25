import React from 'react';
import { Link } from 'react-router-dom'; // Importe o Link
import './Header.css'; // Importe o CSS

const Header = () => {
    return (
        <nav className="bg-black p-4 fixed-top">
            <div className="container mx-auto flex items-center">
                {/* Logo do AutoLoc */}
                <div className="flex items-center">
                    <img src="/CarHeader.svg" alt="Car Icon" className="w-6 h-6 mr-2" /> {/* Ícone Car */}
                    <span className="text-lg font-semibold text-white">AutoLoc</span>
                </div>
                {/* Container para centralizar os links */}
                <div className="header-container">
                    <Link to="/" className="nav-link">Pátios</Link>
                    <Link to="/veiculos" className="nav-link">Veículos</Link>
                    <Link to="/localizacao" className="nav-link">Localização</Link>
                </div>
                {/* Caixinha do Login */}
                <Link to="/login" className="login-button ml-4">
                    <img src="/User.svg" alt="User Icon" className="login-icon" />
                    <span className="text-white">Login</span>
                </Link>
            </div>
        </nav>
    );
};

export default Header;

import React from 'react';
import { Link } from 'react-router-dom';
import { Car } from 'lucide-react';
import './Header.css'; // Certifique-se de que o caminho está correto

const Header = () => {
    return (
        <nav className="bg-black text-white p-4">
            <div className="container mx-auto flex justify-between items-center">
                <div className="flex items-center space-x-6">
                    <div className="flex items-center">
                        <Car className="w-6 h-6 mr-2" />
                        <span className="text-lg font-semibold">AutoLoc</span>
                    </div>
                    <div className="flex space-x-6">
                        <Link to="/" className="hover:text-gray-300">Pátios</Link>
                        <Link to="/veiculos" className="hover:text-gray-300">Veículos</Link>
                        <Link to="/localizacao" className="hover:text-gray-300">Localização</Link>
                    </div>
                </div>
                <Link to="/login" className="login-button flex items-center justify-center rounded-full border border-white bg-black text-white px-4 py-2 hover:bg-gray-800">
                    <img src="/User.svg" alt="User" className="mr-2" /> {/* Ajuste o caminho conforme necessário */}
                    <span>Login</span>
                </Link>
            </div>
        </nav>
    );
};

export default Header;

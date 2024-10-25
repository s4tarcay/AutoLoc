import React from 'react';
import { Car } from 'lucide-react';
import { Link } from 'react-router-dom'; // Importe o Link

const Header = () => {
    return (
        <nav className="bg-black text-white p-4 fixed-top">
            <div className="container mx-auto flex justify-between items-center">
                <div className="flex items-center space-x-6">
                    <div className="flex items-center">
                        <Car className="w-6 h-6 mr-2" />
                        <span className="text-lg font-semibold">AutoLoc</span>
                    </div>
                    <div className="flex space-x-4">
                        <Link to="/" className="hover:text-gray-300">Pátios</Link> {/* Adicione o Link aqui */}
                        <Link to="/veiculos" className="hover:text-gray-300">Veículos</Link>
                        <Link to="/localizacao" className="hover:text-gray-300">Localização</Link>
                    </div>
                </div>
                <button className="px-4 py-1 rounded border border-white hover:bg-white hover:text-black transition-colors">
                    Login
                </button>
            </div>
        </nav>
    );
};

export default Header;

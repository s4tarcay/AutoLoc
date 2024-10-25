import React, { useState } from 'react';
import { Car, Menu, X } from 'lucide-react';
import { Link } from 'react-router-dom';

const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <nav className="bg-slate-900 fixed w-full top-0 z-50 shadow-lg transition-all duration-300">
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-center h-20">
                    {/* Logo e Nome */}
                    <div className="flex items-center">
                        <Car className="w-14 h-14 mr-2 text-emerald-500" />
                        <span className="text-2xl font-bold text-white tracking-tight">
                            Auto<span className="text-emerald-500">Loc</span>
                        </span>
                    </div>

                    {/* Botão Login */}
                    <div className="hidden md:flex items-center space-x-4">
                        <button className="px-6 py-2.5 rounded-md bg-emerald-600 text-white hover:bg-emerald-700 transition-all duration-300 font-semibold text-sm shadow-lg hover:shadow-emerald-500/20">
                            Login
                        </button>
                    </div>

                    {/* Menu Mobile */}
                    <button 
                        className="md:hidden text-white hover:text-emerald-500 transition-colors"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                        {isMenuOpen ? 
                            <X className="w-6 h-6" /> : 
                            <Menu className="w-6 h-6" />
                        }
                    </button>
                </div>
            </div>

            {/* Menu Mobile Dropdown */}
            {isMenuOpen && (
                <div className="md:hidden bg-slate-800 border-t border-slate-700">
                    <div className="container mx-auto px-4 py-4 space-y-4">
                        <Link 
                            to="/cliente" 
                            className="block text-gray-300 hover:text-emerald-500 transition-colors duration-300 font-medium text-sm uppercase"
                        >
                            Cliente
                        </Link>
                        <Link 
                            to="/" 
                            className="block text-gray-300 hover:text-emerald-500 transition-colors duration-300 font-medium text-sm uppercase"
                        >
                            Locações
                        </Link>
                        <Link 
                            to="/veiculos" 
                            className="block text-gray-300 hover:text-emerald-500 transition-colors duration-300 font-medium text-sm uppercase"
                        >
                            Veículos
                        </Link>
                        <Link 
                            to="/patio" 
                            className="block text-gray-300 hover:text-emerald-500 transition-colors duration-300 font-medium text-sm uppercase"
                        >
                            Pátio
                        </Link>
                        <button className="w-full px-6 py-2.5 rounded-md bg-emerald-600 text-white hover:bg-emerald-700 transition-all duration-300 font-semibold text-sm shadow-lg hover:shadow-emerald-500/20">
                            Login
                        </button>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Header;

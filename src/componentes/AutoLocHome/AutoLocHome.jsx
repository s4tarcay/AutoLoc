import React, { useState } from 'react';

import './AutoLocHome.css';

const AutoLocHome = () => {
    const [statusFilter, setStatusFilter] = useState('Todos');
    const [regionFilter, setRegionFilter] = useState('Todos');

    const statusOptions = [
        { value: 'Todos', label: 'Todos' },
        { value: 'normal', label: 'Disponibilidade Normal' },
        { value: 'medium', label: 'Disponibilidade Média' },
        { value: 'low', label: 'Baixa Disponibilidade' }
    ];

    const regionOptions = [
        { value: 'Todos', label: 'Todos' },
        { value: 'centro', label: 'Centro' },
        { value: 'sul', label: 'Sul' },
        { value: 'norte', label: 'Norte' },
        { value: 'oeste', label: 'Oeste' }
    ];

    const lots = [
        { name: "Pátio Centro", total: 30, available: 23, rented: 7, status: "normal", region: "centro" },
        { name: "Pátio Zona Sul", total: 22, available: 14, rented: 8, status: "medium", region: "sul" },
        { name: "Pátio Zona Norte", total: 40, available: 3, rented: 37, status: "low", region: "norte" }
    ];

    const getStatusColor = (status) => {
        switch (status) {
            case "normal": return "bg-green-200";
            case "medium": return "bg-yellow-200";
            case "low": return "bg-red-200";
            default: return "bg-gray-200";
        }
    };

    const filteredLots = lots.filter(lot => {
        const matchesStatus = statusFilter === 'Todos' || lot.status === statusFilter;
        const matchesRegion = regionFilter === 'Todos' || lot.region === regionFilter;
        return matchesStatus && matchesRegion;
    });

    return (
        <div className="min-h-screen bg-gray-100">

            <div className="container mx-auto p-8 flex">
                <div className="w-64 mr-8">
                    <div className="bg-white rounded-lg p-4 mb-4 shadow-sm">
                        <h3 className="font-semibold mb-4">Filtros</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm mb-2">Status</label>
                                <select
                                    className="w-full p-2 border rounded"
                                    value={statusFilter}
                                    onChange={(e) => setStatusFilter(e.target.value)}
                                >
                                    {statusOptions.map((option) => (
                                        <option key={option.value} value={option.value}>
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm mb-2">Região</label>
                                <select
                                    className="w-full p-2 border rounded"
                                    value={regionFilter}
                                    onChange={(e) => setRegionFilter(e.target.value)}
                                >
                                    {regionOptions.map((option) => (
                                        <option key={option.value} value={option.value}>
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <button className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700">
                                Aplicar Filtros
                            </button>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg p-4 shadow-sm">
                        <h3 className="font-semibold mb-4">Legenda</h3>
                        <div className="space-y-2">
                            <div className="flex items-center">
                                <div className="w-3 h-3 rounded-full bg-green-400 mr-2"></div>
                                <span className="text-sm">Disponibilidade Normal</span>
                            </div>
                            <div className="flex items-center">
                                <div className="w-3 h-3 rounded-full bg-yellow-400 mr-2"></div>
                                <span className="text-sm">Disponibilidade Média</span>
                            </div>
                            <div className="flex items-center">
                                <div className="w-3 h-3 rounded-full bg-red-400 mr-2"></div>
                                <span className="text-sm">Baixa Disponibilidade</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex-1">
                    <h2 className="text-2xl font-semibold mb-6">Pátios Disponíveis</h2>
                    <div className="grid grid-cols-2 gap-6">
                        {filteredLots.map((lot, index) => (
                            <div
                                key={index}
                                className={`rounded-lg p-4 ${getStatusColor(lot.status)} transition-transform hover:scale-105 cursor-pointer`}
                            >
                                <h3 className="text-lg font-semibold mb-4">{lot.name}</h3>
                                <div className="grid grid-cols-3 gap-4 text-center">
                                    <div>
                                        <div className="font-bold text-xl">{lot.total}</div>
                                        <div className="text-sm">Total</div>
                                    </div>
                                    <div>
                                        <div className="font-bold text-xl">{lot.available}</div>
                                        <div className="text-sm">Disponíveis</div>
                                    </div>
                                    <div>
                                        <div className="font-bold text-xl">{lot.rented}</div>
                                        <div className="text-sm">Locados</div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AutoLocHome;

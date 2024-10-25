import React, { useEffect, useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Patio.css';

const Patio = () => {
    const [patios, setPatios] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [formData, setFormData] = useState({ id: '', nome: '' });
    const [searchTerm, setSearchTerm] = useState('');
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [editingId, setEditingId] = useState(null);

    useEffect(() => {
        fetchPatios();
    }, []);

    const fetchPatios = async () => {
        try {
            const response = await axios.get('https://192.168.1.44:7190/api/Patios');
            setPatios(response.data);
        } catch (err) {
            setError(`Erro ao buscar pátios: ${err.message} | ${err.response ? err.response.data : ''}`);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    const filteredPatios = patios.filter(patio => {
        return (
            patio.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
            patio.id.toString().includes(searchTerm)
        );
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleCreateSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('https://192.168.1.44:7190/api/Patios', formData);
            fetchPatios();
            resetFormData();
            setShowCreateModal(false);
        } catch (err) {
            setError(`Erro: ${err.message} | ${err.response ? err.response.data : ''}`);
        }
    };

    const handleEdit = (patio) => {
        setFormData({ id: patio.id, nome: patio.nome });
        setEditingId(patio.id);
        setShowEditModal(true);
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`https://192.168.1.44:7190/api/Patios/${editingId}`, formData);
            fetchPatios();
            resetFormData();
            setShowEditModal(false);
        } catch (err) {
            setError(`Erro: ${err.message} | ${err.response ? err.response.data : ''}`);
        }
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`https://192.168.1.44:7190/api/Patios/${id}`);
            fetchPatios();
        } catch (err) {
            setError(`Erro: ${err.message} | ${err.response ? err.response.data : ''}`);
        }
    };

    const resetFormData = () => {
        setFormData({ id: '', nome: '' });
        setEditingId(null);
    };

    if (loading) return <div>Carregando...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div className="min-h-screen bg-gray-100">
            <div className="container mx-auto p-8 flex flex-col">
                <h2 className="text-2xl font-semibold mb-6">Pátios Disponíveis</h2>
                <div className="mb-4">
                    <input
                        type="text"
                        placeholder="Buscar Pátio por ID ou Nome"
                        value={searchTerm}
                        onChange={handleSearch}
                        className="p-2 border rounded mr-4"
                    />
                    <button
                        className="mr-4 btn btn-primary"
                        onClick={() => setShowCreateModal(true)}
                    >
                        Criar Pátio
                    </button>
                </div>
                <div className="flex flex-wrap gap-4">
                    {filteredPatios.length > 0 ? (
                        filteredPatios.map((patio) => (
                            <div key={patio.id} className="rounded-lg p-4 bg-white shadow-sm flex flex-col">
                                <h3 className="text-lg font-semibold mb-4">{patio.nome}</h3>
                                <div className="text-sm">ID: {patio.id}</div>
                                <div className="flex justify-between mt-4">
                                    <button
                                        onClick={() => handleEdit(patio)}
                                        className="btn btn-warning"
                                    >
                                        Editar
                                    </button>
                                    <button
                                        onClick={() => handleDelete(patio.id)}
                                        className="btn btn-danger"
                                    >
                                        Deletar
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center w-full">Nenhum pátio encontrado.</div>
                    )}
                </div>

                {/* Modal de Criar Pátio */}
                <div className={`modal fade ${showCreateModal ? 'show' : ''}`} style={{ display: showCreateModal ? 'block' : 'none' }}>
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Novo Pátio</h5>
                                <button type="button" className="btn-close" onClick={() => setShowCreateModal(false)}></button>
                            </div>
                            <div className="modal-body">
                                <form onSubmit={handleCreateSubmit}>
                                    <div className="mb-3">
                                        <label className="form-label">Nome</label>
                                        <input
                                            type="text"
                                            name="nome"
                                            value={formData.nome}
                                            onChange={handleChange}
                                            className="form-control"
                                            required
                                        />
                                    </div>
                                    <button type="submit" className="btn btn-primary w-100">Criar Pátio</button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Modal de Editar Pátio (utilizando o modal de veículo) */}
                <div className={`modal fade ${showEditModal ? 'show' : ''}`} style={{ display: showEditModal ? 'block' : 'none' }}>
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Editar Pátio</h5>
                                <button type="button" className="btn-close" onClick={() => setShowEditModal(false)}></button>
                            </div>
                            <div className="modal-body">
                                <form onSubmit={handleEditSubmit}>
                                    <div className="mb-3">
                                        <label className="form-label">Nome</label>
                                        <input
                                            type="text"
                                            name="nome"
                                            value={formData.nome}
                                            onChange={handleChange}
                                            className="form-control"
                                            required
                                        />
                                    </div>
                                    <button type="submit" className="btn btn-warning w-100">Atualizar Pátio</button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Patio;
    
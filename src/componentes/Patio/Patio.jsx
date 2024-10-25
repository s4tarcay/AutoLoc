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
    const [vehiclesCount, setVehiclesCount] = useState({});

    useEffect(() => {
        fetchPatios();
    }, []);

    const fetchPatios = async () => {
        try {
            const response = await axios.get('https://192.168.1.44:7190/api/Patios');
            setPatios(response.data);

            // Fetch vehicle counts for each patio
            const countPromises = response.data.map(patio => fetchVehiclesCount(patio.id));
            const counts = await Promise.all(countPromises);
            const countMap = {};
            response.data.forEach((patio, index) => {
                countMap[patio.id] = counts[index];
            });
            setVehiclesCount(countMap);
        } catch (err) {
            setError(`Erro ao buscar pátios: ${err.message} | ${err.response ? err.response.data : ''}`);
        } finally {
            setLoading(false);
        }
    };

    const fetchVehiclesCount = async (patioId) => {
        try {
            const response = await axios.get(`https://192.168.1.44:7190/api/Veiculos`);
            const vehicles = response.data.filter(veiculo => veiculo.patioId === patioId);
            return vehicles.length; // Retorna a contagem de veículos no pátio
        } catch (err) {
            console.error(`Erro ao buscar veículos para o pátio ${patioId}: ${err.message}`);
            return 0; // Retorne 0 em caso de erro
        }
    };

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    const filteredPatios = patios.filter(patio =>
        patio.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        patio.id.toString().includes(searchTerm)
    );

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleCreateSubmit = async (e) => {
        e.preventDefault();
        const selectedPatio = patios.find(p => p.id === formData.id);

        if (vehiclesCount[selectedPatio.id] >= 20) {
            setError(`Não é possível adicionar mais veículos a este pátio. Limite de 20 veículos alcançado.`);
            return;
        }

        try {
            await axios.post('https://192.168.1.44:7190/api/Veiculos', { ...formData, patioId: selectedPatio.id });
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

    if (loading) return <div className="text-center">Carregando...</div>;
    if (error) return <div className="text-danger text-center">{error}</div>;

    return (
        <div className="min-h-screen bg-light">
            <div className="container p-5">
                <h2 className="text-center mb-4">Pátios Disponíveis</h2>
                <div className="mb-4 d-flex justify-content-between">
                    <input
                        type="text"
                        placeholder="Buscar Pátio por ID ou Nome"
                        value={searchTerm}
                        onChange={handleSearch}
                        className="form-control me-2"
                    />
                    <button
                        className="btn btn-primary"
                        onClick={() => setShowCreateModal(true)}
                        disabled={filteredPatios.every(patio => vehiclesCount[patio.id] >= 20)} // Desabilita o botão se todos os pátios estiverem cheios
                    >
                        Criar Veículo
                    </button>
                </div>
                <div className="row">
                    {filteredPatios.length > 0 ? (
                        filteredPatios.map((patio) => (
                            <div key={patio.id} className="col-md-4 mb-4">
                                <div className="card shadow-sm">
                                    <div className="card-body">
                                        <h5 className="card-title">{patio.nome}</h5>
                                        <p className="card-text"><strong>ID:</strong> {patio.id}</p>
                                        <p className="card-text"><strong>Veículos Alocados:</strong> {vehiclesCount[patio.id] || 0} /20</p>
                                        <div className="d-flex justify-content-between">
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
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center w-100">Nenhum pátio encontrado.</div>
                    )}
                </div>

                {/* Modal de Criar Veículo */}
                <div className={`modal fade ${showCreateModal ? 'show' : ''}`} style={{ display: showCreateModal ? 'block' : 'none' }}>
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Novo Veículo</h5>
                                <button type="button" className="btn-close" onClick={() => setShowCreateModal(false)}></button>
                            </div>
                            <div className="modal-body">
                                <form onSubmit={handleCreateSubmit}>
                                    <div className="mb-3">
                                        <label className="form-label">Nome do Veículo</label>
                                        <input
                                            type="text"
                                            name="nome"
                                            value={formData.nome}
                                            onChange={handleChange}
                                            className="form-control"
                                            required
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">ID do Pátio</label>
                                        <select
                                            name="id"
                                            value={formData.id}
                                            onChange={handleChange}
                                            className="form-control"
                                            required
                                        >
                                            <option value="">Selecione um pátio</option>
                                            {patios.map(patio => (
                                                <option key={patio.id} value={patio.id}>
                                                    {patio.nome} (Veículos: {vehiclesCount[patio.id] || 0})
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <button type="submit" className="btn btn-primary w-100">Criar Veículo</button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Modal de Editar Pátio */}
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

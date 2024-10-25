import React, { useEffect, useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import './Veiculos.css';

const Veiculo = () => {
    const [veiculos, setVeiculos] = useState([]);
    const [patios, setPatios] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [formData, setFormData] = useState({
        modelo: '',
        nome: '',
        valorDaDiaria: '',
        patioId: ''
    });
    const [isEditing, setIsEditing] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        fetchPatios();
    }, []);

    useEffect(() => {
        if (patios.length > 0) {
            fetchVeiculos();
        }
    }, [patios]);

    const fetchVeiculos = async () => {
        try {
            const response = await axios.get('https://192.168.1.44:7190/api/Veiculos');
            setVeiculos(response.data);
        } catch (err) {
            setError(`Erro: ${err.message} | ${err.response ? err.response.data : ''}`);
        } finally {
            setLoading(false);
        }
    };

    const fetchPatios = async () => {
        try {
            const response = await axios.get('https://192.168.1.44:7190/api/Patios');
            setPatios(response.data);
        } catch (err) {
            setError(`Erro ao buscar PATIO Ids: ${err.message} | ${err.response ? err.response.data : ''}`);
        }
    };

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    const filteredVeiculos = veiculos.filter(veiculo => {
        return (
            veiculo.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
            veiculo.id.toString().includes(searchTerm)
        );
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handlePostSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                modelo: formData.modelo,
                nome: formData.nome,
                valorDaDiaria: parseFloat(formData.valorDaDiaria), // Converte para número
                patioId: formData.patioId
            };
            await axios.post('https://192.168.1.44:7190/api/Veiculos', payload);
            fetchVeiculos();
            resetFormData();
            setShowModal(false);
        } catch (err) {
            setError(`Erro: ${err.message} | ${err.response ? err.response.data : ''}`);
        }
    };

    const handleEdit = (veiculo) => {
        setFormData({
            modelo: veiculo.modelo,
            nome: veiculo.nome,
            valorDaDiaria: veiculo.valorDaDiaria.toString(), // Mantém como string para o input
            patioId: veiculo.patioId
        });
        setEditingId(veiculo.id);
        setIsEditing(true);
        setShowModal(true);
    };

    const handleUpdateSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                id: editingId, // Certifique-se de que o ID está incluído
                modelo: formData.modelo,
                nome: formData.nome,
                valorDaDiaria: parseFloat(formData.valorDaDiaria), // Converte para número
                patioId: formData.patioId
            };
            await axios.put(`https://192.168.1.44:7190/api/Veiculos/${editingId}`, payload);
            fetchVeiculos();
            resetFormData();
            setShowModal(false);
            setIsEditing(false);
        } catch (err) {
            setError(`Erro: ${err.message} | ${err.response ? err.response.data : ''}`);
        }
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`https://192.168.1.44:7190/api/Veiculos/${id}`);
            fetchVeiculos();
        } catch (err) {
            setError(`Erro: ${err.message} | ${err.response ? err.response.data : ''}`);
        }
    };

    const resetFormData = () => {
        setFormData({
            modelo: '',
            nome: '',
            valorDaDiaria: '',
            patioId: ''
        });
        setEditingId(null);
    };

    if (loading) return <div>Carregando...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div className="min-h-screen bg-gray-100">
            <div className="container mx-auto p-8 flex flex-col">
                <h2 className="text-2xl font-semibold mb-6">Veículos Disponíveis</h2>
                <div className="mb-4">
                    <input
                        type="text"
                        placeholder="Buscar Veículo por Nome ou ID"
                        value={searchTerm}
                        onChange={handleSearch}
                        className="p-2 border rounded mr-4"
                    />
                    <button
                        onClick={() => { resetFormData(); setShowModal(true); }}
                        className="mr-4 btn btn-primary"
                    >
                        Criar Veículo
                    </button>
                </div>
                <div className="flex flex-wrap gap-4">
                    {filteredVeiculos.length > 0 ? (
                        filteredVeiculos.map((veiculo) => (
                            <div key={veiculo.id} className="rounded-lg p-4 bg-white shadow-sm flex flex-col">
                                <h3 className="text-lg font-semibold mb-4">{veiculo.nome}</h3>
                                <div className="text-sm">ID: {veiculo.id}</div>
                                <div className="grid grid-cols-1 gap-4 text-center flex-grow">
                                    <div>
                                        <div className="font-bold text-xl">{veiculo.modelo}</div>
                                        <div className="text-sm">Modelo</div>
                                    </div>
                                    <div>
                                        <div className="font-bold text-xl">{veiculo.valorDaDiaria}</div>
                                        <div className="text-sm">Valor da Diária</div>
                                    </div>
                                </div>
                                <div className="flex justify-between mt-4">
                                    <button
                                        onClick={() => handleEdit(veiculo)}
                                        className="btn btn-warning"
                                    >
                                        Editar
                                    </button>
                                    <button
                                        onClick={() => handleDelete(veiculo.id)}
                                        className="btn btn-danger"
                                    >
                                        Deletar
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center w-full">Nenhum veículo encontrado.</div>
                    )}
                </div>

                {/* Modal de Criar e Editar Veículo */}
                <div className={`modal fade ${showModal ? 'show' : ''}`} style={{ display: showModal ? 'block' : 'none' }}>
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="createModalLabel">{isEditing ? 'Editar Veículo' : 'Novo Veículo'}</h5>
                                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
                            </div>
                            <div className="modal-body">
                                <form onSubmit={isEditing ? handleUpdateSubmit : handlePostSubmit}>
                                    <div className="mb-3">
                                        <label className="form-label">Modelo</label>
                                        <input
                                            type="text"
                                            name="modelo"
                                            value={formData.modelo}
                                            onChange={handleChange}
                                            className="form-control"
                                            required
                                        />
                                    </div>
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
                                    <div className="mb-3">
                                        <label className="form-label">Valor da Diária</label>
                                        <input
                                            type="number"
                                            name="valorDaDiaria"
                                            value={formData.valorDaDiaria}
                                            onChange={handleChange}
                                            className="form-control"
                                            required
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Pátio</label>
                                        <select
                                            name="patioId"
                                            value={formData.patioId}
                                            onChange={handleChange}
                                            className="form-select"
                                            required
                                        >
                                            <option value="">Selecione um Pátio</option>
                                            {patios.map((patio) => (
                                                <option key={patio.id} value={patio.id}>
                                                    {patio.id} - {patio.nome}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <button type="submit" className="btn btn-primary">{isEditing ? 'Atualizar Veículo' : 'Criar Veículo'}</button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Veiculo;

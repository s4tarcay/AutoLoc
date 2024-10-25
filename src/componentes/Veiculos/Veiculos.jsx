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
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const patiosResponse = await axios.get('https://192.168.1.44:7190/api/Patios');
            setPatios(patiosResponse.data);
            const veiculosResponse = await axios.get('https://192.168.1.44:7190/api/Veiculos');
            setVeiculos(veiculosResponse.data);
        } catch (err) {
            setError(`Erro: ${err.message} | ${err.response ? err.response.data : ''}`);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    const filteredVeiculos = veiculos.filter(veiculo =>
        veiculo.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        veiculo.id.toString().includes(searchTerm)
    );

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const payload = {
            modelo: formData.modelo,
            nome: formData.nome,
            valorDaDiaria: parseFloat(formData.valorDaDiaria),
            patioId: formData.patioId
        };

        try {
            if (isEditing) {
                await axios.put(`https://192.168.1.44:7190/api/Veiculos/${editingId}`, payload);
            } else {
                await axios.post('https://192.168.1.44:7190/api/Veiculos', payload);
            }
            resetFormData();
            setShowModal(false);
            fetchData(); // Atualiza a lista de veículos após criar ou editar
        } catch (err) {
            setError(`Erro: ${err.message} | ${err.response ? err.response.data : ''}`);
        }
    };

    const handleEdit = (veiculo) => {
        setFormData({
            modelo: veiculo.modelo,
            nome: veiculo.nome,
            valorDaDiaria: veiculo.valorDaDiaria.toString(),
            patioId: veiculo.patioId
        });
        setEditingId(veiculo.id);
        setIsEditing(true);
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`https://192.168.1.44:7190/api/Veiculos/${id}`);
            fetchData(); // Atualiza a lista de veículos após deletar
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
        setIsEditing(false);
    };

    if (loading) return <div className="text-center">Carregando...</div>;
    if (error) return <div className="text-danger text-center">{error}</div>;

    return (
        <div className="min-h-screen bg-light">
            <div className="container p-5">
                <h2 className="text-center mb-4">Veículos Disponíveis</h2>

                <div className="mb-4 d-flex justify-content-between">
                    <input
                        type="text"
                        placeholder="Buscar Veículo por Nome ou ID"
                        value={searchTerm}
                        onChange={handleSearch}
                        className="form-control me-2"
                    />
                    <button
                        onClick={() => { resetFormData(); setShowModal(true); }}
                        className="btn btn-primary"
                    >
                        Criar Veículo
                    </button>
                </div>

                <div className="row">
                    {filteredVeiculos.length > 0 ? (
                        filteredVeiculos.map((veiculo) => {
                            // Encontrar o pátio correspondente pelo ID
                            const patio = patios.find(p => p.id === veiculo.patioId);
                            return (
                                <div key={veiculo.id} className="col-md-4 mb-4">
                                    <div className="card shadow-sm">
                                        <div className="card-body">
                                            <h5 className="card-title">{veiculo.nome}</h5>
                                            <p className="card-text"><strong>ID:</strong> {veiculo.id}</p>
                                            <p className="card-text"><strong>Modelo:</strong> {veiculo.modelo}</p>
                                            <p className="card-text"><strong>Valor da Diária:</strong> R$ {veiculo.valorDaDiaria.toFixed(2)}</p>
                                            <p className="card-text"><strong>Pátio:</strong> {patio ? patio.nome : 'Desconhecido'}</p>
                                            <div className="d-flex justify-content-between">
                                                <button onClick={() => handleEdit(veiculo)} className="btn btn-warning">
                                                    Editar
                                                </button>
                                                <button onClick={() => handleDelete(veiculo.id)} className="btn btn-danger">
                                                    Deletar
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <div className="text-center w-100">Nenhum veículo encontrado.</div>
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
                                <form onSubmit={handleSubmit}>
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
                                                    {patio.nome}
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

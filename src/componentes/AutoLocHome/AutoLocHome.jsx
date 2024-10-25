import React, { useEffect, useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import './AutoLocHome.css';
import { v4 as uuidv4 } from 'uuid';

const AutoLocHome = () => {
    const [lots, setLots] = useState([]);
    const [clientes, setClientes] = useState([]);
    const [veiculos, setVeiculos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [formData, setFormData] = useState({
        id: '',
        diasLocados: '',
        valorLocacao: '',
        clienteId: '',
        veiculoId: ''
    });
    const [searchTerm, setSearchTerm] = useState('');
    const [showEditModal, setShowEditModal] = useState(false);

    useEffect(() => {
        fetchLots();
        fetchClientes();
        fetchVeiculos();
    }, []);

    const fetchLots = async () => {
        try {
            const response = await axios.get('https://192.168.1.44:7190/api/Locacaos');
            setLots(response.data);
        } catch (err) {
            setError(`Erro: ${err.message} | ${err.response ? err.response.data : ''}`);
        } finally {
            setLoading(false);
        }
    };

    const fetchClientes = async () => {
        try {
            const response = await axios.get('https://192.168.1.44:7190/api/Clientes');
            setClientes(response.data);
        } catch (err) {
            setError(`Erro ao buscar clientes: ${err.message} | ${err.response ? err.response.data : ''}`);
        }
    };

    const fetchVeiculos = async () => {
        try {
            const response = await axios.get('https://192.168.1.44:7190/api/Veiculos');
            setVeiculos(response.data);
        } catch (err) {
            setError(`Erro ao buscar veículos: ${err.message} | ${err.response ? err.response.data : ''}`);
        }
    };

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    const filteredLots = lots.filter(lot => {
        const clienteNome = clientes.find(cliente => cliente.id === lot.clienteId)?.nome.toLowerCase() || '';
        const veiculoModelo = veiculos.find(veiculo => veiculo.id === lot.veiculoId)?.modelo.toLowerCase() || '';
        return (
            lot.id.toString().includes(searchTerm) ||
            clienteNome.includes(searchTerm.toLowerCase()) ||
            veiculoModelo.includes(searchTerm.toLowerCase())
        );
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleCreateSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                id: uuidv4(),
                diasLocados: Number(formData.diasLocados),
                valorLocacao: Number(formData.valorLocacao),
                clienteId: formData.clienteId,
                veiculoId: formData.veiculoId
            };
            await axios.post('https://192.168.1.44:7190/api/Locacaos', payload);
            fetchLots();
            resetFormData();
        } catch (err) {
            setError(`Erro: ${err.message} | ${err.response ? err.response.data : ''}`);
        }
    };

    const handleEdit = (lot) => {
        setFormData({
            id: lot.id,
            diasLocados: lot.diasLocados,
            valorLocacao: lot.valorLocacao,
            clienteId: lot.clienteId,
            veiculoId: lot.veiculoId
        });
        setShowEditModal(true);
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                ...formData,
                diasLocados: Number(formData.diasLocados),
                valorLocacao: Number(formData.valorLocacao)
            };
            await axios.put(`https://192.168.1.44:7190/api/Locacaos/${formData.id}`, payload);
            fetchLots();
            setShowEditModal(false);
            resetFormData();
        } catch (err) {
            setError(`Erro: ${err.message} | ${err.response ? err.response.data : ''}`);
        }
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`https://192.168.1.44:7190/api/Locacaos/${id}`);
            fetchLots();
        } catch (err) {
            setError(`Erro: ${err.message} | ${err.response ? err.response.data : ''}`);
        }
    };

    const resetFormData = () => {
        setFormData({
            id: '',
            diasLocados: '',
            valorLocacao: '',
            clienteId: '',
            veiculoId: ''
        });
    };

    const calculateTotal = (diasLocados, valorLocacao) => {
        return diasLocados * valorLocacao;
    };

    if (loading) return <div>Carregando...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div className="min-h-screen bg-gray-100">
            <div className="container mx-auto p-8 flex flex-col">
                <h2 className="text-2xl font-semibold mb-6">Locações Disponíveis</h2>
                <div className="mb-4">
                    <input
                        type="text"
                        placeholder="Buscar Locação por ID, Cliente ou Veículo"
                        value={searchTerm}
                        onChange={handleSearch}
                        className="p-2 border rounded mr-4"
                    />
                    <button
                        className="mr-4 btn btn-primary"
                        data-bs-toggle="modal"
                        data-bs-target="#createModal"
                    >
                        Criar Locação
                    </button>
                </div>
                <div className="flex flex-wrap gap-4">
                    {filteredLots.length > 0 ? (
                        filteredLots.map((lot) => (
                            <div key={lot.id} className="rounded-lg p-4 bg-white shadow-sm flex flex-col">
                                <h3 className="text-lg font-semibold mb-4">ID: {lot.id}</h3>
                                <div className="text-sm">Cliente: {clientes.find(cliente => cliente.id === lot.clienteId)?.nome || 'Desconhecido'}</div>
                                <div className="text-sm">Veículo: {veiculos.find(veiculo => veiculo.id === lot.veiculoId)?.modelo || 'Desconhecido'}</div>
                                <div className="text-sm">Dias Locados: {lot.diasLocados}</div>
                                <div className="text-sm">Valor da Locação: {lot.valorLocacao}</div>
                                <div className="text-sm font-bold">Total: {calculateTotal(lot.diasLocados, lot.valorLocacao).toFixed(2)}</div>
                                <div className="flex justify-between mt-4">
                                    <button
                                        onClick={() => handleEdit(lot)}
                                        className="btn btn-warning"
                                    >
                                        Editar
                                    </button>
                                    <button
                                        onClick={() => handleDelete(lot.id)}
                                        className="btn btn-danger"
                                    >
                                        Deletar
                                    </button>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="text-center w-full">Nenhuma locação encontrada.</div>
                    )}
                </div>

                {/* Modal de Criar Locação */}
                <div className="modal fade" id="createModal" tabIndex="-1" aria-labelledby="createModalLabel" aria-hidden="true">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="createModalLabel">Nova Locação</h5>
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div className="modal-body">
                                <form onSubmit={handleCreateSubmit}>
                                    <div className="mb-3">
                                        <label className="form-label">Dias Locados</label>
                                        <input
                                            type="number"
                                            name="diasLocados"
                                            value={formData.diasLocados}
                                            onChange={handleChange}
                                            className="form-control"
                                            required
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Valor da Locação</label>
                                        <input
                                            type="number"
                                            name="valorLocacao"
                                            value={formData.valorLocacao}
                                            onChange={handleChange}
                                            className="form-control"
                                            required
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Cliente</label>
                                        <select
                                            name="clienteId"
                                            value={formData.clienteId}
                                            onChange={handleChange}
                                            className="form-select"
                                            required
                                        >
                                            <option value="">Selecione um Cliente</option>
                                            {clientes.map(cliente => (
                                                <option key={cliente.id} value={cliente.id}>
                                                    {cliente.nome}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Veículo</label>
                                        <select
                                            name="veiculoId"
                                            value={formData.veiculoId}
                                            onChange={handleChange}
                                            className="form-select"
                                            required
                                        >
                                            <option value="">Selecione um Veículo</option>
                                            {veiculos.map(veiculo => (
                                                <option key={veiculo.id} value={veiculo.id}>
                                                    {veiculo.modelo}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <button type="submit" className="btn btn-primary w-100">
                                        Criar Locação
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Modal de Editar Locação */}
                <div className={`modal fade ${showEditModal ? 'show' : ''}`} style={{ display: showEditModal ? 'block' : 'none' }}>
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Editar Locação</h5>
                                <button type="button" className="btn-close" onClick={() => setShowEditModal(false)}></button>
                            </div>
                            <div className="modal-body">
                                <form onSubmit={handleEditSubmit}>
                                    <div className="mb-3">
                                        <label className="form-label">Dias Locados</label>
                                        <input
                                            type="number"
                                            name="diasLocados"
                                            value={formData.diasLocados}
                                            onChange={handleChange}
                                            className="form-control"
                                            required
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Valor da Locação</label>
                                        <input
                                            type="number"
                                            name="valorLocacao"
                                            value={formData.valorLocacao}
                                            onChange={handleChange}
                                            className="form-control"
                                            required
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Cliente</label>
                                        <select
                                            name="clienteId"
                                            value={formData.clienteId}
                                            onChange={handleChange}
                                            className="form-select"
                                            required
                                        >
                                            {clientes.map(cliente => (
                                                <option key={cliente.id} value={cliente.id}>
                                                    {cliente.nome}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Veículo</label>
                                        <select
                                            name="veiculoId"
                                            value={formData.veiculoId}
                                            onChange={handleChange}
                                            className="form-select"
                                            required
                                        >
                                            {veiculos.map(veiculo => (
                                                <option key={veiculo.id} value={veiculo.id}>
                                                    {veiculo.modelo}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <button type="submit" className="btn btn-warning w-100">
                                        Atualizar Locação
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AutoLocHome;

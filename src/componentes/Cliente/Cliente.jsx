import React, { useEffect, useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { v4 as uuidv4 } from 'uuid';

const Cliente = () => {
    const [clientes, setClientes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [formData, setFormData] = useState({
        id: '',
        nome: '',
        cpf: '',
        telefone: '',
        email: ''
    });
    const [searchTerm, setSearchTerm] = useState('');
    const [showEditModal, setShowEditModal] = useState(false);
    const [showCreateModal, setShowCreateModal] = useState(false);

    useEffect(() => {
        fetchClientes();
    }, []);

    const fetchClientes = async () => {
        try {
            const response = await axios.get('https://192.168.1.44:7190/api/Clientes');
            setClientes(response.data);
        } catch (err) {
            setError(`Erro ao buscar clientes: ${err.message} | ${err.response ? err.response.data : ''}`);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        setSearchTerm(e.target.value);
    };

    const filteredClientes = clientes.filter(cliente =>
        cliente.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cliente.cpf.includes(searchTerm)
    );

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleCreateSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                id: uuidv4(),
                nome: formData.nome,
                cpf: formData.cpf,
                telefone: formData.telefone,
                email: formData.email || null
            };
            await axios.post('https://192.168.1.44:7190/api/Clientes', payload);
            fetchClientes();
            resetFormData();
            setShowCreateModal(false);
        } catch (err) {
            setError(`Erro: ${err.message} | ${err.response ? err.response.data : ''}`);
        }
    };

    const handleEdit = (cliente) => {
        setFormData(cliente);
        setShowEditModal(true);
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`https://192.168.1.44:7190/api/Clientes/${formData.id}`, formData);
            fetchClientes();
            setShowEditModal(false);
            resetFormData();
        } catch (err) {
            setError(`Erro: ${err.message} | ${err.response ? err.response.data : ''}`);
        }
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`https://192.168.1.44:7190/api/Clientes/${id}`);
            fetchClientes();
        } catch (err) {
            setError(`Erro: ${err.message} | ${err.response ? err.response.data : ''}`);
        }
    };

    const resetFormData = () => {
        setFormData({
            id: '',
            nome: '',
            cpf: '',
            telefone: '',
            email: ''
        });
    };

    if (loading) return <div className="text-center">Carregando...</div>;
    if (error) return <div className="text-danger text-center">{error}</div>;

    return (
        <div className="min-h-screen bg-light">
            <div className="container p-5">
                <h2 className="text-center mb-4">Clientes Disponíveis</h2>
                <div className="mb-4 d-flex justify-content-between">
                    <input
                        type="text"
                        placeholder="Buscar Cliente por Nome ou CPF"
                        value={searchTerm}
                        onChange={handleSearch}
                        className="form-control me-2"
                    />
                    <button
                        className="btn btn-primary"
                        onClick={() => setShowCreateModal(true)}
                    >
                        Criar Cliente
                    </button>
                </div>
                <div className="row">
                    {filteredClientes.length > 0 ? (
                        filteredClientes.map((cliente) => (
                            <div key={cliente.id} className="col-md-4 mb-4">
                                <div className="card shadow-sm">
                                    <div className="card-body">
                                        <h5 className="card-title">{cliente.nome}</h5>
                                        <p className="card-text"><strong>CPF:</strong> {cliente.cpf}</p>
                                        <p className="card-text"><strong>Telefone:</strong> {cliente.telefone}</p>
                                        <p className="card-text"><strong>Email:</strong> {cliente.email || 'N/A'}</p>
                                        <div className="d-flex justify-content-between">
                                            <button
                                                onClick={() => handleEdit(cliente)}
                                                className="btn btn-warning"
                                            >
                                                Editar
                                            </button>
                                            <button
                                                onClick={() => handleDelete(cliente.id)}
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
                        <div className="text-center w-100">Nenhum cliente encontrado.</div>
                    )}
                </div>

                {/* Modal de Criar Cliente */}
                <div className={`modal fade ${showCreateModal ? 'show' : ''}`} style={{ display: showCreateModal ? 'block' : 'none' }}>
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Novo Cliente</h5>
                                <button type="button" className="btn-close" onClick={() => setShowCreateModal(false)}></button>
                            </div>
                            <div className="modal-body">
                                <form onSubmit={handleCreateSubmit}>
                                    {['nome', 'cpf', 'telefone', 'email'].map((field, index) => (
                                        <div className="mb-3" key={index}>
                                            <label className="form-label">{field.charAt(0).toUpperCase() + field.slice(1)}</label>
                                            <input
                                                type={field === 'email' ? 'email' : 'text'}
                                                name={field}
                                                value={formData[field]}
                                                onChange={handleChange}
                                                className="form-control"
                                                required
                                                pattern={field === 'cpf' ? "^\d{11}$" : field === 'telefone' ? "^\d{10,11}$" : undefined}
                                            />
                                            {field !== 'email' && <small className="form-text text-muted">Insira {field === 'cpf' ? '11' : '10 ou 11'} dígitos numéricos.</small>}
                                        </div>
                                    ))}
                                    <button type="submit" className="btn btn-primary w-100">Criar Cliente</button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Modal de Editar Cliente */}
                <div className={`modal fade ${showEditModal ? 'show' : ''}`} style={{ display: showEditModal ? 'block' : 'none' }}>
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Editar Cliente</h5>
                                <button type="button" className="btn-close" onClick={() => setShowEditModal(false)}></button>
                            </div>
                            <div className="modal-body">
                                <form onSubmit={handleEditSubmit}>
                                    {['nome', 'cpf', 'telefone', 'email'].map((field, index) => (
                                        <div className="mb-3" key={index}>
                                            <label className="form-label">{field.charAt(0).toUpperCase() + field.slice(1)}</label>
                                            <input
                                                type={field === 'email' ? 'email' : 'text'}
                                                name={field}
                                                value={formData[field]}
                                                onChange={handleChange}
                                                className="form-control"
                                                required
                                                pattern={field === 'cpf' ? "^\d{11}$" : field === 'telefone' ? "^\d{10,11}$" : undefined}
                                            />
                                            {field !== 'email' && <small className="form-text text-muted">Insira {field === 'cpf' ? '11' : '10 ou 11'} dígitos numéricos.</small>}
                                        </div>
                                    ))}
                                    <button type="submit" className="btn btn-warning w-100">Atualizar Cliente</button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cliente;

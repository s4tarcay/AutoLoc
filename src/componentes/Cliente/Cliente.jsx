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
        } catch (err) {
            setError(`Erro: ${err.message} | ${err.response ? err.response.data : ''}`);
        }
    };

    const handleEdit = (cliente) => {
        setFormData({
            id: cliente.id,
            nome: cliente.nome,
            cpf: cliente.cpf,
            telefone: cliente.telefone,
            email: cliente.email || ''
        });
        setShowEditModal(true);
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = {
                id: formData.id, // Passando o ID do cliente
                nome: formData.nome,
                cpf: formData.cpf,
                telefone: formData.telefone,
                email: formData.email || null
            };
            await axios.put(`https://192.168.1.44:7190/api/Clientes/${formData.id}`, payload);
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

    if (loading) return <div>Carregando...</div>;
    if (error) return <div>{error}</div>;

    return (
        <div className="min-h-screen bg-gray-100">
            <div className="container mx-auto p-8 flex flex-col">
                <h2 className="text-2xl font-semibold mb-6">Clientes Disponíveis</h2>
                <div className="mb-4">
                    <input
                        type="text"
                        placeholder="Buscar Cliente por Nome ou CPF"
                        value={searchTerm}
                        onChange={handleSearch}
                        className="p-2 border rounded mr-4"
                    />
                    <button
                        className="mr-4 btn btn-primary"
                        data-bs-toggle="modal"
                        data-bs-target="#createModal"
                    >
                        Criar Cliente
                    </button>
                </div>
                <div className="flex flex-wrap gap-4">
                    {filteredClientes.length > 0 ? (
                        filteredClientes.map((cliente) => (
                            <div key={cliente.id} className="rounded-lg p-4 bg-white shadow-sm flex flex-col">
                                <h3 className="text-lg font-semibold mb-4">{cliente.nome}</h3>
                                <div className="text-sm">CPF: {cliente.cpf}</div>
                                <div className="text-sm">Telefone: {cliente.telefone}</div>
                                <div className="text-sm">Email: {cliente.email || 'N/A'}</div>
                                <div className="flex justify-between mt-4">
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
                        ))
                    ) : (
                        <div className="text-center w-full">Nenhum cliente encontrado.</div>
                    )}
                </div>

                {/* Modal de Criar Cliente */}
                <div className="modal fade" id="createModal" tabIndex="-1" aria-labelledby="createModalLabel" aria-hidden="true">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="createModalLabel">Novo Cliente</h5>
                                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
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
                                            minLength={1} // Validação de minLength
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">CPF</label>
                                        <input
                                            type="text"
                                            name="cpf"
                                            value={formData.cpf}
                                            onChange={handleChange}
                                            className="form-control"
                                            required
                                            pattern="^\d{11}$"
                                            minLength={11} // Validação de minLength
                                        />
                                        <small className="form-text text-muted">Insira 11 dígitos numéricos.</small>
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Telefone</label>
                                        <input
                                            type="text"
                                            name="telefone"
                                            value={formData.telefone}
                                            onChange={handleChange}
                                            className="form-control"
                                            required
                                            pattern="^\d{10,11}$"
                                            minLength={10} // Validação de minLength
                                        />
                                        <small className="form-text text-muted">Insira 10 ou 11 dígitos numéricos.</small>
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Email</label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            className="form-control"
                                            nullable={true} // Permitir campo de email nulo
                                        />
                                    </div>
                                    <button type="submit" className="btn btn-primary w-100">
                                        Criar Cliente
                                    </button>
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
                                    <div className="mb-3">
                                        <label className="form-label">Nome</label>
                                        <input
                                            type="text"
                                            name="nome"
                                            value={formData.nome}
                                            onChange={handleChange}
                                            className="form-control"
                                            required
                                            minLength={1} // Validação de minLength
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">CPF</label>
                                        <input
                                            type="text"
                                            name="cpf"
                                            value={formData.cpf}
                                            onChange={handleChange}
                                            className="form-control"
                                            required
                                            pattern="^\d{11}$"
                                            minLength={11} // Validação de minLength
                                        />
                                        <small className="form-text text-muted">Insira 11 dígitos numéricos.</small>
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Telefone</label>
                                        <input
                                            type="text"
                                            name="telefone"
                                            value={formData.telefone}
                                            onChange={handleChange}
                                            className="form-control"
                                            required
                                            pattern="^\d{10,11}$"
                                            minLength={10} // Validação de minLength
                                        />
                                        <small className="form-text text-muted">Insira 10 ou 11 dígitos numéricos.</small>
                                    </div>
                                    <div className="mb-3">
                                        <label className="form-label">Email</label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            className="form-control"
                                            nullable={true} // Permitir campo de email nulo
                                        />
                                    </div>
                                    <button type="submit" className="btn btn-warning w-100">
                                        Atualizar Cliente
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

export default Cliente;

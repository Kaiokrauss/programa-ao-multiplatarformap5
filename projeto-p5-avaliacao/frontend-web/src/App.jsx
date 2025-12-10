import React, { useState, useEffect } from 'react';

const API_URL = 'http://localhost:3001/api';

export default function App() {
  const [clientes, setClientes] = useState([]);
  const [form, setForm] = useState({
    id: '', nome: '', telefone: '', email: '', endereco: '', cidade: '', estado: ''
  });
  const [editando, setEditando] = useState(false);

  useEffect(() => { carregarClientes(); }, []);

  const carregarClientes = async () => {
    try {
      const res = await fetch(`${API_URL}/consultartodos`);
      const data = await res.json();
      setClientes(data);
    } catch (error) {
      alert('Erro ao carregar clientes');
    }
  };

  const handleSubmit = async () => {
    try {
      const url = editando ? `${API_URL}/alterar` : `${API_URL}/inserir`;
      const method = editando ? 'PUT' : 'POST';
      
      await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      
      alert(editando ? 'Cliente alterado!' : 'Cliente cadastrado!');
      limparForm();
      carregarClientes();
    } catch (error) {
      alert('Erro ao salvar');
    }
  };

  const excluir = async (id) => {
    if (window.confirm('Excluir cliente?')) {
      try {
        await fetch(`${API_URL}/excluir/${id}`, { method: 'DELETE' });
        carregarClientes();
      } catch (error) {
        alert('Erro ao excluir');
      }
    }
  };

  const editar = (cliente) => {
    setForm(cliente);
    setEditando(true);
  };

  const limparForm = () => {
    setForm({ id: '', nome: '', telefone: '', email: '', endereco: '', cidade: '', estado: '' });
    setEditando(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-indigo-900 mb-8 text-center">
          Sistema de Gestão de Clientes
        </h1>

        <div className="bg-white rounded-lg shadow-xl p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-4">
            {editando ? 'Editar Cliente' : 'Novo Cliente'}
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <input type="text" placeholder="Nome *" value={form.nome}
              onChange={(e) => setForm({...form, nome: e.target.value})}
              className="p-3 border rounded-lg" />
            <input type="tel" placeholder="Telefone" value={form.telefone}
              onChange={(e) => setForm({...form, telefone: e.target.value})}
              className="p-3 border rounded-lg" />
            <input type="email" placeholder="Email *" value={form.email}
              onChange={(e) => setForm({...form, email: e.target.value})}
              className="p-3 border rounded-lg" />
            <input type="text" placeholder="Endereço" value={form.endereco}
              onChange={(e) => setForm({...form, endereco: e.target.value})}
              className="p-3 border rounded-lg" />
            <input type="text" placeholder="Cidade" value={form.cidade}
              onChange={(e) => setForm({...form, cidade: e.target.value})}
              className="p-3 border rounded-lg" />
            <input type="text" placeholder="Estado" value={form.estado}
              onChange={(e) => setForm({...form, estado: e.target.value})}
              className="p-3 border rounded-lg" />
            <button onClick={handleSubmit}
              className="col-span-2 bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700">
              {editando ? 'Atualizar' : 'Cadastrar'}
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-xl p-6">
          <h2 className="text-2xl font-semibold mb-4">Lista de Clientes</h2>
          <table className="w-full">
            <thead className="bg-indigo-600 text-white">
              <tr>
                <th className="p-3 text-left">ID</th>
                <th className="p-3 text-left">Nome</th>
                <th className="p-3 text-left">Email</th>
                <th className="p-3 text-left">Cidade</th>
                <th className="p-3 text-center">Ações</th>
              </tr>
            </thead>
            <tbody>
              {clientes.map((c, i) => (
                <tr key={c.id} className={i % 2 === 0 ? 'bg-gray-50' : ''}>
                  <td className="p-3">{c.id}</td>
                  <td className="p-3">{c.nome}</td>
                  <td className="p-3">{c.email}</td>
                  <td className="p-3">{c.cidade}</td>
                  <td className="p-3 text-center">
                    <button onClick={() => editar(c)}
                      className="bg-yellow-500 text-white px-3 py-1 rounded mr-2">
                      Editar
                    </button>
                    <button onClick={() => excluir(c.id)}
                      className="bg-red-500 text-white px-3 py-1 rounded">
                      Excluir
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

import { useEffect, useState } from 'react';
import {
  consultarTodos,
  consultarPorId,
  inserirCliente,
  alterarCliente,
  excluirCliente
} from './api';

const CLIENTE_VAZIO = {
  id: null,
  nome: '',
  telefone: '',
  email: '',
  endereco: '',
  cidade: '',
  estado: ''
};

const ESTADOS_BR = [
  'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS',
  'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC',
  'SP', 'SE', 'TO'
];

export default function App() {
  const [clientes, setClientes] = useState([]);
  const [formulario, setFormulario] = useState(CLIENTE_VAZIO);
  const [modoEdicao, setModoEdicao] = useState(false);
  const [busca, setBusca] = useState('');
  const [carregando, setCarregando] = useState(false);
  const [mensagem, setMensagem] = useState(null); // { tipo: 'sucesso' | 'erro', texto }

  async function carregarClientes() {
    setCarregando(true);
    try {
      const dados = await consultarTodos();
      setClientes(dados);
    } catch (erro) {
      exibirMensagem('erro', erro.message);
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    carregarClientes();
  }, []);

  function exibirMensagem(tipo, texto) {
    setMensagem({ tipo, texto });
    setTimeout(() => setMensagem(null), 3500);
  }

  function atualizarCampo(campo, valor) {
    setFormulario((atual) => ({ ...atual, [campo]: valor }));
  }

  function limparFormulario() {
    setFormulario(CLIENTE_VAZIO);
    setModoEdicao(false);
  }

  async function salvarCliente(evento) {
    evento.preventDefault();
    try {
      if (modoEdicao) {
        await alterarCliente(formulario);
        exibirMensagem('sucesso', 'Cliente alterado com sucesso.');
      } else {
        await inserirCliente(formulario);
        exibirMensagem('sucesso', 'Cliente inserido com sucesso.');
      }
      limparFormulario();
      carregarClientes();
    } catch (erro) {
      exibirMensagem('erro', erro.message);
    }
  }

  function editarCliente(cliente) {
    setFormulario(cliente);
    setModoEdicao(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  async function removerCliente(id) {
    if (!window.confirm('Deseja realmente excluir este cliente?')) return;
    try {
      await excluirCliente(id);
      exibirMensagem('sucesso', 'Cliente excluído com sucesso.');
      carregarClientes();
    } catch (erro) {
      exibirMensagem('erro', erro.message);
    }
  }

  async function buscarPorId() {
    if (!busca.trim()) {
      carregarClientes();
      return;
    }
    try {
      const cliente = await consultarPorId(busca.trim());
      setClientes([cliente]);
    } catch (erro) {
      setClientes([]);
      exibirMensagem('erro', erro.message);
    }
  }

  return (
    <div className="pagina">
      <header className="cabecalho">
        <div className="cabecalho-conteudo">
          <span className="marca-indice">01</span>
          <div>
            <h1>Gestão de Clientes</h1>
            <p>Cadastro, consulta, alteração e exclusão de clientes</p>
          </div>
        </div>
      </header>

      <main className="conteudo">
        {mensagem && (
          <div className={`aviso aviso-${mensagem.tipo}`}>{mensagem.texto}</div>
        )}

        <section className="painel formulario-painel">
          <h2>{modoEdicao ? `Editar cliente #${formulario.id}` : 'Novo cliente'}</h2>
          <form onSubmit={salvarCliente} className="formulario">
            <div className="campo">
              <label htmlFor="nome">Nome</label>
              <input
                id="nome"
                type="text"
                value={formulario.nome}
                onChange={(e) => atualizarCampo('nome', e.target.value)}
                required
              />
            </div>

            <div className="campo">
              <label htmlFor="telefone">Telefone</label>
              <input
                id="telefone"
                type="text"
                value={formulario.telefone}
                onChange={(e) => atualizarCampo('telefone', e.target.value)}
                placeholder="(00) 00000-0000"
                required
              />
            </div>

            <div className="campo">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                value={formulario.email}
                onChange={(e) => atualizarCampo('email', e.target.value)}
                required
              />
            </div>

            <div className="campo campo-largo">
              <label htmlFor="endereco">Endereço</label>
              <input
                id="endereco"
                type="text"
                value={formulario.endereco}
                onChange={(e) => atualizarCampo('endereco', e.target.value)}
                required
              />
            </div>

            <div className="campo">
              <label htmlFor="cidade">Cidade</label>
              <input
                id="cidade"
                type="text"
                value={formulario.cidade}
                onChange={(e) => atualizarCampo('cidade', e.target.value)}
                required
              />
            </div>

            <div className="campo">
              <label htmlFor="estado">Estado</label>
              <select
                id="estado"
                value={formulario.estado}
                onChange={(e) => atualizarCampo('estado', e.target.value)}
                required
              >
                <option value="">Selecione</option>
                {ESTADOS_BR.map((uf) => (
                  <option key={uf} value={uf}>{uf}</option>
                ))}
              </select>
            </div>

            <div className="acoes-formulario">
              <button type="submit" className="botao botao-principal">
                {modoEdicao ? 'Salvar alteração' : 'Inserir cliente'}
              </button>
              {modoEdicao && (
                <button type="button" className="botao botao-secundario" onClick={limparFormulario}>
                  Cancelar
                </button>
              )}
            </div>
          </form>
        </section>

        <section className="painel lista-painel">
          <div className="lista-cabecalho">
            <h2>Clientes cadastrados</h2>
            <div className="busca">
              <input
                type="text"
                placeholder="Buscar por Id..."
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && buscarPorId()}
              />
              <button className="botao botao-secundario" onClick={buscarPorId}>Buscar</button>
              <button className="botao botao-secundario" onClick={() => { setBusca(''); carregarClientes(); }}>
                Ver todos
              </button>
            </div>
          </div>

          {carregando ? (
            <p className="estado-vazio">Carregando clientes...</p>
          ) : clientes.length === 0 ? (
            <p className="estado-vazio">Nenhum cliente cadastrado até o momento.</p>
          ) : (
            <div className="tabela-wrapper">
              <table className="tabela">
                <thead>
                  <tr>
                    <th>Id</th>
                    <th>Nome</th>
                    <th>Telefone</th>
                    <th>Email</th>
                    <th>Endereço</th>
                    <th>Cidade</th>
                    <th>UF</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {clientes.map((cliente) => (
                    <tr key={cliente.id}>
                      <td>{cliente.id}</td>
                      <td>{cliente.nome}</td>
                      <td>{cliente.telefone}</td>
                      <td>{cliente.email}</td>
                      <td>{cliente.endereco}</td>
                      <td>{cliente.cidade}</td>
                      <td>{cliente.estado}</td>
                      <td className="acoes-tabela">
                        <button className="link-acao" onClick={() => editarCliente(cliente)}>Editar</button>
                        <button className="link-acao link-acao-perigo" onClick={() => removerCliente(cliente.id)}>
                          Excluir
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

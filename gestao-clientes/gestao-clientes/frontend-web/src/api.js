const API_URL = 'http://localhost:3001';

async function tratarResposta(resposta) {
  const dados = await resposta.json().catch(() => ({}));
  if (!resposta.ok) {
    throw new Error(dados.erro || 'Erro ao comunicar com a API');
  }
  return dados;
}

export async function consultarTodos() {
  const resposta = await fetch(`${API_URL}/api/consultartodos`);
  return tratarResposta(resposta);
}

export async function consultarPorId(id) {
  const resposta = await fetch(`${API_URL}/api/consultar/${id}`);
  return tratarResposta(resposta);
}

export async function inserirCliente(cliente) {
  const resposta = await fetch(`${API_URL}/api/inserir`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(cliente)
  });
  return tratarResposta(resposta);
}

export async function alterarCliente(cliente) {
  const resposta = await fetch(`${API_URL}/api/alterar`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(cliente)
  });
  return tratarResposta(resposta);
}

export async function excluirCliente(id) {
  const resposta = await fetch(`${API_URL}/api/excluir`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id })
  });
  return tratarResposta(resposta);
}

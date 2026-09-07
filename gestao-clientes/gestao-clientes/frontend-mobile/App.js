import { useEffect, useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Alert,
  RefreshControl,
  StatusBar
} from 'react-native';
import {
  consultarTodos,
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

export default function App() {
  const [clientes, setClientes] = useState([]);
  const [formulario, setFormulario] = useState(CLIENTE_VAZIO);
  const [modoEdicao, setModoEdicao] = useState(false);
  const [carregando, setCarregando] = useState(false);

  async function carregarClientes() {
    setCarregando(true);
    try {
      const dados = await consultarTodos();
      setClientes(dados);
    } catch (erro) {
      Alert.alert('Erro', erro.message);
    } finally {
      setCarregando(false);
    }
  }

  useEffect(() => {
    carregarClientes();
  }, []);

  function atualizarCampo(campo, valor) {
    setFormulario((atual) => ({ ...atual, [campo]: valor }));
  }

  function limparFormulario() {
    setFormulario(CLIENTE_VAZIO);
    setModoEdicao(false);
  }

  function validar() {
    const obrigatorios = ['nome', 'telefone', 'email', 'endereco', 'cidade', 'estado'];
    return obrigatorios.every((campo) => formulario[campo] && formulario[campo].trim() !== '');
  }

  async function salvarCliente() {
    if (!validar()) {
      Alert.alert('Atenção', 'Preencha todos os campos antes de salvar.');
      return;
    }
    try {
      if (modoEdicao) {
        await alterarCliente(formulario);
        Alert.alert('Sucesso', 'Cliente alterado com sucesso.');
      } else {
        await inserirCliente(formulario);
        Alert.alert('Sucesso', 'Cliente inserido com sucesso.');
      }
      limparFormulario();
      carregarClientes();
    } catch (erro) {
      Alert.alert('Erro', erro.message);
    }
  }

  function editarCliente(cliente) {
    setFormulario(cliente);
    setModoEdicao(true);
  }

  function confirmarExclusao(cliente) {
    Alert.alert(
      'Excluir cliente',
      `Deseja realmente excluir "${cliente.nome}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            try {
              await excluirCliente(cliente.id);
              carregarClientes();
            } catch (erro) {
              Alert.alert('Erro', erro.message);
            }
          }
        }
      ]
    );
  }

  return (
    <SafeAreaView style={estilos.pagina}>
      <StatusBar barStyle="dark-content" backgroundColor="#f6f4ee" />
      <ScrollView contentContainerStyle={estilos.conteudo}>
        <View style={estilos.cabecalho}>
          <View style={estilos.indice}>
            <Text style={estilos.indiceTexto}>01</Text>
          </View>
          <View>
            <Text style={estilos.titulo}>Gestão de Clientes</Text>
            <Text style={estilos.subtitulo}>Cadastro e consulta de clientes</Text>
          </View>
        </View>

        <View style={estilos.painel}>
          <Text style={estilos.painelTitulo}>
            {modoEdicao ? `Editar cliente #${formulario.id}` : 'Novo cliente'}
          </Text>

          <CampoTexto label="Nome" valor={formulario.nome} aoAlterar={(v) => atualizarCampo('nome', v)} />
          <CampoTexto
            label="Telefone"
            valor={formulario.telefone}
            aoAlterar={(v) => atualizarCampo('telefone', v)}
            teclado="phone-pad"
          />
          <CampoTexto
            label="Email"
            valor={formulario.email}
            aoAlterar={(v) => atualizarCampo('email', v)}
            teclado="email-address"
          />
          <CampoTexto label="Endereço" valor={formulario.endereco} aoAlterar={(v) => atualizarCampo('endereco', v)} />
          <CampoTexto label="Cidade" valor={formulario.cidade} aoAlterar={(v) => atualizarCampo('cidade', v)} />
          <CampoTexto
            label="Estado (UF)"
            valor={formulario.estado}
            aoAlterar={(v) => atualizarCampo('estado', v.toUpperCase())}
            maxLength={2}
          />

          <View style={estilos.acoesFormulario}>
            <TouchableOpacity style={estilos.botaoPrincipal} onPress={salvarCliente}>
              <Text style={estilos.botaoPrincipalTexto}>
                {modoEdicao ? 'Salvar alteração' : 'Inserir cliente'}
              </Text>
            </TouchableOpacity>
            {modoEdicao && (
              <TouchableOpacity style={estilos.botaoSecundario} onPress={limparFormulario}>
                <Text style={estilos.botaoSecundarioTexto}>Cancelar</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        <View style={estilos.painel}>
          <Text style={estilos.painelTitulo}>Clientes cadastrados</Text>

          <FlatList
            data={clientes}
            keyExtractor={(item) => String(item.id)}
            scrollEnabled={false}
            refreshControl={
              <RefreshControl refreshing={carregando} onRefresh={carregarClientes} />
            }
            ListEmptyComponent={
              <Text style={estilos.estadoVazio}>Nenhum cliente cadastrado até o momento.</Text>
            }
            renderItem={({ item }) => (
              <View style={estilos.cartaoCliente}>
                <View style={estilos.cartaoCabecalho}>
                  <Text style={estilos.cartaoNome}>#{item.id} · {item.nome}</Text>
                </View>
                <Text style={estilos.cartaoLinha}>{item.telefone} · {item.email}</Text>
                <Text style={estilos.cartaoLinha}>{item.endereco}</Text>
                <Text style={estilos.cartaoLinha}>{item.cidade} / {item.estado}</Text>
                <View style={estilos.cartaoAcoes}>
                  <TouchableOpacity onPress={() => editarCliente(item)}>
                    <Text style={estilos.linkAcao}>Editar</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => confirmarExclusao(item)}>
                    <Text style={estilos.linkAcaoPerigo}>Excluir</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function CampoTexto({ label, valor, aoAlterar, teclado = 'default', maxLength }) {
  return (
    <View style={estilos.campo}>
      <Text style={estilos.campoLabel}>{label}</Text>
      <TextInput
        style={estilos.campoInput}
        value={valor}
        onChangeText={aoAlterar}
        keyboardType={teclado}
        maxLength={maxLength}
        autoCapitalize={label === 'Email' ? 'none' : 'words'}
      />
    </View>
  );
}

const estilos = StyleSheet.create({
  pagina: {
    flex: 1,
    backgroundColor: '#f6f4ee'
  },
  conteudo: {
    padding: 20,
    paddingBottom: 48
  },
  cabecalho: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 20,
    borderBottomWidth: 2,
    borderBottomColor: '#1b2a2e',
    paddingBottom: 16
  },
  indice: {
    width: 30,
    height: 30,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#2f6f5e',
    alignItems: 'center',
    justifyContent: 'center'
  },
  indiceTexto: {
    color: '#2f6f5e',
    fontWeight: '600'
  },
  titulo: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1b2a2e'
  },
  subtitulo: {
    fontSize: 13,
    color: '#45585c',
    marginTop: 2
  },
  painel: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#d8d2c4',
    padding: 16,
    marginBottom: 20
  },
  painelTitulo: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1b2a2e',
    marginBottom: 14
  },
  campo: {
    marginBottom: 12
  },
  campoLabel: {
    fontSize: 12,
    color: '#45585c',
    marginBottom: 4
  },
  campoInput: {
    borderWidth: 1,
    borderColor: '#d8d2c4',
    backgroundColor: '#f6f4ee',
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 15,
    color: '#1b2a2e'
  },
  acoesFormulario: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 6
  },
  botaoPrincipal: {
    backgroundColor: '#1f4c40',
    paddingVertical: 11,
    paddingHorizontal: 18,
    flex: 1,
    alignItems: 'center'
  },
  botaoPrincipalTexto: {
    color: '#fff',
    fontWeight: '600'
  },
  botaoSecundario: {
    borderWidth: 1,
    borderColor: '#1b2a2e',
    paddingVertical: 11,
    paddingHorizontal: 18,
    alignItems: 'center'
  },
  botaoSecundarioTexto: {
    color: '#1b2a2e',
    fontWeight: '600'
  },
  estadoVazio: {
    fontStyle: 'italic',
    color: '#45585c'
  },
  cartaoCliente: {
    borderWidth: 1,
    borderColor: '#d8d2c4',
    padding: 12,
    marginBottom: 10
  },
  cartaoCabecalho: {
    marginBottom: 4
  },
  cartaoNome: {
    fontWeight: '700',
    color: '#1b2a2e',
    fontSize: 15
  },
  cartaoLinha: {
    color: '#45585c',
    fontSize: 13,
    marginTop: 2
  },
  cartaoAcoes: {
    flexDirection: 'row',
    gap: 20,
    marginTop: 10
  },
  linkAcao: {
    color: '#1f4c40',
    fontWeight: '600',
    textDecorationLine: 'underline'
  },
  linkAcaoPerigo: {
    color: '#a3402f',
    fontWeight: '600',
    textDecorationLine: 'underline'
  }
});

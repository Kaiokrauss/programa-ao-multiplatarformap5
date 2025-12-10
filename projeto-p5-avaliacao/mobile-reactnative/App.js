import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, Alert } from 'react-native';

const API_URL = 'http://192.168.1.100:3001/api'; // ALTERE PARA SEU IP LOCAL

export default function App() {
  const [clientes, setClientes] = useState([]);
  const [form, setForm] = useState({ nome: '', telefone: '', email: '', cidade: '', estado: '' });

  useEffect(() => { carregarClientes(); }, []);

  const carregarClientes = async () => {
    try {
      const res = await fetch(`${API_URL}/consultartodos`);
      const data = await res.json();
      setClientes(data);
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível carregar clientes');
    }
  };

  const cadastrar = async () => {
    if (!form.nome || !form.email) {
      Alert.alert('Atenção', 'Preencha nome e email');
      return;
    }
    try {
      await fetch(`${API_URL}/inserir`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      Alert.alert('Sucesso', 'Cliente cadastrado!');
      setForm({ nome: '', telefone: '', email: '', cidade: '', estado: '' });
      carregarClientes();
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível cadastrar');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Gestão de Clientes</Text>
      
      <TextInput style={styles.input} placeholder="Nome *" value={form.nome}
        onChangeText={(t) => setForm({...form, nome: t})} />
      <TextInput style={styles.input} placeholder="Email *" value={form.email}
        onChangeText={(t) => setForm({...form, email: t})} />
      <TextInput style={styles.input} placeholder="Telefone" value={form.telefone}
        onChangeText={(t) => setForm({...form, telefone: t})} />
      <TextInput style={styles.input} placeholder="Cidade" value={form.cidade}
        onChangeText={(t) => setForm({...form, cidade: t})} />
      
      <TouchableOpacity style={styles.button} onPress={cadastrar}>
        <Text style={styles.buttonText}>Cadastrar Cliente</Text>
      </TouchableOpacity>

      <FlatList
        data={clientes}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>{item.nome}</Text>
            <Text>{item.email}</Text>
            <Text>{item.cidade}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f5f5f5' },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20, textAlign: 'center' },
  input: { backgroundColor: '#fff', padding: 12, marginBottom: 10, borderRadius: 8 },
  button: { backgroundColor: '#4F46E5', padding: 15, borderRadius: 8, marginBottom: 20 },
  buttonText: { color: '#fff', textAlign: 'center', fontWeight: 'bold' },
  card: { backgroundColor: '#fff', padding: 15, marginBottom: 10, borderRadius: 8 }
});

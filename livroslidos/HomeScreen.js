import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, FlatList, Image, StyleSheet, TouchableOpacity } from 'react-native';

export default function App() {
  const [livro, setLivro] = useState('');
  const [filteredResults, setFilteredResults] = useState([]);
  const [statusFilter, setStatusFilter] = useState('Todos');
  const [allResults, setAllResults] = useState([]);

  useEffect(() => {
    setFilteredResults(
      statusFilter === 'Todos'
        ? allResults
        : allResults.filter(item => item.status === statusFilter)
    );
  }, [statusFilter, allResults]);

  const buscarLivros = async () => {
    try {
      const response = await fetch(`https://www.googleapis.com/books/v1/volumes?q=${livro}`);
      const data = await response.json();
      const resultados = data.items.map(item => ({
        id: item.id,
        nome: item.volumeInfo.title,
        autor: item.volumeInfo.authors ? item.volumeInfo.authors.join(', ') : 'Desconhecido',
        editora: item.volumeInfo.publisher || 'Desconhecida',
        ano: item.volumeInfo.publishedDate ? item.volumeInfo.publishedDate.split('-')[0] : 'Desconhecido',
        imagem: item.volumeInfo.imageLinks ? item.volumeInfo.imageLinks.thumbnail : 'https://via.placeholder.com/100x150',
        status: 'Está lendo' // Default status
      }));
      
      setAllResults(prevResults => [...prevResults, ...resultados]);
      setStatusFilter('Todos');
    } catch (error) {
      console.error("Erro ao buscar livros:", error);
    }
  };

  const handleStatusChange = (item, novoStatus) => {
    setAllResults(prevResults =>
      prevResults.map(book =>
        book.id === item.id ? { ...book, status: novoStatus } : book
      )
    );
    setFilteredResults(prevResults =>
      prevResults.map(book =>
        book.id === item.id ? { ...book, status: novoStatus } : book
      ).filter(book => book.status === statusFilter || statusFilter === 'Todos')
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Livros</Text>
      <TextInput
        style={styles.input}
        placeholder="Buscar livro"
        value={livro}
        onChangeText={setLivro}
      />
      <Button title="Buscar e Adicionar" onPress={buscarLivros} color="#007bff" />

      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={[styles.filterButton, statusFilter === 'Todos' && styles.activeFilter]}
          onPress={() => setStatusFilter('Todos')}
        >
          <Text style={[styles.filterButtonText, statusFilter === 'Todos' && styles.activeFilterText]}>Todos</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterButton, statusFilter === 'Está lendo' && styles.activeFilter]}
          onPress={() => setStatusFilter('Está lendo')}
        >
          <Text style={[styles.filterButtonText, statusFilter === 'Está lendo' && styles.activeFilterText]}>Está Lendo</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterButton, statusFilter === 'Já leu' && styles.activeFilter]}
          onPress={() => setStatusFilter('Já leu')}
        >
          <Text style={[styles.filterButtonText, statusFilter === 'Já leu' && styles.activeFilterText]}>Já Leu</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={filteredResults}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Image source={{ uri: item.imagem }} style={styles.image} />
            <View style={styles.itemDetails}>
              <Text style={styles.text}>Nome: {item.nome}</Text>
              <Text style={styles.text}>Autor: {item.autor}</Text>
              <Text style={styles.text}>Editora: {item.editora}</Text>
              <Text style={styles.text}>Ano: {item.ano}</Text>
              <Text style={styles.text}>Status: {item.status}</Text>
            </View>
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[styles.button, item.status === 'Já leu' && styles.buttonDisabled]}
                onPress={() => handleStatusChange(item, 'Já leu')}
                disabled={item.status === 'Já leu'}
              >
                <Text style={styles.buttonText}>Já Leu</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, item.status === 'Está lendo' && styles.buttonDisabled]}
                onPress={() => handleStatusChange(item, 'Está lendo')}
                disabled={item.status === 'Está lendo'}
              >
                <Text style={styles.buttonText}>Está Lendo</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, item.status === 'Todos' && styles.buttonDisabled]}
                onPress={() => handleStatusChange(item, 'Todos')}
                disabled={item.status === 'Todos'}
              >
                <Text style={styles.buttonText}>Todos</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        contentContainerStyle={styles.flatListContent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  filterContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  filterButton: {
    flex: 1,
    alignItems: 'center',
    padding: 10,
    borderRadius: 5,
    marginHorizontal: 5,
    backgroundColor: '#ddd',
  },
  activeFilter: {
    backgroundColor: '#007bff',
  },
  filterButtonText: {
    color: '#333',
    fontSize: 16,
  },
  activeFilterText: {
    color: '#fff',
  },
  item: {
    marginBottom: 20,
    backgroundColor: '#f9f9f9',
    padding: 10,
    borderRadius: 5,
    elevation: 2,
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  image: {
    width: 100,
    height: 150,
    marginRight: 10,
  },
  itemDetails: {
    flex: 1,
  },
  text: {
    fontSize: 16,
    marginBottom: 5,
  },
  buttonContainer: {
    flexDirection: 'row',
    marginTop: 10,
    justifyContent: 'space-between',
    flex: 1,
  },
  button: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  buttonDisabled: {
    backgroundColor: '#ddd',
  },
  buttonText: {
    color: '#fff',
  },
  flatListContent: {
    flexGrow: 1,
  },
});

import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { db } from './firebaseConfig';
import { collection, query, where, onSnapshot } from 'firebase/firestore';

export default function FilteredBooksScreen({ route, navigation }) {
  const { filter } = route.params; // Receber o filtro da navegação
  const [livros, setLivros] = useState([]);

  useEffect(() => {
    const livrosRef = collection(db, 'livros');
    const q = query(livrosRef, where('status', '==', filter));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const livrosData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setLivros(livrosData);
    });

    return () => unsubscribe();
  }, [filter]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Livros {filter}</Text>
      <FlatList
        data={livros}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={styles.text}>Nome: {item.nome}</Text>
            <Text style={styles.text}>Autor: {item.autor}</Text>
            <Text style={styles.text}>Diretor: {item.diretor}</Text>
            <Text style={styles.text}>Ano: {item.ano}</Text>
            <Text style={styles.text}>Status: {item.status}</Text>
          </View>
        )}
        contentContainerStyle={styles.flatListContent}
      />
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.buttonText}>Voltar</Text>
      </TouchableOpacity>
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
  item: {
    marginBottom: 20,
    backgroundColor: '#f9f9f9',
    padding: 10,
    borderRadius: 5,
    elevation: 2,
  },
  text: {
    fontSize: 16,
    marginBottom: 5,
  },
  backButton: {
    marginTop: 20,
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
  },
  flatListContent: {
    flexGrow: 1,
  },
});

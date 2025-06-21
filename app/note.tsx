import React from 'react';
import { View, Text, Alert, StyleSheet, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function NoteScreen() {
  const router = useRouter(); 
  const params = useLocalSearchParams();
  const note = params.note ? JSON.parse(params.note as string) : null;

  if (!note) {
    return (
      <View style={styles.container}>
        <Text style={styles.error}>Note not found</Text>
      </View>
    );
  }

  const handleEdit = () => {
    router.push({
      pathname: '/form',
      params: { note: JSON.stringify(note) },
    });
  };

  const handleDelete = () => {
    Alert.alert(
      "Delete Note",
      "Are you sure you want to delete this note?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            const raw = await AsyncStorage.getItem('notes');
            const notes = raw ? JSON.parse(raw) : [];
            const filtered = notes.filter((n: any) => n.id !== note.id);
            await AsyncStorage.setItem('notes', JSON.stringify(filtered));
            router.push('/');
          },
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>{note.title}</Text>
        <Text style={styles.content}>{note.content}</Text>
        <Text style={styles.date}>{new Date(note.date).toLocaleDateString()}</Text>

        <View
          style={[
            styles.importanceDot,
            {
              backgroundColor:
                note.importance === 'high'
                  ? '#FF3B30'
                  : note.importance === 'medium'
                  ? '#FF9500'
                  : '#34C759',
            },
          ]}
        />

        <View style={styles.actions}>
          <TouchableOpacity style={styles.actionButton} onPress={handleEdit}>
            <Ionicons name="create-outline" size={20} color="#fff" />
            <Text style={styles.buttonText}>Edit</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.actionButton, styles.delete]} onPress={handleDelete}>
            <Ionicons name="trash-outline" size={20} color="#fff" />
            <Text style={styles.buttonText}>Delete</Text>
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity style={styles.backButton} onPress={() => router.push('/')}>
        <Ionicons name="arrow-back" size={20} color="#fff" />
        <Text style={styles.backText}>Back</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1F2A38',
    alignItems: 'center',
    padding: 24,
    justifyContent: 'center',
  },
  error: {
    color: '#fff',
    fontSize: 18,
  },
  card: {
    backgroundColor: '#fff',
    width: '100%',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
    elevation: 5,
    marginBottom: 60,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#222',
    marginBottom: 12,
  },
  content: {
    fontSize: 16,
    color: '#555',
    marginBottom: 12,
  },
  date: {
    fontSize: 13,
    color: '#999',
    marginBottom: 16,
  },
  importanceDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
    marginBottom: 24,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flexDirection: 'row',
    backgroundColor: '#007AFF',
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 10,
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  delete: {
    backgroundColor: '#FF3B30',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 15,
  },
  backButton: {
    position: 'absolute',
    bottom: 30,
    backgroundColor: '#34495E',
    flexDirection: 'row',
    paddingVertical: 12,
    paddingHorizontal: 28,
    borderRadius: 30,
    alignItems: 'center',
    gap: 10,
  },
  backText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

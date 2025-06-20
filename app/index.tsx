import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  TouchableOpacity
} from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Note = {
  id: string;
  title: string;
  content: string;
  date: string;
  importance: 'high' | 'medium' | 'low';
};

export default function Index() {
  const router = useRouter();
  const [notes, setNotes] = useState<Note[]>([]);

  useFocusEffect(
    useCallback(() => {
      const loadNotes = async () => {
        const raw = await AsyncStorage.getItem('notes');
        setNotes(raw ? JSON.parse(raw) : []);
      };
      loadNotes();
    }, [])
  );

  const getImportanceColor = (level: Note['importance']) => {
    switch (level) {
      case 'high': return '#EF4444'; // red
      case 'medium': return '#F59E0B'; // orange
      case 'low': return '#10B981'; // green
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>📓 My Notes</Text>

      <FlatList
        data={notes}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Pressable
            onPress={() =>
              router.push({
                pathname: "/note",
                params: {
                  id: item.id
                },
              })
            }
            style={({ pressed }) => [
              styles.noteCard,
              { opacity: pressed ? 0.8 : 1 },
              { borderLeftColor: getImportanceColor(item.importance) },
            ]}
          >

            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.content}>{item.content}</Text>
            <Text style={styles.date}>
              {new Date(item.date).toLocaleDateString()}
            </Text>
          </Pressable>
        )}
        ListEmptyComponent={
          <Text style={styles.empty}>No notes available yet.</Text>
        }
      />

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => router.push('/form')}
      >
        <Text style={styles.addButtonText}>+ New Note</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#F9FAFB',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#111827',
  },
  noteCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 3,
    borderLeftWidth: 6,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },
  content: {
    fontSize: 14,
    color: '#4B5563',
    marginTop: 4,
  },
  date: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 8,
  },
  empty: {
    textAlign: 'center',
    marginTop: 40,
    fontSize: 16,
    color: '#6B7280',
  },
  addButton: {
    backgroundColor: '#2563EB',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 100,
    position: 'absolute',
    bottom: 20,
    right: 20,
    elevation: 4,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 16,
  },
});

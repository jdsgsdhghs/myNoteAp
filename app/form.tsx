import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker from '@react-native-community/datetimepicker';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useState, useEffect } from 'react';
import {
  Button, Keyboard, Platform, StyleSheet, Text, TextInput,
  TouchableOpacity, TouchableWithoutFeedback, View,
} from 'react-native';

const importanceLevels = [
  { value: 'high',   color: '#F45B69' },
  { value: 'medium', color: '#FFD4CA' },
  { value: 'low',    color: '#7EE4EC' },
];

export default function Form() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [date, setDate] = useState(new Date());
  const [importance, setImportance] = useState('low');
  const [showPicker, setShowPicker] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const { note } = useLocalSearchParams();

  useEffect(() => {
    try {
      if (note) {
        const n = JSON.parse(note as string);
        if (n?.id) {
          setTitle(n.title);
          setContent(n.content);
          setDate(new Date(n.date));
          setImportance(n.importance);
          setEditingId(n.id);
          return;
        }
      }
    } catch (e) {
      console.warn('Invalid note parameters');
    }

    setTitle('');
    setContent('');
    setDate(new Date());
    setImportance('low');
    setEditingId(null);
  }, [note]);

  const handleSubmit = async () => {
    if (!title.trim() || !content.trim()) {
      alert('Please fill in both the title and content.');
      return;
    }

    const noteObj = {
      id: editingId ?? Date.now(),
      title: title.trim(),
      content: content.trim(),
      date: date.toISOString(),
      importance,
    };

    try {
      const raw = await AsyncStorage.getItem('notes');
      const arr = raw ? JSON.parse(raw) : [];

      const updatedNotes = editingId
        ? arr.map((n: any) => (n.id === editingId ? noteObj : n))
        : [...arr, noteObj];

      await AsyncStorage.setItem('notes', JSON.stringify(updatedNotes));
      router.push('/');
    } catch (e) {
      console.error('Save error:', e);
      alert('An error occurred while saving.');
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
        <Text style={styles.page}>
          {editingId ? '✏️ Edit Note' : '📝 New Note'}
        </Text>

        <TextInput
          style={styles.input}
          placeholder="Note title"
          placeholderTextColor="#9CA3AF"
          value={title}
          onChangeText={setTitle}
        />

        <Text style={styles.label}>Content</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Note details..."
          placeholderTextColor="#9CA3AF"
          value={content}
          onChangeText={setContent}
          multiline
        />

        <Text style={styles.label}>Date</Text>
        <TouchableOpacity
          style={styles.dateInput}
          onPress={() => setShowPicker(true)}
        >
          <Text style={styles.dateText}>
            {date.toLocaleDateString()}
          </Text>
        </TouchableOpacity>

        {showPicker && (
          <>
            <DateTimePicker
              value={date}
              mode="date"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={(e, sel) => {
                if (e.type === 'dismissed') { setShowPicker(false); return; }
                if (sel) setDate(sel);
                if (Platform.OS === 'android') setShowPicker(false);
              }}
            />
            {Platform.OS === 'ios' && (
              <Button title="Confirm Date" onPress={() => setShowPicker(false)} />
            )}
          </>
        )}

        <Text style={styles.label}>Importance</Text>
        <View style={styles.importanceContainer}>
          {importanceLevels.map((lvl) => (
            <TouchableOpacity
              key={lvl.value}
              style={[
                styles.importanceButton,
                { backgroundColor: lvl.color },
                importance === lvl.value && styles.selected
              ]}
              onPress={() => setImportance(lvl.value)}
            />
          ))}
        </View>

        <View style={styles.buttonGroup}>
          <TouchableOpacity onPress={() => router.back()} style={[styles.button, styles.backButton]}>
            <Text style={styles.buttonText}>← Back</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleSubmit} style={[styles.button, styles.saveButton]}>
            <Text style={styles.buttonText}>💾 Save</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F3F4F6',
  },
  page: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 24,
    textAlign: 'center',
  },
  label: {
    fontSize: 16,
    color: '#374151',
    marginBottom: 6,
    marginTop: 12,
    fontWeight: '600',
  },
  input: {
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 10,
    fontSize: 16,
    borderColor: '#D1D5DB',
    borderWidth: 1,
    color: '#111827',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  dateInput: {
    backgroundColor: '#2563EB',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 6,
  },
  dateText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  importanceContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  importanceButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginHorizontal: 10,
    borderWidth: 2,
    borderColor: '#D1D5DB',
  },
  selected: {
    borderWidth: 3,
    borderColor: '#111827',
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 30,
  },
  button: {
    flex: 1,
    padding: 14,
    marginHorizontal: 6,
    borderRadius: 10,
    alignItems: 'center',
  },
  backButton: {
    backgroundColor: '#9CA3AF',
  },
  saveButton: {
    backgroundColor: '#10B981',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});

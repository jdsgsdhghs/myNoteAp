
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
  
  const [title,      setTitle]      = useState('');       
  const [content,    setContent]    = useState('');       
  const [date,       setDate]       = useState(new Date());
  const [importance, setImportance] = useState('low');   
  const [showPicker, setShowPicker] = useState(false);    

  const [editingId,  setEditingId]  = useState<number | null>(null); 
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
      console.warn('Params no valid');      
    }

    setTitle('');
    setContent('');
    setDate(new Date());
    setImportance('low');
    setEditingId(null);
  }, [note]);

  const handleSubmit = async () => {
 
    if (!title.trim() || !content.trim()) {
      alert('Please fill in the title and content.');
      return;
    }

    // Objet note à enregistrer
    const noteObj = {
      id: editingId ?? Date.now(),           
      title: title.trim(),
      content: content.trim(),
      date: date.toISOString(),       
      importance,                         
    };

    try {
      // Récupère les notes existantes
      const raw = await AsyncStorage.getItem('notes');
      const arr = raw ? JSON.parse(raw) : [];

      
      const updatedNotes = editingId
        ? arr.map((n: any) => (n.id === editingId ? noteObj : n))
        : [...arr, noteObj];

     
      await AsyncStorage.setItem('notes', JSON.stringify(updatedNotes));

      router.push('/');                  
    } catch (e) {
      console.error('Erreur de sauvegarde :', e);
      alert('Une erreur est survenue.');
    }
  };

 
  return (
    // Ferme le clavier si on tape en dehors du formulaire
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
      
        <Text style={styles.page}>
          {editingId ? 'Update Note' : 'Create a new note'}
        </Text>

       
        <TextInput
          style={styles.input}
          placeholder="Enter your title here"
          value={title}
          onChangeText={setTitle}
        />

       
        <Text style={styles.label}>Content</Text>
        <TextInput
          style={[styles.input, { height: 100 }]}
          placeholder="Enter your content here"
          value={content}
          onChangeText={setContent}
          multiline
        />

      
        <Text style={styles.label}>Date</Text>
        <TouchableOpacity
          style={styles.dateInput}
          onPress={() => setShowPicker(true)}
        >
          <Text style={{ color: '#fff' }}>
            {date.toLocaleDateString()}
          </Text>
        </TouchableOpacity>

        {/* Affiche le DateTimePicker si demandé */}
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
            {/* Bouton OK pour fermer sur iOS */}
            {Platform.OS === 'ios' && (
              <Button title="ok" onPress={() => setShowPicker(false)} />
            )}
          </>
        )}

        {/* Choix de l’importance sous forme de cercles colorés */}
        <View style={styles.importanceContainer}>
          {importanceLevels.map((lvl) => (
            <TouchableOpacity
              key={lvl.value}
              style={[
                styles.importanceButton,
                { backgroundColor: lvl.color },
                importance === lvl.value && styles.selected, 
              ]}
              onPress={() => setImportance(lvl.value)}
            />
          ))}
        </View>

        {/* Boutons de navigation */}
        <Button title="Back"   onPress={() => router.back()} />
        <Button title="Save" onPress={handleSubmit} />
      </View>
    </TouchableWithoutFeedback>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#456990',
    paddingHorizontal: 20,
    paddingTop: 32,
    justifyContent: 'flex-start',
  },
  page: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
    textAlign: 'center',
  },
  label: {
    color: '#fff8f8',
    fontWeight: '600',
    fontSize: 14,
    marginBottom: 4,
    marginTop: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#fff',
    color: '#333',
    borderRadius: 8,
    padding: 10,
    marginBottom: 8,
    width: '100%',
    fontSize: 14,
  },
  dateInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#fff',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    marginBottom: 8,
    width: '100%',
  },
  importanceContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 12,
  },
  importanceButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: '#fff',
    marginHorizontal: 6,
  },
  selected: {
    borderWidth: 3,
    borderColor: '#fff',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 16,
    gap: 10,
  },
});


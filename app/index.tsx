
import React, { useCallback, useState } from 'react';
import {View, Text, StyleSheet, FlatList,TouchableOpacity, Pressable} from 'react-native';
import { useFocusEffect, useRouter, Link } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';


// On définit ce qu’est une "note"
type Note = {
  id: string;                         
  title: string;                       
  content: string;                       
  date: string;                         
  importance: 'high' | 'medium' | 'low'; 
};

  
export default function Index() {
  const router = useRouter();                   
  const [notes, setNotes] = useState<Note[]>([]); // État pour stocker les notes

  // Cette fonction est appelée quand on revient sur cette page
  useFocusEffect(
    useCallback(() => {
      const load = async () => {
        const raw = await AsyncStorage.getItem('notes'); 
        setNotes(raw ? JSON.parse(raw) : []);            
      };
      load();
    }, [])
  );

  // Fonction pour ouvrir une note quand on clique dessus
  const openNote = useCallback((note: Note) => {
    router.push({
      pathname: '/note',                    
      params: { note: JSON.stringify(note) },  
    });
  }, [router]);

  // Ce que l’écran affiche
  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <Text style={styles.appTitle}>MyNoteBook</Text>  
        <Pressable
          style={styles.addButton}
          onPress={() => router.push('/form')} // navigation propre sans paramètre
        >
          <Text style={styles.addButtonText}>New Note</Text>
        </Pressable>
      </View>

      {/* Si aucune note n’existe, on affiche un message */}
      {notes.length === 0 ? (
        <Text style={styles.empty}>No notes were created.</Text>
      ) : (
        // Sinon, on affiche toutes les notes avec FlatList
        <FlatList
          data={notes}                                
          keyExtractor={(item) => item.id}             
          contentContainerStyle={styles.listContent}    
          showsVerticalScrollIndicator={false}        
          renderItem={({ item }) => (                  
            <TouchableOpacity 
              onPress={() => openNote(item)}          
              activeOpacity={0.7}                     
            >
              <View style={styles.card}>                
                <Text style={styles.title}>{item.title}</Text>    
                <Text style={styles.content}>{item.content}</Text>      
                <Text style={styles.date}>
                  {new Date(item.date).toLocaleDateString()}  
                </Text>                                               

                {/* Un point coloré selon l’importance */}
                <View
                  style={[
                    styles.dot,
                    {
                      backgroundColor:
                        item.importance === 'high'
                          ? '#F45B69'       
                          : item.importance === 'medium'
                          ? '#FFD4CA'       
                          : '#7EE4EC',      
                    },
                  ]}
                />
              </View>
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F7FA',
    paddingTop: 50,
    paddingHorizontal: 20,
  },

  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
  },

  appTitle: {
    fontSize: 30,
    fontWeight: '800',
    color: '#1F2D3D',
    letterSpacing: 1,
  },

  addButton: {
    backgroundColor: '#456990',
    padding: 12,
    borderRadius: 30,
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 6,
  },

  addButtonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },

  empty: {
    color: '#7B8794',
    textAlign: 'center',
    fontSize: 18,
    marginTop: 100,
    opacity: 0.8,
  },

  listContent: {
    paddingBottom: 100,
  },

  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    marginHorizontal: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
    position: 'relative',
  },

  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1C1C1E',
    marginBottom: 8,
  },

  content: {
    fontSize: 15,
    color: '#4A4A4A',
    lineHeight: 20,
  },

  date: {
    fontSize: 13,
    color: '#A0AEC0',
    marginTop: 10,
  },

  dot: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#F4F7FA',
  },
});



 
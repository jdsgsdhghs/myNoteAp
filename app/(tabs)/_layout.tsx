import { Tabs} from 'expo-router'
import React from 'react'
import { View, Text } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

export default function NoteScreen() {
  const { id } = useLocalSearchParams();

  return (
    <View style={{ padding: 20 }}>
      <Text>Note ID: {id}</Text>
      {/* Tu peux ici chercher la note avec l’ID ou passer les données via params */}
    </View>
  );
}

// const layout = () => {
//   return (
//     <Tabs
//       screenOptions={{
// }}
//     >
//       <Tabs.Screen name="index" options={{ title: 'Home' ,headerShown:false }} />
//       <Tabs.Screen name="form" options={{ title: 'Form', headerShown:false }} />
      
//     </Tabs>
//   )
// }

// export default layout

 
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { RootNavigator } from './src/features/navigation/RootNavigator';
import './global.css';
import { getFirestore } from 'firebase/firestore';

// Tu configuración de Firebase
const firebaseConfig = {
  // ... tu configuración
};


function App() {
  return (
    <NavigationContainer>
      <RootNavigator />
    </NavigationContainer>
  );
}

export default App;
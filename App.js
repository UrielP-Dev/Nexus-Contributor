import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { RootNavigator } from './src/features/navigation/RootNavigator';
import './global.css';
import { app } from './src/config/firebase';
import { getFirestore } from 'firebase/firestore';

// Inicializa Firestore
const db = getFirestore(app);

function App() {
  return (
    <NavigationContainer>
      <RootNavigator />
    </NavigationContainer>
  );
}

export default App;
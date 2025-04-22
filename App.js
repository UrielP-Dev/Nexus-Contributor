import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { RootNavigator } from "./src/features/navigation/RootNavigator";
import "./global.css";
import "./src/config/firebase"; // Solo importamos el archivo para asegurar la inicialización
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { RootNavigator } from './src/features/navigation/RootNavigator';
import { UserProvider } from './src/context/UserContext';
import './global.css';
import { getFirestore } from 'firebase/firestore';

// Tu configuración de Firebase
const firebaseConfig = {
  // ... tu configuración
};


function App() {
  return (
    <UserProvider>
      <NavigationContainer>
        <RootNavigator />
      </NavigationContainer>
    </UserProvider>
  );
}

export default App;

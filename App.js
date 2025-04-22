<<<<<<< HEAD
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { RootNavigator } from "./src/features/navigation/RootNavigator";
import "./global.css";
import "./src/config/firebase"; // Solo importamos el archivo para asegurar la inicialización
=======
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { RootNavigator } from './src/features/navigation/RootNavigator';
import './global.css';
import { getFirestore } from 'firebase/firestore';

// Tu configuración de Firebase
const firebaseConfig = {
  // ... tu configuración
};

>>>>>>> 733b69b096fc196d2a8aa73c3b72c41249ae26cd

function App() {
  return (
    <NavigationContainer>
      <RootNavigator />
    </NavigationContainer>
  );
}

export default App;

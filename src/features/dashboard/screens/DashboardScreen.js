import React from 'react';
import { View, Text } from 'react-native';
import MainLayout from '../../layout/components/MainLayout.js';

import MapaGoogle from '../../maps/MapaGoogle.js'; // Importa el componente MapaGoogle

const DashboardScreen = ({ navigation }) => {
  return (
    <MainLayout navigation={navigation}>
      <View className="p-4">
        <Text className="text-h2 font-bold text-primary">Dashboard</Text>
        <Text className="text-body text-text-soft mt-2">
        
        
        <MapaGoogle />
        
        
        </Text>
      </View>
    </MainLayout>
  );
};

export default DashboardScreen;
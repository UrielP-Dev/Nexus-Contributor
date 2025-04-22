import React from 'react';
import { View, Text, TouchableOpacity, Animated } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import MainLayout from '../../layout/components/MainLayout.js';

import MapaGoogle from '../../maps/MapaGoogle.js'; // Importa el componente MapaGoogle

const DashboardScreen = ({ navigation }) => {
  const pulseAnim = new Animated.Value(1);

  React.useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  return (
    <MainLayout navigation={navigation}>
<<<<<<< HEAD
      <View className="p-4">
        <Text className="text-h2 font-bold text-primary">Dashboard</Text>
        <Text className="text-body text-text-soft mt-2">
        
        
        <MapaGoogle />
        
        
        </Text>
=======
      <View className="flex-1 p-4">
        {/* Header Section */}
        <View className="mb-6">
          <Text className="text-h2 font-bold text-primary">Dashboard</Text>
          <Text className="text-body text-text-soft mt-2">
            Bienvenido a tu panel de control Nexus
          </Text>
        </View>

        {/* Stats Overview */}
        <View className="flex-row justify-between mb-6">
          <View className="bg-background-box p-4 rounded-md shadow-default flex-1 mr-2">
            <Ionicons name="analytics" size={24} color="#006FB9" />
            <Text className="text-h4 font-bold text-primary mt-2">45</Text>
            <Text className="text-small text-text-soft">Registros Totales</Text>
          </View>
          <View className="bg-background-box p-4 rounded-md shadow-default flex-1 ml-2">
            <Ionicons name="today" size={24} color="#006FB9" />
            <Text className="text-h4 font-bold text-primary mt-2">12</Text>
            <Text className="text-small text-text-soft">Registros Hoy</Text>
          </View>
        </View>

        {/* Map Placeholder */}
        <View className="bg-background-box rounded-md shadow-default h-64 mb-6">
          <View className="items-center justify-center h-full">
            <Ionicons name="map" size={48} color="#D9E3F2" />
            <Text className="text-text-neutral mt-2">Mapa de registros (Próximamente)</Text>
          </View>
        </View>

        {/* New Registration Button */}
        <Animated.View 
          style={{
            transform: [{ scale: pulseAnim }],
          }}
        >
          <TouchableOpacity
            className="rounded-md overflow-hidden shadow-primary"
            onPress={() => navigation.navigate('Register')}
          >
            <LinearGradient
              colors={['#006FB9', '#194B7B']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              className="p-4"
            >
              <View className="flex-row items-center justify-center">
                <Ionicons name="add-circle" size={24} color="#FFFFFF" />
                <Text className="text-body font-bold text-white ml-2">
                  Nuevo Registro
                </Text>
              </View>
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>

        {/* Quick Actions */}
        <View className="mt-6">
          <Text className="text-h4 font-bold text-text mb-4">Acciones Rápidas</Text>
          <View className="flex-row flex-wrap justify-between">
            {['Búsqueda', 'Reportes', 'Configuración'].map((action, index) => (
              <TouchableOpacity
                key={index}
                className="bg-background-box w-[31%] p-3 rounded-md shadow-default items-center"
              >
                <Ionicons 
                  name={['search', 'document-text', 'settings'][index]} 
                  size={24} 
                  color="#006FB9" 
                />
                <Text className="text-small text-text-soft mt-2">{action}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
>>>>>>> d1548a991a8389b72512cdb388ea4d97c8eaf51d
      </View>
    </MainLayout>
  );
};

export default DashboardScreen;
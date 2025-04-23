import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Animated, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import MainLayout from '../../layout/components/MainLayout.js';
import MapaGoogle from '../../../maps/Mapagoogle.js';
import { useUser } from '../../../context/UserContext';

const DashboardScreen = ({ navigation }) => {
  const { userData } = useUser();
  const [todayRegistrations, setTodayRegistrations] = useState(12);
  const [totalRegistrations, setTotalRegistrations] = useState(45);
  const [weeklyGoal, setWeeklyGoal] = useState(25);
  const [weeklyProgress, setWeeklyProgress] = useState(18);
  
  const pulseAnim = new Animated.Value(1);

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.05,
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

  // Calcular porcentaje de progreso para la meta semanal
  const progressPercentage = Math.min(100, (weeklyProgress / weeklyGoal) * 100);
  
  // Obtener nombre del usuario o valor predeterminado
  const userName = userData?.name || "Colaborador";
  const firstName = userName.split(' ')[0]; // Sólo el primer nombre para personalización

  return (
    <MainLayout navigation={navigation}>
      <ScrollView className="flex-1 bg-background" showsVerticalScrollIndicator={false}>
        <View className="flex-1 p-4">
          {/* Encabezado personalizado */}
          <View className="mb-6">
            <Text className="text-h3 text-text-soft">Hola,</Text>
            <Text className="text-h2 font-bold text-primary">{firstName}</Text>
            <Text className="text-body text-text-soft mt-1">
            </Text>
          </View>

          {/* Tarjeta de Progreso Semanal */}
          <View className="bg-white rounded-xl p-4 shadow-sm mb-6">
            <View className="flex-row justify-between items-center mb-3">
              <Text className="text-lg font-bold text-text">Meta Semanal</Text>
              <View className="bg-primary-light px-3 py-1 rounded-full">
                <Text className="text-primary font-medium">{weeklyProgress} de {weeklyGoal}</Text>
              </View>
            </View>
            
            {/* Barra de progreso */}
            <View className="h-3 bg-gray-200 rounded-full mb-2">
              <View 
                className="h-3 bg-primary rounded-full" 
                style={{ width: `${progressPercentage}%` }} 
              />
            </View>
            
            <Text className="text-text-soft text-sm">
              {weeklyGoal - weeklyProgress > 0 
                ? `Necesitas ${weeklyGoal - weeklyProgress} más para alcanzar tu meta semanal`
                : '¡Felicidades! Has alcanzado tu meta semanal'}
            </Text>
          </View>

          {/* Estadísticas */}
          <View className="flex-row justify-between mb-6">
            <View className="bg-white p-4 rounded-xl shadow-sm flex-1 mr-2">
              <Ionicons name="analytics" size={24} color="#006FB9" />
              <Text className="text-h3 font-bold text-primary mt-2">{totalRegistrations}</Text>
              <Text className="text-sm text-text-soft">Registros Totales</Text>
            </View>
            <View className="bg-white p-4 rounded-xl shadow-sm flex-1 ml-2">
              <Ionicons name="today" size={24} color="#006FB9" />
              <Text className="text-h3 font-bold text-primary mt-2">{todayRegistrations}</Text>
              <Text className="text-sm text-text-soft">Registros Hoy</Text>
            </View>
          </View>

          {/* Mapa */}
          <View className="bg-white rounded-xl shadow-sm mb-6 overflow-hidden">
            <View className="h-56 mt-1">
              <MapaGoogle />
            </View>
          </View>

          {/* Botón de Nuevo Registro */}
          <Animated.View 
            style={{
              transform: [{ scale: pulseAnim }],
            }}
          >
            <TouchableOpacity
              className="rounded-xl overflow-hidden shadow-primary mb-6"
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

          {/* Negocios Cercanos */}
          <View className="mb-4">
            <Text className="text-lg font-bold text-text mb-3">Negocios Cercanos</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {[
                { name: 'Abarrotes Don José', type: 'Tienda', distance: 150, direction: 'norte', icon: 'storefront' },
                { name: 'Estética Bella', type: 'Estética', distance: 300, direction: 'sur', icon: 'cut' },
                { name: 'Barbería El Jefe', type: 'Barbería', distance: 450, direction: 'este', icon: 'cut' },
                { name: 'Papelería Lupita', type: 'Papelería', distance: 600, direction: 'oeste', icon: 'document' }
              ].map((business, index) => (
                <TouchableOpacity
                  key={index}
                  className="bg-white p-4 rounded-xl shadow-sm mr-3 w-64"
                >
                  <View className="flex-row items-center mb-2">
                    <View className="bg-primary-light p-2 rounded-full">
                      <Ionicons name={business.icon} size={24} color="#006FB9" />
                    </View>
                    <View className="ml-3 flex-1">
                      <Text className="font-bold text-text" numberOfLines={1}>{business.name}</Text>
                      <Text className="text-text-soft text-sm">{business.type}</Text>
                    </View>
                  </View>
                  <View className="flex-row items-center justify-between mt-2">
                    <View className="flex-row items-center">
                      <Ionicons name="location" size={16} color="#006FB9" />
                      <Text className="text-primary ml-1">{business.distance}m</Text>
                    </View>
                    <View className="flex-row items-center">
                      <Ionicons name="arrow-forward" size={16} color="#006FB9" />
                      <Text className="text-text-soft ml-1">hacia {business.direction}</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
          
          {/* Espacio para la barra de navegación */}
          <View className="h-16" />
        </View>
      </ScrollView>
    </MainLayout>
  );
};

export default DashboardScreen;
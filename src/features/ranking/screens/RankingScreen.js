import React, { useEffect, useState } from "react";
import { View, Text, ActivityIndicator, ScrollView, Image, TouchableOpacity } from "react-native";
import { collection, query, getDocs } from "firebase/firestore";
import { db } from "../../../config/firebase";
import MainLayout from "../../layout/components/MainLayout";
import UserInformationCard from "../components/UserInfoCard";
import { Ionicons } from '@expo/vector-icons';

export default function RankingScreen({ navigation }) {
  const [users, setUsers] = useState([]);
  const [topUsers, setTopUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterOption, setFilterOption] = useState('all'); // 'all', 'weekly', 'monthly'

  async function syncAllUsers() {
    try {
      const querySnapshot = await getDocs(query(collection(db, "users")));
      const userList = [];
      querySnapshot.forEach((doc) => {
        userList.push({ id: doc.id, ...doc.data() });
      });

      const sorted = userList.sort((a, b) => b.points - a.points);
      setTopUsers(sorted.slice(0, 3)); // Top 3
      setUsers(sorted.slice(3)); // Resto
    } catch (error) {
      console.error("Error loading users:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    syncAllUsers();
  }, []);

  // Componente para el podio
  const PodiumView = () => {
    if (topUsers.length === 0) return null;
    
    // Asegurarse de que hay 3 usuarios para el podio
    const first = topUsers[0] || { name: '-', points: 0 };
    const second = topUsers[1] || { name: '-', points: 0 };
    const third = topUsers[2] || { name: '-', points: 0 };
    
    return (
      <View className="my-4">
        {/* Contenedor del podio */}
        <View className="flex-row justify-center items-end h-64 mb-8">
          {/* Segundo lugar */}
          <View className="items-center">
            <View className="bg-white rounded-full overflow-hidden border-2 border-purple-600 h-16 w-16 items-center justify-center mb-2">
              <Text className="text-2xl">🥈</Text>
            </View>
            <Text className="text-center font-bold" numberOfLines={1} ellipsizeMode="tail">
              {second.name}
            </Text>
            <View className="bg-purple-100 px-3 py-1 rounded-full mt-1">
              <Text className="text-purple-800 font-medium">{second.points} pts</Text>
            </View>
            <View className="bg-purple-600 w-24 h-28 rounded-t-lg mt-2">
              <Text className="text-white text-center font-bold mt-1">2°</Text>
            </View>
          </View>
          
          {/* Primer lugar */}
          <View className="items-center -mb-4 mx-4 z-10">
            <View className="bg-white rounded-full overflow-hidden border-2 border-yellow-500 h-20 w-20 items-center justify-center mb-2">
              <Text className="text-3xl">🏆</Text>
            </View>
            <Text className="text-center font-bold" numberOfLines={1} ellipsizeMode="tail">
              {first.name}
            </Text>
            <View className="bg-yellow-100 px-3 py-1 rounded-full mt-1">
              <Text className="text-yellow-800 font-medium">{first.points} pts</Text>
            </View>
            <View className="bg-yellow-500 w-28 h-36 rounded-t-lg mt-2">
              <Text className="text-white text-center font-bold mt-1">1°</Text>
            </View>
          </View>
          
          {/* Tercer lugar */}
          <View className="items-center">
            <View className="bg-white rounded-full overflow-hidden border-2 border-blue-500 h-14 w-14 items-center justify-center mb-2">
              <Text className="text-xl">🥉</Text>
            </View>
            <Text className="text-center font-bold" numberOfLines={1} ellipsizeMode="tail">
              {third.name}
            </Text>
            <View className="bg-blue-100 px-3 py-1 rounded-full mt-1">
              <Text className="text-blue-800 font-medium">{third.points} pts</Text>
            </View>
            <View className="bg-blue-500 w-16 h-24 rounded-t-lg mt-2">
              <Text className="text-white text-center font-bold mt-1">3°</Text>
            </View>
          </View>
        </View>
      </View>
    );
  };

  // Filtro de tiempo
  const FilterOptions = () => (
    <View className="flex-row justify-center mb-6 space-x-2">
      <TouchableOpacity 
        className={`px-4 py-2 rounded-full ${filterOption === 'all' ? 'bg-primary' : 'bg-gray-200'}`}
        onPress={() => setFilterOption('all')}
      >
        <Text className={filterOption === 'all' ? 'text-white font-medium' : 'text-gray-600'}>
          Total
        </Text>
      </TouchableOpacity>
      <TouchableOpacity 
        className={`px-4 py-2 rounded-full ${filterOption === 'weekly' ? 'bg-primary' : 'bg-gray-200'}`}
        onPress={() => setFilterOption('weekly')}
      >
        <Text className={filterOption === 'weekly' ? 'text-white font-medium' : 'text-gray-600'}>
          Semanal
        </Text>
      </TouchableOpacity>
      <TouchableOpacity 
        className={`px-4 py-2 rounded-full ${filterOption === 'monthly' ? 'bg-primary' : 'bg-gray-200'}`}
        onPress={() => setFilterOption('monthly')}
      >
        <Text className={filterOption === 'monthly' ? 'text-white font-medium' : 'text-gray-600'}>
          Mensual
        </Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <MainLayout navigation={navigation}>
      <ScrollView className="flex-1 bg-background" showsVerticalScrollIndicator={false}>
        <View className="p-4">
          {/* Cabecera */}
          <View className="flex-row justify-between items-center mb-2">
            <Text className="text-h2 font-bold text-primary">Ranking</Text>
            <TouchableOpacity 
              className="bg-background-box rounded-full p-2"
              onPress={() => syncAllUsers()}
            >
              <Ionicons name="refresh" size={20} color="#006FB9" />
            </TouchableOpacity>
          </View>
          
          <Text className="text-text-soft mb-4">
            Clasificación basada en total de puntos acumulados por cada promotor.
          </Text>
          
          {/* Filtros de tiempo */}
          <FilterOptions />
          
          {loading ? (
            <View className="justify-center items-center py-20">
              <ActivityIndicator size="large" color="#006FB9" />
              <Text className="mt-4 text-text-soft">Cargando ranking...</Text>
            </View>
          ) : (
            <View>
              {/* Top 3 - Vista de Podio */}
              <View className="bg-white rounded-xl p-4 shadow-sm mb-6">
                <Text className="text-lg font-bold text-center text-primary mb-3">
                  Top 3 Colaboradores
                </Text>
                <PodiumView />
              </View>
              
              {/* Lista de Clasificación */}
              <View className="bg-white rounded-xl p-4 shadow-sm">
                <Text className="text-lg font-bold text-primary mb-4">Clasificación General</Text>
                
                {users.length > 0 ? (
                  users.map((user, index) => (
                    <UserInformationCard 
                      key={user.id} 
                      user={user} 
                      position={index + 4} // Posición 4 en adelante
                    />
                  ))
                ) : (
                  <View className="py-6 items-center">
                    <Text className="text-text-soft text-center">
                      No hay más usuarios en el ranking
                    </Text>
                  </View>
                )}
              </View>
              
              {/* Espacio para la barra de navegación */}
              <View className="h-16" />
            </View>
          )}
        </View>
      </ScrollView>
    </MainLayout>
  );
}
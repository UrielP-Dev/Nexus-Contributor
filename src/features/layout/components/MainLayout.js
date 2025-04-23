import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { authService } from '../../auth/services/authService';
import { useUser } from '../../../context/UserContext';
import { TouchableWithoutFeedback, Keyboard } from 'react-native';

export default function MainLayout({ children, navigation }) {
  const { clearUser } = useUser();
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = async () => {
    Alert.alert(
      "Cerrar Sesión",
      "¿Estás seguro que deseas cerrar sesión?",
      [
        {
          text: "Cancelar",
          style: "cancel"
        },
        {
          text: "Sí, cerrar sesión",
          style: "destructive",
          onPress: async () => {
            try {
              await authService.logout();
              clearUser();
              navigation.replace('Login');
            } catch (error) {
              Alert.alert('Error', 'No se pudo cerrar sesión');
            }
          }
        },
      
    ]);
  };

  const menuItems = [
    { icon: "home", label: "Home", route: "Dashboard" },
    { icon: "person", label: "Ranking", route: "Ranking" },
    { icon: "people", label: "Referidos", route: "Referrals" },
    
  ];

  

  const Sidebar = () => (
    <TouchableWithoutFeedback
      onPress={() => {
        setSidebarOpen(false); // Minimizar el sidebar al presionar fuera
      }}
    >
      <View
        className={`absolute left-0 top-0 h-full z-50 ${
          isSidebarOpen ? "flex" : "hidden"
        }`}
      >
        {/* Fondo semitransparente que permite interacción con la página principal */}
        <View className="absolute left-0 top-0 h-full w-4 bg-blue bg-opacity-50" />
  
        {/* Sidebar con ancho fijo */}
        <View className="absolute left-0 top-0 h-full bg-white w-64 shadow-default">
          <View className="p-4 border-b border-border-neutral flex-row items-center">
            {/* Botón para regresar al Home */}
            <TouchableOpacity
              className="flex-row items-center"
              onPress={() => {
                // Navegar al Home
                setSidebarOpen(false);
              }}
            >
              <Ionicons name="arrow-back" size={24} color="#006FB9" />
            </TouchableOpacity>
            {/* Texto "Nexus" */}
            <Text className="ml-4 text-h4 font-bold text-primary">Nexus</Text>
          </View>
          <ScrollView>
  {menuItems.map((item, index) => (
    <TouchableOpacity
      key={index}
      className="p-4 flex-row items-center"
      onPress={() => {
        navigation.navigate(item.route);
        setSidebarOpen(false);
      }}
    >
      <Ionicons name={item.icon} size={24} color="#006FB9" />
      <Text className="ml-3 text-body text-text">{item.label}</Text>
    </TouchableOpacity>
  ))}

  {/* Separador */}
  <View className="my-2 border-t border-border-neutral" />

  {/* Botón de Logout */}
  <TouchableOpacity
    className="p-4 flex-row items-center"
    onPress={handleLogout}
  >
    <Ionicons name="log-out" size={24} color="#BA4B44" />
    <Text className="ml-3 text-body text-semantic-error">Cerrar Sesión</Text>
  </TouchableOpacity>

  {/* Footer */}
<TouchableOpacity
  className="items-center mt-10 "
  onPress={() => {
    console.log("Footer presionado");
    // Puedes agregar cualquier acción aquí si es necesario
  }}
>
  <View className="flex-row items-end">
    <View className="h-px w-16 bg-border-neutral" />
    <View className="mx-4">
      <View className="w-3 h-3 bg-brand-coppel rounded-full" />
    </View>
    <View className="h-px w-16 bg-border-neutral" />
  </View>
  <Text className="text-text-soft text-small mt-4">
    Nexus Contributor v1.0.0
  </Text>
</TouchableOpacity>
</ScrollView>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );

  const BottomNav = () => (
    <View className="bg-white border-t border-border-neutral">
      <View className="flex-row justify-around py-2">
        {menuItems.map((item, index) => (
          <TouchableOpacity
            key={index}
            className="items-center p-2"
            onPress={() => navigation.navigate(item.route)}
          >
            <Ionicons name={item.icon} size={24} color="#006FB9" />
            <Text className="text-caption text-text-soft">{item.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View
        className="flex-1"
        pointerEvents={isSidebarOpen ? "box-none" : "auto"} // Permitir que los eventos táctiles pasen al sidebar
        onTouchStart={(e) => {
          if (isSidebarOpen) {
            const touchX = e.nativeEvent.pageX;
            if (touchX > 256) { // Verifica si el toque está fuera del ancho del sidebar (256px)
              setSidebarOpen(false); // Minimizar el sidebar al tocar fuera
            }
          }
        }}
      >
        <View className="flex-row items-center p-4 bg-white shadow-default">
          <TouchableOpacity onPress={() => setSidebarOpen(!isSidebarOpen)}>
            <Ionicons name="menu" size={24} color="#006FB9" />
          </TouchableOpacity>
          <Text className="ml-4 text-h4 font-bold text-primary">Nexus</Text>
        </View>
        
        <Sidebar />

        <View className="flex-1">{children}</View>

        <BottomNav />
      </View>
    </SafeAreaView>
  );
}

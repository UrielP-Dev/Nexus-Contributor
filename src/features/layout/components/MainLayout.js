import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { authService } from '../../auth/services/authService';

export default function MainLayout({ children, navigation }) {
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
              navigation.replace('Login');
            } catch (error) {
              Alert.alert('Error', 'No se pudo cerrar sesión');
            }
          }
        }
      ]
    );
  };

  const menuItems = [
    { icon: 'home', label: 'Home', route: 'Dashboard' },
    { icon: 'person', label: 'Profile', route: 'Profile' },
    { icon: 'settings', label: 'Settings', route: 'Settings' },
    { icon: 'create', label: 'Registro', route: 'Register' },
  ];

  const Sidebar = () => (
    <View className={`absolute left-0 top-0 h-full bg-white w-64 shadow-default z-50 ${isSidebarOpen ? 'flex' : 'hidden'}`}>
      <View className="p-4 border-b border-border-neutral">
        <Text className="text-h4 font-bold text-primary">Nexus</Text>
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
      </ScrollView>
    </View>
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
      <View className="flex-1">
        <View className="flex-row items-center p-4 bg-white shadow-default">
          <TouchableOpacity onPress={() => setSidebarOpen(!isSidebarOpen)}>
            <Ionicons name="menu" size={24} color="#006FB9" />
          </TouchableOpacity>
          <Text className="ml-4 text-h4 font-bold text-primary">Nexus</Text>
        </View>
        
        <Sidebar />
        
        <View className="flex-1">
          {children}
        </View>
        
        <BottomNav />
      </View>
    </SafeAreaView>
  );
}
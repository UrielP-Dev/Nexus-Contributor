import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { authService } from '../services/authService';

const LoginScreen = ({ navigation }) => {
  const [employeeNumber, setEmployeeNumber] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      if (!employeeNumber || !password) {
        Alert.alert('Error', 'Por favor ingresa tu número de empleado y contraseña');
        return;
      }

      const userData = await authService.login(employeeNumber, password);
      navigation.replace('Dashboard', { userData });
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <View className="px-6 pt-12">
        <Text className="text-3xl font-bold text-gray-800 mb-8">Bienvenido</Text>
        
        <View className="space-y-4">
          <TextInput
            className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm"
            placeholder="Número de empleado"
            value={employeeNumber}
            onChangeText={setEmployeeNumber}
            keyboardType="numeric"
          />
          
          <TextInput
            className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm"
            placeholder="Contraseña"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <TouchableOpacity
            className="rounded-lg overflow-hidden mt-6 shadow-md"
            onPress={handleLogin}
          >
            <LinearGradient
              colors={['#3B82F6', '#2563EB']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <View className="py-4">
                <Text className="text-center font-semibold text-white text-lg">
                  Iniciar Sesión
                </Text>
              </View>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default LoginScreen;
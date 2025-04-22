import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, BackHandler, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { authService } from '../services/authService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { useUser } from '../../../context/UserContext';

const LoginScreen = ({ navigation }) => {
  const [employeeNumber, setEmployeeNumber] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { updateUser } = useUser();

  useEffect(() => {
    checkExistingSession();
    // Prevenir el botón de retroceso
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => true
    );
    return () => backHandler.remove();
  }, []);

  const checkExistingSession = async () => {
    try {
      const userData = await AsyncStorage.getItem('userData');
      if (userData) {
        const parsedUserData = JSON.parse(userData);
        updateUser(parsedUserData);
        navigation.replace('Dashboard', { userData: parsedUserData });
      }
    } catch (error) {
      console.error('Error checking session:', error);
    }
  };

  const handleLogin = async () => {
    try {
      if (!employeeNumber || !password) {
        Alert.alert('Error', 'Por favor ingresa tu número de empleado y contraseña');
        return;
      }

      const userData = await authService.login(employeeNumber, password);
      await AsyncStorage.setItem('userData', JSON.stringify(userData));
      navigation.replace('Dashboard', { userData });
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <LinearGradient
        colors={['#006FB9', '#194B7B']}
        className="absolute h-72 w-full"
      />
      
      <View className="px-6 flex-1">
        {/* Logo y Título */}
        <View className="items-center mt-12 mb-8">
          <Image
            source={require('../../../assets/Nexus2.png')}
            style={{ width: 200, height: 100 }}
            resizeMode="contain"
          />
        </View>

        {/* Formulario */}
        <View className="bg-background-box rounded-md p-6 shadow-floating">
          <Text className="text-h3 font-bold text-primary mb-2">Bienvenido</Text>
          <Text className="text-text-soft mb-6">Ingresa tus credenciales para continuar</Text>

          <View className="space-y-4">
            {/* Input Empleado */}
            <View>
              <Text className="text-small text-text-soft mb-2">Número de Empleado</Text>
              <View className="flex-row items-center bg-background rounded-md border border-border-neutral">
                <View className="p-3">
                  <Ionicons name="person-outline" size={20} color="#006FB9" />
                </View>
                <TextInput
                  className="flex-1 p-3 text-text"
                  placeholder="Ingresa tu número de empleado"
                  value={employeeNumber}
                  onChangeText={setEmployeeNumber}
                  keyboardType="numeric"
                />
              </View>
            </View>

            {/* Input Contraseña */}
            <View>
              <Text className="text-small text-text-soft mb-2">Contraseña</Text>
              <View className="flex-row items-center bg-background rounded-md border border-border-neutral">
                <View className="p-3">
                  <Ionicons name="lock-closed-outline" size={20} color="#006FB9" />
                </View>
                <TextInput
                  className="flex-1 p-3 text-text"
                  placeholder="Ingresa tu contraseña"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                />
                <TouchableOpacity 
                  className="p-3"
                  onPress={() => setShowPassword(!showPassword)}
                >
                  <Ionicons 
                    name={showPassword ? "eye-outline" : "eye-off-outline"} 
                    size={20} 
                    color="#006FB9" 
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Botón Login */}
            <TouchableOpacity
              className="mt-6"
              onPress={handleLogin}
            >
              <LinearGradient
                colors={['#006FB9', '#194B7B']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                className="py-4 rounded-md shadow-primary"
              >
                <Text className="text-center font-bold text-white text-body">
                  Iniciar Sesión
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>

        {/* Footer */}
        <View className="items-center mt-8">
          <View className="flex-row items-center">
            <View className="h-px w-16 bg-border-neutral" />
            <View className="mx-4">
              <View className="w-3 h-3 bg-brand-coppel rounded-full" />
            </View>
            <View className="h-px w-16 bg-border-neutral" />
          </View>
          <Text className="text-text-soft text-small mt-4">
            Nexus Contributor v1.0.0
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default LoginScreen;
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { getFirestore, collection, addDoc } from 'firebase/firestore';

const RegisterScreen = ({ navigation }) => {
  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [postalCode, setPostalCode] = useState('');

  const handleRegister = async () => {
    try {
      if (!name || !phoneNumber || !postalCode) {
        Alert.alert('Error', 'Por favor completa todos los campos');
        return;
      }

      const db = getFirestore();
      const usersRef = collection(db, 'users');
      
      await addDoc(usersRef, {
        name,
        phone_number: phoneNumber,
        postal_code: postalCode,
        created_at: new Date()
      });

      Alert.alert('Éxito', 'Registro completado exitosamente');
      navigation.replace('Login');
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <View className="px-6 pt-12">
        <Text className="text-3xl font-bold text-gray-800 mb-8">Registro</Text>
        
        <View className="space-y-4">
          <TextInput
            className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm"
            placeholder="Nombre completo"
            value={name}
            onChangeText={setName}
          />
          
          <TextInput
            className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm"
            placeholder="Número de teléfono"
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            keyboardType="phone-pad"
          />

          <TextInput
            className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm"
            placeholder="Código postal"
            value={postalCode}
            onChangeText={setPostalCode}
            keyboardType="numeric"
            maxLength={5}
          />

          <TouchableOpacity
            className="rounded-lg overflow-hidden mt-6 shadow-md"
            onPress={handleRegister}
          >
            <LinearGradient
              colors={['#3B82F6', '#2563EB']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <View className="py-4">
                <Text className="text-center font-semibold text-white text-lg">
                  Registrarse
                </Text>
              </View>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default RegisterScreen;
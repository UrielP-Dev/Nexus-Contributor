import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { authService } from '../services/authService';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    try {
      await authService.login(email, password);
      navigation.replace('Dashboard');
    } catch (error) {
      Alert.alert('Error', error.message);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="px-6 pt-12">
        <Text className="text-h2 font-bold text-primary mb-8">Login</Text>
        
        <View className="space-y-4">
          <TextInput
            className="bg-white p-4 rounded-md border border-border-neutral"
            placeholder="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          
          <TextInput
            className="bg-white p-4 rounded-md border border-border-neutral"
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <TouchableOpacity
            className="rounded-md overflow-hidden mt-6"
            onPress={handleLogin}
          >
            <LinearGradient
              colors={['#006FB9', '#194B7B']}
              start={{ x: 0, y: 0 }}
              end={{ x: 2, y: 0 }}
            >
              <View className="py-4">
                <Text className="text-center font-semibold text-body text-white">
                  Login
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
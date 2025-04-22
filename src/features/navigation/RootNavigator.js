import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../auth/screens/HomeScreen';
import LoginScreen from '../auth/screens/LoginScreen';
import DashboardScreen from '../dashboard/screens/DashboardScreen';
import ReferralsScreen from '../referrals/screens/ReferralsScreen';
import RegisterScreen from '../RegisterForms/Screens/RegisterScreen';

const Stack = createNativeStackNavigator();

export function RootNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen 
        name="Dashboard" 
        component={DashboardScreen}
        options={{
          headerShown: false,
          gestureEnabled: false
        }}
      />
      <Stack.Screen 
        name="Referrals" 
        component={ReferralsScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen 
        name="Register" 
        component={RegisterScreen}
        options={{
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
}
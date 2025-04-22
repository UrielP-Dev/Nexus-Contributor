import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useUser } from '../../../context/UserContext';
import { referralService } from '../services/referralService';
import ReferralCard from '../components/ReferralCard';

const ReferralsScreen = () => {
  const [referrals, setReferrals] = useState([]);
  const [loading, setLoading] = useState(true);
  const { userData } = useUser();

  useEffect(() => {
    loadReferrals();
  }, []);

  const loadReferrals = async () => {
    try {
      if (!userData?.employee_number) {
        throw new Error('Número de empleado no disponible');
      }
      const referralData = await referralService.getReferralsByEmployeeNumber(userData.employee_number);
      console.log('Datos de referidos:', referralData);
      setReferrals(referralData);
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#006FB9" />
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="px-4 py-6">
        <Text className="text-h2 font-bold text-primary mb-4">
          Mis Registros
        </Text>
        <FlatList
          data={referrals}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <ReferralCard referral={item} />}
          ListEmptyComponent={
            <Text className="text-center text-text-soft mt-4">
              No tienes registros
            </Text>
          }
        />
      </View>
    </SafeAreaView>
  );
};

export default ReferralsScreen; 
import React from 'react';
import { View, FlatList, Text, ActivityIndicator } from 'react-native';
import ReferralCard from './ReferralCard';

const ReferralList = ({ referrals, loading }) => {
  if (loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#006FB9" />
      </View>
    );
  }

  return (
    <FlatList
      data={referrals}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <ReferralCard referral={item} />}
      contentContainerClassName="px-4"
      ListEmptyComponent={
        <View className="flex-1 justify-center items-center py-8">
          <Text className="text-text-soft text-center">
            No hay referidos registrados aún.{'\n'}
            Los referidos que registres aparecerán aquí.
          </Text>
        </View>
      }
    />
  );
};

export default ReferralList; 
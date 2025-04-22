import React from 'react';
import { View, Text } from 'react-native';

const ReferralProgress = ({ courseName, progress }) => {
  return (
    <View className="mb-2">
      <View className="flex-row justify-between mb-1">
        <Text className="text-text-soft text-sm">{courseName}</Text>
        <Text className="text-text-soft text-sm">{progress}%</Text>
      </View>
      <View className="h-2 bg-gray-200 rounded-full">
        <View 
          className="h-2 bg-primary rounded-full" 
          style={{ width: `${progress}%` }}
        />
      </View>
    </View>
  );
};

export default ReferralProgress; 
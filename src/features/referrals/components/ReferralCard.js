import React from 'react';
import { View, Text } from 'react-native';
import ReferralProgress from './ReferralProgress';

const ReferralCard = ({ referral }) => {
  return (
    <View className="bg-background-box p-4 rounded-lg mb-4 shadow-sm">
      <Text className="text-h4 font-bold text-primary">{referral.name}</Text>
      <View className="mt-2 space-y-1">
        <Text className="text-text-soft">
          CP: {referral.postalCode}
        </Text>
        <Text className="text-text-soft">
          Tel: {referral.phone}
        </Text>
        <Text className="text-text-soft">
          Registrado: {new Date(referral.registrationDate).toLocaleDateString()}
        </Text>
      </View>
      
      <View className="mt-4">
        <Text className="text-body font-semibold mb-2">Progreso en cursos:</Text>
        {referral.courseProgress.map((course, index) => (
          <ReferralProgress 
            key={index}
            courseName={course.name}
            progress={course.progress}
          />
        ))}
      </View>
    </View>
  );
};

export default ReferralCard; 
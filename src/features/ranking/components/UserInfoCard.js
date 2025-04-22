import React from "react";
import { Text, View } from "react-native";

export default function UserInformationCard({ user }) {
  const { name, employee_number, points } = user;
  return (
    <View>
      <Text>{user.name}</Text>
      <Text>{user.points}</Text>
    </View>
  );
}

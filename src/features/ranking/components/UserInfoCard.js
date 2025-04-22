import React from "react";
import { Text, View } from "react-native";
import { BarChart } from "react-native-gifted-charts";
import { LinearGradient } from "expo-linear-gradient";

export default function UserInformationCard({ user }) {
  const { name, points } = user;

  // Calculate gradient intensity based on points
  // Higher points = stronger/deeper yellow gradient
  const getGradientColors = () => {
    if (points <= 10) {
      return ["#1976D2", "#1E88E5"]; // Level 1: Deepest blue
    } else if (points <= 20) {
      return ["#2196F3", "#42A5F5"]; // Level 2: Medium blue
    } else if (points <= 30) {
      return ["#64B5F6", "#90CAF9"]; // Level 3: Light blue
    } else if (points <= 40) {
      return ["#BBDEFB", "#E3F2FD"]; // Level 4: Lightest blue
    } else if (points <= 50) {
      return ["#FFECB3", "#FFF8E1"]; // Level 5: Lightest yellow
    } else if (points <= 60) {
      return ["#FFD54F", "#FFE082"]; // Level 6: Light yellow
    } else if (points <= 70) {
      return ["#FFB300", "#FFCA28"]; // Level 7: Medium yellow
    } else {
      return ["#FF8F00", "#FFA000"]; // Level 8: Deep yellow/gold
    }
  };

  // Get the appropriate colors based on points
  const gradientColors = getGradientColors();

  return (
    <View className="rounded-md shadow-md overflow-hidden mx-1 my-2">
      <LinearGradient colors={gradientColors} className="p-6">
        <View className="flex-row justify-between items-center mb-2">
          <Text className="text-lg font-bold text-gray-800">{name}</Text>
          <View className="bg-white bg-opacity-60 px-3 py-1 rounded-full">
            <Text className="text-md font-semibold text-blue-800">
              {points} pts
            </Text>
          </View>
        </View>
      </LinearGradient>
    </View>
  );
}

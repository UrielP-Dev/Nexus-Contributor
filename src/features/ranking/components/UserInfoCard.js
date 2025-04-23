import React from "react";
import { Text, View } from "react-native";
import { Ionicons } from '@expo/vector-icons';

export default function UserInformationCard({ user, position }) {
  const { name, points } = user;
  
  const getPositionColor = () => {
    // Colores para posiciones fuera del podio
    if (position <= 10) return "#006FB9"; // Top 10: Azul
    if (position <= 20) return "#4CAF50"; // Top 20: Verde
    return "#757575"; // Resto: Gris
  };

  return (
    <View className="flex-row items-center bg-background-box rounded-lg p-3 mb-3">
      {/* Número de posición */}
      <View 
        className="w-10 h-10 rounded-full items-center justify-center mr-3"
        style={{ backgroundColor: `${getPositionColor()}15` }} // Color con opacidad
      >
        <Text 
          className="font-bold text-lg" 
          style={{ color: getPositionColor() }}
        >
          {position}
        </Text>
      </View>
      
      {/* Información del usuario */}
      <View className="flex-1">
        <Text className="font-medium text-text" numberOfLines={1} ellipsizeMode="tail">
          {name}
        </Text>
        <View className="flex-row items-center mt-1">
          <Ionicons name="star" size={14} color="#FFC107" />
          <Text className="ml-1 text-xs text-text-soft">
            {points} puntos
          </Text>
        </View>
      </View>
      
      {/* Botón de tendencia */}
      <View className="flex-row items-center bg-gray-100 px-2 py-1 rounded-lg">
        <Ionicons 
          name={points > 50 ? "trending-up" : "trending-down"} 
          size={16} 
          color={points > 50 ? "#4CAF50" : "#F44336"} 
        />
        <Text 
          className="ml-1 text-xs font-medium"
          style={{ color: points > 50 ? "#4CAF50" : "#F44336" }}
        >
          {points > 50 ? "+2" : "-1"}
        </Text>
      </View>
    </View>
  );
}
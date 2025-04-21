import React from "react";

export default function RankingScreen({ navigation }) {
  const handleNavigate = (router) => () => navigation.navigate(screen);

  return (
    <View className="flex-1 items-center justify-center bg-white">
      <Text className="text-h1 font-bold text-brand-afore mb-0">Ranking</Text>
      <Text className="text-body text-text text-center font-medium">
        Conectando emprendedores con las herramientas que necesitan para crecer
      </Text>
    </View>
  );
}

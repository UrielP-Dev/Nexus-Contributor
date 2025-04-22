import React, { useEffect, useState } from "react";
import { View, Text, ActivityIndicator, ScrollView } from "react-native";
import { BarChart } from "react-native-gifted-charts";
import { collection, query, getDocs } from "firebase/firestore";
import { db } from "../../../config/firebase";
import MainLayout from "../../layout/components/MainLayout";
import UserInformationCard from "../components/UserInfoCard";

export default function RankingScreen({ navigation }) {
  const [users, setUsers] = useState([]);
  const [firstThreeUsers, setFirstThreeUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  async function syncAllUsers() {
    try {
      const querySnapshot = await getDocs(query(collection(db, "users")));
      const userList = [];
      querySnapshot.forEach((doc) => {
        userList.push({ id: doc.id, ...doc.data() });
      });

      const sorted = userList.sort((a, b) => b.points - a.points);
      setFirstThreeUsers(sorted.slice(0, 3)); // Top 3
      setUsers(sorted.slice(3)); // Resto
    } catch (error) {
      console.error("Error loading users:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    syncAllUsers();
  }, []);

  // Reordenar para que el 1º lugar esté en el centro
  const reorderedUsers =
    firstThreeUsers.length === 3
      ? [firstThreeUsers[1], firstThreeUsers[0], firstThreeUsers[2]]
      : firstThreeUsers;

  // Crear los datos para el gráfico con los colores correctos según lugar original
  const barData = reorderedUsers.map((user) => {
    const realIndex = firstThreeUsers.findIndex((u) => u.id === user.id);

    let color = "#999";
    if (realIndex === 0) color = "#FFDD35"; // 1º - Amarillo
    else if (realIndex === 1) color = "#753CBD"; // 2º - Morado
    else if (realIndex === 2) color = "#006FB9"; // 3º - Azul

    return {
      value: user.points,
      label: user.name,
      frontColor: color,
      labelTextStyle: {
        color: "#333",
        fontWeight: "bold",
      },
      barBorderRadius: 8,
    };
  });

  return (
    <MainLayout navigation={navigation}>
      <View className="flex-1 p-4">
        <Text className="text-h2 font-bold text-primary mb-4">Ranking</Text>
        <Text className="text-body text-text text-center font-medium mb-6">
          Top 3 cobradores de Nexus
        </Text>

        {loading ? (
          <View className="flex-1 justify-center items-center mt-10">
            <ActivityIndicator size="large" color="#753CBD" />
            <Text className="mt-2 text-text font-medium">Cargando...</Text>
          </View>
        ) : (
          <View>
            <BarChart
              data={barData}
              isHorizontal
              barWidth={40}
              barBorderRadius={12}
              yAxisThickness={0}
              yAxisTextStyle={{ color: "transparent" }}
              showValuesOnTopOfBars={true}
              xAxisLabelTextStyle={{ color: "#555" }}
              noOfSections={3}
              spacing={50}
              xAxisColor="#eee"
              height={220}
            />
            <ScrollView className="mt-6 mb-96">
              {users.map((user) => (
                <UserInformationCard key={user.id} user={user} />
              ))}
            </ScrollView>
          </View>
        )}
      </View>
    </MainLayout>
  );
}

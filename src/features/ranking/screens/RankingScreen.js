import React, { useEffect, useState } from "react";
import { Text, View } from "react-native";
import MainLayout from "../../layout/components/MainLayout";
import { collection, query, getDocs } from "firebase/firestore";
import { db } from "../../../config/firebase";
import UserInformationCard from "../components/UserInfoCard";

export default function RankingScreen({ navigation }) {
  const [users, setUsers] = useState([]);

  async function syncAllUsers() {
    const querySnapshot = await getDocs(query(collection(db, "users")));
    const userList = [];
    querySnapshot.forEach((doc) => {
      userList.push({ id: doc.id, ...doc.data() });
    });
    setUsers(userList.sort((a, b) => b.points - a.points));
  }

  useEffect(() => {
    syncAllUsers();
  }, []);

  return (
    <MainLayout navigation={navigation}>
      <View className="flex-1 p-4">
        <View className="mb-6">
          <Text className="text-h2 font-bold text-primary">Ranking</Text>
          <Text className="text-body text-text text-center font-medium">
            Los mejores cobradores de Nexus
          </Text>
          {users.map((user) => (
            <UserInformationCard key={user.id} user={user} />
          ))}
        </View>
      </View>
    </MainLayout>
  );
}

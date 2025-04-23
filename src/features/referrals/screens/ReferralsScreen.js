import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  Alert,
  ScrollView,
  TouchableOpacity,
  Image,
} from "react-native";
import { useUser } from "../../../context/UserContext";
import { Ionicons } from "@expo/vector-icons";
import MainLayout from "../../layout/components/MainLayout";

// Datos simulados de microempresarios para pruebas
const mockMicroempresarios = [
  {
    id: "1",
    name: "María",
    last_name: "González",
    email: "maria.gonzalez@example.com",
    phone: "5551234567",
    business_name: "Artesanías María",
    business_type: "Artesanías",
    registration_date: "2023-10-15",
  },
  {
    id: "2",
    name: "Juan",
    last_name: "Pérez",
    email: "juan.perez@example.com",
    phone: "5552345678",
    business_name: "Abarrotes Don Juan",
    business_type: "Tienda",
    registration_date: "2023-10-18",
  },
  {
    id: "3",
    name: "Ana",
    last_name: "Rodríguez",
    email: "ana.rodriguez@example.com",
    phone: "5553456789",
    business_name: "Cosméticos Ana",
    business_type: "Belleza",
    registration_date: "2023-10-20",
  },
  {
    id: "4",
    name: "Carlos",
    last_name: "López",
    email: "carlos.lopez@example.com",
    phone: "5554567890",
    business_name: "Taller Mecánico López",
    business_type: "Servicios",
    registration_date: "2023-10-25",
  },
  {
    id: "5",
    name: "Patricia",
    last_name: "Martínez",
    email: "patricia.martinez@example.com",
    phone: "5555678901",
    business_name: "Papelería Patty",
    business_type: "Papelería",
    registration_date: "2023-11-02",
  },
  {
    id: "6",
    name: "Miguel",
    last_name: "Sánchez",
    email: "miguel.sanchez@example.com",
    phone: "5556789012",
    business_name: "Taquería Don Miguel",
    business_type: "Alimentos",
    registration_date: "2023-11-05",
  },
  {
    id: "7",
    name: "Laura",
    last_name: "Torres",
    email: "laura.torres@example.com",
    phone: "5557890123",
    business_name: "Boutique Elegante",
    business_type: "Ropa",
    registration_date: "2023-11-10",
  },
  {
    id: "8",
    name: "Roberto",
    last_name: "Flores",
    email: "roberto.flores@example.com",
    phone: "5558901234",
    business_name: "Ferretería Flores",
    business_type: "Ferretería",
    registration_date: "2023-11-15",
  },
  {
    id: "9",
    name: "Sofía",
    last_name: "Ramírez",
    email: "sofia.ramirez@example.com",
    phone: "5559012345",
    business_name: "Pastelería Sofía",
    business_type: "Panadería",
    registration_date: "2023-11-20",
  },
  {
    id: "10",
    name: "Daniel",
    last_name: "Mendoza",
    email: "daniel.mendoza@example.com",
    phone: "5550123456",
    business_name: "Electrónica Mendoza",
    business_type: "Electrónica",
    registration_date: "2023-11-25",
  },
  {
    id: "11",
    name: "Carmen",
    last_name: "Herrera",
    email: "carmen.herrera@example.com",
    phone: "5551234567",
    business_name: "Florería Carmen",
    business_type: "Florería",
    registration_date: "2023-12-01",
  },
  {
    id: "12",
    name: "Javier",
    last_name: "Díaz",
    email: "javier.diaz@example.com",
    phone: "5552345678",
    business_name: "Carpintería Díaz",
    business_type: "Carpintería",
    registration_date: "2023-12-05",
  },
  {
    id: "13",
    name: "Elena",
    last_name: "Castro",
    email: "elena.castro@example.com",
    phone: "5553456789",
    business_name: "Estética Elena",
    business_type: "Belleza",
    registration_date: "2023-12-10",
  },
  {
    id: "14",
    name: "Fernando",
    last_name: "Ortiz",
    email: "fernando.ortiz@example.com",
    phone: "5554567890",
    business_name: "Zapatería Ortiz",
    business_type: "Calzado",
    registration_date: "2023-12-15",
  },
  {
    id: "15",
    name: "Gabriela",
    last_name: "Vargas",
    email: "gabriela.vargas@example.com",
    phone: "5555678901",
    business_name: "Cafetería Gaby",
    business_type: "Cafetería",
    registration_date: "2023-12-20",
  },
];

// Datos simulados de webinars disponibles
const mockWebinars = [
  {
    id: "1",
    title: "Fundamentos del Negocio Digital",
    date: "2023-10-10",
    duration: "60 min",
  },
  {
    id: "2",
    title: "Marketing para Microempresas",
    date: "2023-10-20",
    duration: "45 min",
  },
  {
    id: "3",
    title: "Gestión Financiera Básica",
    date: "2023-11-05",
    duration: "90 min",
  },
  {
    id: "4",
    title: "Atención al Cliente",
    date: "2023-11-15",
    duration: "60 min",
  },
  {
    id: "5",
    title: "Estrategias de Crecimiento",
    date: "2023-12-01",
    duration: "75 min",
  },
];

// Función ajustada para generar datos simulados de progreso con mínimo de 56 llaves
const generateMockData = (id) => {
  // Generar datos con variabilidad pero que algunos tengan progreso destacado (alto o bajo)
  const isHighPerformer = id % 5 === 0; // Cada 5to registro es un alto rendimiento
  const isLowPerformer = id % 7 === 0; // Cada 7mo registro es un rendimiento moderado-bajo

  let webinarsCompleted;

  if (isHighPerformer) {
    // Alto rendimiento: entre 45-85 webinars (315-595 llaves)
    webinarsCompleted = Math.floor(Math.random() * 41) + 45;
  } else if (isLowPerformer) {
    // Rendimiento moderado-bajo: entre 8-20 webinars (56-140 llaves)
    webinarsCompleted = Math.floor(Math.random() * 13) + 8;
  } else {
    // Rendimiento promedio: entre 15-45 webinars (105-315 llaves)
    webinarsCompleted = Math.floor(Math.random() * 31) + 15;
  }

  // Exactamente 7 llaves por webinar completado
  const keysCollected = webinarsCompleted * 7;

  // Último webinar completado (para mostrar progreso reciente)
  const completedWebinarIds = [];
  for (let i = 0; i < webinarsCompleted; i++) {
    completedWebinarIds.push(String(i + 1));
  }

  // Calcular progreso general basado en webinars completados
  const progress = webinarsCompleted / 85;

  // Generar fecha de última actividad (más reciente para los de alto rendimiento)
  const daysAgo = isHighPerformer
    ? Math.floor(Math.random() * 3)
    : isLowPerformer
    ? Math.floor(Math.random() * 14) + 7
    : Math.floor(Math.random() * 7);
  const lastActivity = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000)
    .toISOString()
    .split("T")[0];

  return {
    id,
    webinarsCompleted,
    totalWebinars: 85,
    keysCollected,
    totalKeys: 595, // 85 cursos × 7 llaves = 595 llaves totales
    progress,
    lastActivity,
    completedWebinarIds,
    pendingTasks: Math.floor(Math.random() * 3), // 0-2 tareas pendientes
    percentileRanking: Math.floor(Math.random() * 100) + 1, // Ranking percentil 1-100
  };
};

// Componente para la barra de progreso
const ProgressBar = ({ progress, label, emoji, color = "#006FB9" }) => (
  <View className="mb-4">
    <View className="flex-row justify-between mb-1">
      <Text className="text-text-soft text-sm">
        {emoji} {label}
      </Text>
      <Text className="text-text-soft text-sm font-medium">
        {Math.round(progress * 100)}%
      </Text>
    </View>
    <View className="h-2.5 bg-gray-200 rounded-full">
      <View
        className="h-2.5 rounded-full"
        style={{ width: `${progress * 100}%`, backgroundColor: color }}
      />
    </View>
  </View>
);

// Componente para las estadísticas
const StatCard = ({ title, value, total, emoji }) => (
  <View className="bg-white rounded-xl p-4 shadow-sm flex-1 mx-1">
    <Text className="text-lg font-bold text-center mb-1">{emoji}</Text>
    <Text className="text-center font-medium">{title}</Text>
    <Text className="text-center text-primary text-xl font-bold">
      {value}/{total}
    </Text>
  </View>
);

// Componente para incentivos con niveles y candados
const IncentiveLevel = ({
  level,
  title,
  description,
  icon,
  isUnlocked,
  isActive,
}) => (
  <View
    className={`bg-white rounded-xl p-4 mb-3 shadow-sm ${
      isActive ? "border-2 border-primary" : ""
    }`}
  >
    <View className="flex-row items-center">
      <View
        className={`w-12 h-12 rounded-full justify-center items-center mr-3 ${
          isUnlocked ? "bg-primary-light" : "bg-gray-200"
        }`}
      >
        <Text className="text-2xl">{icon}</Text>
      </View>
      <View className="flex-1">
        <View className="flex-row items-center">
          <Text className="font-bold text-base">{title}</Text>
          {!isUnlocked && (
            <Ionicons
              name="lock-closed"
              size={16}
              color="#888"
              style={{ marginLeft: 6 }}
            />
          )}
          {isUnlocked && (
            <Ionicons
              name="checkmark-circle"
              size={16}
              color="#4CAF50"
              style={{ marginLeft: 6 }}
            />
          )}
        </View>
        <Text className="text-text-soft text-sm">{description}</Text>
      </View>
      <View className="bg-gray-100 px-2 py-1 rounded-full">
        <Text className="text-xs font-medium">Nivel {level}</Text>
      </View>
    </View>
  </View>
);

// Componente para la tarjeta de microempresario con su progreso
const MicroempresarioCard = ({
  referral,
  progressData,
  onPress,
  isSelected,
}) => (
  <TouchableOpacity
    onPress={onPress}
    className={`bg-white rounded-xl p-4 mb-3 shadow-sm ${
      isSelected ? "border-2 border-primary" : ""
    }`}
  >
    <View className="flex-row justify-between items-center mb-2">
      <View className="flex-row items-center">
        <Text className="text-xl mr-2">👤</Text>
        <View>
          <Text className="font-bold">
            {referral.name} {referral.last_name}
          </Text>
          <Text className="text-text-soft text-xs">{referral.email}</Text>
        </View>
      </View>
      <View className="bg-gray-100 px-2 py-1 rounded-full">
        <Text className="text-xs font-medium">
          {progressData.keysCollected} 🔑
        </Text>
      </View>
    </View>

    <View className="mb-2">
      <View className="flex-row justify-between mb-1">
        <Text className="text-text-soft text-xs">Progreso General</Text>
        <Text className="text-text-soft text-xs">
          {Math.round(progressData.progress * 100)}%
        </Text>
      </View>
      <View className="h-2 bg-gray-200 rounded-full">
        <View
          className="h-2 rounded-full"
          style={{
            width: `${progressData.progress * 100}%`,
            backgroundColor:
              progressData.progress > 0.7
                ? "#4CAF50"
                : progressData.progress > 0.3
                ? "#FF9800"
                : "#F44336",
          }}
        />
      </View>
    </View>

    <View className="flex-row justify-between items-center">
      <Text className="text-text-soft text-xs">
        <Ionicons name="time-outline" size={12} /> Última actividad:{" "}
        {progressData.lastActivity}
      </Text>
      <Text className="text-xs text-primary">
        Ver detalles <Ionicons name="chevron-down" size={12} />
      </Text>
    </View>
  </TouchableOpacity>
);

// Componente para mostrar detalles de progreso de un microempresario
const MicroempresarioProgressDetails = ({ progressData, onClose }) => (
  <View className="bg-white rounded-xl p-4 mb-4 shadow-sm">
    <View className="flex-row justify-between mb-3">
      <Text className="text-lg font-bold">Progreso Detallado 📊</Text>
      <TouchableOpacity onPress={onClose}>
        <Text className="text-primary font-medium">Cerrar</Text>
      </TouchableOpacity>
    </View>

    <ProgressBar
      progress={progressData.webinarsCompleted / progressData.totalWebinars}
      label={`Webinars (${progressData.webinarsCompleted}/${progressData.totalWebinars})`}
      emoji="🎓"
      color="#4CAF50"
    />

    <ProgressBar
      progress={progressData.keysCollected / progressData.totalKeys}
      label={`Llaves (${progressData.keysCollected}/${progressData.totalKeys})`}
      emoji="🔑"
      color="#FF9800"
    />

    <View className="flex-row mt-3">
      <StatCard
        title="Webinars"
        value={progressData.webinarsCompleted}
        total={progressData.totalWebinars}
        emoji="🎓"
      />
      <StatCard
        title="Llaves"
        value={progressData.keysCollected}
        total={progressData.totalKeys}
        emoji="🔑"
      />
    </View>

    {/* Información de llaves de bonificación */}
    {progressData.keysCollected > progressData.webinarsCompleted * 7 && (
      <View className="bg-yellow-50 p-3 rounded-lg mt-3">
        <Text className="font-medium text-yellow-700">⭐ Bonificación:</Text>
        <Text className="text-yellow-800 mt-1">
          Este microempresario ha obtenido{" "}
          {progressData.keysCollected - progressData.webinarsCompleted * 7}{" "}
          llaves adicionales por actividades complementarias.
        </Text>
      </View>
    )}

    {/* Estado del microempresario */}
    <View className="bg-blue-50 p-3 rounded-lg mt-4">
      <Text className="font-medium text-primary">Estado actual:</Text>
      <Text className="text-text-soft mt-1">
        {progressData.webinarsCompleted === progressData.totalWebinars
          ? "✅ Ha completado todos los webinars."
          : `⏳ Le faltan ${
              progressData.totalWebinars - progressData.webinarsCompleted
            } webinars por completar.`}
      </Text>
      <Text className="text-text-soft mt-1">
        {progressData.keysCollected === progressData.totalKeys
          ? "✅ Ha recolectado todas las llaves."
          : `⏳ Le faltan ${
              progressData.totalKeys - progressData.keysCollected
            } llaves por recolectar.`}
      </Text>
      <Text className="text-text-soft mt-1">
        📊 Se encuentra en el percentil {progressData.percentileRanking} de
        todos los microempresarios.
      </Text>
    </View>

    {/* Recomendación de acción */}
    <View className="bg-green-50 p-3 rounded-lg mt-3">
      <Text className="font-medium text-green-700">Acción recomendada:</Text>
      <Text className="text-green-800 mt-1">
        {progressData.webinarsCompleted < progressData.totalWebinars
          ? "📞 Contacta al microempresario para animarle a completar los webinars pendientes."
          : progressData.keysCollected < progressData.totalKeys
          ? "📞 Recuérdale que debe completar las actividades para obtener más llaves."
          : "🎉 ¡Felicita al microempresario por completar todo el programa!"}
      </Text>
    </View>
  </View>
);

const ReferralsScreen = ({ navigation }) => {
  const [referrals, setReferrals] = useState([]);
  const [loading, setLoading] = useState(true);
  const { userData } = useUser();
  const [selectedReferralId, setSelectedReferralId] = useState(null);
  const [referralProgressData, setReferralProgressData] = useState({});
  const [userProgress, setUserProgress] = useState({
    totalRegistros: 0,
    metaSemanal: 15,
    registrosSemana: 0,
    nivel: 1,
  });
  const [sortOption, setSortOption] = useState("keys"); // 'keys', 'progress', 'recent'

  useEffect(() => {
    loadReferrals();
  }, []);

  const loadReferrals = async () => {
    try {
      if (!userData?.employee_number) {
        throw new Error("Número de empleado no disponible");
      }

      // En un entorno real, obtendrías estos datos de la API
      // Por ahora usamos los datos simulados
      const referralData = mockMicroempresarios;
      console.log("Datos de microempresarios:", referralData);

      // Generar datos de progreso simulados para cada microempresario
      const progressDataMap = {};
      referralData.forEach((referral) => {
        progressDataMap[referral.id] = generateMockData(referral.id);
      });

      setReferrals(referralData);
      setReferralProgressData(progressDataMap);

      // Simular datos de progreso del usuario
      setUserProgress({
        totalRegistros: referralData.length,
        metaSemanal: 15,
        registrosSemana: Math.min(referralData.length, 8), // Simulamos registros de esta semana
        nivel: referralData.length > 20 ? 3 : referralData.length > 10 ? 2 : 1,
      });
    } catch (error) {
      Alert.alert("Error", error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleReferralPress = (id) => {
    setSelectedReferralId(selectedReferralId === id ? null : id);
  };

  // Ordenar la lista de microempresarios según la opción seleccionada
  const getSortedReferrals = () => {
    if (!referrals.length) return [];

    return [...referrals].sort((a, b) => {
      const progressA = referralProgressData[a.id];
      const progressB = referralProgressData[b.id];

      if (!progressA || !progressB) return 0;

      switch (sortOption) {
        case "keys":
          return progressB.keysCollected - progressA.keysCollected;
        case "progress":
          return progressB.progress - progressA.progress;
        case "recent":
          return (
            new Date(progressB.lastActivity) - new Date(progressA.lastActivity)
          );
        default:
          return 0;
      }
    });
  };

  // Calcular estadísticas generales
  const calculateStats = () => {
    if (Object.keys(referralProgressData).length === 0)
      return {
        totalWebinars: 0,
        totalWebinarsCompleted: 0,
        totalKeys: 0,
        totalKeysCollected: 0,
        highestProgress: 0,
        lowestProgress: 0,
      };

    const stats = Object.values(referralProgressData).reduce(
      (acc, data) => {
        return {
          totalWebinars: acc.totalWebinars + data.totalWebinars,
          totalWebinarsCompleted:
            acc.totalWebinarsCompleted + data.webinarsCompleted,
          totalKeys: acc.totalKeys + data.totalKeys,
          totalKeysCollected: acc.totalKeysCollected + data.keysCollected,
          highestProgress: Math.max(acc.highestProgress, data.progress),
          lowestProgress:
            acc.lowestProgress === 0
              ? data.progress
              : Math.min(acc.lowestProgress, data.progress),
        };
      },
      {
        totalWebinars: 0,
        totalWebinarsCompleted: 0,
        totalKeys: 0,
        totalKeysCollected: 0,
        highestProgress: 0,
        lowestProgress: 0,
      }
    );

    return stats;
  };

  const stats = calculateStats();
  const sortedReferrals = getSortedReferrals();

  if (loading) {
    return (
      <MainLayout navigation={navigation}>
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#006FB9" />
        </View>
      </MainLayout>
    );
  }

  return (
    <MainLayout navigation={navigation}>
      <View className="flex-1 bg-background">
        <ScrollView>
          <View className="px-4 py-6">
            <Text className="text-h2 font-bold text-primary mb-4">
              Mis Registros
            </Text>

            {/* Tarjeta de Progreso del Usuario */}
            <View className="bg-white rounded-xl p-4 mb-6 shadow-sm">
              <View className="flex-row justify-between items-center mb-4">
                <View>
                  <Text className="text-lg font-bold">Tu Progreso</Text>
                  <Text className="text-text-soft">
                    Nivel actual: {userProgress.nivel}
                  </Text>
                </View>
                <View className="bg-primary-light px-3 py-1 rounded-full">
                  <Text className="text-primary font-medium">
                    {userProgress.totalRegistros} Registros
                  </Text>
                </View>
              </View>

              {/* Meta semanal */}
              <View className="mb-4">
                <View className="flex-row justify-between mb-1">
                  <Text className="text-text-soft text-sm">
                    🎯 Meta semanal ({userProgress.registrosSemana}/
                    {userProgress.metaSemanal})
                  </Text>
                  <Text className="text-text-soft text-sm font-medium">
                    {Math.round(
                      (userProgress.registrosSemana /
                        userProgress.metaSemanal) *
                        100
                    )}
                    %
                  </Text>
                </View>
                <View className="h-2.5 bg-gray-200 rounded-full">
                  <View
                    className="h-2.5 rounded-full bg-green-500"
                    style={{
                      width: `${
                        (userProgress.registrosSemana /
                          userProgress.metaSemanal) *
                        100
                      }%`,
                    }}
                  />
                </View>
              </View>

              {/* Estadísticas rápidas */}
              <View className="flex-row mt-2">
                <View className="bg-blue-50 rounded-lg p-3 flex-1 mr-2">
                  <Text className="text-center text-sm text-text-soft">
                    Esta semana
                  </Text>
                  <Text className="text-center text-primary text-xl font-bold">
                    {userProgress.registrosSemana}
                  </Text>
                </View>
                <View className="bg-purple-50 rounded-lg p-3 flex-1">
                  <Text className="text-center text-sm text-text-soft">
                    Total
                  </Text>
                  <Text className="text-center text-purple-600 text-xl font-bold">
                    {userProgress.totalRegistros}
                  </Text>
                </View>
              </View>
            </View>

            {/* Niveles de Incentivos */}
            <Text className="text-lg font-bold mb-3">
              Niveles de Recompensa 🏆
            </Text>
            <View className="mb-6">
              <IncentiveLevel
                level={1}
                title="Nivel Básico"
                description="Acceso a herramientas básicas de referidos"
                icon="🔰"
                isUnlocked={userProgress.nivel >= 1}
                isActive={userProgress.nivel === 1}
              />
              <IncentiveLevel
                level={2}
                title="Nivel Intermedio"
                description="Bonos especiales y acceso a webinars exclusivos"
                icon="⭐"
                isUnlocked={userProgress.nivel >= 2}
                isActive={userProgress.nivel === 2}
              />
              <IncentiveLevel
                level={3}
                title="Nivel Experto"
                description="Recompensas premium y reconocimiento especial"
                icon="🏅"
                isUnlocked={userProgress.nivel >= 3}
                isActive={userProgress.nivel === 3}
              />
            </View>

            {/* Sección de Progreso de Microempresarios */}
            <View className="mb-6">
              <View className="flex-row justify-between items-center mb-3">
                <Text className="text-lg font-bold">
                  Progreso de Microempresarios 📊
                </Text>
                <View className="bg-gray-100 px-3 py-1 rounded-full">
                  <Text className="text-xs font-medium">
                    {userProgress.totalRegistros} registros
                  </Text>
                </View>
              </View>

              <View className="bg-white rounded-xl p-4 shadow-sm mb-4">
                <Text className="font-medium mb-3">Resumen de actividad:</Text>

                <ProgressBar
                  progress={
                    stats.totalWebinarsCompleted / (stats.totalWebinars || 1)
                  }
                  label={`Webinars completados`}
                  emoji="🎓"
                  color="#4CAF50"
                />

                <ProgressBar
                  progress={stats.totalKeysCollected / (stats.totalKeys || 1)}
                  label={`Llaves recolectadas`}
                  emoji="🔑"
                  color="#FF9800"
                />

                <View className="bg-blue-50 p-3 rounded-lg mt-3">
                  <Text className="text-primary font-medium">
                    💡 Tip: Contacta a los microempresarios con menor progreso
                    para ayudarles a avanzar.
                  </Text>
                </View>
              </View>

              {/* Opciones de ordenamiento */}
              <View className="flex-row justify-between bg-white rounded-xl p-2 mb-3 shadow-sm">
                <TouchableOpacity
                  onPress={() => setSortOption("keys")}
                  className={`flex-1 p-2 rounded-lg ${
                    sortOption === "keys" ? "bg-primary-light" : ""
                  }`}
                >
                  <Text
                    className={`text-center ${
                      sortOption === "keys"
                        ? "text-primary font-medium"
                        : "text-text-soft"
                    }`}
                  >
                    🔑 Llaves
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setSortOption("progress")}
                  className={`flex-1 p-2 rounded-lg ${
                    sortOption === "progress" ? "bg-primary-light" : ""
                  }`}
                >
                  <Text
                    className={`text-center ${
                      sortOption === "progress"
                        ? "text-primary font-medium"
                        : "text-text-soft"
                    }`}
                  >
                    📈 Progreso
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => setSortOption("recent")}
                  className={`flex-1 p-2 rounded-lg ${
                    sortOption === "recent" ? "bg-primary-light" : ""
                  }`}
                >
                  <Text
                    className={`text-center ${
                      sortOption === "recent"
                        ? "text-primary font-medium"
                        : "text-text-soft"
                    }`}
                  >
                    🕒 Reciente
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Lista de Microempresarios */}
            <Text className="text-lg font-bold mb-3">
              Microempresarios Registrados
            </Text>
            <FlatList
              data={sortedReferrals}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <View>
                  <MicroempresarioCard
                    referral={item}
                    progressData={referralProgressData[item.id]}
                    onPress={() => handleReferralPress(item.id)}
                    isSelected={selectedReferralId === item.id}
                  />

                  {selectedReferralId === item.id && (
                    <MicroempresarioProgressDetails
                      progressData={referralProgressData[item.id]}
                      onClose={() => setSelectedReferralId(null)}
                    />
                  )}
                </View>
              )}
              ListEmptyComponent={
                <View className="bg-white rounded-xl p-6 items-center">
                  <Text className="text-5xl mb-2">🔍</Text>
                  <Text className="text-center text-text-soft">
                    No tienes microempresarios registrados aún
                  </Text>
                  <Text className="text-center text-primary mt-2 font-medium">
                    ¡Comienza a compartir tu código!
                  </Text>
                </View>
              }
              scrollEnabled={false}
            />

            {/* Asegurar que la última parte tenga suficiente espacio */}
            <View className="h-16"></View>
          </View>
        </ScrollView>
      </View>
    </MainLayout>
  );
};

export default ReferralsScreen;

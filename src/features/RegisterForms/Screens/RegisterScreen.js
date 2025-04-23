import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, Modal, ScrollView, Animated, Dimensions, Image, Pressable, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import { useUser } from '../../../context/UserContext';
import { Ionicons } from '@expo/vector-icons';
import MainLayout from '../../layout/components/MainLayout';
import VoiceRecognizer from '../components/VoiceRecognizer';

const { width } = Dimensions.get('window');

// Definir límites para CDMX (o el área que prefieras)
const LOCATION_BOUNDS = {
  north: 19.5365,
  south: 19.3208,
  east: -99.0476,
  west: -99.2443
};

// Función para generar coordenadas aleatorias
const getRandomLocation = () => {
  const lat = LOCATION_BOUNDS.south + (Math.random() * (LOCATION_BOUNDS.north - LOCATION_BOUNDS.south));
  const lng = LOCATION_BOUNDS.west + (Math.random() * (LOCATION_BOUNDS.east - LOCATION_BOUNDS.west));
  return { 
    latitude: Number(lat.toFixed(6)), 
    longitude: Number(lng.toFixed(6)) 
  };
};

const RegisterScreen = ({ navigation }) => {
  const { user, userData } = useUser();
  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [businessType, setBusinessType] = useState('');
  const [showBusinessTypeMenu, setShowBusinessTypeMenu] = useState(false);
  const [registeredUserId, setRegisteredUserId] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;

  // Opciones de tipo de negocio
  const businessTypeOptions = [
    'Tienda de abarrotes',
    'Restaurante/Comida',
    'Servicios profesionales',
    'Venta por catálogo',
    'Artesanías',
    'Papelería',
    'Ropa y accesorios',
    'Belleza y estética',
    'Tecnología/Electrónica',
    'Otro'
  ];

  // Datos para el carrusel informativo
  const carouselData = [
    {
      id: '1',
      title: 'Registra Microempresarios',
      description: 'Por cada microempresario registrado que complete cursos, aumentas tus posibilidades de incentivos.',
      icon: '🚀',
    },
    {
      id: '2',
      title: 'Seguimiento Completo',
      description: 'Monitorea el progreso de los cursos y las llaves obtenidas por cada microempresario.',
      icon: '📊',
    },
    {
      id: '3',
      title: 'Desbloquea Niveles',
      description: 'Conforme tus referidos avancen, desbloquearás nuevos niveles de beneficios.',
      icon: '🔓',
    },
  ];

  // Usar user como respaldo si userData no está disponible
  const currentUser = userData || user;

  useEffect(() => {
    console.log("Estado de usuario actual:", currentUser);
    
    // Si no hay usuario, mostrar alerta
    if (!currentUser) {
      Alert.alert(
        'No hay sesión activa',
        'Para registrar microempresarios necesitas iniciar sesión primero.',
        [
          {
            text: 'Ir a Login',
            onPress: () => navigation.navigate('Login')
          },
          {
            text: 'Continuar como invitado',
            style: 'cancel'
          }
        ]
      );
    }
  }, [currentUser, navigation]);

  const FIXED_PIN = '0909';

  const handleRegister = async () => {
    try {
      console.log("Intentando registrar, estado del usuario:", currentUser);

      if (!name || !phoneNumber || !postalCode) {
        Alert.alert('Error', 'Por favor completa todos los campos obligatorios');
        return;
      }

      // Generar coordenadas aleatorias
      const locationData = getRandomLocation();
      console.log("Ubicación generada:", locationData);

      const db = getFirestore();
      const registersRef = collection(db, 'registers');
      
      // Usar el número de empleado del usuario o un valor por defecto
      const referrerId = currentUser?.employee_number || 
                         currentUser?.employeeNumber || 
                         currentUser?.id || 
                         'guest-user';
                         
      console.log("Número de empleado que se usará como ID de referidor:", referrerId);
      
      const docRef = await addDoc(registersRef, {
        name,
        phone: phoneNumber,
        postalCode,
        businessName: businessName || 'No especificado',
        businessType: businessType || 'No especificado',
        pin: FIXED_PIN,
        referrerId: referrerId,
        registrationDate: new Date().toISOString(),
        courseProgress: [],
        keysCollected: 0,
        webinarsCompleted: 0,
        created_at: new Date(),
        // Agregar coordenadas de ubicación
        latitude: locationData.latitude,
        longitude: locationData.longitude
      });

      setRegisteredUserId(docRef.id);
      Alert.alert(
        '¡Registro Exitoso!', 
        `El microempresario ha sido registrado correctamente. Su PIN de acceso es: ${FIXED_PIN}`,
        [
          {
            text: 'Ver todos mis registros',
            onPress: () => navigation.navigate('Referrals')
          },
          {
            text: 'Registrar otro',
            onPress: () => {
              // Limpiar campos
              setName('');
              setPhoneNumber('');
              setPostalCode('');
              setBusinessName('');
              setBusinessType('');
            }
          }
        ]
      );
    } catch (error) {
      console.error('Error al registrar:', error);
      Alert.alert('Error', error.message || 'Error al registrar microempresario');
    }
  };

  // Selector de Tipo de Negocio
  const BusinessTypeSelector = () => (
    <Modal
      visible={showBusinessTypeMenu}
      transparent={true}
      animationType="slide"
      onRequestClose={() => setShowBusinessTypeMenu(false)}
    >
      <View className="flex-1 justify-end bg-black bg-opacity-50">
        <View className="bg-white rounded-t-xl p-5">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-h3 font-bold text-primary">Tipo de Negocio</Text>
            <TouchableOpacity onPress={() => setShowBusinessTypeMenu(false)}>
              <Ionicons name="close" size={24} color="#006FB9" />
            </TouchableOpacity>
          </View>
          
          <ScrollView className="max-h-80">
            {businessTypeOptions.map((option, index) => (
              <TouchableOpacity 
                key={index}
                className={`p-4 ${index < businessTypeOptions.length - 1 ? 'border-b border-border-neutral' : ''}`}
                onPress={() => {
                  setBusinessType(option);
                  setShowBusinessTypeMenu(false);
                }}
              >
                <Text className={`text-body ${businessType === option ? 'text-primary font-bold' : 'text-text'}`}>
                  {option}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );

  // Elemento del carrusel
  const renderCarouselItem = ({ item }) => {
    return (
      <View className="px-6 py-4">
        <View className="bg-white rounded-xl p-6 shadow-sm">
          <View className="justify-center items-center mb-3">
            <Text className="text-5xl">{item.icon}</Text>
          </View>
          <Text className="text-xl font-bold text-primary text-center mb-2">
            {item.title}
          </Text>
          <Text className="text-body text-text-soft text-center">
            {item.description}
          </Text>
        </View>
      </View>
    );
  };

  // Indicadores de página del carrusel
  const renderDotIndicators = () => {
    return carouselData.map((_, index) => {
      const inputRange = [(index - 1) * width, index * width, (index + 1) * width];
      
      const dotWidth = scrollX.interpolate({
        inputRange,
        outputRange: [8, 16, 8],
        extrapolate: 'clamp',
      });
      
      const opacity = scrollX.interpolate({
        inputRange,
        outputRange: [0.3, 1, 0.3],
        extrapolate: 'clamp',
      });
      
      return (
        <Animated.View
          key={`dot-${index}`}
          className="h-2 rounded-full mx-1 bg-primary"
          style={{
            width: dotWidth,
            opacity: opacity,
          }}
        />
      );
    });
  };

  // Función para manejar los datos extraídos del reconocimiento de voz
  const handleExtractedData = (data) => {
    if (data.nombre) setName(data.nombre);
    if (data.telefono) setPhoneNumber(data.telefono);
    if (data.codigoPostal) setPostalCode(data.codigoPostal);
    if (data.nombreNegocio) setBusinessName(data.nombreNegocio);
    if (data.tipoNegocio) setBusinessType(data.tipoNegocio);
  };

  return (
    <MainLayout navigation={navigation}>
      <ScrollView className="flex-1 bg-background">
        {/* Cabecera */}
        <View className="px-6 pt-3">
          <Text className="text-h2 font-bold text-primary mb-2">Registrar Microempresario</Text>
          {userData ? (
            <Text className="text-body text-text-soft mb-1">
              Registrando como: {userData.name || userData.email || userData.employee_number || "Usuario autenticado"}
            </Text>
          ) : (
            <Text className="text-body text-semantic-warning mb-1">
              Estado de autenticación no disponible
            </Text>
          )}
        </View>

        {/* Carrusel informativo */}
        <View className="my-3">
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={Animated.event(
              [{ nativeEvent: { contentOffset: { x: scrollX } } }],
              { useNativeDriver: false }
            )}
            scrollEventThrottle={16}
            decelerationRate="fast"
            snapToInterval={width}
            snapToAlignment="center"
          >
            {carouselData.map((item) => (
              <View key={item.id} style={{ width }}>
                {renderCarouselItem({ item })}
              </View>
            ))}
          </ScrollView>
          <View className="flex-row justify-center my-4">
            {renderDotIndicators()}
          </View>
        </View>

        {/* Formulario */}
        <View className="px-6 pt-1 mb-4">
          <View className="bg-white rounded-xl p-5 shadow-sm">
            <Text className="text-lg font-semibold text-primary mb-4">
              Información del Microempresario
            </Text>
            
            {/* Componente de reconocimiento de voz */}
            <VoiceRecognizer onDataExtracted={handleExtractedData} />
            
            <View className="space-y-4">
              <View>
                <Text className="text-sm text-text-soft mb-1">Nombre completo <Text className="text-semantic-error">*</Text></Text>
                <TextInput
                  className="bg-background-box p-4 rounded-lg border border-border-neutral"
                  placeholder="Ej. María González López"
                  value={name}
                  onChangeText={setName}
                />
              </View>
              
              <View>
                <Text className="text-sm text-text-soft mb-1">Número de teléfono <Text className="text-semantic-error">*</Text></Text>
                <TextInput
                  className="bg-background-box p-4 rounded-lg border border-border-neutral"
                  placeholder="Ej. 5551234567"
                  value={phoneNumber}
                  onChangeText={setPhoneNumber}
                  keyboardType="phone-pad"
                />
              </View>

              <View>
                <Text className="text-sm text-text-soft mb-1">Código postal <Text className="text-semantic-error">*</Text></Text>
                <TextInput
                  className="bg-background-box p-4 rounded-lg border border-border-neutral"
                  placeholder="Ej. 06700"
                  value={postalCode}
                  onChangeText={setPostalCode}
                  keyboardType="numeric"
                  maxLength={5}
                />
              </View>

              <View>
                <Text className="text-sm text-text-soft mb-1">Nombre del negocio</Text>
                <TextInput
                  className="bg-background-box p-4 rounded-lg border border-border-neutral"
                  placeholder="Ej. Abarrotes Don Juan"
                  value={businessName}
                  onChangeText={setBusinessName}
                />
              </View>

              <View>
                <Text className="text-sm text-text-soft mb-1">Tipo de negocio</Text>
                <TouchableOpacity 
                  className="bg-background-box p-4 rounded-lg border border-border-neutral flex-row justify-between"
                  onPress={() => setShowBusinessTypeMenu(true)}
                >
                  <Text className={businessType ? "text-text" : "text-text-soft"}>
                    {businessType || "Seleccionar tipo de negocio"}
                  </Text>
                  <Ionicons name="chevron-down" size={20} color="#6B7280" />
                </TouchableOpacity>
              </View>
            </View>

            <Text className="text-xs text-text-soft mt-4 mb-4">
              Los campos marcados con <Text className="text-semantic-error">*</Text> son obligatorios
            </Text>

            <TouchableOpacity
              className="rounded-lg overflow-hidden mt-2 shadow-primary"
              onPress={handleRegister}
            >
              <LinearGradient
                colors={['#006FB9', '#194B7B']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                className="p-4"
              >
                <Text className="text-center font-bold text-white text-body">
                  Registrar Microempresario
                </Text>
              </LinearGradient>
            </TouchableOpacity>
            
            <View className="bg-blue-50 p-3 rounded-lg mt-4">
              <Text className="text-sm text-blue-800">
                <Text className="font-bold">Nota: </Text>
                Los microempresarios registrados recibirán automáticamente el PIN para terminar el registro.
              </Text>
            </View>
          </View>
        </View>
        
        {/* Espacio para evitar que el contenido quede bajo la barra de navegación */}
        <View className="h-16"></View>
      </ScrollView>
      
      <BusinessTypeSelector />
    </MainLayout>
  );
};

export default RegisterScreen;
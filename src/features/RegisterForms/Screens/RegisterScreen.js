import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import { useUser } from '../../../context/UserContext';
import { Ionicons } from '@expo/vector-icons';

const RegisterScreen = ({ navigation }) => {
  const { user, userData } = useUser();
  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [showPinModal, setShowPinModal] = useState(false);
  const [enteredPin, setEnteredPin] = useState('');
  const [registeredUserId, setRegisteredUserId] = useState(null);

  // Usar user como respaldo si userData no está disponible
  const currentUser = userData || user;

  useEffect(() => {
    console.log("Estado de usuario actual:", currentUser);
    
    // Si no hay usuario, mostrar alerta
    if (!currentUser) {
      Alert.alert(
        'No hay sesión activa',
        'Para registrar referidos necesitas iniciar sesión primero.',
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
        Alert.alert('Error', 'Por favor completa todos los campos');
        return;
      }

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
        pin: FIXED_PIN,
        referrerId: referrerId,
        registrationDate: new Date().toISOString(),
        courseProgress: [],
        created_at: new Date()
      });

      setRegisteredUserId(docRef.id);
      Alert.alert(
        'Éxito', 
        'Referido registrado exitosamente',
        [
          {
            text: 'OK',
            onPress: () => navigation.navigate('Referrals')
          }
        ]
      );
    } catch (error) {
      console.error('Error al registrar:', error);
      Alert.alert('Error', error.message || 'Error al registrar referido');
    }
  };

  const handlePinVerification = () => {
    if (enteredPin === FIXED_PIN) {
      setShowPinModal(false);
      Alert.alert('PIN correcto', 'Acceso concedido');
    } else {
      Alert.alert('PIN incorrecto', 'Por favor intente nuevamente');
      setEnteredPin('');
    }
  };

  const PinVerificationModal = () => (
    <Modal
      visible={showPinModal}
      transparent={true}
      animationType="slide"
      onRequestClose={() => setShowPinModal(false)}
    >
      <View className="flex-1 justify-center items-center bg-black bg-opacity-50">
        <View className="bg-white p-5 rounded-lg w-4/5">
          <View className="flex-row justify-between items-center mb-4">
            <Text className="text-h3 font-bold text-primary">Verificar PIN</Text>
            <TouchableOpacity onPress={() => setShowPinModal(false)}>
              <Ionicons name="close" size={24} color="#006FB9" />
            </TouchableOpacity>
          </View>
          
          <Text className="mb-4 text-text-soft">
            Por favor ingrese el PIN de acceso
          </Text>
          
          <TextInput
            className="bg-background-box p-4 rounded-lg border border-border-neutral mb-4"
            placeholder="PIN"
            value={enteredPin}
            onChangeText={setEnteredPin}
            keyboardType="numeric"
            maxLength={4}
            secureTextEntry
          />
          
          <TouchableOpacity
            className="rounded-lg overflow-hidden shadow-primary"
            onPress={handlePinVerification}
          >
            <LinearGradient
              colors={['#006FB9', '#194B7B']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              className="p-4"
            >
              <Text className="text-center font-bold text-white text-body">
                Verificar
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="px-6 pt-6">
        <Text className="text-h2 font-bold text-primary mb-4">Registrar Referido</Text>
        {userData ? (
          <Text className="text-body text-text-soft mb-2">
            Registrando como: {userData.email || userData.employee_number || "Usuario autenticado"}
          </Text>
        ) : (
          <Text className="text-body text-semantic-warning mb-2">
            Estado de autenticación no disponible
          </Text>
        )}
        <Text className="text-body text-text-soft mb-6">
          Ingresa los datos del nuevo referido
        </Text>
        
        <View className="space-y-4">
          <TextInput
            className="bg-background-box p-4 rounded-lg border border-border-neutral"
            placeholder="Nombre completo"
            value={name}
            onChangeText={setName}
          />
          
          <TextInput
            className="bg-background-box p-4 rounded-lg border border-border-neutral"
            placeholder="Número de teléfono"
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            keyboardType="phone-pad"
          />

          <TextInput
            className="bg-background-box p-4 rounded-lg border border-border-neutral"
            placeholder="Código postal"
            value={postalCode}
            onChangeText={setPostalCode}
            keyboardType="numeric"
            maxLength={5}
          />

          <TouchableOpacity
            className="rounded-lg overflow-hidden mt-6 shadow-primary"
            onPress={handleRegister}
          >
            <LinearGradient
              colors={['#006FB9', '#194B7B']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              className="p-4"
            >
              <Text className="text-center font-bold text-white text-body">
                Registrar Referido
              </Text>
            </LinearGradient>
          </TouchableOpacity>
          
          <TouchableOpacity
            className="mt-4 items-center"
            onPress={() => setShowPinModal(true)}
          >
            <Text className="text-primary">Verificar PIN (demo)</Text>
          </TouchableOpacity>
        </View>
      </View>
      
      <PinVerificationModal />
    </SafeAreaView>
  );
};

export default RegisterScreen;
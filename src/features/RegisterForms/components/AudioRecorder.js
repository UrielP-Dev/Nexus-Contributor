import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Audio } from 'expo-audio';
import * as FileSystem from 'expo-file-system';

const AudioRecorder = ({ onDataExtracted }) => {
  const [recording, setRecording] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [audioUri, setAudioUri] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [transcription, setTranscription] = useState('');

  // Función para iniciar la grabación de audio
  const startRecording = async () => {
    try {
      // Solicitar permisos
      const { status } = await Audio.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permiso denegado', 'Se necesita permiso para grabar audio');
        return;
      }

      // Configurar la sesión de audio
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
        staysActiveInBackground: false,
        interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
        interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX,
      });

      // Iniciar grabación
      const { recording } = await Audio.Recording.createAsync(
        Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY
      );
      setRecording(recording);
      setIsRecording(true);
      
      Alert.alert('Grabando', 'Grabación iniciada. Hable con el microempresario para obtener sus datos.');
    } catch (error) {
      console.error('Error al iniciar la grabación:', error);
      Alert.alert('Error', 'No se pudo iniciar la grabación');
    }
  };

  // Función para detener la grabación
  const stopRecording = async () => {
    try {
      if (!recording) return;
      
      setIsRecording(false);
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      setAudioUri(uri);
      setRecording(null);
      
      // Procesar el audio automáticamente después de detener la grabación
      processAudioWithOpenAI(uri);
    } catch (error) {
      console.error('Error al detener la grabación:', error);
      Alert.alert('Error', 'No se pudo detener la grabación');
    }
  };

  // Función para procesar el audio con la API de OpenAI
  const processAudioWithOpenAI = async (uri) => {
    try {
      setIsProcessing(true);
      
      // Leer el archivo de audio como base64
      const base64Audio = await FileSystem.readAsStringAsync(uri, {
        encoding: FileSystem.EncodingType.Base64,
      });
      
      // Configurar la solicitud a la API de OpenAI
      const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': 'Bearer YOUR_OPENAI_API_KEY', // Reemplazar con una variable de entorno
        },
        body: JSON.stringify({
          model: 'whisper-1',
          file: base64Audio,
          response_format: 'json',
        }),
      });
      
      const data = await response.json();
      
      if (data.text) {
        setTranscription(data.text);
        
        // Extraer información relevante usando GPT
        const extractionResponse = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer YOUR_OPENAI_API_KEY', // Reemplazar con una variable de entorno
          },
          body: JSON.stringify({
            model: 'gpt-4',
            messages: [
              {
                role: 'system',
                content: 'Extrae la siguiente información de la transcripción: nombre completo, número de teléfono, código postal, nombre del negocio y tipo de negocio. Devuelve un objeto JSON con estos campos.'
              },
              {
                role: 'user',
                content: data.text
              }
            ],
            response_format: { type: 'json_object' }
          }),
        });
        
        const extractionData = await extractionResponse.json();
        const extractedInfo = JSON.parse(extractionData.choices[0].message.content);
        
        // Enviar los datos extraídos al componente padre
        onDataExtracted({
          nombre: extractedInfo.nombre,
          telefono: extractedInfo.telefono,
          codigoPostal: extractedInfo.codigoPostal,
          nombreNegocio: extractedInfo.nombreNegocio,
          tipoNegocio: extractedInfo.tipoNegocio
        });
        
        Alert.alert('Información extraída', 'Se han completado los campos con la información de la conversación.');
      }
      
      setIsProcessing(false);
    } catch (error) {
      console.error('Error al procesar el audio:', error);
      Alert.alert('Error', 'No se pudo procesar el audio');
      setIsProcessing(false);
    }
  };

  return (
    <View className="mb-5">
      <TouchableOpacity
        className={`rounded-lg p-4 flex-row justify-center items-center ${isRecording ? 'bg-semantic-error' : 'bg-primary'}`}
        onPress={isRecording ? stopRecording : startRecording}
      >
        <Ionicons 
          name={isRecording ? "stop" : "mic"} 
          size={24} 
          color="white" 
          style={{ marginRight: 8 }} 
        />
        <Text className="font-bold text-white text-body">
          {isRecording ? 'Detener Grabación' : 'Grabar Conversación'}
        </Text>
      </TouchableOpacity>
      
      {isProcessing && (
        <View className="flex-row justify-center items-center mt-2">
          <ActivityIndicator size="small" color="#006FB9" />
          <Text className="ml-2 text-primary">Procesando audio...</Text>
        </View>
      )}
      
      {transcription ? (
        <View className="mt-3 p-3 bg-blue-50 rounded-lg">
          <Text className="text-xs text-blue-800 font-semibold mb-1">Transcripción:</Text>
          <Text className="text-xs text-text-soft">{transcription.substring(0, 100)}...</Text>
        </View>
      ) : null}
    </View>
  );
};

export default AudioRecorder; 
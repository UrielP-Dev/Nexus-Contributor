import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Alert, TextInput, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const TextAnalyzer = ({ onDataExtracted }) => {
  const [conversationText, setConversationText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const processTextWithOpenAI = async () => {
    if (!conversationText.trim()) {
      Alert.alert('Texto vacío', 'Por favor, ingrese la conversación para analizar');
      return;
    }

    try {
      setIsProcessing(true);
      console.log('Enviando texto a OpenAI:', conversationText);

      // Verificar que la API key esté configurada
      const apiKey = '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'; // Reemplazar con tu API key real
      if (!apiKey || apiKey === 'YOUR_OPENAI_API_KEY') {
        throw new Error('No se ha configurado la API key de OpenAI');
      }
      
      // Crear el objeto de solicitud
      const requestBody = {
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: 'Extrae la siguiente información de la transcripción: nombre completo, número de teléfono, código postal, nombre del negocio y tipo de negocio. Devuelve un objeto JSON con estos campos.'
          },
          {
            role: 'user',
            content: conversationText
          }
        ],
        response_format: { type: 'json_object' }
      };
      
      console.log('Request body:', JSON.stringify(requestBody, null, 2));
      
      // Extraer información relevante usando GPT
      const extractionResponse = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify(requestBody),
      });
      
      // Verificar si la respuesta es exitosa
      if (!extractionResponse.ok) {
        const errorText = await extractionResponse.text();
        console.error('Error en la respuesta de OpenAI:', errorText);
        throw new Error(`Error en la API de OpenAI: ${extractionResponse.status} ${errorText}`);
      }
      
      const extractionData = await extractionResponse.json();
      
      // Imprimir respuesta completa en consola
      console.log('Respuesta completa de OpenAI:', JSON.stringify(extractionData, null, 2));
      
      if (!extractionData || !extractionData.choices || extractionData.choices.length === 0) {
        throw new Error('Respuesta vacía o inválida de OpenAI');
      }
      
      const messageContent = extractionData.choices[0].message.content;
      console.log('Mensaje de respuesta:', messageContent);
      
      // Analizar el JSON con manejo de errores
      let extractedInfo;
      try {
        extractedInfo = JSON.parse(messageContent);
        console.log('Datos extraídos:', extractedInfo);
      } catch (jsonError) {
        console.error('Error al analizar JSON:', jsonError);
        console.log('Contenido que causó error:', messageContent);
        throw new Error('No se pudo analizar la respuesta JSON');
      }
      
      // Verificar que extractedInfo sea un objeto válido
      if (!extractedInfo || typeof extractedInfo !== 'object') {
        throw new Error('La información extraída no es un objeto válido');
      }
      
      // Extraer los campos con comprobaciones de seguridad
      const dataToSend = {
        nombre: extractedInfo.nombre || '',
        telefono: extractedInfo.telefono || '',
        codigoPostal: extractedInfo.codigoPostal || '',
        nombreNegocio: extractedInfo.nombreNegocio || '',
        tipoNegocio: extractedInfo.tipoNegocio || ''
      };
      
      // Enviar los datos extraídos al componente padre
      onDataExtracted(dataToSend);
      
      Alert.alert('Información extraída', 'Se han completado los campos con la información de la conversación.');
      setIsProcessing(false);
    } catch (error) {
      console.error('Error al procesar el texto:', error);
      console.error('Detalles del error:', error.message);
      
      Alert.alert('Error', `No se pudo procesar la transcripción: ${error.message}`);
      setIsProcessing(false);
    }
  };

  return (
    <View className="mb-5">
      <View className="mb-3">
        <Text className="text-sm text-text-soft mb-1">Ingrese la conversación con el microempresario</Text>
        <TextInput
          className="bg-background-box p-4 rounded-lg border border-border-neutral min-h-[120px]"
          placeholder="Ej. Mi nombre es Juan Pérez, tengo una tienda de abarrotes llamada 'La Esquina', mi teléfono es 555-123-4567 y mi código postal es 01234..."
          value={conversationText}
          onChangeText={setConversationText}
          multiline={true}
          textAlignVertical="top"
        />
      </View>
      
      <TouchableOpacity
        className="rounded-lg p-4 flex-row justify-center items-center bg-primary"
        onPress={processTextWithOpenAI}
        disabled={isProcessing}
      >
        <Ionicons 
          name="search-outline" 
          size={24} 
          color="white" 
          style={{ marginRight: 8 }} 
        />
        <Text className="font-bold text-white text-body">
          Analizar Conversación
        </Text>
      </TouchableOpacity>
      
      {isProcessing && (
        <View className="flex-row justify-center items-center mt-2">
          <ActivityIndicator size="small" color="#006FB9" />
          <Text className="ml-2 text-primary">Procesando texto...</Text>
        </View>
      )}
    </View>
  );
};

export default TextAnalyzer; 
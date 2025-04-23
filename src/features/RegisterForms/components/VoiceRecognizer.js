// components/VoiceRecognizer.js
import React, { useState, useEffect } from 'react'
import { View, Text, TouchableOpacity, Alert, ActivityIndicator, Platform } from 'react-native'
import { Audio } from 'expo-av'
import { Ionicons } from '@expo/vector-icons'
import * as FileSystem from 'expo-file-system'

const OPENAI_API_KEY = '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'

const VoiceRecognizer = ({ onDataExtracted }) => {
  const [recording, setRecording] = useState(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [errorMessage, setErrorMessage] = useState(null)

  useEffect(() => {
    (async () => {
      const { status } = await Audio.requestPermissionsAsync()
      if (status !== 'granted') {
        Alert.alert('Permiso denegado', 'Necesitamos permiso de micrófono')
      }
    })()
  }, [])

  const startRecording = async () => {
    try {
      setErrorMessage(null)
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true
      })
      const { recording } = await Audio.Recording.createAsync(
        Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY
      )
      setRecording(recording)
    } catch (err) {
      console.error('Error iniciando grabación:', err)
      Alert.alert('Error', 'No se pudo iniciar la grabación')
    }
  }

  const stopRecording = async () => {
    try {
      if (!recording) {
        console.warn('No hay grabación activa para detener')
        return
      }
      
      await recording.stopAndUnloadAsync()
      const uri = recording.getURI()
      setRecording(null)
      
      console.log('URI de audio:', uri)
      
      if (uri) {
        // Verificar que el archivo existe
        const fileInfo = await FileSystem.getInfoAsync(uri)
        if (!fileInfo.exists) {
          throw new Error('El archivo de audio no existe')
        }
        console.log('Tamaño de archivo:', fileInfo.size)
        
        await processAudio(uri)
      } else {
        throw new Error('No se obtuvo URI después de la grabación')
      }
    } catch (err) {
      console.error('Error deteniendo grabación:', err)
      setErrorMessage(err.message)
      setIsProcessing(false)
    }
  }

  const processAudio = async (uri) => {
    setIsProcessing(true)
    try {
      if (Platform.OS === 'web') {
        // Implementación web específica
        Alert.alert('No soportado', 'La grabación de audio no está disponible en web')
        setIsProcessing(false)
        return
      }
      
      // Verificar que tenemos la URI correcta
      if (!uri || typeof uri !== 'string') {
        throw new Error(`URI inválida: ${uri}`)
      }
      
      console.log('Procesando audio desde:', uri)
      
      // 1) Enviar a Whisper - versión mejorada
      const formData = new FormData()
      
      // Crear el objeto de archivo con propiedades explícitas
      const fileToUpload = {
        uri: Platform.OS === 'ios' ? uri.replace('file://', '') : uri,
        type: 'audio/m4a',
        name: 'recording.m4a'
      }
      
      console.log('Objeto de archivo:', JSON.stringify(fileToUpload))
      
      formData.append('file', fileToUpload)
      formData.append('model', 'whisper-1')
      
      console.log('FormData creado correctamente')
      
      // Probar mock de transcripción para evitar problemas de FormData
      const mockWhisperResponse = true
      let text
      
      if (mockWhisperResponse) {
        console.log('Usando mock de transcripción para pruebas')
        text = "Hola, mi nombre es María Rodríguez López. Mi teléfono es 555-123-4567. El código postal es 28010. Mi negocio se llama 'Pastelería Dulce Tentación' y es una pastelería artesanal."
      } else {
        // Código real para enviar a Whisper
        const whisperRes = await fetch(
          'https://api.openai.com/v1/audio/transcriptions',
          {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${OPENAI_API_KEY}`,
              'Content-Type': 'multipart/form-data'
            },
            body: formData
          }
        )
        
        if (!whisperRes.ok) {
          const errorText = await whisperRes.text()
          throw new Error(`Error en Whisper API: ${whisperRes.status} ${errorText}`)
        }
        
        const whisperData = await whisperRes.json()
        text = whisperData.text
      }
      
      console.log('Transcripción obtenida:', text)

      // 2) Extraer campos con GPT
      const prompt = `
Extrae estos campos de la transcripción:
nombre completo, número de teléfono, código postal, nombre del negocio, tipo de negocio.
Devuélvelos en JSON así:
{
  "nombre": "...",
  "telefono": "...",
  "codigoPostal": "...",
  "nombreNegocio": "...",
  "tipoNegocio": "..."
}
Transcripción:
"${text}"
`
      const gptRes = await fetch(
        'https://api.openai.com/v1/chat/completions',
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${OPENAI_API_KEY}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            model: 'gpt-4',
            messages: [{ role: 'user', content: prompt }],
            temperature: 0
          })
        }
      )
      
      if (!gptRes.ok) {
        const errorText = await gptRes.text()
        throw new Error(`Error en GPT API: ${gptRes.status} ${errorText}`)
      }
      
      const gptJson = await gptRes.json()
      console.log('Respuesta GPT:', JSON.stringify(gptJson, null, 2))
      
      const content = gptJson.choices[0].message.content.trim()
      console.log('Contenido extraído:', content)
      
      const extracted = JSON.parse(content)
      console.log('Datos JSON extraídos:', extracted)

      // 3) Notificar al padre
      onDataExtracted({
        nombre: extracted.nombre || '',
        telefono: extracted.telefono || '',
        codigoPostal: extracted.codigoPostal || '',
        nombreNegocio: extracted.nombreNegocio || '',
        tipoNegocio: extracted.tipoNegocio || ''
      })
      Alert.alert('Campos completados', 'Formulario actualizado con éxito.')
    } catch (error) {
      console.error('Error procesando audio:', error)
      setErrorMessage(error.message)
      Alert.alert('Error', `No se pudieron extraer los campos: ${error.message}`)
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <View className="mb-5">
      <TouchableOpacity
        className={`rounded-lg p-4 flex-row justify-center items-center ${
          recording ? 'bg-semantic-error' : 'bg-primary'
        }`}
        onPress={recording ? stopRecording : startRecording}
      >
        <Ionicons
          name={recording ? 'stop' : 'mic'}
          size={24}
          color="white"
          style={{ marginRight: 8 }}
        />
        <Text className="font-bold text-white text-body">
          {recording ? 'Detener Grabación' : 'Grabar Datos'}
        </Text>
      </TouchableOpacity>

      {isProcessing && (
        <View className="flex-row justify-center items-center mt-2">
          <ActivityIndicator size="small" color="#006FB9" />
          <Text className="ml-2 text-primary">Procesando…</Text>
        </View>
      )}
      
      {errorMessage && (
        <View className="mt-2 p-2 bg-red-50 rounded">
          <Text className="text-red-600 text-xs">{errorMessage}</Text>
        </View>
      )}
    </View>
  )
}

export default VoiceRecognizer

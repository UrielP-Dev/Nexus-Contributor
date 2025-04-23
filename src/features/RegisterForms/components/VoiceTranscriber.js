// components/VoiceTranscriber.js
import React, { useState, useEffect } from 'react'
import { View, Text, TouchableOpacity, Alert, Platform } from 'react-native'
import { Audio } from 'expo-av'
import * as FileSystem from 'expo-file-system'
import { Ionicons } from '@expo/vector-icons'

// API KEY (en producción, mover a variables de entorno seguras)
const OPENAI_API_KEY = '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'

const VoiceTranscriber = ({ onTranscription }) => {
  const [recording, setRecording] = useState(null)
  const [isRecording, setIsRecording] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [transcript, setTranscript] = useState('')

  useEffect(() => {
    return () => {
      if (recording) {
        stopRecording()
      }
    }
  }, [])

  const startRecording = async () => {
    try {
      // Solicitar permisos
      const { status } = await Audio.requestPermissionsAsync()
      if (status !== 'granted') {
        Alert.alert('Permiso denegado', 'Se necesita permiso para grabar audio')
        return
      }

      // Configurar modo de audio
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
        staysActiveInBackground: false,
      })

      // Iniciar grabación
      console.log('Iniciando grabación...')
      const { recording: newRecording } = await Audio.Recording.createAsync(
        Audio.RecordingOptionsPresets.HIGH_QUALITY
      )
      
      setRecording(newRecording)
      setIsRecording(true)
      setTranscript('')
    } catch (e) {
      console.error('Error al iniciar grabación:', e)
      Alert.alert('Error', 'No se pudo iniciar la grabación')
    }
  }

  const stopRecording = async () => {
    try {
      if (!recording) return
      
      console.log('Deteniendo grabación...')
      setIsRecording(false)
      await recording.stopAndUnloadAsync()
      
      const uri = recording.getURI()
      setRecording(null)
      
      if (uri) {
        await processAudioFile(uri)
      }
    } catch (e) {
      console.error('Error al detener grabación:', e)
      Alert.alert('Error', 'No se pudo detener la grabación')
    }
  }

  const processAudioFile = async (uri) => {
    try {
      setIsProcessing(true)
      console.log('Procesando audio:', uri)
      
      // Verificar que el archivo existe
      const fileInfo = await FileSystem.getInfoAsync(uri)
      if (!fileInfo.exists) {
        throw new Error('El archivo de audio no existe')
      }
      
      // Preparar FormData
      const formData = new FormData()
      formData.append('file', {
        uri: Platform.OS === 'ios' ? uri.replace('file://', '') : uri,
        type: 'audio/m4a',
        name: 'audio.m4a'
      })
      formData.append('model', 'whisper-1')
      formData.append('language', 'es')
      
      // Enviar a OpenAI Whisper
      const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
          // No especifiques 'Content-Type' aquí, FormData lo hace automáticamente
        },
        body: formData
      })
      
      if (!response.ok) {
        const errorText = await response.text()
        throw new Error(`Error en Whisper API: ${response.status} ${errorText}`)
      }
      
      const result = await response.json()
      console.log('Transcripción:', result)
      
      if (result.text) {
        setTranscript(result.text)
        onTranscription(result.text)
      } else {
        throw new Error('No se recibió texto en la respuesta')
      }
    } catch (error) {
      console.error('Error procesando audio:', error)
      Alert.alert('Error', `No se pudo transcribir: ${error.message}`)
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <View style={{ margin: 16 }}>
      <TouchableOpacity
        onPress={isRecording ? stopRecording : startRecording}
        disabled={isProcessing}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: isRecording ? '#D32F2F' : '#1976D2',
          opacity: isProcessing ? 0.7 : 1,
          padding: 12,
          borderRadius: 8
        }}
      >
        <Ionicons
          name={isRecording ? 'stop' : 'mic'}
          size={20}
          color="#fff"
          style={{ marginRight: 8 }}
        />
        <Text style={{ color: '#fff', fontWeight: 'bold' }}>
          {isRecording ? 'Detener' : isProcessing ? 'Procesando...' : 'Transcribir'}
        </Text>
      </TouchableOpacity>

      {transcript !== '' && (
        <View style={{ marginTop: 12, padding: 8, backgroundColor: '#f0f0f0', borderRadius: 4 }}>
          <Text>Texto reconocido:</Text>
          <Text style={{ marginTop: 4 }}>{transcript}</Text>
        </View>
      )}
    </View>
  )
}

export default VoiceTranscriber

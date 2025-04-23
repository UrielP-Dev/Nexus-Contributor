// components/VoiceRecognizer.js

import React, { useState, useEffect, useRef } from 'react'
import { View, Text, TouchableOpacity, Alert, ActivityIndicator, Platform } from 'react-native'
import { Audio } from 'expo-av'
import * as FileSystem from 'expo-file-system'
import { Ionicons } from '@expo/vector-icons'

// ----------------------------------------------------------------------------
// 🚨 IMPORTANTE: En producción, mueve tus API keys a tu backend o variables
//               seguras (app.json → expo.extra)
// ----------------------------------------------------------------------------
const OPENAI_API_KEY = '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'
const REPLICATE_API_TOKEN = 'r8_ASmcMG2BHboz4MSVQEGnbRRZtTzYsp20YyS2v'

// Modelo y versión de WhisperX en Replicate
const WHISPER_MODEL_VERSION = '77505c700514deed62ab3891c0011e307f905ee527458afc15de7d9e2a3034e8'

const VoiceRecognizer = ({ onDataExtracted }) => {
  const [recording, setRecording] = useState(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [audioUri, setAudioUri] = useState(null)
  const soundRef = useRef(null)

  useEffect(() => {
    // Solicitar permisos de micrófono al cargar el componente
    (async () => {
      const { status } = await Audio.requestPermissionsAsync()
      if (status !== 'granted') {
        Alert.alert('Permiso denegado', 'Necesitamos permiso de micrófono')
      }
    })()
  }, [])

  const startRecording = async () => {
    try {
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      })
      const rec = new Audio.Recording()
      await rec.prepareToRecordAsync({
        android: {
          extension: '.m4a',
          outputFormat: Audio.RECORDING_OPTION_ANDROID_OUTPUT_FORMAT_MPEG_4,
          audioEncoder: Audio.RECORDING_OPTION_ANDROID_AUDIO_ENCODER_AAC,
          sampleRate: 44100,
          numberOfChannels: 2,
          bitRate: 128000,
        },
        ios: {
          extension: '.m4a',
          audioQuality: Audio.RECORDING_OPTION_IOS_AUDIO_QUALITY_HIGH,
          sampleRate: 44100,
          numberOfChannels: 2,
          bitRate: 128000,
          outputFormat: Audio.RECORDING_OPTION_IOS_OUTPUT_FORMAT_MPEG4AAC,
        },
      })
      await rec.startAsync()
      setRecording(rec)
    } catch (err) {
      console.error('Error al iniciar grabación:', err)
      Alert.alert('Error', 'No se pudo iniciar la grabación')
    }
  }

  const stopRecording = async () => {
    if (!recording) return
    setIsProcessing(true)
    try {
      await recording.stopAndUnloadAsync()
      const uri = recording.getURI()
      setRecording(null)

      // Guardar en documentDirectory con extensión correcta
      const newPath = FileSystem.documentDirectory + 'audio.m4a'
      await FileSystem.copyAsync({ from: uri, to: newPath })
      setAudioUri(newPath)

      // Leer base64
      const base64Audio = await FileSystem.readAsStringAsync(newPath, {
        encoding: FileSystem.EncodingType.Base64,
      })
      const audioDataUrl = `data:audio/m4a;base64,${base64Audio}`

      // Llamar a Replicate API directamente como en el ejemplo curl
      const transcribedText = await transcribeAudioWithReplicate(audioDataUrl)
      
      // Extraer campos con OpenAI
      const extractedData = await extractDataWithOpenAI(transcribedText)
      
      onDataExtracted(extractedData)
      Alert.alert('✅ Listo', 'Campos extraídos correctamente.')
    } catch (err) {
      console.error('Error en procesamiento:', err)
      Alert.alert('Error', err.message)
    } finally {
      setIsProcessing(false)
    }
  }

  const transcribeAudioWithReplicate = async (audioDataUrl) => {
    try {
      // Crear la solicitud POST a Replicate siguiendo el formato del ejemplo curl
      const response = await fetch('https://api.replicate.com/v1/predictions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${REPLICATE_API_TOKEN}`,
          'Content-Type': 'application/json',
          'Prefer': 'wait' // Esperar por el resultado en vez de polling
        },
        body: JSON.stringify({
          version: WHISPER_MODEL_VERSION,
          input: {
            debug: false,
            vad_onset: 0.5,
            audio_file: audioDataUrl,
            batch_size: 64,
            vad_offset: 0.363,
            diarization: false,
            temperature: 0,
            align_output: false
          }
        })
      })

      if (!response.ok) {
        const errorData = await response.text()
        console.error('Error en respuesta de Replicate:', errorData)
        throw new Error(`Error en API de Replicate: ${response.status}`)
      }

      const result = await response.json()
      console.log('Respuesta completa de Replicate:', JSON.stringify(result, null, 2))

      // Verificar si hay errores
      if (result.error) {
        throw new Error(`Error en procesamiento: ${result.error}`)
      }

      // Extraer el texto según la estructura específica de la respuesta
      let transcribedText = '';
      
      // Estructura específica donde el texto está en output.segments[].text
      if (result.output && result.output.segments && Array.isArray(result.output.segments)) {
        // Combinar todos los segmentos de texto en uno solo
        transcribedText = result.output.segments
          .map(segment => segment.text)
          .join(' ')
          .trim();
      } 
      // Fallbacks para otros posibles formatos
      else if (typeof result.output === 'string') {
        transcribedText = result.output;
      }
      else if (result.output && typeof result.output.text === 'string') {
        transcribedText = result.output.text;
      }
      
      if (!transcribedText) {
        console.error('No se pudo extraer texto de la respuesta:', result);
        throw new Error('No se pudo obtener transcripción de la respuesta')
      }

      console.log('Transcripción obtenida:', transcribedText)
      return transcribedText
    } catch (error) {
      console.error('Error transcribiendo audio:', error)
      throw new Error(`Error en la transcripción: ${error.message}`)
    }
  }

  const extractDataWithOpenAI = async (transcribedText) => {
    try {
      const prompt = `
  Extrae estos campos de la transcripción:
  nombre completo, teléfono, código postal, nombre del negocio, tipo de negocio.
  Devuélvelos en JSON:
  {
    "nombre": "...",
    "telefono": "...",
    "codigoPostal": "...",
    "nombreNegocio": "...",
    "tipoNegocio": "..."
  }
  Transcripción:
  "${transcribedText}"
  `
      console.log('Enviando a OpenAI:', prompt);
      
      const chatRes = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4',
          messages: [{ role: 'user', content: prompt }],
          temperature: 0
          // Removido response_format que estaba causando el error
        }),
      })
      
      if (!chatRes.ok) {
        const errorText = await chatRes.text()
        console.error('Error respuesta OpenAI:', errorText)
        throw new Error(`Error en OpenAI API: ${chatRes.status} - ${errorText}`)
      }
      
      const chatJson = await chatRes.json()
      console.log('Respuesta de OpenAI:', JSON.stringify(chatJson, null, 2))
      
      const content = chatJson.choices[0].message.content.trim()
      console.log('Contenido a parsear:', content)
      
      // Verificar si el contenido parece un JSON válido
      if (!content.startsWith('{') || !content.endsWith('}')) {
        console.error('La respuesta no tiene formato JSON válido:', content)
        // Intentar extraer JSON si está entre comillas, markdown, etc.
        const jsonMatch = content.match(/\{.*\}/s)
        if (jsonMatch) {
          const extractedJson = jsonMatch[0]
          console.log('JSON extraído de la respuesta:', extractedJson)
          return JSON.parse(extractedJson)
        }
        
        // Si no se puede extraer, crear un objeto con la información disponible
        return {
          nombre: transcribedText,
          telefono: "",
          codigoPostal: "",
          nombreNegocio: "",
          tipoNegocio: ""
        }
      }
      
      try {
        return JSON.parse(content)
      } catch (parseError) {
        console.error('Error al parsear JSON:', parseError, 'Contenido:', content)
        // Devolver un objeto con valores por defecto
        return {
          nombre: transcribedText,
          telefono: "",
          codigoPostal: "",
          nombreNegocio: "",
          tipoNegocio: ""
        }
      }
    } catch (error) {
      console.error('Error extrayendo datos con OpenAI:', error)
      throw new Error(`Error procesando datos: ${error.message}`)
    }
  }

  const playAudio = async () => {
    if (!audioUri) return
    try {
      if (soundRef.current) await soundRef.current.unloadAsync()
      const { sound } = await Audio.Sound.createAsync({ uri: audioUri })
      soundRef.current = sound
      await sound.playAsync()
    } catch (e) {
      console.error('Error reproduciendo audio:', e)
      Alert.alert('Error', 'No se pudo reproducir el audio.')
    }
  }

  return (
    <View style={{ margin: 16 }}>
      <TouchableOpacity
        disabled={isProcessing}
        onPress={recording ? stopRecording : startRecording}
        style={{
          backgroundColor: recording ? '#D32F2F' : '#1976D2',
          padding: 12,
          borderRadius: 8,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Ionicons name={recording ? 'stop' : 'mic'} size={20} color="#fff" />
        <Text style={{ color: '#fff', marginLeft: 8, fontWeight: 'bold' }}>
          {isProcessing ? 'Procesando…' : recording ? 'Detener' : 'Grabar y enviar'}
        </Text>
      </TouchableOpacity>
      
      {isProcessing && (
        <View style={{ marginTop: 16, alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#1976D2" />
          <Text style={{ marginTop: 8, color: '#666' }}>
            Procesando audio, esto puede tardar un momento...
          </Text>
        </View>
      )}
      
      {audioUri && !recording && !isProcessing && (
        <TouchableOpacity
          onPress={playAudio}
          style={{
            marginTop: 16,
            padding: 12,
            backgroundColor: '#4CAF50',
            borderRadius: 8,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Ionicons name="play" size={20} color="#fff" />
          <Text style={{ color: '#fff', marginLeft: 8 }}>Reproducir audio</Text>
        </TouchableOpacity>
      )}
    </View>
  )
}

export default VoiceRecognizer

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
  const [permissionStatus, setPermissionStatus] = useState('pending') // 'pending', 'checking', 'granted', 'denied'
  const [isCheckingPermission, setIsCheckingPermission] = useState(false)
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

  const requestVerbalPermission = async () => {
    setIsCheckingPermission(true)
    try {
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      })
      
      Alert.alert(
        'Solicitud de permiso',
        'Por favor, diga claramente al microempresario: "¿Me permite grabar nuestra conversación?"',
        [
          { text: 'Continuar', onPress: () => checkVerbalPermission() }
        ]
      )
    } catch (err) {
      console.error('Error al preparar solicitud de permiso:', err)
      Alert.alert('Error', 'No se pudo iniciar la verificación de permiso')
      setIsCheckingPermission(false)
    }
  }

  const checkVerbalPermission = async () => {
    setPermissionStatus('checking')
    try {
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
      
      // Grabar durante 5 segundos para capturar la respuesta
      setTimeout(async () => {
        await stopPermissionRecording(rec)
      }, 5000)
      
      Alert.alert('Grabando respuesta', 'Esperando respuesta del microempresario...')
      
    } catch (err) {
      console.error('Error al verificar permiso verbal:', err)
      Alert.alert('Error', 'No se pudo grabar la respuesta de permiso')
      setPermissionStatus('pending')
      setIsCheckingPermission(false)
    }
  }

  const stopPermissionRecording = async (rec) => {
    try {
      await rec.stopAndUnloadAsync()
      const uri = rec.getURI()
      setIsProcessing(true)

      // Guardar en documentDirectory con extensión correcta
      const newPath = FileSystem.documentDirectory + 'permission_audio.m4a'
      await FileSystem.copyAsync({ from: uri, to: newPath })

      // Leer base64
      const base64Audio = await FileSystem.readAsStringAsync(newPath, {
        encoding: FileSystem.EncodingType.Base64,
      })
      const audioDataUrl = `data:audio/m4a;base64,${base64Audio}`

      // Transcribir respuesta usando el mismo método que la grabación principal
      const transcribedText = await transcribeAudioWithReplicate(audioDataUrl)
      
      // Usar OpenAI para analizar la respuesta con más precisión
      const permissionResult = await analyzePermissionWithOpenAI(transcribedText)
      
      if (permissionResult.isGranted) {
        setPermissionStatus('granted')
        Alert.alert('Permiso concedido', `El microempresario ha dado su permiso: "${permissionResult.detectedResponse}"`)
      } else {
        setPermissionStatus('denied')
        Alert.alert('Permiso denegado', `El microempresario no ha dado permiso. Respuesta detectada: "${permissionResult.detectedResponse}"`)
      }
    } catch (err) {
      console.error('Error procesando verificación de permiso:', err)
      Alert.alert('Error', 'No se pudo procesar la respuesta de permiso: ' + err.message)
      setPermissionStatus('pending')
    } finally {
      setIsCheckingPermission(false)
      setIsProcessing(false)
    }
  }

  // Nuevo método que usa OpenAI para analizar la respuesta de permiso
  const analyzePermissionWithOpenAI = async (transcribedText) => {
    try {
      const prompt = `
Analiza esta transcripción de audio y determina si la persona da su permiso para ser grabada en una conversación.

Transcripción:
"${transcribedText}"

Considera diversos tipos de respuestas positivas como:
- Afirmaciones directas: "sí", "claro", "por supuesto"
- Afirmaciones indirectas: "adelante", "no hay problema", "está bien", "no me molesta"
- Afirmaciones contextuales: "puede grabar", "tiene mi permiso", "lo autorizo"
- Afirmaciones con condiciones: "sí, pero solo para esto", "está bien por esta vez"

Y negativas como:
- Negaciones directas: "no", "no quiero"
- Negaciones indirectas: "prefiero que no", "mejor no", "ahora no"
- Evasivas: "después hablamos", "en otro momento", "no estoy seguro"
- Preguntas sin respuesta clara: "¿para qué es?", "¿es necesario?"

Responde con un JSON con este formato exacto:
{
  "isGranted": true/false,
  "detectedResponse": "la parte específica de la transcripción que indica permiso o negativa",
  "confidence": "alta/media/baja",
  "explanation": "breve explicación de por qué se interpreta como permiso o negativa"
}
`
      
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
        }),
      })
      
      if (!chatRes.ok) {
        const errorText = await chatRes.text()
        console.error('Error respuesta OpenAI:', errorText)
        throw new Error(`Error en OpenAI API: ${chatRes.status} - ${errorText}`)
      }
      
      const chatJson = await chatRes.json()
      console.log('Análisis de permiso de OpenAI:', JSON.stringify(chatJson, null, 2))
      
      const content = chatJson.choices[0].message.content.trim()
      
      // Extraer JSON de la respuesta
      let jsonMatch = content;
      if (!content.startsWith('{')) {
        jsonMatch = content.match(/\{.*\}/s)
        if (!jsonMatch) {
          throw new Error('No se pudo extraer JSON de la respuesta')
        }
        jsonMatch = jsonMatch[0]
      }
      
      const result = JSON.parse(jsonMatch)
      return result
    } catch (error) {
      console.error('Error analizando permiso con OpenAI:', error)
      // En caso de error, hacemos un análisis simple como fallback
      return {
        isGranted: checkIfPermissionGranted(transcribedText),
        detectedResponse: transcribedText,
        confidence: "baja"
      }
    }
  }

  // Mantener el método simple como fallback
  const checkIfPermissionGranted = (text) => {
    // Convertir a minúsculas y buscar respuestas afirmativas en español
    const lowerText = text.toLowerCase()
    const affirmativeResponses = ['sí', 'si', 'claro', 'adelante', 'por supuesto', 'está bien', 'de acuerdo', 'afirmativo']
    
    return affirmativeResponses.some(response => lowerText.includes(response))
  }

  const startRecording = async () => {
    // Verificar que tenemos permiso verbal antes de grabar
    if (permissionStatus !== 'granted') {
      Alert.alert('Permiso requerido', 'Debe obtener permiso verbal antes de grabar')
      return
    }
    
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
      {permissionStatus === 'pending' && (
        <View style={{ marginBottom: 20 }}>
          <View style={{ 
            backgroundColor: '#FFF9C4', 
            padding: 12, 
            borderRadius: 8, 
            marginBottom: 16,
            borderLeftWidth: 4,
            borderLeftColor: '#FBC02D',
            flexDirection: 'row',
            alignItems: 'center'
          }}>
            <Ionicons name="alert-circle" size={24} color="#FBC02D" style={{ marginRight: 10 }} />
            <View>
              <Text style={{ fontWeight: 'bold', marginBottom: 4 }}>Permiso requerido</Text>
              <Text>Antes de grabar, debe obtener autorización verbal del microempresario</Text>
            </View>
          </View>
          
          <TouchableOpacity
            disabled={isCheckingPermission}
            onPress={requestVerbalPermission}
            style={{
              backgroundColor: '#4CAF50',
              padding: 16,
              borderRadius: 8,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              elevation: 2,
            }}
          >
            <Ionicons name="mic" size={24} color="#fff" />
            <Text style={{ color: '#fff', marginLeft: 10, fontWeight: 'bold', fontSize: 16 }}>
              {isCheckingPermission ? 'Verificando permiso...' : 'Solicitar permiso verbal'}
            </Text>
          </TouchableOpacity>
        </View>
      )}
      
      {permissionStatus === 'checking' && (
        <View style={{ 
          marginBottom: 20, 
          alignItems: 'center',
          backgroundColor: '#E3F2FD',
          padding: 20,
          borderRadius: 8,
        }}>
          <ActivityIndicator size="large" color="#2196F3" />
          <Text style={{ marginTop: 12, color: '#0D47A1', fontWeight: 'bold', fontSize: 16 }}>
            Analizando respuesta...
          </Text>
          <Text style={{ marginTop: 8, color: '#1976D2', textAlign: 'center' }}>
            Estamos verificando si el microempresario otorgó permiso para grabar
          </Text>
        </View>
      )}
      
      {(permissionStatus === 'granted') && (
        <View style={{ marginBottom: 20 }}>
          <View style={{ 
            backgroundColor: '#E8F5E9', 
            padding: 12, 
            borderRadius: 8, 
            marginBottom: 16,
            borderLeftWidth: 4,
            borderLeftColor: '#4CAF50',
            flexDirection: 'row',
            alignItems: 'center'
          }}>
            <Ionicons name="checkmark-circle" size={24} color="#4CAF50" style={{ marginRight: 10 }} />
            <View>
              <Text style={{ fontWeight: 'bold', color: '#2E7D32', marginBottom: 4 }}>Permiso concedido</Text>
              <Text style={{ color: '#388E3C' }}>El microempresario autorizó la grabación</Text>
            </View>
          </View>
          
          <TouchableOpacity
            disabled={isProcessing}
            onPress={recording ? stopRecording : startRecording}
            style={{
              backgroundColor: recording ? '#D32F2F' : '#1976D2',
              padding: 16,
              borderRadius: 8,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              elevation: 2,
            }}
          >
            <Ionicons 
              name={isProcessing ? 'hourglass' : recording ? 'stop-circle' : 'mic'} 
              size={24} 
              color="#fff" 
            />
            <Text style={{ color: '#fff', marginLeft: 10, fontWeight: 'bold', fontSize: 16 }}>
              {isProcessing ? 'Procesando…' : recording ? 'Detener grabación' : 'Grabar conversación'}
            </Text>
          </TouchableOpacity>
        </View>
      )}
      
      {permissionStatus === 'denied' && (
        <View style={{ marginBottom: 20 }}>
          <View style={{ 
            backgroundColor: '#FFEBEE', 
            padding: 12, 
            borderRadius: 8, 
            marginBottom: 16,
            borderLeftWidth: 4,
            borderLeftColor: '#D32F2F',
            flexDirection: 'row',
            alignItems: 'center'
          }}>
            <Ionicons name="close-circle" size={24} color="#D32F2F" style={{ marginRight: 10 }} />
            <View>
              <Text style={{ fontWeight: 'bold', color: '#C62828', marginBottom: 4 }}>Permiso denegado</Text>
              <Text style={{ color: '#D32F2F' }}>No se puede grabar sin autorización verbal</Text>
            </View>
          </View>
          
          <TouchableOpacity
            onPress={() => setPermissionStatus('pending')}
            style={{ 
              padding: 16, 
              backgroundColor: '#D32F2F', 
              borderRadius: 8, 
              alignItems: 'center',
              flexDirection: 'row',
              justifyContent: 'center',
              elevation: 2,
            }}
          >
            <Ionicons name="refresh" size={24} color="#fff" style={{ marginRight: 8 }} />
            <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}>Intentar nuevamente</Text>
          </TouchableOpacity>
        </View>
      )}
      
      {isProcessing && (
        <View style={{ 
          marginTop: 20, 
          alignItems: 'center',
          backgroundColor: '#E8F5E9',
          padding: 20,
          borderRadius: 8,
          borderWidth: 1,
          borderColor: '#C8E6C9'
        }}>
          <ActivityIndicator size="large" color="#1976D2" />
          <Text style={{ marginTop: 12, color: '#1976D2', fontWeight: 'bold', fontSize: 16 }}>
            Procesando audio
          </Text>
          <Text style={{ marginTop: 8, color: '#388E3C', textAlign: 'center' }}>
            Esto puede tardar un momento. Estamos analizando la conversación...
          </Text>
        </View>
      )}
      
      {audioUri && !recording && !isProcessing && (
        <TouchableOpacity
          onPress={playAudio}
          style={{
            marginTop: 16,
            padding: 12,
            backgroundColor: '#673AB7',
            borderRadius: 8,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            elevation: 2,
          }}
        >
          <Ionicons name="play-circle" size={24} color="#fff" />
          <Text style={{ color: '#fff', marginLeft: 10, fontWeight: 'bold' }}>Reproducir grabación</Text>
        </TouchableOpacity>
      )}
    </View>
  )
}

export default VoiceRecognizer

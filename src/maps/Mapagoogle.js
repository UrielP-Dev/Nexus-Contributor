import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';
import { app } from '../config/firebase';
import { GOOGLE_MAPS_API_KEY } from '@env';

const MapaGoogle = () => {
  const [origin, setOrigin] = useState(null);
  const [destination, setDestination] = useState(null);
  const [waypoints, setWaypoints] = useState([]);
  const [error, setError] = useState(null);
  const db = getFirestore(app);

  if (!GOOGLE_MAPS_API_KEY) {
    console.error('Error: API key de Google Maps no configurada');
    return <Text>Error: API key no configurada</Text>;
  }

  useEffect(() => {
    const fetchRoute = async () => {
      try {
        const q = query(collection(db, "routes"), where("routeId", "==", "ChIJpxjMIzfbp9FW2j5S1M0w"));
        const snapshot = await getDocs(q);

        if (!snapshot.empty) {
          const data = snapshot.docs[0].data();
          console.log('Datos de la ruta:', data);
          
          if (!data.startPoint?.latitude || !data.startPoint?.longitude) {
            console.error('Error: Coordenadas de origen inválidas');
            return;
          }
          if (!data.endPoint?.latitude || !data.endPoint?.longitude) {
            console.error('Error: Coordenadas de destino inválidas');
            return;
          }

          const validWaypoints = data.stops?.filter(wp => wp?.latitude && wp?.longitude) || [];
          
          setOrigin(data.startPoint);
          setDestination(data.endPoint);
          setWaypoints(validWaypoints);
        } else {
          console.log("No se encontró la ruta.");
        }
      } catch (err) {
        console.error("Error al obtener la ruta:", err);
      }
    };

    fetchRoute();
  }, []);

  if (error) {
    return <Text>{error}</Text>;
  }

  if (!origin || !destination) {
    return <Text>Cargando mapa...</Text>;
  }

  return (
    <View className="bg-background-box rounded-md shadow-default mb-2 h-[225px] w-full overflow-hidden">
      <MapView style={{ flex: 1 }} initialRegion={{
        latitude: origin.latitude,
        longitude: origin.longitude,
        latitudeDelta: 0.3,
        longitudeDelta: 0.3,
      }}>
        <MapViewDirections
          origin={{
            latitude: parseFloat(origin.latitude),
            longitude: parseFloat(origin.longitude)
          }}
          destination={{
            latitude: parseFloat(destination.latitude),
            longitude: parseFloat(destination.longitude)
          }}
          waypoints={waypoints.map(wp => ({
            latitude: parseFloat(wp.latitude),
            longitude: parseFloat(wp.longitude)
          }))}
          apikey={GOOGLE_MAPS_API_KEY}
          strokeWidth={4}
          strokeColor="#006FB9"
          optimizeWaypoints={true}
          onError={(errorMessage) => {
            console.error('Error en la dirección:', errorMessage);
            setError('Error al cargar la ruta');
          }}
        />
        <Marker coordinate={origin} title="Origen" />
        <Marker coordinate={destination} title="Destino" />
        {waypoints.map((wp, idx) => (
          <Marker key={idx} coordinate={wp} title={`Parada ${idx + 1}`} pinColor="orange" />
        ))}
      </MapView>
    </View>
  );
};

export default MapaGoogle;

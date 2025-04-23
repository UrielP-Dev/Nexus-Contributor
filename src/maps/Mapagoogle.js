import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';
import { app } from '../config/firebase';

const MapaGoogle = () => {
  const [origin, setOrigin] = useState(null);
  const [destination, setDestination] = useState(null);
  const [waypoints, setWaypoints] = useState([]);
  const [error, setError] = useState(null);
  const db = getFirestore(app);
  const apikey = 'AIzaSyAA8WEJzLQUMhR1p1Vucxi4g_cO3DVLGOM';

  useEffect(() => {
    console.log('apikey', apikey);
    console.log('API KEY value:', apikey);
    if (!apikey) {
      console.error('Error: API key de Google Maps no configurada');
      setError('Error: API key no configurada');
      return;
    }

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

  const calculateRegion = () => {
    const allPoints = [origin, destination, ...waypoints];
    const lats = allPoints.map(p => parseFloat(p.latitude));
    const lngs = allPoints.map(p => parseFloat(p.longitude));
    
    const minLat = Math.min(...lats);
    const maxLat = Math.max(...lats);
    const minLng = Math.min(...lngs);
    const maxLng = Math.max(...lngs);
    
    const padding = 0.003;
    return {
      latitude: (minLat + maxLat) / 2,
      longitude: (minLng + maxLng) / 2,
      latitudeDelta: (maxLat - minLat) + padding,
      longitudeDelta: (maxLng - minLng) + padding
    };
  };

  return (
    <View className="bg-background-box rounded-md shadow-default mb-2 h-[225px] w-full overflow-hidden">
      <MapView style={{ flex: 1 }} initialRegion={calculateRegion()}>
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
          apikey={apikey}
          strokeWidth={4}
          strokeColor="#006FB9"
          optimizeWaypoints={true}
          onError={(errorMessage) => {
            console.error('Error en la dirección:', errorMessage);
            console.log('Origin:', origin);
            console.log('Destination:', destination);
            console.log('API Key length:', apikey?.length || 0);
            setError('Error al cargar la ruta: ' + errorMessage);
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

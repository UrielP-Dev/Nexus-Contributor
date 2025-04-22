import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';
import { app } from '../config/firebase'; // Asegúrate de que la ruta sea correcta
import { useUser } from '../context/UserContext';

const GOOGLE_MAPS_APIKEY = "AIzaSyAA8WEJzLQUMhR1p1Vucxi4g_cO3DVLGOM";

const MapaGoogle = () => {
  const [origin, setOrigin] = useState(null);
  const [destination, setDestination] = useState(null);
  const [waypoints, setWaypoints] = useState([]);
  const db = getFirestore(app);

  // Obtener userData desde el contexto
  const { userData } = useUser();

  useEffect(() => {
    const fetchRoute = async () => {
      try {
        // Verificar si userData y routeId están disponibles
        if (!userData || !userData.routeId) {
          console.log("No se encontró routeId en userData.");
          return;
        }
        console.log(userData.routeId);
        const q = query(collection(db, "routes"), where("routeId", "==", userData.routeId));
        const snapshot = await getDocs(q);

        if (!snapshot.empty) {
          const data = snapshot.docs[0].data();
          setOrigin(data.startPoint);
          setDestination(data.endPoint);
          setWaypoints(data.stops || []);
        } else {
          console.log("No se encontró la ruta.");
        }
      } catch (err) {
        console.error("Error al obtener la ruta:", err);
      }
    };

    fetchRoute();
  }, [userData]); // Escuchar cambios en userData

  if (!origin || !destination) {
    return <Text>Cargando mapa...</Text>;
  }

  return (
    <View className="bg-background-box rounded-md shadow-default mb-2 h-[225px] w-full overflow-hidden">
      <MapView
        style={{ flex: 1 }}
        initialRegion={{
          latitude: origin.latitude,
          longitude: origin.longitude,
          latitudeDelta: 0.3,
          longitudeDelta: 0.3,
        }}
      >
        <MapViewDirections
          origin={origin}
          destination={destination}
          waypoints={waypoints}
          apikey={GOOGLE_MAPS_APIKEY}
          strokeWidth={4}
          strokeColor="#006FB9"
          optimizeWaypoints={true}
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
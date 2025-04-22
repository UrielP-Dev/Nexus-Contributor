import { getFirestore, collection, addDoc, getDocs, deleteDoc } from 'firebase/firestore';
import { db } from '../config/firebase';

const CDMX_BOUNDS = {
  north: 19.5365,
  south: 19.3208,
  east: -99.0476,
  west: -99.2443
};

const getRandomCoordinate = () => {
  const lat = CDMX_BOUNDS.south + (Math.random() * (CDMX_BOUNDS.north - CDMX_BOUNDS.south));
  const lng = CDMX_BOUNDS.west + (Math.random() * (CDMX_BOUNDS.east - CDMX_BOUNDS.west));
  return { latitude: Number(lat.toFixed(4)), longitude: Number(lng.toFixed(4)) };
};

// Genera una ruta aleatoria con 3 paradas
const generateRandomRoute = () => {
  return {
    startPoint: getRandomCoordinate(),
    endPoint: getRandomCoordinate(),
    stops: Array(3).fill(null).map(() => getRandomCoordinate())
  };
};

// Genera un número de empleado aleatorio de 5 dígitos
const generateEmployeeNumber = () => {
    // Resultado entre 100000 y 999999
    return String(100000 + Math.floor(Math.random() * 900000));
  };
  

// Genera un ID de ruta de Google Maps simulado
const generateRouteId = () => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  return 'ChIJ' + Array(20).fill(null)
    .map(() => chars.charAt(Math.floor(Math.random() * chars.length)))
    .join('');
};

export const generateTestData = async () => {
  try {
    const usersCollection = collection(db, 'users');
    const routesCollection = collection(db, 'routes');
    const generatedUsers = [];

    for (let i = 0; i < 10; i++) {
      const routeId = generateRouteId();
      const employee_number = generateEmployeeNumber();

      // Crear usuario
      const userData = {
        employee_number,
        password: employee_number, // En producción usar hash
        routeId,
        points: Math.floor(Math.random() * 50)
      };

      const userDoc = await addDoc(usersCollection, userData);

      // Crear ruta asociada
      const routeData = {
        userId: userDoc.id,
        routeId,
        ...generateRandomRoute()
      };

      await addDoc(routesCollection, routeData);

      generatedUsers.push({
        userId: userDoc.id,
        ...userData,
        route: routeData
      });
    }

    console.log('Datos de prueba generados exitosamente:', generatedUsers);
    return generatedUsers;

  } catch (error) {
    console.error('Error generando datos de prueba:', error);
    throw error;
  }
};

// Función para limpiar datos de prueba
export const clearTestData = async () => {
  try {
    const usersSnapshot = await getDocs(collection(db, 'users'));
    const routesSnapshot = await getDocs(collection(db, 'routes'));

    const deletePromises = [];

    usersSnapshot.forEach(doc => {
      deletePromises.push(deleteDoc(doc.ref));
    });

    routesSnapshot.forEach(doc => {
      deletePromises.push(deleteDoc(doc.ref));
    });

    await Promise.all(deletePromises);
    console.log('Datos de prueba eliminados exitosamente');

  } catch (error) {
    console.error('Error eliminando datos de prueba:', error);
    throw error;
  }
}; 
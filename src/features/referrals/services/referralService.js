// referralService.js
import { 
    collection, 
    query, 
    where, 
    getDocs, 
    addDoc 
  } from 'firebase/firestore';
  import { db } from '../../../config/firebase';
  
  export const referralService = {
    async getReferralsByEmployeeNumber(userContext) {
      try {
        console.log("User context received:", userContext); // Depuración
        
        // Verificar si userContext es directamente el número de empleado
        let employeeNumber;
        
        if (typeof userContext === 'string' || typeof userContext === 'number') {
          employeeNumber = userContext;
        } else {
          // Obtener el número de empleado del contexto del usuario (objeto)
          employeeNumber = userContext?.employee_number;
        }
        
        if (!employeeNumber) {
          console.error('No employee number found in user context');
          return [];
        }
        
        console.log("Using employee number:", employeeNumber); // Depuración
        
        // Usar la sintaxis correcta para Firestore v9+
        const referralsRef = collection(db, 'registers');
        let q = query(referralsRef, where('referrerId', '==', employeeNumber));
        
        let referralsSnapshot = await getDocs(q);
        
        // Si no hay resultados, intentar con el valor como número
        if (referralsSnapshot.empty && !isNaN(employeeNumber)) {
          const numericEmployeeNumber = Number(employeeNumber);
          console.log("No results with string, trying as number:", numericEmployeeNumber); // Depuración
          
          q = query(referralsRef, where('referrerId', '==', numericEmployeeNumber));
          referralsSnapshot = await getDocs(q);
        }
        
        if (referralsSnapshot.empty) {
          console.log('No referrals found for employee number:', employeeNumber);
          return [];
        }
        
        // Devolver los datos sin formato
        const referrals = referralsSnapshot.docs.map(doc => {
          const data = doc.data();
          console.log("Document data:", data); // Depuración
          return {
            ...data,
            id: doc.id // Esto asegura que cada referido tenga un ID único
          };
        });
        
        console.log('Referrals found:', referrals);
        return referrals;
      } catch (error) {
        console.error('Error fetching referrals:', error);
        throw new Error('No se pudieron cargar los registros');
      }
    },
  
    async addReferral(referralData) {
      try {
        // 1. Reference the 'referrals' collection
        const referralsCol = collection(db, 'referrals');
        // 2. Add a new document with a timestamp
        await addDoc(referralsCol, {
          ...referralData,
          registrationDate: new Date().toISOString()
        });
      } catch (error) {
        console.error('Error adding referral:', error);
        throw new Error('No se pudo agregar el referido');
      }
    }
  };
  
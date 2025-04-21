import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from 'firebase/auth';
import firebaseApp from '../../../config/firebase';
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';

const auth = getAuth(firebaseApp);

export const authService = {
  login: async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return userCredential.user;
    } catch (error) {
      throw error;
    }
  },

  register: async (email, password) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      return userCredential.user;
    } catch (error) {
      throw error;
    }
  },

  logout: async () => {
    try {
      await signOut(auth);
    } catch (error) {
      throw error;
    }
  },

  async login(employeeNumber, password) {
    try {
      const db = getFirestore();
      const usersRef = collection(db, 'users');
      const q = query(
        usersRef,
        where('employee_number', '==', employeeNumber),
        where('password', '==', password)
      );

      const querySnapshot = await getDocs(q);
      
      if (querySnapshot.empty) {
        throw new Error('Número de empleado o contraseña incorrectos');
      }

      const userData = querySnapshot.docs[0].data();
      return userData;
    } catch (error) {
      throw error;
    }
  }
};
import { firebase } from '../../../config/firebase'; // Ajusta esta ruta según tu configuración

export const referralService = {
  async getReferralsByUser(userId) {
    try {
      const referralsSnapshot = await firebase
        .firestore()
        .collection('referrals')
        .where('referrerId', '==', userId)
        .get();

      if (referralsSnapshot.empty) {
        return []; // Retorna un array vacío si no hay referidos
      }

      return referralsSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (error) {
      console.error('Error fetching referrals:', error);
      throw new Error('No se pudieron cargar los referidos');
    }
  },

  async addReferral(referralData) {
    try {
      await firebase
        .firestore()
        .collection('referrals')
        .add({
          ...referralData,
          registrationDate: new Date().toISOString()
        });
    } catch (error) {
      console.error('Error adding referral:', error);
      throw new Error('No se pudo agregar el referido');
    }
  }
}; 
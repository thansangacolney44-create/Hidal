
import * as admin from 'firebase-admin';
import { getApps } from 'firebase-admin/app';
import { headers } from 'next/headers';

// This is the key for the service account you create in Firebase.
// You must add this to your environment variables.
const FIREBASE_SERVICE_ACCOUNT = process.env.FIREBASE_SERVICE_ACCOUNT;

if (!FIREBASE_SERVICE_ACCOUNT) {
    throw new Error('Missing FIREBASE_SERVICE_ACCOUNT environment variable.');
}

const serviceAccount = JSON.parse(FIREBASE_SERVICE_ACCOUNT);

// Initialize Firebase Admin
if (!getApps().length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });
}

const db = admin.firestore();
const auth = admin.auth();

export { db, auth };

export const getFirebaseAdmin = async () => {
    return { db, auth, admin };
};


export const getFirebaseUser = async () => {
    const headersList = headers();
    const authorization = headersList.get('Authorization');
    
    if (authorization?.startsWith('Bearer ')) {
      const idToken = authorization.split('Bearer ')[1];
      try {
        const decodedToken = await auth.verifyIdToken(idToken);
        return decodedToken;
      } catch (error) {
        console.error('Error verifying Firebase ID token:', error);
        return null;
      }
    }
    return null;
  };

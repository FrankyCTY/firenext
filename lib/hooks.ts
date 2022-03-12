import { auth, firestore } from '../lib/firebase';
import {
  addDoc,
  setDoc,
  doc,
  collection,
  onSnapshot,
} from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';

// Custom hook to read  auth record and user profile doc
export function useUserData() {
  const [user] = useAuthState(auth);
  const [username, setUsername] = useState(null);

  useEffect(() => {
    // turn off realtime subscription
    let unsubscribe;

    if (user) {
      console.log('hi', user);
      const collecctionRef = collection(firestore, 'users');
      const docRef = doc(firestore, 'users', user.uid);
      unsubscribe = onSnapshot(docRef, (doc) => {
        setUsername(doc.data()?.username);
      });
    } else {
      setUsername(null);
    }

    return unsubscribe;
  }, [user]);

  return { user, username };
}

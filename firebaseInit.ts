import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyCFBQiMguSfVnIlKtx9gd6tp5E0d3MMOgw',
  authDomain: 'fireship-demos-2c88d.firebaseapp.com',
  projectId: 'fireship-demos-2c88d',
  storageBucket: 'fireship-demos-2c88d.appspot.com',
  messagingSenderId: '254373453434',
  appId: '1:254373453434:web:8af496babffc3cd5c665c3',
  measurementId: 'G-LT3G92K0LE',
};

const firebaseApp = initializeApp(firebaseConfig);

export const auth = getAuth(firebaseApp);
export const firestore = getFirestore(firebaseApp);

/**`
 * Converts a firestore document to JSON
 * @param  {DocumentSnapshot} doc
 */
export function postToJSON(post) {
  return {
    ...post,
    // Gotcha! firestore timestamp NOT serializable to JSON. Must convert to milliseconds
    createdAt: post.createdAt.toMillis(),
    updatedAt: post.updatedAt.toMillis(),
  };
}

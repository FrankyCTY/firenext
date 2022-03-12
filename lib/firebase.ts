import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import 'firebase/compat/storage';

const firebaseConfig = {
  apiKey: 'AIzaSyCFBQiMguSfVnIlKtx9gd6tp5E0d3MMOgw',
  authDomain: 'fireship-demos-2c88d.firebaseapp.com',
  projectId: 'fireship-demos-2c88d',
  storageBucket: 'fireship-demos-2c88d.appspot.com',
  messagingSenderId: '254373453434',
  appId: '1:254373453434:web:8af496babffc3cd5c665c3',
  measurementId: 'G-LT3G92K0LE',
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export const auth = firebase.auth();
export const firestore = firebase.firestore();
export const storage = firebase.storage();

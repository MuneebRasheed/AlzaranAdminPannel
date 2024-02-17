// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// const firebaseConfig = {
//   apiKey: 'AIzaSyDwns684r4kqfWCWzqW0Za5eUoloI2GQQs',
//   authDomain: 'admin-pannel-b5d33.firebaseapp.com',
//   projectId: 'admin-pannel-b5d33',
//   storageBucket: 'admin-pannel-b5d33.appspot.com',
//   messagingSenderId: '959915923047',
//   appId: '1:959915923047:web:013609c82050922ada66c2',
// };
// const firebaseConfig = {
//   apiKey: 'AIzaSyDYy6XdgmQMma6S4wc1AUfZ-kSshuoo9PU',
//   authDomain: 'admin-pannel-f143e.firebaseapp.com',
//   projectId: 'admin-pannel-f143e',
//   storageBucket: 'admin-pannel-f143e.appspot.com',
//   messagingSenderId: '843731198743',
//   appId: '1:843731198743:web:bbbdc9722cbda63699cd52',
// };

const firebaseConfig = {
  apiKey: "AIzaSyAnod2fydbOwD2xGqgKrn_P8ymWwaYjeVU",
  authDomain: "adminpannel-df31f.firebaseapp.com",
  projectId: "adminpannel-df31f",
  storageBucket: "adminpannel-df31f.appspot.com",
  messagingSenderId: "153387407941",
  appId: "1:153387407941:web:a19de37105247cec53212c"

};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export firestore database
// It will be imported into your react app whenever it is needed
export const db = getFirestore(app);
export const storage = getStorage(app);
export default app;

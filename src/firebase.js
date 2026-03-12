import { initializeApp } from "firebase/app";
import { getDatabase, ref, onValue } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyCx2Hvv9l1x8QhuHrmKAFJ6U-TuFCQXRWo",
  authDomain: "smart-irrigation-dd142.firebaseapp.com",
  databaseURL: "https://smart-irrigation-dd142-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "smart-irrigation-dd142",
  storageBucket: "smart-irrigation-dd142.firebasestorage.app",
  messagingSenderId: "264748792554",
  appId: "1:264748792554:web:53e5881dd5e0c1d55f7593"
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

export { database, ref, onValue };

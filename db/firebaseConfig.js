
import { initializeApp } from "firebase/app";
import { addDoc, collection, getDocs, getFirestore, query, where } from "firebase/firestore";



// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCJWYcgT5fTgmyOdvaJ_3fNu7Eh3wIL6D8",
  authDomain: "emition-tester-25d9c.firebaseapp.com",
  projectId: "emition-tester-25d9c",
  storageBucket: "emition-tester-25d9c.appspot.com",
  messagingSenderId: "1023532525940",
  appId: "1:1023532525940:web:08956a2c4ff26dee84a421"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export const addTestToDb = async (data) => {
  try {
    const docRef = await addDoc(collection(db, "tests"), data);
    console.log("Document written with ID: ", docRef.id);
    return docRef.id;
  } catch (e) {
    console.error("Error adding document: ", e);
    throw new Error("Failed to add test to database");
  }
};


export const getAllTestDocs = async () => {
  try {
    const testCollection = collection(db, 'tests');
    const querySnapshot = await getDocs(testCollection);

    const testDocs = [];
    querySnapshot.forEach((doc) => {
      testDocs.push({
        id: doc.id,
        ...doc.data()
      });
    });

    return testDocs;
  } catch (error) {
    console.error('Error fetching test documents:', error);
    throw new Error('Failed to fetch test documents');
  }
};

export const createUser = async (data) => {
  try {
    const docRef = await addDoc(collection(db, "users"), data);
    console.log("Document written with ID: ", docRef.id);
    return docRef.id;
  } catch (e) {
    console.error("Error adding document: ", e);
    throw new Error("Failed to add test to database");
  }
};

export const getAllUser = async () => {
  try {
    const Collection = collection(db, 'users');
    const querySnapshot = await getDocs(Collection);

    const testDocs = [];
    querySnapshot.forEach((doc) => {
      testDocs.push({
        id: doc.id,
        ...doc.data()
      });
    });

    return testDocs;
  } catch (error) {
    console.error('Error fetching test documents:', error);
    throw new Error('Failed to fetch test documents');
  }
};


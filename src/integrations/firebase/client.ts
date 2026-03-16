import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, query, where, orderBy, getDocs, serverTimestamp } from "firebase/firestore";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || import.meta.env.VITE_GOOGLE_AI_STUDIO_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || `${import.meta.env.VITE_FIREBASE_PROJECT_ID}.firebaseapp.com`,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "njiapanda-v2",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || `${import.meta.env.VITE_FIREBASE_PROJECT_ID}.appspot.com`,
  messagingSenderId: "000000000000",
  appId: "1:000000000000:web:0000000000000000"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

export const isFirebaseConfigured = () => !!(import.meta.env.VITE_FIREBASE_PROJECT_ID);

export const storiesRef = collection(db, "stories");

export const addStory = async (story: {
  text: string;
  title: string;
  language: string;
  status: string;
  source: string;
  abuse_type?: string;
  tags?: string[];
}) => {
  const doc = await addDoc(storiesRef, {
    ...story,
    created_at: serverTimestamp(),
  });
  return doc.id;
};

export const getStories = async (status = "approved") => {
  const q = query(
    storiesRef,
    where("status", "==", status),
    orderBy("created_at", "desc")
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};
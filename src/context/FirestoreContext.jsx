// FirestoreContext.jsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './FirebaseContext'; 
import { initializeApp } from 'firebase/app';
//
import { getFirestore, collection, addDoc, query, where, onSnapshot, deleteDoc, doc } from 'firebase/firestore'; 
import { firebaseConfig } from '../config/Firebase'; 

const FirestoreContext = createContext();

export const useFirestore = () => {
  return useContext(FirestoreContext);
};

export const FirestoreProvider = ({ children }) => {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState([]);
  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);

  useEffect(() => {
    if (user) {
      // Überwachen Sie Änderungen an der Firestore-Sammlung für den Benutzer
      const q = query(collection(db, 'favorites'), where('userId', '==', user.uid));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const updatedFavorites = [];
        snapshot.forEach((doc) => {
          updatedFavorites.push({ id: doc.id, ...doc.data() }); // Füge die ID zum Favoriten hinzu
        });
        setFavorites(updatedFavorites);
      });

      // Cleanup-Funktion, um das Abhören zu stoppen, wenn die Komponente unmontiert wird
      return () => unsubscribe();
    }
  }, [user, db]);

  const addFavorite = async (favorite) => {
    if (user) {
      try {
        const docRef = await addDoc(collection(db, 'favorites'), {
          ...favorite,
          userId: user.uid,
        });
        console.log('Favorite added with ID: ', docRef.id);
      } catch (e) {
        console.error('Error adding favorite: ', e);
      }
    }
  };

  const deleteFavorite = async (favoriteId) => {
    if (user) {
      try {
        await deleteDoc(doc(db, 'favorites', favoriteId));
        console.log('Favorite deleted with ID: ', favoriteId);
      } catch (e) {
        console.error('Error deleting favorite: ', e);
      }
    }
  };

  return (
    <FirestoreContext.Provider value={{ favorites, addFavorite, deleteFavorite }}>
      {children}
    </FirestoreContext.Provider>
  );
};

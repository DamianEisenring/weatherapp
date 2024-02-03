import { createContext, useContext, useEffect, useState } from "react";
import { auth } from "../config/Firebase";

//Firebase functions
import {
  signOut,
  onAuthStateChanged,
  GoogleAuthProvider,
  signInWithRedirect,
  signInWithPopup,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";

//Create Context
const userAuthContext = createContext();

//Provider
const googleProvider = new GoogleAuthProvider();

export function useAuth() {
  return useContext(userAuthContext);
}

export function UserAuthContextProvider({ children }) {
  const [user, setUser] = useState();
  const [loading, setLoading] = useState(true);

  function googleLogin() {
    return signInWithPopup(auth, googleProvider);
  }
  function signUp(email, password) {
    return createUserWithEmailAndPassword(auth, email, password);
  }

  function login(email, password) {
    return signInWithEmailAndPassword(auth, email, password);
  }

  function logOut() {
    return signOut(auth);
  }
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const value = { user, logOut, googleLogin, signUp, login };

  return (
    <userAuthContext.Provider value={value}>
      {!loading && children}
    </userAuthContext.Provider>
  );
}

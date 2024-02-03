import React from "react";
import Weather from "./components/Weather";
import FavoritePlaces from "./components/FavoritePlaces";
import { useAuth } from "./context/FirebaseContext";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { FirestoreProvider } from "./context/FirestoreContext";
import LoginPopUp from './components/LoginPopUp'




function App() {
  const { user, googleLogin } = useAuth();

  const Login = () => (
    <div className="app">
      <LoginPopUp/>
    </div>
  );

  return (
    <FirestoreProvider>
      <BrowserRouter>
        <Routes>
          <Route path="" element={user ? <Weather /> : <Login />} />
        </Routes>
      </BrowserRouter>
    </FirestoreProvider>
  );
}

export default App;

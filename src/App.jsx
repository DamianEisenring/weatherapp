import React from 'react';
import Weather from './components/Weather';
import FavoritePlaces from './components/favoritePlaces';
import { useAuth } from './context/FirebaseContext';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { FirestoreProvider } from './context/FirestoreContext';

function App() {
  const { user, googleLogin } = useAuth();

  const Login = () => (
    <div className="app">
      <button id="login" onClick={googleLogin}>
        Sign In
      </button>
    </div>
  );

  return (
    <FirestoreProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/main" element={user ? <Weather /> : <Login />} />
          <Route
            path="/favorite-places"
            element={
              user ? (
                <FavoritePlaces />
              ) : (
                <Login />
              )
            }
          />
        </Routes>
      </BrowserRouter>
    </FirestoreProvider>
  );
}

export default App;

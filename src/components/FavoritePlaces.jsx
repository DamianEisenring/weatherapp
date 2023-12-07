import React, { useEffect, useState } from 'react';
import { useFirestore } from '../context/FirestoreContext';
import { useNavigate } from 'react-router-dom';

const FavoritePlaces = () => {
  const { favorites, deleteFavorite } = useFirestore();
  const [weatherData, setWeatherData] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Lade Wetterdaten für jeden favorisierten Ort
    const fetchData = async () => {
      const newData = await Promise.all(
        favorites.map(async (place) => {
          const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${place.name}&units=metric&appid=895284fb2d2c50a520ea537456963d9c`
          );
          const responseData = await response.json();
          return {
            name: place.name,
            temp: responseData.main.temp,
            description: responseData.weather[0].main,
          };
        })
      );
      setWeatherData(newData);
    };

    fetchData();
  }, [favorites]);

  const navigateToMain = () => {
    navigate('/main');
  };

  const handleDeleteFavorite = (index) => {
    const favoriteToDelete = favorites[index];
    deleteFavorite(favoriteToDelete.id);
  };

  return (
    <div className="app">
      <h1>Favorite Places</h1>
      <button onClick={navigateToMain}>Main</button>
      <ul>
        {weatherData.map((place, index) => (
          <li key={index}>
            <p>Name: {place.name}</p>
            <p>Temperature: {place.temp}°C</p>
            <p>Description: {place.description}</p>
            <button onClick={() => handleDeleteFavorite(index)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FavoritePlaces;

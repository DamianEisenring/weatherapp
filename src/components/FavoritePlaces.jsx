import React, { useEffect, useState } from "react";
import { useFirestore } from "../context/FirestoreContext";
import { useNavigate } from "react-router-dom";
import { MdDelete } from "react-icons/md";

// Import of all the weather icons
import { TiWeatherCloudy } from "react-icons/ti";
import { TiWeatherPartlySunny } from "react-icons/ti";
import { TiWeatherSunny } from "react-icons/ti";
import { TiWeatherShower } from "react-icons/ti";
import { TiWeatherDownpour } from "react-icons/ti";
import { TiWeatherStormy } from "react-icons/ti";
import { TiWeatherSnow } from "react-icons/ti";
import { RiMistFill } from "react-icons/ri";

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
    navigate("/");
  };

  const handleDeleteFavorite = (index) => {
    const favoriteToDelete = favorites[index];
    deleteFavorite(favoriteToDelete.id);
  };

  const getWeatherIcon = (description) => {
    switch (description) {
      case "Clouds":
        return <TiWeatherCloudy />;
      case "Clear":
        return <TiWeatherSunny />;
      case "Partly Cloudy":
        return <TiWeatherPartlySunny />;
      case "Showers":
        return <TiWeatherShower />;
      case "Rain":
        return <TiWeatherDownpour />;
      case "Thunderstorm":
        return <TiWeatherStormy />;
      case "Snow":
        return <TiWeatherSnow />;
      case "Mist":
        return <RiMistFill />;
      default:
        return null;
    }
  };

  return (
    <div>
      <h1>Favorite Places</h1>
      <ul>
        {weatherData.map((place, index) => (
          <li key={index}>
            <p>{place.name}</p>
            <p>{Math.round(place.temp)}°C</p>
            <p className="description">{getWeatherIcon(place.description)}</p> 
            <p>{place.description}</p>
            <MdDelete
              className="delete_button"
              onClick={() => handleDeleteFavorite(index)}
            />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FavoritePlaces;

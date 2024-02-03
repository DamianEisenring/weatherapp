import React, { useEffect, useState } from "react";
import { useAuth } from "../context/FirebaseContext";
import { useFirestore } from "../context/FirestoreContext";
import { useNavigate } from "react-router-dom";
import FavoritePlaces from "./FavoritePlaces.jsx";
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

const Weather = () => {
  const { addFavorite } = useFirestore();
  const { logOut } = useAuth();
  const [searched, setSearched] = useState(false);
  const [data, setData] = useState({});
  const [location, setLocation] = useState("");
  const navigate = useNavigate();

  function Locationdoesntexist() {
    return alert("Fehler: Diese Ortschaft existiert nicht.");
  }

  const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${location}&units=metric&appid=895284fb2d2c50a520ea537456963d9c`;

  const searchLocation = async (event) => {
    if (event.key === "Enter") {
      try {
        const response = await fetch(apiUrl);

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const responseData = await response.json();

        setData(responseData);
        console.log(responseData);
        handleSearch();
      } catch (error) {
        console.error("Error fetching weather data:", error);
        Locationdoesntexist();
      }
      setLocation("");
    }
  };
  const handleSearch = async () => {
    setSearched(true);
  };
  const addFavoritePlace = async () => {
    if (data.name) {
      // Füge den Favoriten zur Firestore-Datenbank hinzu
      await addFavorite({
        name: data.name,
        temp: data.main.temp,
        description: data.weather[0].main,
      });
    }
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
    <div className="app">
      <header>
        <h1>Weather App</h1>
      </header>
      <nav>
        <div>
          <input
            value={location}
            onChange={(event) => setLocation(event.target.value)}
            onKeyPress={searchLocation}
            placeholder="Enter Location"
            type="text"
            id="search"
          />
          <button onClick={logOut} id="logOut">
            Log Out
          </button>
          <button
            onClick={addFavoritePlace}
            style={{ visibility: searched ? "visible" : "hidden" }}
            id="favoritePlace"
          >
            Add favorite Place
          </button>
        </div>
      </nav>
      <div className="container">
        <div className="top">
          <div className="location">
            <p>{data.name}</p>
          </div>
          <div className="temp">
            {data.main ? <h1>{Math.round(data.main.temp)}°C</h1> : null}
          </div>
          <div className="description">
            <p className="description-icon">
              {data.weather ? getWeatherIcon(data.weather[0].main) : null}
            </p>
            {data.weather ? <p>{data.weather[0].main}</p> : null}
          </div>
        </div>
        <div className="bottom">
          <FavoritePlaces />
        </div>
      </div>
    </div>
  );
};

export default Weather;

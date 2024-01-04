import React, { useState } from 'react'
import '../index.css';
import {useAuth} from '../context/FirebaseContext'
import { useNavigate } from 'react-router-dom';
import { useFirestore } from '../context/FirestoreContext';
import FavoritePlaces from './favoritePlaces';


const Weather = () => {
    const {addFavorite} = useFirestore();
    const {logOut } = useAuth()
    const [searched, setSearched] = useState(false);
    const [data, setData] = useState({})
    const [location, setLocation] = useState('')
    const [favorites, setFavorites] = useState([]);
    const navigate = useNavigate(); 


    function Locationdoesntexist(){
        return alert('Fehler: Diese Ortschaft existiert nicht.')
      }
      
    
      const apiUrl = `https://api.openweathermap.org/data/2.5/YOUR_API_KEY`
    
      const searchLocation = async (event) => {
        if (event.key === 'Enter') {
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
            console.error('Error fetching weather data:', error);
            Locationdoesntexist();
          }
          setLocation('');
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
      }
      const navigateToFavoritePlaces = () => {
        navigate('/favorite-places');
      };

      return (
        <div className="app" >
          <header>
            <h1>Weather App</h1>
          </header>
          <nav>
            <div>
              <input
                value={location}
                onChange={event => setLocation(event.target.value)}
                onKeyPress={searchLocation}
                placeholder='Enter Location'
                type="text" 
                id='search'
                />
                <button onClick={logOut} id='logOut'>Log Out</button>
                <button 
                onClick={addFavoritePlace} 
                style={{ visibility: searched ? 'visible' : 'hidden'}} 
                id='favoritePlace'
                >Add favorite Place</button>
                
                <button onClick={navigateToFavoritePlaces}>Favorite Places</button>
            </div>
          </nav>   
          <div className="container">
            <div className="top">
              <div className="location">
                <p>{data.name}</p>
              </div>
              <div className="temp">
                {data.main ? <h1>{data.main.temp.toFixed()}°C</h1> : null}
              </div>
              <div className="description">
                {data.weather ? <p>{data.weather[0].main}</p> : null}
              </div>             
            </div>
              <div className="bottom">
                <div className="feels">
                  {data.main ? <p className='bold'>Feels Like: <br/>{data.main.feels_like.toFixed()}°C</p> : null}                 
                </div>
                <div className="humidity">
                  {data.main ? <p className='bold'>Humidity:<br/> {data.main.humidity}%</p> : null}
                </div>
                <div className="wind" >
                  {data.wind ? <p className='bold'>Wind Speed:<br/>{data.wind.speed.toFixed()} MPH</p> : null}    
                </div>
              </div>
          </div>
        </div>
      );
}

export default Weather;
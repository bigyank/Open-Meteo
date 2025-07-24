import { useState } from 'react'
import SearchBar from './components/SearchBar'
import CurrentWeather from './components/CurrentWeather'
import Forecast from './components/Forecast'
import useWeather from './hooks/useWeather'
import './App.css'
import './styles/Weather.css'

function Loading() {
  return (
    <div className="loading-spinner">
      <div className="spinner" />
      <span>Loading...</span>
    </div>
  );
}

function App() {
  const [city, setCity] = useState('');
  const { currentWeather, forecast, loading, error } = useWeather(city);

  const handleSearch = (searchCity) => {
    setCity(searchCity);
  };

  return (
    <div className="app">
      <header>
        <h1>Weather App</h1>
      </header>
      <main>
        <SearchBar onSearch={handleSearch} />
        {!city && !loading && (
          <div className="welcome-message">
            <h2>Welcome to Weather App</h2>
            <p>Enter a city name to get the current weather and forecast</p>
          </div>
        )}
        {loading && <Loading />}
        {error && (
          <div className="error-message">
            <h3>Error</h3>
            <p>{error}</p>
          </div>
        )}
        {city && !loading && !error && (
          <>
            <CurrentWeather data={currentWeather} />
            <Forecast data={forecast} />
          </>
        )}
      </main>
      <footer>
        <p>
          Powered by <a href="https://openweathermap.org/" target="_blank" rel="noreferrer">OpenWeather API</a>
        </p>
      </footer>
    </div>
  )
}

export default App

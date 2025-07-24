import { useState, useEffect } from 'react';
import { fetchCurrentWeather, fetchForecast } from '../api/weatherApi';

const useWeather = (city) => {
  const [currentWeather, setCurrentWeather] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWeatherData = async () => {
      if (!city) {
        setLoading(false);
        return;
      }
      
      setLoading(true);
      setError(null);
      
      try {
        const [weatherData, forecastData] = await Promise.all([
          fetchCurrentWeather(city),
          fetchForecast(city)
        ]);
        
        setCurrentWeather(weatherData);
        setForecast(forecastData);
      } catch (err) {
        setError(err.message || 'Failed to fetch weather data');
      } finally {
        setLoading(false);
      }
    };

    fetchWeatherData();
  }, [city]);

  const refreshWeather = async () => {
    if (!city) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const [weatherData, forecastData] = await Promise.all([
        fetchCurrentWeather(city),
        fetchForecast(city)
      ]);
      
      setCurrentWeather(weatherData);
      setForecast(forecastData);
    } catch (err) {
      setError(err.message || 'Failed to fetch weather data');
    } finally {
      setLoading(false);
    }
  };

  return {
    currentWeather,
    forecast,
    loading,
    error,
    refreshWeather
  };
};

export default useWeather; 
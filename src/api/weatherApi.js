import axios from 'axios';

// Create an API instance with base URL for Open-Meteo API
// Open-Meteo is a free weather API that doesn't require an API key
const weatherApi = axios.create({
  baseURL: 'https://api.open-meteo.com/v1',
});

// Weather API functions
export const fetchCurrentWeather = async (city) => {
  try {
    // First, geocode the city name to get coordinates
    const geocodeUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1&language=en&format=json`;
    const geocodeResponse = await axios.get(geocodeUrl);
    
    if (!geocodeResponse.data.results || geocodeResponse.data.results.length === 0) {
      throw new Error('Location not found');
    }
    
    const location = geocodeResponse.data.results[0];
    const { latitude, longitude, name, country, country_code } = location;
    
    // Then fetch weather data using coordinates
    const weatherResponse = await weatherApi.get('/forecast', {
      params: {
        latitude,
        longitude,
        current: 'temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,rain,showers,snowfall,weather_code,cloud_cover,pressure_msl,surface_pressure,wind_speed_10m,wind_direction_10m',
        daily: 'weather_code,temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,sunrise,sunset',
        timezone: 'auto',
        forecast_days: 1
      }
    });
    
    // Adapt Open-Meteo response to match our app's expected format
    const adaptedResponse = {
      name,
      sys: {
        country: country || country_code,
        sunrise: new Date(weatherResponse.data.daily.sunrise[0]).getTime() / 1000,
        sunset: new Date(weatherResponse.data.daily.sunset[0]).getTime() / 1000
      },
      main: {
        temp: weatherResponse.data.current.temperature_2m,
        feels_like: weatherResponse.data.current.apparent_temperature,
        temp_min: weatherResponse.data.daily.temperature_2m_min[0],
        temp_max: weatherResponse.data.daily.temperature_2m_max[0],
        pressure: weatherResponse.data.current.surface_pressure,
        humidity: weatherResponse.data.current.relative_humidity_2m
      },
      weather: [
        {
          id: weatherResponse.data.current.weather_code,
          main: getWeatherDescription(weatherResponse.data.current.weather_code),
          description: getWeatherDescription(weatherResponse.data.current.weather_code)
        }
      ],
      wind: {
        speed: weatherResponse.data.current.wind_speed_10m,
        deg: weatherResponse.data.current.wind_direction_10m
      },
      clouds: {
        all: weatherResponse.data.current.cloud_cover
      },
      timezone: 0, // Open-Meteo handles timezone automatically
      coord: {
        lat: latitude,
        lon: longitude
      }
    };
    
    return adaptedResponse;
  } catch (error) {
    console.error('Error fetching current weather:', error);
    throw error;
  }
};

export const fetchForecast = async (city) => {
  try {
    // First, geocode the city name to get coordinates
    const geocodeUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1&language=en&format=json`;
    const geocodeResponse = await axios.get(geocodeUrl);
    
    if (!geocodeResponse.data.results || geocodeResponse.data.results.length === 0) {
      throw new Error('Location not found');
    }
    
    const location = geocodeResponse.data.results[0];
    const { latitude, longitude } = location;
    
    // Then fetch forecast data using coordinates
    const forecastResponse = await weatherApi.get('/forecast', {
      params: {
        latitude,
        longitude,
        hourly: 'temperature_2m,relative_humidity_2m,apparent_temperature,precipitation_probability,precipitation,weather_code,cloud_cover,pressure_msl,surface_pressure,wind_speed_10m,wind_direction_10m',
        daily: 'weather_code,temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,precipitation_sum,precipitation_probability_max',
        timezone: 'auto',
        forecast_days: 7
      }
    });
    
    // Adapt Open-Meteo forecast data to match our app's expected format
    const adaptedForecast = {
      city: {
        name: geocodeResponse.data.results[0].name,
        country: geocodeResponse.data.results[0].country || geocodeResponse.data.results[0].country_code,
        coord: {
          lat: latitude,
          lon: longitude
        }
      },
      list: processForecastData(forecastResponse.data)
    };
    
    return adaptedForecast;
  } catch (error) {
    console.error('Error fetching forecast:', error);
    throw error;
  }
};

// Helper function to process forecast data into 3-hour intervals similar to OpenWeatherMap
function processForecastData(data) {
  const result = [];
  
  // Get data for every 3 hours (indices 0, 3, 6, 9, etc.)
  for (let i = 0; i < Math.min(data.hourly.time.length, 40); i += 3) {
    const timestamp = new Date(data.hourly.time[i]).getTime() / 1000;
    
    result.push({
      dt: timestamp,
      main: {
        temp: data.hourly.temperature_2m[i],
        feels_like: data.hourly.apparent_temperature[i],
        pressure: data.hourly.surface_pressure[i],
        humidity: data.hourly.relative_humidity_2m[i],
      },
      weather: [
        {
          id: data.hourly.weather_code[i],
          main: getWeatherDescription(data.hourly.weather_code[i]),
          description: getWeatherDescription(data.hourly.weather_code[i])
        }
      ],
      clouds: {
        all: data.hourly.cloud_cover[i]
      },
      wind: {
        speed: data.hourly.wind_speed_10m[i],
        deg: data.hourly.wind_direction_10m[i]
      },
      pop: data.hourly.precipitation_probability[i] / 100 // Convert from percentage to 0-1 range
    });
  }
  
  return result;
}

// Helper function to convert Open-Meteo weather codes to descriptions
function getWeatherDescription(code) {
  const weatherCodes = {
    0: 'Clear sky',
    1: 'Mainly clear',
    2: 'Partly cloudy',
    3: 'Overcast',
    45: 'Fog',
    48: 'Depositing rime fog',
    51: 'Light drizzle',
    53: 'Moderate drizzle',
    55: 'Dense drizzle',
    56: 'Light freezing drizzle',
    57: 'Dense freezing drizzle',
    61: 'Slight rain',
    63: 'Moderate rain',
    65: 'Heavy rain',
    66: 'Light freezing rain',
    67: 'Heavy freezing rain',
    71: 'Slight snow fall',
    73: 'Moderate snow fall',
    75: 'Heavy snow fall',
    77: 'Snow grains',
    80: 'Slight rain showers',
    81: 'Moderate rain showers',
    82: 'Violent rain showers',
    85: 'Slight snow showers',
    86: 'Heavy snow showers',
    95: 'Thunderstorm',
    96: 'Thunderstorm with slight hail',
    99: 'Thunderstorm with heavy hail'
  };
  
  return weatherCodes[code] || 'Unknown';
}

export default weatherApi; 
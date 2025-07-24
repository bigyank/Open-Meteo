// Format temperature with proper unit
export const formatTemperature = (temp, unit = 'C') => {
  return `${Math.round(temp)}°${unit}`;
};

// Get weather icon URL based on Open-Meteo weather codes
export const getWeatherIconUrl = (weatherCode) => {
  // Map Open-Meteo weather codes to OpenWeatherMap-like icon codes
  const codeMap = {
    0: '01d', // Clear sky
    1: '02d', // Mainly clear
    2: '03d', // Partly cloudy
    3: '04d', // Overcast
    45: '50d', // Fog
    48: '50d', // Depositing rime fog
    51: '09d', // Light drizzle
    53: '09d', // Moderate drizzle
    55: '09d', // Dense drizzle
    56: '13d', // Light freezing drizzle
    57: '13d', // Dense freezing drizzle
    61: '10d', // Slight rain
    63: '10d', // Moderate rain
    65: '10d', // Heavy rain
    66: '13d', // Light freezing rain
    67: '13d', // Heavy freezing rain
    71: '13d', // Slight snow fall
    73: '13d', // Moderate snow fall
    75: '13d', // Heavy snow fall
    77: '13d', // Snow grains
    80: '09d', // Slight rain showers
    81: '09d', // Moderate rain showers
    82: '09d', // Violent rain showers
    85: '13d', // Slight snow showers
    86: '13d', // Heavy snow showers
    95: '11d', // Thunderstorm
    96: '11d', // Thunderstorm with slight hail
    99: '11d', // Thunderstorm with heavy hail
  };
  
  // If it's nighttime, use night icons
  const iconCode = codeMap[weatherCode] || '01d';
  
  return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
};

// Format date from timestamp
export const formatDate = (timestamp) => {
  const date = new Date(timestamp * 1000);
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
};

// Format time from timestamp
export const formatTime = (timestamp) => {
  const date = new Date(timestamp * 1000);
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit'
  });
};

// Group forecast data by day
export const groupForecastByDay = (forecastList) => {
  const groupedForecast = {};
  
  forecastList.forEach(item => {
    const date = new Date(item.dt * 1000).toLocaleDateString('en-US');
    
    if (!groupedForecast[date]) {
      groupedForecast[date] = [];
    }
    
    groupedForecast[date].push(item);
  });
  
  return groupedForecast;
}; 
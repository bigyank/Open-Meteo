import { formatTemperature, getWeatherIconUrl, formatDate, formatTime } from '../utils/weatherUtils';

const CurrentWeather = ({ data }) => {
  if (!data) {
    return null;
  }

  const {
    name,
    sys: { country },
    weather,
    main: { temp, feels_like, temp_min, temp_max, humidity, pressure },
    wind: { speed },
    dt
  } = data;

  return (
    <div className="current-weather">
      <div className="weather-header">
        <h2>{name}, {country}</h2>
        <p className="date">{formatDate(dt)} | {formatTime(dt)}</p>
      </div>
      
      <div className="weather-main">
        <div className="weather-icon">
          <img src={getWeatherIconUrl(weather[0].id)} alt={weather[0].description} />
        </div>
        <div className="weather-info">
          <div className="temperature">
            <h1>{formatTemperature(temp)}</h1>
            <p>Feels like {formatTemperature(feels_like)}</p>
          </div>
          <div className="description">{weather[0].description}</div>
        </div>
      </div>
      <div className="weather-details">
        <div className="detail-row">
          <div className="detail-item">
            <span className="label">Min</span>
            <span className="value">{formatTemperature(temp_min)}</span>
          </div>
          <div className="detail-item">
            <span className="label">Max</span>
            <span className="value">{formatTemperature(temp_max)}</span>
          </div>
          <div className="detail-item">
            <span className="label">Humidity</span>
            <span className="value">{humidity}%</span>
          </div>
          <div className="detail-item">
            <span className="label">Pressure</span>
            <span className="value">{pressure} hPa</span>
          </div>
          <div className="detail-item">
            <span className="label">Wind</span>
            <span className="value">{speed} m/s</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CurrentWeather; 
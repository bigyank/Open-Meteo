import { formatTemperature, getWeatherIconUrl, formatDate, formatTime, groupForecastByDay } from '../utils/weatherUtils';

const ForecastItem = ({ item }) => {
  return (
    <div className="forecast-item">
      <div className="forecast-time">{formatTime(item.dt)}</div>
      <div className="forecast-icon">
        <img 
          src={getWeatherIconUrl(item.weather[0].id)} 
          alt={item.weather[0].description}
        />
      </div>
      <div className="forecast-temp">{formatTemperature(item.main.temp)}</div>
      <div className="forecast-desc">{item.weather[0].description}</div>
    </div>
  );
};

const ForecastDay = ({ dayData }) => {
  if (!dayData || !dayData.length) return null;
  
  // Get the date from the first item in the day
  const date = formatDate(dayData[0].dt);
  
  return (
    <div className="forecast-day">
      <h3 className="forecast-date">{date}</h3>
      <div className="forecast-items">
        {dayData.map((item, idx) => (
          <ForecastItem key={idx} item={item} />
        ))}
      </div>
    </div>
  );
};

const Forecast = ({ data }) => {
  if (!data) return null;
  const grouped = groupForecastByDay(data.list);
  return (
    <div className="forecast">
      <h2 className="forecast-heading">5-Day Forecast</h2>
      <div className="forecast-container">
        {Object.keys(grouped).map((day, idx) => (
          <ForecastDay key={idx} dayData={grouped[day]} />
        ))}
      </div>
    </div>
  );
};

export default Forecast; 
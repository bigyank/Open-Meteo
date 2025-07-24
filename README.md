# Weather App

A React weather application built with Vite that displays current weather and 5-day forecast using the OpenWeather API.

## Features

- Current weather display with details (temperature, humidity, wind speed, etc.)
- 5-day weather forecast
- Search for weather by city name
- Responsive design

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- NPM or Yarn
- OpenWeather API key (get one at [https://openweathermap.org/api](https://openweathermap.org/api))

### Installation

1. Clone the repository or download the source code

2. Navigate to the project directory:
   ```
   cd weather-app
   ```

3. Install dependencies:
   ```
   npm install
   ```

4. Create a `.env.local` file in the root directory with your OpenWeather API key:
   ```
   VITE_OPENWEATHER_API_KEY=your_api_key_here
   ```

5. Start the development server:
   ```
   npm run dev
   ```

6. Open your browser and navigate to `http://localhost:5173`

## Build for Production

To build the app for production, run:

```
npm run build
```

## Technologies Used

- React
- Vite
- Axios
- OpenWeather API

## Project Structure

```
weather-app/
├── src/
│   ├── api/          # API related functions
│   ├── components/   # React components
│   ├── hooks/        # Custom hooks
│   ├── utils/        # Utility functions
│   ├── styles/       # CSS styles
│   ├── App.jsx       # Main App component
│   └── main.jsx      # Entry point
├── public/           # Static files
└── index.html        # HTML entry point
```

## License

This project is open source and available under the [MIT License](LICENSE).

import React, { useState, useEffect } from 'react';
import { 
  Search, MapPin, Sun, Cloud, Droplets, Wind, 
  Eye, Gauge, Thermometer, Sunrise, Sunset, Calendar, Loader2, Moon
} from 'lucide-react';

const API_KEY = "your_openweathermap_api_key_here"; // Replace with your OpenWeatherMap API key

const WeatherDashboard = () => {
  const [city, setCity] = useState('New York');
  const [searchInput, setSearchInput] = useState('');
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // --- Autocomplete Effect ---
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (searchInput.trim().length < 2) {
        setSuggestions([]);
        return;
      }
      try {
        const res = await fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${searchInput}&limit=5&appid=${API_KEY}`);
        const data = await res.json();
        setSuggestions(data);
      } catch (error) {
        console.error("Error fetching suggestions:", error);
      }
    };

    const delayDebounceFn = setTimeout(() => {
      fetchSuggestions();
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchInput]);

  // --- Main Weather Fetch Effect ---
  useEffect(() => {
    const fetchWeather = async () => {
      setLoading(true);
      try {
        const weatherRes = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${API_KEY}`);
        const weatherData = await weatherRes.json();

        const forecastRes = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${API_KEY}`);
        const forecastData = await forecastRes.json();

        if (weatherRes.ok && forecastRes.ok) {
          setWeather(weatherData);
          const dailyData = forecastData.list.filter(reading => reading.dt_txt.includes("12:00:00"));
          setForecast(dailyData);
        } else {
          console.error("City not found");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
      setLoading(false);
    };

    fetchWeather();
  }, [city]); 

  const handleSearch = (e) => {
    if (e.key === 'Enter' && searchInput.trim() !== '') {
      setCity(searchInput);
      setSearchInput('');
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    const preciseQuery = `${suggestion.name},${suggestion.country}`;
    setCity(preciseQuery);
    setSearchInput('');
    setShowSuggestions(false);
  };

  const formatTime = (unixTime) => {
    return new Date(unixTime * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const getWeatherIcon = (mainCondition, className) => {
    switch(mainCondition) {
      case 'Clear': return <Sun className={className} />;
      case 'Clouds': return <Cloud className={className} />;
      case 'Rain': 
      case 'Drizzle': return <Droplets className={className} />;
      default: return <Cloud className={className} />;
    }
  };

  // --- Sun Arc Calculation Math ---
  const getSunPosition = (sunrise, sunset) => {
    const now = Math.floor(Date.now() / 1000);
    let progress = 0;
    
    if (now > sunrise && now < sunset) {
      progress = (now - sunrise) / (sunset - sunrise);
    } else if (now >= sunset) {
      progress = 1; // Sun has set
    }
    
    // Calculate X and Y on a semi-circle using Trigonometry
    // The SVG viewBox is 0 0 100 50, radius is 40, center is (50, 50)
    const angle = Math.PI - (progress * Math.PI); 
    const x = 50 + 40 * Math.cos(angle);
    const y = 50 - 40 * Math.sin(angle);
    
    return { x, y };
  };

  const MetricCard = ({ icon, title, value }) => (
    <div className="bg-white/10 rounded-2xl p-4 flex flex-col justify-center space-y-2">
      <div className="flex items-center space-x-2 text-gray-300">
        {icon}
        <span className="text-sm font-medium">{title}</span>
      </div>
      <span className="text-xl font-semibold pl-1">{value}</span>
    </div>
  );

  return (
    <div 
      className="min-h-screen bg-cover bg-center text-white font-sans flex flex-col items-center p-6"
      style={{ 
        backgroundImage: "url('https://images.unsplash.com/photo-1513002749550-c59d786b8e6c?q=80&w=2574&auto=format&fit=crop')",
        backgroundColor: "rgba(30, 41, 59, 0.4)",
        backgroundBlendMode: "overlay"
      }}
    >
      {/* Header & Search */}
      <div className="w-full max-w-7xl flex flex-col items-center mb-8 mt-4 space-y-4">
        <p className="text-sm md:text-base text-gray-200 text-center max-w-2xl drop-shadow-md">
          Experience weather like never before with real-time data, beautiful visuals, 
          and precise forecasts for any location worldwide
        </p>
        
        <div className="flex items-center space-x-4 w-full max-w-2xl relative z-50">
          <div className="relative flex-grow">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-300" />
            <input 
              type="text" 
              value={searchInput}
              onChange={(e) => {
                setSearchInput(e.target.value);
                setShowSuggestions(true);
              }}
              onKeyDown={handleSearch}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
              placeholder="Search for any city..." 
              className="w-full bg-white/5 backdrop-blur-xl border border-white/30 rounded-full py-3 pl-12 pr-12 outline-none placeholder-white focus:bg-white/30 transition-all shadow-xl text-white font-medium"
            />
            <MapPin className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-300" />

            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white/ backdrop-blur-xl border border-white/30 rounded-2xl overflow-hidden shadow-2xl z-50">
                {suggestions.map((suggestion, index) => (
                  <div 
                    key={index}
                    onMouseDown={(e) => {
                      e.preventDefault(); 
                      handleSuggestionClick(suggestion);
                    }}
                    className="px-6 py-3 cursor-pointer hover:bg-white/10 transition-colors border-b border-white/20 last:border-0 flex flex-col"
                  >
                    <span className="font-medium text-white drop-shadow-md">{suggestion.name}</span>
                    <span className="text-xs text-gray-200 drop-shadow-md">
                      {[suggestion.state, suggestion.country].filter(Boolean).join(', ')}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {loading || !weather ? (
        <div className="flex-grow flex items-center justify-center">
          <Loader2 className="w-12 h-12 animate-spin text-white" />
        </div>
      ) : (
        /* WIDENED LAYOUT: Now max-w-7xl and 3 columns on XL screens */
        <div className="w-full max-w-7xl flex flex-col xl:flex-row gap-6 justify-center">
          
          {/* Column 1: Main Weather Panel */}
          <div className="flex-grow max-w-3xl bg-white/3 backdrop-blur-xl border border-white/20 rounded-[2rem] p-8 shadow-2xl flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <div>
                <div className="flex items-center space-x-2">
                  <MapPin className="w-5 h-5" />
                  <h2 className="text-2xl font-semibold">{weather.name}</h2>
                </div>
                <p className="text-gray-300 ml-7 text-sm">{weather.sys.country}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-300">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}</p>
              </div>
            </div>

            <div className="flex justify-between items-center my-8">
              <div>
                <h1 className="text-8xl font-light tracking-tighter">
                  {Math.round(weather.main.temp)}<span className="text-6xl text-gray-300 relative -top-6">°C</span>
                </h1>
                <p className="text-xl font-medium mt-2 capitalize">{weather.weather[0].description}</p>
                <div className="flex space-x-4 text-sm mt-1 text-gray-300">
                  <span>H: {Math.round(weather.main.temp_max)}°</span>
                  <span>L: {Math.round(weather.main.temp_min)}°</span>
                </div>
              </div>
              {getWeatherIcon(weather.weather[0].main, "w-40 h-40 text-white drop-shadow-lg")}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <MetricCard icon={<Eye className="w-4 h-4" />} title="Visibility" value={`${(weather.visibility / 1000).toFixed(1)} km`} />
              <MetricCard icon={<Wind className="w-4 h-4" />} title="Wind Speed" value={`${weather.wind.speed} m/s`} />
              <MetricCard icon={<Droplets className="w-4 h-4" />} title="Humidity" value={`${weather.main.humidity}%`} />
              <MetricCard icon={<Gauge className="w-4 h-4" />} title="Pressure" value={`${weather.main.pressure} hPa`} />
              <MetricCard icon={<Thermometer className="w-4 h-4" />} title="Feels Like" value={`${Math.round(weather.main.feels_like)}°C`} />
            </div>
          </div>

          {/* Column 2: 5-Day Forecast */}
          <div className="w-full xl:w-80 bg-white/5 backdrop-blur-xl border border-white/20 rounded-[2rem] p-6 shadow-2xl flex flex-col shrink-0">
            <div className="flex items-center space-x-2 mb-6 text-lg font-semibold border-b border-white/20 pb-4">
              <Calendar className="w-5 h-5" />
              <span>5-Day Forecast</span>
            </div>

            <div className="flex flex-col space-y-4 flex-grow justify-center">
              {forecast.map((day, index) => {
                const dateObj = new Date(day.dt * 1000);
                return (
                  <div key={index} className="flex items-center justify-between bg-white/5 rounded-2xl p-4 border border-white/10 hover:bg-white/10 transition-colors">
                    <div className="flex items-center space-x-4">
                      {getWeatherIcon(day.weather[0].main, "w-6 h-6 text-white")}
                      <div>
                        <p className="font-semibold">{dateObj.toLocaleDateString('en-US', { weekday: 'short' })}</p>
                        <p className="text-[10px] text-gray-300 capitalize">{day.weather[0].description}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">{Math.round(day.main.temp_max)}°</p>
                      <p className="text-xs text-gray-300">{Math.round(day.main.temp_min)}°</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Column 3: NEW Sun & Moon Card */}
          <div className="w-full xl:w-80 flex flex-col gap-6 shrink-0">
            
            {/* Sun Arc Card */}
            <div className="bg-white/5 backdrop-blur-xl border border-white/20 rounded-[2rem] p-6 shadow-2xl flex flex-col flex-grow">
              <div className="flex items-center space-x-2 mb-6 text-lg font-semibold border-b border-white/20 pb-4">
                <Sun className="w-5 h-5 text-yellow-400" />
                <span>Sun Tracker</span>
              </div>
              
              <div className="relative w-full aspect-[2/1] mt-4 mb-2">
                <svg viewBox="0 0 100 55" className="w-full h-full overflow-visible drop-shadow-md">
                  {/* Dashed background arc */}
                  <path d="M 10 50 A 40 40 0 0 1 90 50" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="2" strokeDasharray="4 4" />
                  
                  {/* Solid colored arc showing progress */}
                  <path 
                    d="M 10 50 A 40 40 0 0 1 90 50" 
                    fill="none" 
                    stroke="url(#sunGradient)" 
                    strokeWidth="3"
                    strokeDasharray="251.2" // Circumference of semi-circle
                    strokeDashoffset={251.2 - (251.2 * (Math.max(0, Math.min(1, (Math.floor(Date.now() / 1000) - weather.sys.sunrise) / (weather.sys.sunset - weather.sys.sunrise)))))} 
                  />
                  
                  {/* The dynamically placed Sun Icon */}
                  <g transform={`translate(${getSunPosition(weather.sys.sunrise, weather.sys.sunset).x}, ${getSunPosition(weather.sys.sunrise, weather.sys.sunset).y})`}>
                    <circle cx="0" cy="0" r="4" fill="#fbbf24" className="drop-shadow-lg" />
                    <circle cx="0" cy="0" r="8" fill="#fbbf24" opacity="0.3" className="animate-pulse" />
                  </g>

                  {/* Gradients */}
                  <defs>
                    <linearGradient id="sunGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#fbbf24" />
                      <stop offset="50%" stopColor="#f97316" />
                      <stop offset="100%" stopColor="#4f46e5" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>

              {/* Sunrise & Sunset Text Times */}
              <div className="flex justify-between text-sm mt-auto border-t border-white/10 pt-4">
                <div className="text-center">
                  <p className="text-gray-300 text-xs mb-1">Sunrise</p>
                  <p className="font-semibold">{formatTime(weather.sys.sunrise)}</p>
                </div>
                <div className="text-center">
                  <p className="text-gray-300 text-xs mb-1">Sunset</p>
                  <p className="font-semibold">{formatTime(weather.sys.sunset)}</p>
                </div>
              </div>
            </div>

            {/* Moon Phase Card Placeholder */}
            <div className="bg-gradient-to-br from-indigo-900/40 to-purple-900/20 backdrop-blur-xl border border-white/20 rounded-[2rem] p-6 shadow-2xl flex items-center justify-between">
              <div>
                <p className="text-xs text-indigo-200 uppercase tracking-wider mb-1">Moon Phase</p>
                <p className="text-lg font-semibold text-white">Waxing Crescent</p>
                <p className="text-xs text-gray-300 mt-1">Illumination: 24%</p>
              </div>
              <Moon className="w-12 h-12 text-indigo-200 drop-shadow-xl" />
            </div>

          </div>

        </div>
      )}
    </div>
  );
};

export default WeatherDashboard;
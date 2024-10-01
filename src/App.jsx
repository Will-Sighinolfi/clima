import { useState, useEffect } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass, faCloud, faSun, faCloudRain, faSnowflake, faTemperatureLow, faTemperatureHigh, faWind, faTemperatureFull } from '@fortawesome/free-solid-svg-icons';
import Background from './assets/Background.svg';
import Temperature from './assets/Temperature_Now.svg';
import './App.css';

function App() {
  const [cityName, setCityName] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  const apiKey = import.meta.env.VITE_KEY;

  const fetchWeatherData = async (city) => {
    try {
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}&lang=pt_br`
      );
      setWeatherData(response.data);
      setErrorMessage(null);
      console.log('Dados da API:', response.data);
    } catch (error) {
      setErrorMessage('Erro ao buscar dados. Verifique o nome da cidade.');
      console.log('Erro na requisição:', error);
    }
  };

  const handleInputChange = (event) => {
    setCityName(event.target.value);
  };

  const handleButtonClick = () => {
    if (cityName) {
      fetchWeatherData(cityName);
    } else {
      setErrorMessage('Por favor, digite o nome da cidade.');
    }
  };

  const capitalizeFirstLetters = (description) => {
    return description
      .toLowerCase()
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };

  const getWeatherIcon = (description) => {
    const desc = description.toLowerCase();
    if (desc.includes("nublado")) return faCloud;
    if (desc.includes("sol")) return faSun;
    if (desc.includes("chuva")) return faCloudRain;
    if (desc.includes("neve")) return faSnowflake;
    return faCloud;
  };

  useEffect(() => {
    const randomCities = ['São Paulo', 'Rio de Janeiro', 'Belo Horizonte', 'Salvador', 'Fortaleza'];
    const randomCity = randomCities[Math.floor(Math.random() * randomCities.length)];
    fetchWeatherData(randomCity);
  }, []);

  return (
    <>
      <div>
        <img src={Background} className="background-img" alt="Background" />
      </div>

      <div id='localize'>
        <input type="text" placeholder='Digite o nome da cidade' id='input' value={cityName} onChange={handleInputChange} />
        <button id='button' onClick={handleButtonClick}>
          <FontAwesomeIcon icon={faMagnifyingGlass} />
        </button>
      </div>

      <section className="main-content">
        <div className="content-wrapper">
          <div className="temperature-container">
            <img src={Temperature} className="temperature" alt="Temperature" />
            <div className="overlay-content">
              <p id='name-city'>
                <i className='fa-solid fa-location-dot'></i>
                <span>{weatherData ? weatherData.name : 'Nome da cidade'}</span>
              </p>
              <p className='main-temp' id='temp'>
                <span>{weatherData ? parseInt(weatherData.main.temp) : 'N/A'}</span>&deg;C
              </p>
              <div id="temp-min-max">
                <FontAwesomeIcon icon={faTemperatureLow} /> <p id="temp-min">{weatherData && weatherData.main ? `${parseInt(weatherData.main.temp_min)}°C` : 'N/A'}</p>
                <p id="temp-max">{weatherData && weatherData.main ? `${parseInt(weatherData.main.temp_max)}°C` : 'N/A'}</p> <FontAwesomeIcon icon={faTemperatureHigh} />
              </div>

              <p className='main-temp' id='temp-description'>
                {weatherData && (
                  <>
                    <FontAwesomeIcon icon={getWeatherIcon(weatherData.weather[0].description)} />{' '}
                    <span>{capitalizeFirstLetters(weatherData.weather[0].description)}</span>
                  </>
                )}
              </p>
            </div>
          </div>

          <div className="right-content">
            <div className="climate-info">
              <div className="climate-item">
                <div className='qualit-itens'>
                  <FontAwesomeIcon icon={faCloud} size="2x" />
                  <p>Qualidade do ar</p>
                  <p>{weatherData ? 'Boa' : 'Desconhecido'}</p>
                </div>
              </div>

              <div className="climate-item">
                <div className='hour-itens'>
                  <FontAwesomeIcon icon={faSun} size="2x" />
                  <p id='hour-sun'>Horário do sol</p>
                  <p>Nascer do sol: {weatherData && weatherData.sys ? new Date(weatherData.sys.sunrise * 1000).toLocaleTimeString() : 'N/A'}</p>
                  <p>Pôr do sol: {weatherData && weatherData.sys ? new Date(weatherData.sys.sunset * 1000).toLocaleTimeString() : 'N/A'}</p>
                </div>
              </div>
            </div>

            <ul className="list-items">
              <li>
                <FontAwesomeIcon icon={faCloudRain} /> Umidade: {weatherData && weatherData.main ? `${weatherData.main.humidity}%` : 'N/A'}
              </li>
              <li>
                <FontAwesomeIcon icon={faCloud} /> Pressão: {weatherData && weatherData.main ? `${weatherData.main.pressure} hPa` : 'N/A'}
              </li>
              <li>
              <FontAwesomeIcon icon={faWind} /> Velocidade do vento: {weatherData && weatherData.wind ? `${weatherData.wind.speed} m/s` : 'N/A'}
              </li>
              <li>
              <FontAwesomeIcon icon={faTemperatureFull} /> Sensação térmica: {weatherData && weatherData.main ? `${parseInt(weatherData.main.feels_like)}°C` : 'N/A'}
              </li>
            </ul>
          </div>
        </div>
      </section>
    </>
  );
}

export default App;

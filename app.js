const API_KEY = "9fd329d066df56bcdaf2c4d8f59871c9";

const searchForm = document.getElementById('search-form');
const cityInput = document.getElementById('city-input');
const weatherInfo = document.getElementById('weather-info');
const errorMessage = document.getElementById('error-message');

const cityNameEl = document.getElementById('city-name');
const weatherConditionEl = document.getElementById('weather-condition');
const tempEl = document.getElementById('temp');
const humidityEl = document.getElementById('humidity');
const windSpeedEl = document.getElementById('wind-speed');

function showError(message) {
  errorMessage.textContent = message;
  errorMessage.classList.remove('hidden');
}

const getWeatherData = async (city) => {
  try {
    weatherInfo.classList.add('hidden');
    errorMessage.classList.add('hidden');

    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
    );

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error(`"${city}" not found. Please check spelling.`);
      } else {
        throw new Error('Unable to fetch weather. Try again.');
      }
    }

    const data = await response.json();

    cityNameEl.textContent = `📍 ${data.name}`;
    weatherConditionEl.textContent = `☁️ ${data.weather[0].description}`;
    tempEl.textContent = Math.round(data.main.temp);
    humidityEl.textContent = `${data.main.humidity}%`;
    windSpeedEl.textContent = `${data.wind.speed} km/h`;

    weatherInfo.classList.remove('hidden');
    localStorage.setItem('lastSearchedCity', city);

  } catch (error) {
    showError(error.message);
    weatherInfo.classList.add('hidden');
  }
};

searchForm.addEventListener('submit', (event) => {
  event.preventDefault();
  const cityName = cityInput.value.trim();
  if (cityName) {
    getWeatherData(cityName);
  }
});

window.addEventListener('DOMContentLoaded', () => {
  const savedCity = localStorage.getItem('lastSearchedCity');
  if (savedCity) {
    cityInput.value = savedCity;
    getWeatherData(savedCity);
  } else {
    cityInput.value = 'Islamabad';
    getWeatherData('Islamabad');
  }
});

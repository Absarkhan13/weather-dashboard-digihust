// /API
const API_KEY = "9fd329d066df56bcdaf2c4d8f59871c9";
// html elements
const searchForm = document.getElementById('search-form');
const cityInput = document.getElementById('city-input');
const weatherInfo = document.getElementById('weather-info');
const errorMessage = document.getElementById('error-message');
// weather elements
const cityNameEl = document.getElementById('city-name');
const weatherConditionEl = document.getElementById('weather-condition');
const tempEl = document.getElementById('temp');
const humidityEl = document.getElementById('humidity');
const windSpeedEl = document.getElementById('wind-speed');

const getWeatherData = async (city) => {
    try {
        weatherInfo.classList.add('hidden');
        errorMessage.classList.add('hidden');
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);
        if (!response.ok) {
            throw new Error("City not found. Please check the spelling.");
        }
       const data = await response.json();

       cityNameEl.textContent = data.name;
        weatherConditionEl.textContent = data.weather[0].description;
        tempEl.textContent = Math.round(data.main.temp); // Point wali value round off karna
        humidityEl.textContent = `${data.main.humidity}%`;
        windSpeedEl.textContent = `${data.wind.speed} km/h`;

        weatherInfo.classList.remove('hidden');
        localStorage.setItem('lastSearchedCity', city);

    } catch (error) {
        errorMessage.textContent = error.message;
        errorMessage.classList.remove('hidden');
    }
};
//  Search button press hone par ye function chalega
searchForm.addEventListener('submit', (event) => {
    event.preventDefault(); // Page ko refresh hone se rokna
    const cityName = cityInput.value.trim();
    if (cityName) {
        getWeatherData(cityName);
    }
});
window.addEventListener('DOMContentLoaded', () => {
    const savedCity = localStorage.getItem('lastSearchedCity');
    if (savedCity) {
        cityInput.value = savedCity; // Input mein purani city ka name
        getWeatherData(savedCity);   // Uska data dobara ajyy ga 
    }
});
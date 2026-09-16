// API key lagadi idhar OpenWeatherMap ki
const API_KEY = "9fd329d066df56bcdaf2c4d8f59871c9";

// HTML ke elements ko get kar liya variables mein

const searchForm = document.getElementById('search-form');
const cityInput = document.getElementById('city-input');
const weatherInfo = document.getElementById('weather-info');
const errorMessage = document.getElementById('error-message');

// Weather data show karne wale elements
const cityNameEl = document.getElementById('city-name');
const weatherConditionEl = document.getElementById('weather-condition');
const tempEl = document.getElementById('temp');
const humidityEl = document.getElementById('humidity');
const windSpeedEl = document.getElementById('wind-speed');


// Error dikhane ka helper function

function showError(message) {
    errorMessage.textContent = message;
    errorMessage.classList.remove('hidden');
}


// Weather data fetch karne ka main function
const getWeatherData = async (city) => {
    try {
        // Naya search start ho toh pehle purana data aur error chupa do
        weatherInfo.classList.add('hidden');
        errorMessage.classList.add('hidden');

        // API se data mangwaya
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
        );

        // Agar city sahi nahi mili toh error throw karo
        if (!response.ok) {
            if (response.status === 404) {
                throw new Error(`"${city}" not found. Please check spelling.`);
            } else {
                throw new Error('Unable to fetch weather. Try again.');
            }
        }

        // Data ko JSON mein convert kiya
        const data = await response.json();

        // HTML ko update kiya naye data se
        cityNameEl.textContent = data.name;
        weatherConditionEl.textContent = data.weather[0].description;
        tempEl.textContent = Math.round(data.main.temp); // Point wali value ko round off kar diya
        humidityEl.textContent = `${data.main.humidity}%`;
        windSpeedEl.textContent = `${data.wind.speed} km/h`;

        // Sab data set hone ke baad weather info wala box show kar diya
        weatherInfo.classList.remove('hidden');

        // City ko local storage mein save kar liya taake refresh pe gayab na ho
        localStorage.setItem('lastSearchedCity', city);

    } catch (error) {
        // Agar koi error aye toh show karwa diya
        showError(error.message);
        weatherInfo.classList.add('hidden');
    }
};


searchForm.addEventListener('submit', (event) => {
    event.preventDefault(); // Page refresh hone se rokk diya
    const cityName = cityInput.value.trim(); // Spaces khatam kiye input se
    if (cityName) {
        getWeatherData(cityName); // Data fetch karna shuru
    }
});

/
window.addEventListener('DOMContentLoaded', () => {
    // Local storage se check kiya ke pehle koi city search ki thi ya nahi
    const savedCity = localStorage.getItem('lastSearchedCity');
    if (savedCity) {
        cityInput.value = savedCity; // Input mein purani city ka naam daal diya
        getWeatherData(savedCity);   // Aur uska data bhi fetch kar liya
    } else {
        // Agar pehli baar user aaya hai toh default city load kar di
        cityInput.value = 'Islamabad';
        getWeatherData('Islamabad');
    }
});


// GIF Background Creation Using HTML/CSS/JS
function createGifBackground() {
    // Create img element
    const gifImg = document.createElement('img');
    gifImg.id = 'gifBg';
    gifImg.alt = 'Animated Background';
    gifImg.src = 'videoplayback.gif'; // Local path - replace with online URL for testing, e.g., 'https://media.giphy.com/media/3o7btPCcdNniyf0ArS/giphy.gif'
    gifImg.loading = 'eager'; // Load immediately

    // Event Listeners
    gifImg.addEventListener('load', function() {
        console.log('GIF background loaded successfully via JS!');
        // Append to body as first child (background layer)
        document.body.insertBefore(gifImg, document.body.firstChild);
    });

    gifImg.addEventListener('error', function(e) {
        console.error('GIF loading error via JS:', e);
        // Hide img (don't append) and rely on CSS body fallback
        console.log('Switched to CSS animated gradient fallback.');
        // Optional: Add a notification
        // const notice = document.createElement('div');
        // notice.textContent = 'GIF background unavailable - using animated sky.';
        // notice.style.cssText = 'position:fixed;top:10px;right:10px;background:rgba(0,0,0,0.5);color:white;padding:10px;border-radius:5px;z-index:999;';
        // document.body.appendChild(notice);
    });

    // Append only on successful load (handled in 'load' event)
}

// Initialize GIF on Page Load
window.addEventListener('load', function() {
    createGifBackground();
    // Optional: Scroll to about us? Uncomment if needed
    // document.getElementById('aboutUs').scrollIntoView({ behavior: 'smooth' });
});

// Existing Functions (Unchanged - Weather, Map, etc.)
const cityInput = document.getElementById('cityInput');
const dateInput = document.getElementById('dateInput');
const cityName = document.getElementById('cityName');
const weatherInfo = document.getElementById('weatherInfo');
const forecast = document.getElementById('forecast');
const mapContainer = document.getElementById('mapContainer');
const mapIframe = document.getElementById('mapIframe');
const mapBtn = document.getElementById('mapBtn');

// View Button: Forward to details.html
function getWeather() {
    const city = cityInput.value.trim();
    const date = dateInput.value;
    if (!city) {
        alert('Please enter a city name!');
        return;
    }
    window.location.href = `details.html?city=${encodeURIComponent(city)}&date=${encodeURIComponent(date)}`;
}

// Use Location
function getLocationWeather() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(position => {
            const lat = position.coords.latitude;
            const lon = position.coords.longitude;
            fetchWeatherByCoords(lat, lon);
        }, error => {
            alert('Error getting location: ' + error.message);
        });
    } else {
        alert('Geolocation not supported.');
    }
}

// Toggle Map
function toggleMap() {
    const city = cityInput.value.trim();
    if (!city) {
        alert('Please enter a city name for the map!');
        return;
    }
    if (mapContainer.style.display === 'none' || mapContainer.style.display === '') {
        const mapUrl = `https://www.google.com/maps/embed/v1/place?q=${encodeURIComponent(city)}&key=YOUR_GOOGLE_MAPS_KEY`;
        mapIframe.src = mapUrl;
        mapContainer.style.display = 'block';
        mapBtn.textContent = '🗺️ Hide Map';
    } else {
        mapContainer.style.display = 'none';
        mapIframe.src = '';
        mapBtn.textContent = '🗺️ Map';
    }
}

// Fetch Weather by Coords (Placeholder)
function fetchWeatherByCoords(lat, lon) {
    const apiKey = 'YOUR_API_KEY';
    const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
    fetch(url)
        .then(response => response.json())
        .then(data => {
            cityName.textContent = data.name;
            weatherInfo.innerHTML = `<p>Temperature: ${data.main.temp}°C</p><p>Weather: ${data.weather[0].description}</p>`;
            forecast.innerHTML = '<p>Forecast: Sunny with clouds (placeholder).</p>';
        })
        .catch(error => {
            console.error('Weather fetch error:', error);
            weatherInfo.innerHTML = '<p>Error fetching weather. Check console.</p>';
        });
}


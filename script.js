const apiKey = "ced3d80b106f4f84f7c7f34ff711fc91";
const weatherUrl = "https://api.openweathermap.org/data/2.5/weather?";
const forecastUrl = "https://api.openweathermap.org/data/2.5/forecast?";

const searchBtn = document.getElementById("search-btn");
const cityInput = document.getElementById("city-input");
const container = document.querySelector(".container");
const body = document.body;

const iconMap = {
  Clouds: "clouds.png",
  Rain: "rain.png",
  Clear: "sun.png", 
  Snow: "snow.png",
  Drizzle: "drizzle.png",
  Thunderstorm: "storm.png",
  Mist: "mist.png",
  Haze: "haze.png",
};

const backgroundMap = {
  Clouds: "clouds",
  Rain: "rain",
  Clear: "clear",
  Snow: "snow",
  Drizzle: "drizzle",
  Thunderstorm: "thunderstorm",
  Mist: "mist",
  Haze: "haze",
};

window.addEventListener("load", () => {
  navigator.geolocation.getCurrentPosition(
    (position) => {
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;
      fetchWeatherByCoords(lat, lon);
    },
    () => {
      fetchWeather("Multan");
    }
  );
});

searchBtn.addEventListener("click", () => {
  const city = cityInput.value.trim();
  if (city !== "") {
    fetchWeather(city);
    cityInput.value = "";
  }
});

function showLoading() {
  removeError();
  const loading = document.createElement("div");
  loading.className = "loading";
  loading.innerHTML = '<div class="spinner"></div>';
  container.prepend(loading);
}

function hideLoading() {
  const loading = document.querySelector(".loading");
  if (loading) loading.remove();
}

function showError(message) {
  removeError();
  const error = document.createElement("div");
  error.className = "error";
  error.innerText = message;
  container.prepend(error);
}

function removeError() {
  const error = document.querySelector(".error");
  if (error) error.remove();
}

function setBackground(weatherMain) {
  body.className = backgroundMap[weatherMain] || "";
}

async function fetchWeather(city) {
  showLoading();
  try {
    const res = await fetch(`${weatherUrl}q=${city}&appid=${apiKey}&units=metric`);
    if (!res.ok) throw new Error("City not found");
    const data = await res.json();
    updateWeatherUI(data);

    const forecastRes = await fetch(`${forecastUrl}q=${city}&appid=${apiKey}&units=metric`);
    if (!forecastRes.ok) throw new Error("Forecast not available");
    const forecastData = await forecastRes.json();
    updateForecast(forecastData);
  } catch (err) {
    showError(err.message);
    document.getElementById("city-name").innerText = "";
    document.getElementById("temperature").innerText = "";
    document.getElementById("humidity").innerText = "";
    document.getElementById("wind").innerText = "";
    document.getElementById("weather-icon").style.display = "none"; 
    document.getElementById("forecast").innerHTML = "";
    setBackground("");
  } finally {
    hideLoading();
  }
}

async function fetchWeatherByCoords(lat, lon) {
  showLoading();
  try {
    const res = await fetch(`${weatherUrl}lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`);
    if (!res.ok) throw new Error("Location not found");
    const data = await res.json();
    updateWeatherUI(data);

    const forecastRes = await fetch(`${forecastUrl}lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`);
    if (!forecastRes.ok) throw new Error("Forecast not available");
    const forecastData = await forecastRes.json();
    updateForecast(forecastData);
  } catch (err) {
    showError(err.message);
    document.getElementById("city-name").innerText = "";
    document.getElementById("temperature").innerText = "";
    document.getElementById("humidity").innerText = "";
    document.getElementById("wind").innerText = "";
    document.getElementById("weather-icon").style.display = "none"; 
    document.getElementById("forecast").innerHTML = "";
    setBackground("");
  } finally {
    hideLoading();
  }
}

function updateWeatherUI(data) {
  document.getElementById("city-name").innerText = data.name;
  document.getElementById("temperature").innerText = `${Math.round(data.main.temp)}°C`;
  document.getElementById("humidity").innerText = `${data.main.humidity}%`;
  document.getElementById("wind").innerText = `${data.wind.speed} km/h`;
  document.getElementById("weather-icon").style.display = "none"; 
  setBackground(data.weather[0].main);
  removeError();
}

function updateForecast(data) {
  const forecastContainer = document.getElementById("forecast");
  forecastContainer.innerHTML = "";
  const dailyMap = new Map();

  data.list.forEach((item) => {
    const date = new Date(item.dt_txt);
    const day = date.toLocaleDateString("en-US", { weekday: "short" });
    if (!dailyMap.has(day) && dailyMap.size < 7) {
      dailyMap.set(day, {
        temp: Math.round(item.main.temp),
        icon: item.weather[0].main,
      });
    }
  });

  const forecastArray = Array.from(dailyMap.entries());
  const middleIndex = Math.floor(forecastArray.length / 2); 
  forecastContainer.appendChild(createForecastCard(forecastArray[middleIndex]));
  forecastArray.forEach(([day, value], index) => {
    if (index !== middleIndex) {
      forecastContainer.appendChild(createForecastCard([day, value]));
    }
  });
}

function createForecastCard([day, value]) {
  const icon = iconMap[value.icon] || "sun.png";
  const card = document.createElement("div");
  card.className = "forecast-card";
  card.innerHTML = `
    <p>${day}</p>
    <img src="images/${icon}" alt="${value.icon}" />
    <p>${value.temp}°C</p>
  `;
  return card;
}
const cities = [];

let citiesByCountry = {};
let selectedCountry = "Morocco";

const countrySelect = document.getElementById('countrySelect');
const citySelect = document.getElementById('citySelect');


fetch('https://ismailelfakir.github.io/worldcities/worldcities.json')
  .then(response => response.json())
  .then(data => {
    // Store the JSON data in the citiesByCountry object
    citiesByCountry = data; 
     
    populateCountrySelect();
    populateCitySelect(); 
  })
  .catch(error => console.error('Error loading JSON:', error));

  countrySelect.addEventListener('change', () => {
    selectedCountry = countrySelect.value;
    populateCitySelect();
    fetchWeatherData(citySelect.value);
  });

function populateCountrySelect() {
  // Populate the country dropdown with the keys from citiesByCountry
  Object.keys(citiesByCountry).forEach(country => {
    const option = document.createElement('option');
    option.value = country;
    option.textContent = country;
    countrySelect.appendChild(option);
  });
}

function populateCitySelect() {
  citySelect.innerHTML = ''; 

  // Populate the city dropdown with cities from the selected country
  if (selectedCountry && citiesByCountry[selectedCountry]) {
    citiesByCountry[selectedCountry].forEach(city => {
      const option = document.createElement('option');
      option.value = city.name;
      option.textContent = city.name;
      citySelect.appendChild(option);
    });
  }
fetchWeatherData(citySelect.value);
}

citySelect.addEventListener('change', () => {
  const selectedCity = citySelect.value;
  fetchWeatherData(selectedCity);
});

async function fetchWeatherData(cityName) {

  const citiesInSelectedCountry = citiesByCountry[selectedCountry];

  if (!citiesInSelectedCountry || citiesInSelectedCountry.length === 0) {
    console.error('No cities data available for the selected country');
    return;
  }

  const selectedCity = citiesInSelectedCountry.find(city => city.name === cityName);

  if (!selectedCity) {
    console.error('Invalid city name');
    return;
  }

  try {
    const response = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${selectedCity.lat}&longitude=${selectedCity.lng}&current_weather=true&forecast_days=1&hourly=temperature_2m`);
    const data = await response.json();

    const currentTemperature = data.current_weather.temperature;
    document.getElementById('currentTemperature').textContent = `${currentTemperature}°C`;

    const hourlyTimes = data.hourly.time;
    const hourlyTemperatures = data.hourly.temperature_2m;
    const hourlyTemperaturesList = document.getElementById('hourlyTemperatures');
    hourlyTemperaturesList.innerHTML = '';

    hourlyTimes.forEach((time, index) => {
      const hour = new Date(time).getHours();
      const listItem = document.createElement('li');
      listItem.textContent = `${hour}:00 - ${hourlyTemperatures[index]}°C`;
      hourlyTemperaturesList.appendChild(listItem);

      if (hour === new Date().getHours()) {
        listItem.classList.add('currentHour'); // Add a class to the list item
      }
      // if(hour<=20 && hour>6 ){
      //   document.body.classList.add("day");
      // }
      
    });
  } catch (error) 
  {
    console.error('Error:', error);
  }
}


// Initial population of country and city selects
populateCountrySelect();
populateCitySelect();
fetchWeatherData(citySelect.value);
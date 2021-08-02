const form = document.getElementById('form');
const searchInput = document.getElementById('search');
const main = document.getElementById('main');

const locationUrl = location => `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${apikey}&units=imperial`;
const zipcodeUrl = zipcode => `https://api.openweathermap.org/data/2.5/weather?zip=${zipcode}&appid=${apikey}&units=imperial`;
const zipcodeForecast = zipcode => `https://api.openweathermap.org/data/2.5/forecast?zip=${zipcode},us&appid=${apikey}&units=imperial`

form.addEventListener('submit', e => {
	let alphabetRegex = /[a-z]/gi;
	let digitRegex = /[0-9]/gi;

	e.preventDefault();

	const input = searchInput.value;

	// check for mixed letters and numbers
	if (alphabetRegex.test(input) && digitRegex.test(input)) {
		console.log('Invalid input value');
	} else if (alphabetRegex.test(input)) { // check for letters only
		//console.log(input);
		if (input) {
			getWeatherByLocation(input);
		}
	} else { // numbers only
		//console.log(input);
		if (input) {
			getWeatherByZipCode(input);
		}
	}
});

async function getWeatherByLocation(location) {
	console.log('getWeatherByLocation called', location);
	const res = await fetch(locationUrl(location), {
		origin: 'cors',
	});

	const resData = await res.json();
	//console.log(resData);

	addWeatherToPage(resData);
}

async function getWeatherByZipCode(zipcode) {
	//console.log('getWeatherByZipCode called', zipcode);
	// const res = await fetch(zipcodeUrl(zipcode), {
	// 	origin: 'cors',
	// });

	// const resData = await res.json();
	// console.log(resData);

	const forecastRes = await fetch(zipcodeForecast(zipcode), {
		origin: 'cors'
	})

	const forecastResData = await forecastRes.json()
	console.log(forecastResData);

	addWeatherToPage(forecastResData);
}

let now = new Date();

function addWeatherToPage(data) {
	// const temp = data.main.temp;
	// const lowTemp = data.main.temp_min;
	// const hiTemp = data.main.temp_max

	// create a div with a class of .weather
	const weather = document.createElement('div');
	weather.classList.add('weather');

	// search by city 
	// weather.innerHTML = `
	// 	<h1>Current weather for ${data.sys.country}, ${data.name}</h1>
	// 	<p>${dateBuilder(now)}</p>
	// 	<h2>
  //     <img src="http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png" />${Math.round(temp)}°F
  //     <small>${data.weather[0].main}</small>
  //   </h2>
	// 	<h3>low ${Math.round(lowTemp)}°F - high ${Math.round(hiTemp)}°F</h3>	
	// `;



	weather.innerHTML = `
	<h1>Current weather for ${data.city.name}, ${data.city.country}</h1>
	<p>${dateBuilder(now)}</p>
	<h2>
		<img src="https://openweathermap.org/img/wn/${data.list[0].weather[0].icon}@2x.png" alt="weather" />
		${Math.round(data.list[0].main.temp)}&#176
		<small>${data.list[0].weather[0].main}</small>
	</h2>
	<h3>low ${Math.round(data.list[0].main.temp_min)}&#176;F - high ${Math.round(data.list[0].main.temp_max)}&#176;F</h3>	
`;

	// cleanup
	main.innerHTML = '';

	main.appendChild(weather);
}

function dateBuilder (d) {
  let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  let days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  let day = days[d.getDay()];
  let date = d.getDate();
  let month = months[d.getMonth()];
  let year = d.getFullYear();

	//console.log(`${day} ${month} ${date}, ${year}`);
  return `${day} ${month} ${date}, ${year}`;
}


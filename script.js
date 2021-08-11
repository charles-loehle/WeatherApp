const form = document.getElementById('form');
const formControl = document.querySelector('.form-control');
const small = document.querySelector('small');
const searchInput = document.getElementById('search');
const main = document.getElementById('main');
const currentWeather = document.getElementById('current-weather');
const forecastWeather = document.getElementById('forecast-weather');
const alphabetRegex = /[a-z]/gi;
const digitRegex = /[0-9]/gi;

form.addEventListener('submit', e => {
	const input = searchInput.value;

	e.preventDefault();

	// input validation
	if (alphabetRegex.test(input) && digitRegex.test(input)) {
		console.log('Invalid input value');
		setError();
	} else {
		removeError();
		useCurrentWeatherApi(input);
	}
});

function setError() {
	formControl.className = 'form-control error';
}

function removeError() {
	formControl.className = 'form-control';
}

// check for city or zip code and use appropriate api query
function useCurrentWeatherApi(input) {
	if (alphabetRegex.test(input)) {
		// get weather by city name
		fetch(
			`https://api.openweathermap.org/data/2.5/weather?q=${input},us&appid=${apikey}&units=imperial`
		)
			.then(res => res.json())
			.then(data => {
				// console.log(data);
				showCurrentWeather(data);
				useOneCallApi(data);
			});
	} else {
		// get weather by zip code
		fetch(
			`https://api.openweathermap.org/data/2.5/weather?zip=${input},us&appid=${apikey}&units=imperial`
		)
			.then(res => res.json())
			.then(data => {
				showCurrentWeather(data);
				useOneCallApi(data);
			});
	}
}

// get daily forecast using longitude and latitude from current forecast data
function useOneCallApi(data) {
	const { lon, lat } = data.coord;
	// console.log(data);
	fetch(
		`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=current,minutely,hourly,alerts&appid=${apikey}&units=imperial`
	)
		.then(res => res.json())
		.then(data => {
			showForecast([data]);
		});
}

function showCurrentWeather(data) {
	const { name } = data;
	const { country } = data.sys;
	const { description, icon } = data.weather[0];
	// capitalize first character of weather description
	const capDescription =
		description[0].toUpperCase() + description.substring(1);
	const { temp } = data.main;
	const { speed } = data.wind;

	// console.log(data);

	let now = new Date();

	currentWeather.innerHTML = `
	<p class="current-weather__date">${dateBuilder(now)}</p>
	<h2 class="current-weather__location">${name}, ${country}</h2>
	<div class="current-weather__details">
		<img class="weather-icon" src="https://openweathermap.org/img/wn/${icon}@2x.png" alt="weather" />
		<p class="temp">${Math.round(temp)}&#176</p>
		<p class="description">${capDescription}</p>
		<p class="wind">Wind: ${speed}mph</p>
	</div>`;
}

// reference: https://javascript.plainenglish.io/display-7-day-weather-forecast-with-openweather-api-aac8ba21c9e3
function showForecast(data) {
	let forecastDay = '';
	const dailyData = data[0].daily;
	// console.log(dailyData);
	const { pop } = dailyData[0];
	// console.log(pop);

	// add preciptiation to current-weather since it is not in the current weather api data
	const p = document.createElement('p');
	p.className = 'precipitation';
	p.innerText = `Preciptation: ${pop}%`;
	currentWeather.querySelector('.current-weather__details').appendChild(p);

	return dailyData.map((day, index) => {
		// if (index > 0) {
		let dayname = new Date(day.dt * 1000).toLocaleDateString('en', {
			weekday: 'long',
		});
		const { description, icon } = day.weather[0];
		const { min, max } = day.temp;

		// console.log(dayname);

		forecastDay = `
				<div className="forecastday">
					<p class="day">${dayname}</p>
					<img src="https://openweathermap.org/img/wn/${icon}.png" alt="weather" />
					<div className="forecastday__temp">${min} / ${max}&#176;F</div>
					<span>${description}</span>
				</div>
			`;

		forecastWeather.insertAdjacentHTML('beforeend', forecastDay);
		// }
	});
}

function dateBuilder(d) {
	let months = [
		'January',
		'February',
		'March',
		'April',
		'May',
		'June',
		'July',
		'August',
		'September',
		'October',
		'November',
		'December',
	];
	let days = [
		'Sunday',
		'Monday',
		'Tuesday',
		'Wednesday',
		'Thursday',
		'Friday',
		'Saturday',
	];

	let day = days[d.getDay()];
	let date = d.getDate();
	let month = months[d.getMonth()];
	let year = d.getFullYear();

	//console.log(`${day} ${month} ${date}, ${year}`);
	return `${day} ${month} ${date}, ${year}`;
}

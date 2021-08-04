const form = document.getElementById('form');
const searchInput = document.getElementById('search');
const main = document.getElementById('main');
const currentWeather = document.getElementById('current-weather');
const forecastWeather = document.getElementById('forecast-weather');

form.addEventListener('submit', e => {
	const alphabetRegex = /[a-z]/gi;
	const digitRegex = /[0-9]/gi;
	const input = searchInput.value;

	e.preventDefault();

	// input validation
	if (alphabetRegex.test(input) && digitRegex.test(input)) {
		console.log('Invalid input value');
	} else if (alphabetRegex.test(input)) {
		// check for letters only
		//console.log(input);
		if (input) {
			console.log('searched by location');
		}
	} else {
		// numbers only
		//console.log(input);
		if (input) {
			useCurrentWeatherApi(input);
		}
	}
});

async function useCurrentWeatherApi(zipcode) {
	await fetch(
		`https://api.openweathermap.org/data/2.5/weather?zip=${zipcode},us&appid=${apikey}&units=imperial&cnt=3`
	)
		.then(res => res.json())
		.then(data => {
			showCurrentWeather(data)
			useOneCallApi(data)
		});
}

function useOneCallApi(data){
	const {lon, lat} = data.coord
	console.log(data);
	fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=current,minutely,hourly,alerts&appid=${apikey}`).then(res => res.json()).then(data => {
		showForecast([data])
	})
}

function showCurrentWeather(data) {
	const {name} = data;
	const {country} = data.sys;
	const {description, icon} = data.weather[0]
	const {temp, temp_min, temp_max} = data.main

	console.log(data);

	let now = new Date();

	currentWeather.innerHTML = `
	<h1>Current weather for ${name}, ${country}</h1>
	<p>${dateBuilder(now)}</p>
	<h2>
		<img src="https://openweathermap.org/img/wn/${icon}@2x.png" alt="weather" />
		${Math.round(temp)}&#176
		<small>${description}</small>
	</h2>
	<h3>low ${Math.round(temp_min)}&#176;F - high ${Math.round(
		temp_max
	)}&#176;F</h3>	
`;

	forecastWeather.innerHTML = `

		`;
}

function showForecast(data) {
	// console.log(data[0].daily);
	data[0].daily.map(day => console.log(day.dt))
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

const form = document.getElementById('form');
const searchInput = document.getElementById('search');
const main = document.getElementById('main');

const locationUrl = location => `https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${apikey}&units=imperial`;
const zipcodeUrl = zipcode => `https://api.openweathermap.org/data/2.5/weather?zip=${zipcode}&appid=${apikey}&units=imperial`;

form.addEventListener('submit', e => {
	let alphabetRegex = /[a-z]/gi;
	let digitRegex = /[0-9]/gi;

	e.preventDefault();

	const input = searchInput.value;

	// check for mixed letters and numbers
	if (alphabetRegex.test(input) && digitRegex.test(input)) {
		console.log('Invalid input value');
	} else if (alphabetRegex.test(input)) { // check for letters only
		console.log(input);
		if (input) {
			getWeatherByLocation(input);
		}
	} else { // numbers only
		console.log(input);
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
	console.log(resData);

	addWeatherToPage(resData);
}

async function getWeatherByZipCode(zipcode) {
	console.log('getWeatherByZipCode called', zipcode);
	const res = await fetch(zipcodeUrl(zipcode), {
		origin: 'cors',
	});

	const resData = await res.json();
	console.log(resData);

	addWeatherToPage(resData);
}

function addWeatherToPage(data) {
	const temp = data.main.temp;

	// create a div with a class of .weather
	const weather = document.createElement('div');
	weather.classList.add('weather');

	// search by city 
	weather.innerHTML = `
		<h1>${data.sys.country}</h1>
		<h1>${data.name}</h1>
		<h2>
      <img src="http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png" />${temp}°F
      <small>${data.weather[0].main}</small>
    </h2>`;

	// cleanup
	main.innerHTML = '';

	main.appendChild(weather);
}



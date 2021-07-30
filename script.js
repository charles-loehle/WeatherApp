const apikey = '6aa788cd5d3325df1ef11850cff774e7';

const form = document.getElementById('form');
const searchInput = document.getElementById('search');
const main = document.getElementById('main');

const url = location =>
	`https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${apikey}&units=imperial`;

async function getWeatherByLocation(location) {
	const res = await fetch(url(location), {
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

	weather.innerHTML = `<h2>
      <img src="http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png" />${temp}°F
      <small>${data.weather[0].main}</small>
    </h2>`;

	// cleanup
	main.innerHTML = '';

	main.appendChild(weather);
}

form.addEventListener('submit', e => {
	e.preventDefault();
	// get search input value
	// const city = searchInput.value;

	// if (city) {
	// 	getWeatherByLocation(city);
	// }

	const input = searchInput.value;

	let alphabetRegex = /[a-z]/gi; // Change this line
	let digitRegex = /[0-9]/gi;

	if (alphabetRegex.test(input) && digitRegex.test(input)) {
		// check for mixed letters and numbers
		console.log('mixed letters and numbers');
	} else if (alphabetRegex.test(input)) {
		// check for letters only
		console.log('letters');
	} else {
		console.log('numbers');
	}
});

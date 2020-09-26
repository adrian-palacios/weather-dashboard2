let searchCityName = "";
let userCities = ["Austin", "Houston", "Dallas"];
let allCitiesFromStorage = [];
$(".citySearchButton").click(() => {
	searchCityName = $("#citySearch").val();
	/* An array for saving city names for local storage */
	if (searchCityName !== "") {
		console.log(searchCityName);
		allCitiesFromStorage.push(searchCityName);
		localStorage.setItem("myCities", JSON.stringify(allCitiesFromStorage));
	}
	newButton();
	getWeather(searchCityName);
});

$(document).ready(() => {
	/* get city names from local storage */
	allCitiesFromStorage = JSON.parse(localStorage.getItem("myCities"));
	console.log(allCitiesFromStorage);
	if (allCitiesFromStorage === null) {
		localStorage.setItem("myCities", JSON.stringify(userCities));
	}
	newButton();
});

function newButton() {
	$(".cities").empty();
	for (let i = 0; i < allCitiesFromStorage.length; i++) {
		let cityButton = $("<button>");
		let newCity = cityButton
			.text(allCitiesFromStorage[i])
			.addClass("cityButton")
			.val(allCitiesFromStorage[i]);
		$(".cities").append(newCity);
	}
}

$(document).on("click", ".cityButton", function () {
	let getCityName = $(this).val();
	console.log(getCityName);
	getWeather(getCityName);
});

function getWeather(city) {
	$.ajax({
		url: `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=3e7be9a349d1dc778f314703bd387a93`,
		method: "GET",
	}).then((res) => {
		console.log(res);

		$(".cityNameH3").text(res.name);
		$(".todaysDate").text(new Date());
		$(".todaysWeatherIcon").html(
			`<img src="https://openweathermap.org/img/w/${res.weather[0].icon}.png" />`
		);
		$(".currentTemp").text(Math.round((res.main.temp - 273.17) * 1.8 + 32));
		$(".currentHumid").text(res.main.humidity);
		$(".currentWind").text(res.wind.speed);
		/* Getting UV method */
		$.ajax({
			url: `https://api.openweathermap.org/data/2.5/uvi?appid=3e7be9a349d1dc778f314703bd387a93&lat=${res.coord.lat}&lon=${res.coord.lon}`,
			method: "GET",
		}).then(function (res) {
			$(".currentUV").text(res.value);
		});
	});
	$.ajax({
		url: `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=3e7be9a349d1dc778f314703bd387a93`,
		method: "GET",
	}).then((res) => {
		console.log(res);
		const fivedaysWeather = [0, 8, 16, 24, 32];
		function row(x) {
			for (let i = 0; i < fivedaysWeather.length; i++) {
				return `<tr>
					<td>${res.list[fivedaysWeather[i]].dt_txt}</td>
					<td>${$("<img>")
						.attr(
							"src",
							"https://openweathermap.org/img/w/" +
								res.list[fivedaysWeather[i]].weather[0].icon +
								".png"
						)
						.attr("width", 100)}</td>
				</tr>`;
			}
		}
		$(".alldays").html(
			`
			<table>
				<thead>
					<tr>
						<td>Date</td>
						<td>Weather</td>
						<td>Temperature</td>
						<td>Humidity</td>
					</tr>
				</thead>
				<tbody>
					${row()}
				</tbody>
			</table>
			
			`
		);
	});
}

getWeather("Austin");

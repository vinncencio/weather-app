import conditions from "./conditions.js";
import windDirs from "./wind-dirs.js";
import windPower from "./wind-power.js";
const form = document.querySelector('#form');
const input = document.querySelector('.form-input');
const apiKey = '8d9deac627384df6b1102656231012';
const header = document.querySelector('.header');

function removeCard(){
    const prevCard = document.querySelector('.weather-info');
    if (prevCard) prevCard.remove();
};
async function getWeather(city){
    const url = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}`;
    const response = await fetch(url);
    const data = await response.json();
    console.log(data);
    return data;
};
function showCard({name, country, temp, conditions, icon, winddir, winddegree, windkph, windms, windpower}){
    const html = `
    <section class="weather-info">
        <div class="weather-info-city">${name} <span>${country}</span></div>
        <div class="weather-info-row">
            <div class="weather-info-temp">${temp}<span>°c</span></div>
            <img class="weather-img" src="${icon}" alt="Weather">
        </div>
        <div class="weather-desc">${conditions}</div>
        <div class="weather-wind">
            <div class="weather-wind-desc">
                <div class="weather-wind-power"><span>Ветер </span>${windpower}</div>
                <div class="weather-wind-dir">${winddir}</div>
            </div>
            <div class="weather-wind-arrow">
                <img src="./img/arrow-up.svg" style="transform: rotate(${winddegree}deg);"/>
            </div>
        </div>
        <div class="weather-wind-speed">
            <div class="weather-wind-kph">${windkph}<span>км/ч</span></div>
            <div class="weather-wind-ms">${windms}<span>м/с</span></div>                
        </div>
    </section>
    `;
    header.insertAdjacentHTML('afterend', html);
};

form.onsubmit = async function(e){
    e.preventDefault();
    let city = input.value.trim();
    const data = await getWeather(city);
    if (data.error) {
        removeCard();
        const html = `<div class="weather-info">${data.error.message}</div>`;
        header.insertAdjacentHTML('afterend', html);
    } else {
        removeCard();
        const info = conditions.find((obj) => obj.code === data.current.condition.code);
        const condition = data.current.is_day ? info.languages[23]['day_text'] : info.languages[23]['night_text'];
        const iconUrl = 'https:' + data.current.condition.icon;
        const windDir = windDirs.find((obj) => obj.windDirEng === data.current.wind_dir);
        const windMs = Math.round(parseFloat(data.current.wind_kph/3.6), -1);
        const windPowerDesc = windPower.find((obj) => obj.wind_kph_min <= data.current.wind_kph && data.current.wind_kph <= obj.wind_kph_max);
        const windDegree = parseInt(data.current.wind_degree) + 180;
        const weatherData = {
            name: data.location.name,
            country: data.location.country,
            temp: data.current.temp_c,
            conditions: condition,
            icon: iconUrl,
            windkph: data.current.wind_kph,
            winddir: windDir.windDirRus,
            winddegree: windDegree,
            windms: windMs,
            windpower: windPowerDesc.wind_power_desc,
        };
        showCard(weatherData);
    };
};

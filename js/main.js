import conditions from "./conditions.js";
import windDirs from "./wind-dirs.js";
import windPower from "./wind-power.js";
import moonPhases from "./moonPhases.js";
import months from "./months.js";
const form = document.querySelector('#form');
const input = document.querySelector('.form-input');
const apiKey = '8d9deac627384df6b1102656231012';
const header = document.querySelector('.header');
// const footer = document.querySelector('.footer');

function removeCard() {
    const prevCard = document.querySelector('.weather-info');
    if (prevCard) prevCard.remove();
};
async function getWeather(city) {
    const url = `https://api.weatherapi.com/v1/current.json?key=${apiKey}&q=${city}`;
    const response = await fetch(url);
    const data = await response.json();
    // console.log(data);
    return data;
};
async function getAstro(city) {
    const url = `https://api.weatherapi.com/v1/astronomy.json?key=${apiKey}&q=${city}`;
    const response = await fetch(url);
    const data = await response.json();
    // console.log(data);
    return data;
};

form.onsubmit = async function (e) {
    e.preventDefault();
    let city = input.value.trim();
    const data = await getWeather(city);
    const dataAstro = await getAstro(city);
    if (data.error) {
        removeCard();
        const html = `<div class="weather-info">${data.error.message}</div>`;
        header.insertAdjacentHTML('afterend', html);
    } else {
        removeCard();
        const currentData = await submitCurrent(data);
        const astroData = await submitAstro(dataAstro);
        console.log(currentData, astroData);
        showCard(currentData);
        showAstro(astroData);
    };
};

async function submitCurrent(data){
    const info = conditions.find((obj) => obj.code === data.current.condition.code);
    const condition = data.current.is_day ? info.languages[23]['day_text'] : info.languages[23]['night_text'];
    const iconUrl = 'https:' + data.current.condition.icon;
    const windDir = windDirs.find((obj) => obj.windDirEng === data.current.wind_dir);
    const windMs = Math.round(parseFloat(data.current.wind_kph / 3.6), -1);
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
    return weatherData;
}

async function submitAstro(dataAstro){
    const moonrise = timeConversion(dataAstro.astronomy.astro.moonrise);
    const moonset = timeConversion(dataAstro.astronomy.astro.moonset);
    const sunrise = timeConversion(dataAstro.astronomy.astro.sunrise);
    const sunset = timeConversion(dataAstro.astronomy.astro.sunset);
    const isMoonUp = dataAstro.astronomy.astro.is_moon_up; // bool
    const isSunUp = dataAstro.astronomy.astro.is_sun_up; // bool
    const moonIllumination = dataAstro.astronomy.astro.moon_illumination; // int %
    const moonPhase = moonPhases.find((obj) => obj.moonPhaseEng === dataAstro.astronomy.astro.moon_phase);
    const localtime = localtimeConversion(dataAstro.location.localtime);
    // console.log(localtime);
    const astroData = {localtime, sunrise, sunset, moonrise, moonset, 
        moonPhase: moonPhase.moonPhaseRus, 
        moonPhaseImg: moonPhase.moonPhaseImg, 
        moonIllumination, isSunUp, isMoonUp};
    return astroData;
}

function timeConversion(strTime) {
    const timeString = strTime.toString();
    if (timeString.match(/PM$/)) {
        let match = timeString.match(/([0-9]+):([0-9]+) PM/)
        let hours = parseInt(match[1]) + 12;
        let minutes = match[2];
        if (parseInt(match[1]) === 12) {return parseInt(match[1])+ ':' + minutes} 
        else {return hours + ':' + minutes}
    } else {
        let match = timeString.match(/([0-9]+):([0-9]+) AM/)
        let hours = parseInt(match[1]);
        let minutes = match[2];
        if (hours === 12) {return '00:' + minutes} 
        else {return hours + ':' + minutes}
    }
}
function localtimeConversion(strLocaltime){
    const localtimeString = strLocaltime.toString();
    const match = localtimeString.match(/([0-9]+)\-([0-9]+)\-([0-9]+) ([0-9]+):([0-9]+)/);
    const year = match[1];
    const monthObj = months.find((obj) => obj.numb === parseInt(match[2]).toString());
    const month = monthObj.nameRus;
    const day = parseInt(match[3]);
    const hour = parseInt(match[4]);
    const mins = match[5];
    return (hour + ':' + mins + ', ' + day + ' ' + month + ' ' + year);
}

function showCard(currentData) {
    const {name, country, temp, conditions, icon, winddir, winddegree, windkph, windms, windpower} = currentData;
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
function showAstro(astroData){
    const {localtime, sunrise, sunset, moonrise, moonset, moonPhase, moonPhaseImg, moonIllumination, isSunUp, isMoonUp} = astroData;
    const html = `
    <div class="astro">
        <p class="astro-localtime">местное время: <span>${localtime}</span></p>
        <div class="astro-row">
            <div class="astro-sun">
                <img class="astro-sun-img" src="./img/icons/sun.png" alt="sun">
                <div class="astro-suntimes">
                    <div class="astro-times-row">
                        <img class="astro-img" src="./img/icons/sunrise.png" alt="sunrise">
                        <p class="astro-p"><span>${sunrise}</span></p>
                    </div>
                    <div class="astro-times-row">
                        <img class="astro-img" src="./img/icons/sunset.png" alt="sunset">
                        <p class="astro-p"><span>${sunset}</span></p>
                    </div>
                </div>
            </div>
            <div class="astro-sun">
                <img class="astro-sun-img" src="./img/phases/${moonPhaseImg}" alt="moon">
                <div class="astro-suntimes">
                    <div class="astro-times-row">
                        <img class="astro-img" src="./img/icons/moonrise.png" alt="moonrise">
                        <p class="astro-p"><span>${moonrise}</span></p>
                    </div>
                    <div class="astro-times-row">
                        <img class="astro-img" src="./img/icons/moonset.png" alt="moonset">
                        <p class="astro-p"><span>${moonset}</span></p>
                    </div>
                </div>
            </div>
        </div>
        <div class="astro-moon">
            <div class="astro-moon-phase"></div>
            <div class="astro-moon-phase">${moonPhase}<span> светимость: ${moonIllumination}%</span></div>
        </div>
    </div>
    `;
    const weatherInfo = document.querySelector('.weather-info');
    weatherInfo.insertAdjacentHTML('beforeend', html);
}

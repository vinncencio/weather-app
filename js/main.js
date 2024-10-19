import conditions from "./conditions.js";
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
function showCard({name, country, temp, conditions, icon}){
    const html = `
    <section class="weather-info">
        <div class="weather-info-city">${name} <span>${country}</span></div>
        <div class="weather-info-row">
            <div class="weather-info-temp">${temp}<span>°c</span></div>
            <img class="weather-img" src="${icon}" alt="Weather">
        </div>
        <div class="weather-desc">${conditions}</div>
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
        const iconUrl = 'http:' + data.current.condition.icon;
        const weatherData = {
            name: data.location.name,
            country: data.location.country,
            temp: data.current.temp_c,
            conditions: condition,
            icon: iconUrl,
        };
        showCard(weatherData);
    };
};

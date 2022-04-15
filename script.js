'use strict';

const btn = document.querySelector('.btn-country');
const countriesContainer = document.querySelector('.countries');

///////////////////////////////////////
// const request = new XMLHttpRequest();

// request.open('GET', 'https://restcountries.com/v3.1/name/portugal')
// request.send();

// request.addEventListener('load', function(){
//   // console.log(this.responseText)
//   const [data] = JSON.parse(this.responseText);
//   console.log(data);
//   console.log(data.languages.keys());

//   // const html = `
//   // <article class="country">
//   //   <img class="country__img" src="${data.flags.png}" />
//   //   <div class="country__data">
//   //     <h3 class="country__name">${data.name.common}</h3>
//   //     <h4 class="country__region">${data.region}</h4>
//   //     <p class="country__row"><span>👫</span>${(+data.population / 1000000).toFixed(1)} people</p>
//   //     <p class="country__row"><span>🗣️</span>${data.languages}</p>
//   //     <p class="country__row"><span>💰</span>${2}</p>
//   //   </div>
//   // </article>`;

//   // countriesContainer.insertAdjacentHTML('beforeend', html);
//   countriesContainer.style.opacity = 1;

const renderCountry = function (data, className = '') {
  const html = `
  <article class="country ${className}">
    <img class="country__img" src="${data.flags.png}" />
    <div class="country__data">
      <h3 class="country__name">${data.name}</h3>
      <h4 class="country__region">${data.region}</h4>
      <p class="country__row"><span>👫</span>${(
        +data.population / 1000000
      ).toFixed(1)} people</p>
      <p class="country__row"><span>🗣️</span>${data.languages[0].name}</p>
      <p class="country__row"><span>💰</span>${data.currencies[0].name}</p>
    </div>
  </article>`;

  countriesContainer.insertAdjacentHTML('beforeend', html);
  countriesContainer.style.opacity = 1;
};


// Funcion that get the data of the fetch API and also pass errors
const getJSON = function (url, message = 'There is an error') {
  return fetch(url).then(response => {
    if (!response.ok) throw new Error(`${message} ${response.status}`);

    return response.json();
  });
};

// get country and neighbour data
const getCountryData = function (country) {
  getJSON(`https://restcountries.com/v2/name/${country}`, 'Wahala')
    .then(data => {
      renderCountry(data[0]);
      const neighbour = data[0].borders[0];
      // console.log(neighbour);

      if (!neighbour) return;
      return getJSON(
        `https://restcountries.com/v2/alpha/${neighbour}`,
        'Country not found Again'
      );
    })
    .then(data => renderCountry(data, 'neighbour'))
    .catch(err => console.error(`${err} console error`));
};

// getCountryData(whereAmI());


// Promise to get the Location of the user
const promGeo = function (){
  return new Promise( function (resolve, reject){
    navigator.geolocation.getCurrentPosition(resolve, reject)
  });
}

// https://opencagedata.com/api ----API used for geo-coding
const whereAmI = function () {
  promGeo()
    .then(pos => {
      const {latitude: lat, longitude: lng} = pos.coords;

      return fetch(
        `https://api.opencagedata.com/geocode/v1/json?q=${lat}+${lng}&key=cdba9b08f7e645c3bb8396c5daed764b`
      );
    })
    .then(response => response.json())
    .then(data => {
      console.log(data)
      let country = (data.results[0].components.country)
      console.log(country)

      getCountryData(country)
    })
};

whereAmI();

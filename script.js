'use strict';

const btn = document.querySelector('.btn-country');
const countriesContainer = document.querySelector('.countries');

///////////////////////////////////////
const showCountry = function (country) {
  const request = new XMLHttpRequest();
  request.open('GET', `https://restcountries.com/v3.1/name/${country}`);
  request.send();

  request.addEventListener('load', function () {
    const [, data] = JSON.parse(request.responseText)
    console.log(data);

    const html = `<article class="country">
  <img class="country__img" src="${data.flags.png}" />
  <div class="country__data">
    <h3 class="country__name">${data.name.common}</h3>
    <h4 class="country__region">${data.region}</h4>
    <p class="country__row"><span>👫</span><strong>${(data.population / 10000000).toFixed(1)}M</strong> people</p>
    <p class="country__row"><span>🗣️</span>${data.languages.eng}, ${data.languages.hin}</p>
    <p class="country__row"><span>💰</span>${data.currencies.INR.name}</p>
  </div >
</article > `;

    countriesContainer.insertAdjacentHTML('beforeend', html)
    countriesContainer.style.opacity = 1;
  })
}
showCountry('india')
// showCountry('usa')
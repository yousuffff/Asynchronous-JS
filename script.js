'use strict';

const btn = document.querySelector('.btn-country');
const countriesContainer = document.querySelector('.countries');

///////////////////////////////////////

const renderCountry = function (data, classlist = '') {

  const html = `<article class="country ${classlist} ">
  <img class="country__img" src="${data.flags.png}" />
  <div class="country__data">
    <h3 class="country__name">${data.name.common}</h3>
    <h4 class="country__region">${data.region}</h4>
    <p class="country__row"><span>👫</span><strong>${(data.population / 10000000).toFixed(1)}M</strong> people</p>
    <p class="country__row"><span>🗣️</span>${data.languages.eng }</p>
    <p class="country__row"><span>💰</span>${data.currencies}</p>
  </div >
</article > `;

  countriesContainer.insertAdjacentHTML('beforeend', html)
  countriesContainer.style.opacity = 1;
}
// const showCountry = function (country) {
//   const request = new XMLHttpRequest();
//   request.open('GET', `https://restcountries.com/v3.1/name/${country}`);
//   request.send();

//   request.addEventListener('load', function () {
//     const [, data] = JSON.parse(request.responseText)
//     console.log(data);
//     let [neighbour] = data.borders;
//     console.log(neighbour);
//     renderCountry(data)

//     const neighbourCountry = function (neighbour) {
//       const request2 = new XMLHttpRequest();
//       request2.open('GET', `https://restcountries.com/v3.1/alpha/${neighbour}`)
//       request2.send();
//       console.log(neighbour)

//       request2.addEventListener('load', function () {
//         const [data] = JSON.parse(request2.responseText)
//         console.log(data);

//         renderCountry(data, 'neighbour')
//       })

//     }
//     neighbourCountry(neighbour)
//   })
// }
// showCountry('india')
// showCountry('usa')

/// Promise 

const getCountry = function (country) {
  fetch(`https://restcountries.com/v3.1/name/${country}`)
    .then((respone) => respone.json())
    .then((data) => {
      renderCountry(data[1])
      const neighbourCountry = data[1].borders;
      const neighbour = neighbourCountry[Math.floor(Math.random() * 6)];
      console.log(neighbour)

      if (!neighbour) return;

      return fetch(`https://restcountries.com/v3.1/alpha/${neighbour}`)
    }).then((respone2) => respone2.json())
    .then((data) => {
      console.log(data[0])

      renderCountry(data[0], 'neighbour')
    })
}
getCountry('india')
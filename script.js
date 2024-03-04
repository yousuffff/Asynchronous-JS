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
    <p class="country__row"><span>🗣️</span>${data.languages.eng || data.languages.zho || data.languages.dzo || data.languages.mya || data.languages.ben || data.languages.nep || data.languages.deu || data.languages.ces}</p>
    <p class="country__row"><span>💰</span>${data.currencies}</p>
  </div >
</article > `;

  countriesContainer.insertAdjacentHTML('beforeend', html)
  countriesContainer.style.opacity = 1;
}

/////////////////XML request///////////////////

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

//////////////// Promise /////////////////////

const getJSON = function (url, errMsg = 'Something went wrong') {
  return fetch(url).then(res => {
    if (!res.ok) throw new Error(`${errMsg} , ${res.status}`);
    return res.json()
  })
}
const renderErr = function (err) {
  countriesContainer.insertAdjacentText('afterbegin', err.message)
  countriesContainer.style.opacity = 1;
}

const getCountry = function (country) {
  getJSON(`https://restcountries.com/v3.1/name/${country}`, 'Country not found')
    .then((data) => {
      console.log(data)
      // renderCountry(data[1])
      renderCountry(data[0])
      // const neighbourCountry = data[1].borders;
      const neighbourCountry = data[0].borders;
      const neighbour = neighbourCountry[Math.floor(Math.random() * neighbourCountry.length)];
      console.log(neighbour)


      if (!neighbour) throw new Error(`Neighbour Not Found`);

      return getJSON(`https://restcountries.com/v3.1/alpha/${neighbour}`, 'Neighbour not found')
    })
    .then((data) => {
      console.log(data)
      renderCountry(data[0], 'neighbour')

    }).catch(err => {
      renderErr(err)

    }).finally(
  )

}
// getCountry('usa')

///////////////////////////////////////
// Coding Challenge #1

/* 
In this challenge you will build a function 'whereAmI' which renders a country ONLY based on GPS coordinates. For that, you will use a second API to geocode coordinates.

Here are your tasks:

PART 1
1. Create a function 'whereAmI' which takes as inputs a latitude value (lat) and a longitude value (lng) (these are GPS coordinates, examples are below).
2. Do 'reverse geocoding' of the provided coordinates. Reverse geocoding means to convert coordinates to a meaningful location, like a city and country name. Use this API to do reverse geocoding: https://geocode.xyz/api.
The AJAX call will be done to a URL with this format: https://geocode.xyz/52.508,13.381?geoit=json. Use the fetch API and promises to get the data. Do NOT use the getJSON function we created, that is cheating 😉
3. Once you have the data, take a look at it in the console to see all the attributes that you recieved about the provided location. Then, using this data, log a messsage like this to the console: 'You are in Berlin, Germany'
4. Chain a .catch method to the end of the promise chain and log errors to the console
5. This API allows you to make only 3 requests per second. If you reload fast, you will get this error with code 403. This is an error with the request. Remember, fetch() does NOT reject the promise in this case. So create an error to reject the promise yourself, with a meaningful error message.

PART 2
6. Now it's time to use the received data to render a country. So take the relevant attribute from the geocoding API result, and plug it into the countries API that we have been using.
7. Render the country and catch any errors, just like we have done in the last lecture (you can even copy this code, no need to type the same code)

TEST COORDINATES 1: 52.508, 13.381 (Latitude, Longitude)
TEST COORDINATES 2: 19.037, 72.873
TEST COORDINATES 2: -33.933, 18.474

GOOD LUCK 😀
*/
const getPostion = function () {
  return new Promise(function (resolve, reject) {
    navigator.geolocation.getCurrentPosition(resolve, reject);
  })
}
const apiKey = `130584795852412e15925027x28664`

const URL = `https://geocode.xyz/51.50354,-0.12768?geoit=xml&auth=${apiKey}`

const whereAmI = function () {
  getPostion().then(res => {
    const { latitude: lat, longitude: lng } = res.coords;
    console.log(lat, lng)
    return getJSON(`https://geocode.xyz/${lat},${lng}?geoit=json&auth=${apiKey}`)
  }).then(function (data) {
    const country = data.country
    console.log(data)
    getCountry(country)
  }).catch(err => {
    console.error(err)
    renderErr(err)
  })
}
// whereAmI(19.037, 72.873);
// whereAmI(52.508, 13.381);
// whereAmI()
// navigator.geolocation.getCurrentPosition(data => {
//   const { latitude, longitude } = data.coords
//   console.log(latitude, longitude)
// })

// promisefying geolocation



// getPostion().then(res => console.log(res.coords))

///////////////////////////////////////
// Coding Challenge #2

/* 
Build the image loading functionality that I just showed you on the screen.

Tasks are not super-descriptive this time, so that you can figure out some stuff on your own. Pretend you're working on your own 😉

PART 1
1. Create a function 'createImage' which receives imgPath as an input. This function returns a promise which creates a new image (use document.createElement('img')) and sets the .src attribute to the provided image path. When the image is done loading, append it to the DOM element with the 'images' class, and resolve the promise. The fulfilled value should be the image element itself. In case there is an error loading the image ('error' event), reject the promise.

If this part is too tricky for you, just watch the first part of the solution.

PART 2
2. Comsume the promise using .then and also add an error handler;
3. After the image has loaded, pause execution for 2 seconds using the wait function we created earlier;
4. After the 2 seconds have passed, hide the current image (set display to 'none'), and load a second image (HINT: Use the image element returned by the createImage promise to hide the current image. You will need a global variable for that 😉);
5. After the second image has loaded, pause execution for 2 seconds again;
6. After the 2 seconds have passed, hide the current image.

TEST DATA: Images in the img folder. Test the error handler by passing a wrong image path. Set the network speed to 'Fast 3G' in the dev tools Network tab, otherwise images load too fast.

GOOD LUCK 😀
*/

// promisefying setTimeout

const wait = function (second) {
  return new Promise(function (resolve) {
    setTimeout(resolve, second * 1000);
  })
};

// wait(1).then(() => {
//   console.log('Print after 1 second')
//   return wait(1)
// }).then(() => {
//   console.log('Print after 2 second')
//   return wait(1)
// }).then(() => {
//   console.log('Print after 3 second')
//   return wait(1)
// }).then(() => {
//   console.log('Print after 4 second')
//   return wait(1)
// })
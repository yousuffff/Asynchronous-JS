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

// const imageContainer = document.querySelector('.images')

// const createImg = function (imgPath) {
//   return new Promise(function (resolve, reject) {
//     const img = document.createElement('img');
//     img.src = imgPath;
//     img.addEventListener('load', function () {
//       imageContainer.append(img);
//       resolve(img);
//     })
//     img.addEventListener('error', function () {
//       reject(new Error('Image Not Found'))
//     });


//   })
// }
// let currentImage;;
// createImg('img/img-1.jpg')
//   .then(img => {
//     currentImage = img;
//     console.log('Image 1 loaded')
//     return wait(2)
//   })
//   .then(() => {
//     currentImage.style.display = 'none';
//     return createImg('img/img-2.jpg')
//   }).then((img) => {
//     currentImage = img;
//     console.log('Image 2 loaded')
//     return wait(2)
//   }).then(() => {
//     currentImage.style.display = 'none';
//   }).catch(err => {
//     console.error(err)
//   })


/////////////Async Await///////////

const getPos = async function () {
  try {
    const pos = await getPostion();
    console.log(pos)
    const { latitude, longitude } = pos.coords;
    console.log(latitude, longitude)
    const country = await fetch(`https://api.geoapify.com/v1/geocode/reverse?lat=${latitude}&lon=${longitude}&apiKey=8a7abe0cbc8042b5a5442e359d26bee1`)
    const count = await country.json()
    const data = count.features[0].properties
    console.log(data.country)
    const res = await fetch(`https://restcountries.com/v3.1/name/${data.country}`);
    if (!res.ok) throw new Error(`Country not found , ${res.status}`)
    const resData = await res.json();
    // const minidata = resData;
    console.log(resData[1])
    renderCountry(resData[1])

    return `You are in ${data.city},${data.country}`
  }
  catch (err) {
    console.error(err)
    throw err;
  }
};
//// bad practice to use promise with async await
// getPos()
//   .then(city => console.log(city))
//   .catch(err => console.error(err))
//   .finally(() => console.log('location get'))

// we use IIFE with asyncx await
// (async function () {
//   try {
//     const city = await getPos();
//     console.log(city)
//   } catch (err) {
//     console.error(err)
//   }
//   console.log('location got')
// })()

//// get three countries data parallelly 

const get3countries = async function (c1, c2, c3) {
  try {
    //   const data1 = await getJSON(`https://restcountries.com/v3.1/name/${c1}`)
    //   const data2 = await getJSON(`https://restcountries.com/v3.1/name/${c2}`)
    //   const data3 = await getJSON(`https://restcountries.com/v3.1/name/${c3}`)

    //   console.log(data1[0].capital, data2[0].capital, data3[0].capital)

    const data = await Promise.all([
      getJSON(`https://restcountries.com/v3.1/name/${c1}`),
      getJSON(`https://restcountries.com/v3.1/name/${c2}`),
      getJSON(`https://restcountries.com/v3.1/name/${c3}`)
    ]);

    const capital = [data.map(d => d[0].capital), data.map(d => d[0].borders)]
    console.log(capital);
  } catch (err) {
    console.error(err)
  }
}
  // get3countries('uk', 'france', 'canada');

  /// note 
  // in promise.all there is one catch , i mean one flaw and that is if one promise failed due to any error , all promise are gonna rejected.
  // so keep this in mind 
  // and we use promise.all when other promise not depend on first one so for decreasing loading time we load all promises at once
  // That's it.

  // Difference between these four promises
  // Promise.all - promise.all short curcuit the opertion if any promise rejected mean throw error and stop
  // Promise.allSettel - promise.allSettle keep working if their is and error in one of the priomises still completes all promises
  // Promise.race - promise.race return promise which load first but if there is any promise rejected fisrt its return rejected promise
  // Promise.any - work as same as promise.race but only return fulfilled promise and except the rejected one.
  // lets see with example

  ///////////////////////////////////////
  // Other Promise Combinators: race, allSettled and any
  // Promise.race
  ; (async function () {
    const res = await Promise.race([
      getJSON(`https://restcountries.com/v3.1/name/egypt`),
      getJSON(`https://restcountries.com/v3.1/name/italy`),
      getJSON(`https://restcountries.com/v3.1/name/mexico`),
    ]);
    console.log(res[0]);
  })();

const timeout = function (sec) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(new Error('Request took too long!'));
    }, sec * 1000);
  });
};

Promise.race([
  getJSON(`https://restcountries.com/v3.1/name/italy`),
  timeout(5),
])
  .then(res => console.log(res[0]))
  .catch(err => console.error(err));

// Promise.allSettled
Promise.allSettled([
  Promise.resolve('Success'),
  Promise.reject('ERROR'),
  Promise.resolve('Another success'),
]).then(res => console.log(res));

Promise.all([
  Promise.resolve('Success'),
  Promise.reject('ERROR'),
  Promise.resolve('Another success'),
])
  .then(res => console.log(res))
  .catch(err => console.error(err));

// Promise.any [ES2021]
Promise.any([
  Promise.resolve('Success'),
  Promise.reject('ERROR'),
  Promise.resolve('Another success'),
])
  .then(res => console.log(res))
  .catch(err => console.error(err));


///////////////////////////////////////
// Coding Challenge #3

/* 
PART 1
Write an async function 'loadNPause' that recreates Coding Challenge #2, this time using async/await (only the part where the promise is consumed). Compare the two versions, think about the big differences, and see which one you like more.
Don't forget to test the error handler, and to set the network speed to 'Fast 3G' in the dev tools Network tab.

PART 2
1. Create an async function 'loadAll' that receives an array of image paths 'imgArr';
2. Use .map to loop over the array, to load all the images with the 'createImage' function (call the resulting array 'imgs')
3. Check out the 'imgs' array in the console! Is it like you expected?
4. Use a promise combinator function to actually get the images from the array 😉
5. Add the 'paralell' class to all the images (it has some CSS styles).

TEST DATA: ['img/img-1.jpg', 'img/img-2.jpg', 'img/img-3.jpg']. To test, turn off the 'loadNPause' function.

GOOD LUCK 😀
*/

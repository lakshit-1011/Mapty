'use strict';

// prettier-ignore



const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

const form = document.querySelector('.form');
const containerWorkouts = document.querySelector('.workouts');
const inputType = document.querySelector('.form__input--type');
const inputDistance = document.querySelector('.form__input--distance');
const inputDuration = document.querySelector('.form__input--duration');
const inputCadence = document.querySelector('.form__input--cadence');
const inputElevation = document.querySelector('.form__input--elevation');

const getLocation = function () {
  return new Promise(function (resolve, rejected) {
    navigator.geolocation.getCurrentPosition(resolve, rejected);
  });
};

const getData = async function () {
  try {
    const res = await getLocation();
    if (!res) {
      throw new Error('Could not get location');
    }
    const { longitude: long, latitude: lat } = res.coords;
    console.log(res.coords);
    console.log(long, lat);
    const cordi=[lat,long];  

    const map = L.map('map').setView(cordi, 13);

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);

    L.marker(cordi)
      .addTo(map)
      .bindPopup('A pretty CSS popup.<br> Easily customizable.')
      .openPopup();
  } catch (error) {
    console.error(error.message);
  }
};
getData();

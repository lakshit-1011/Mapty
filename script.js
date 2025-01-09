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
const cad = document.querySelector('.cadence');
const ele = document.querySelector('.elevation');

const toatlWorkouts = [];
class Workout {
  // date = new Date();
  id = (Date.now() + '').slice(-10);
  constructor(distance, duration, coordinates) {
    this.distance = distance;
    this.duration = duration;
    this.coordinates = coordinates;
    this.date=new Date();
  }
 
}

class Cycling extends Workout {
  constructor(distance, duration, coordinates, elevationGain,type) {
    super(distance, duration, coordinates);
    this.elevationGain = elevationGain;
    this.type=type;
    this.pace();
    this.setDescription();
  }
  setDescription() {
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];

    this.setDescription = ` ${months[this.date.getMonth()]} ${this.date.getDate()}`;
  }
  pace() {
    this.pace = this.duration / this.distance;
    return this.pace;
  }
}

class Running extends Workout {
  constructor(distance, duration, coordinates, cadence,type) {
    super(distance, duration, coordinates);
    this.cadence = cadence;
    this.type=type;
    this.speed();
    this.setDescription();
  }
  setDescription() {
    const months = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];

    this.setDescription = ` ${months[this.date.getMonth()]} ${this.date.getDate()}`;;
  }
  speed() {
    this.speed = this.distance / this.duration;
    return this.speed;
  }
}

const getLocation = function () {
  return new Promise(function (resolve, rejected) {
    navigator.geolocation.getCurrentPosition(resolve, rejected);
  });
};

let map, mapClick;
const getData = async function () {
  try {
    const res = await getLocation();
    if (!res) {
      throw new Error('Could not get location');
    }
    const { longitude: long, latitude: lat } = res.coords;
    console.log(res.coords);
    console.log(long, lat);
    const cordi = [lat, long];

    map = L.map('map').setView(cordi, 13);

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(map);
    
    map.on('click', function (mapEve) {
      mapClick = mapEve;
      form.classList.remove('hidden');
      inputDistance.focus();
    });
  

  } catch (error) {
    console.error(error.message);
  }
};
getData();
form.addEventListener('submit', function (e) {
  e.preventDefault();

  const validInputs = (...inputs) =>
    inputs.every(inp => Number.isFinite(inp));
  const allPositive = (...inputs) => inputs.every(inp => inp > 0);

  let work;

  const { lat, lng } = mapClick.latlng;

  const typiii = inputType.value;
  const distance = +inputDistance.value;
  const duration = +inputDuration.value;
  
  

   if(typiii==='running'){

    const cadii = +inputCadence.value;

    if(!validInputs(distance,duration,cadii) || !allPositive(distance,duration,cadii)){
      alert('please fill correct details, value should be in number and positive')
    }

     work= new Running(distance,duration,[lat,lng],cadii,typiii);

   }

   if(typiii=='cycling'){

    const elevate = +inputElevation.value;

    if(!validInputs(distance,duration,elevate) || !allPositive(distance,duration,elevate)){
      alert('please fill correct details, value should be in number and positive')
    }
    work= new Cycling(distance,duration,[lat,lng],elevate,typiii);

   }
   
   toatlWorkouts.push(work);
   console.log("total workout",toatlWorkouts);

   setLocalStorage();
   renderWorkOuts(toatlWorkouts);

   let len=+toatlWorkouts.length-1;

  console.log(mapClick);
  inputCadence.value =
    inputDistance.value =
    inputDuration.value =
    inputElevation.value =
      '';
  console.log(lat, lng);
  L.marker([lat, lng])
    .addTo(map)
    .bindPopup(
      L.popup({
        maxWidth: 250,
        minWidth: 100,
        autoClose: false,
        closeOnClick: false,
        className: `${type}-popup`,
      })
    )
    .setPopupContent(`${type} on ${toatlWorkouts[len].setDescription}`)
    .openPopup();

  form.classList.add('hidden');
});

function renderWorkOuts(workouts){
 console.log("render",workouts);
 console.log(workouts.length)
 let len=+workouts.length-1;
 console.log(workouts[len]);
let html;

    if(workouts[len].type==='running'){
       html=
       `
       <li class="workout workout--running" data-id=${workouts[len].id}>
          <h2 class="workout__title">Running on ${workouts[len].setDescription}</h2>
          <div class="workout__details">
            <span class="workout__icon">🏃‍♂️</span>
            <span class="workout__value">${workouts[len].distance}</span>
            <span class="workout__unit">km</span>
          </div>
          <div class="workout__details">
            <span class="workout__icon">⏱</span>
            <span class="workout__value">${workouts[len].duration}</span>
            <span class="workout__unit">min</span>
          </div>
          <div class="workout__details">
            <span class="workout__icon">⚡️</span>
            <span class="workout__value">${workouts[len].speed.toFixed(1)}</span>
            <span class="workout__unit">min/km</span>
          </div>
          <div class="workout__details">
            <span class="workout__icon">🦶🏼</span>
            <span class="workout__value">${workouts[len].cadence}</span>
            <span class="workout__unit">spm</span>
          </div>
        </li>
      `
    }else{
      html=` <li class="workout workout--cycling" data-id=${workouts[len].id}>
          <h2 class="workout__title">Cycling on ${workouts[len].setDescription}</h2>
          <div class="workout__details">
            <span class="workout__icon">🚴‍♀️</span>
            <span class="workout__value">${workouts[len].distance}</span>
            <span class="workout__unit">km</span>
          </div>
          <div class="workout__details">
            <span class="workout__icon">⏱</span>
            <span class="workout__value">${workouts[len].duration}</span>
            <span class="workout__unit">min</span>
          </div>
          <div class="workout__details">
            <span class="workout__icon">⚡️</span>
            <span class="workout__value">${workouts[len].pace.toFixed(1)}</span>
            <span class="workout__unit">km/h</span>
          </div>
          <div class="workout__details">
            <span class="workout__icon">⛰</span>
            <span class="workout__value">${workouts[len].elevationGain}</span>
            <span class="workout__unit">m</span>
          </div>
        </li>
      </ul>`
    }

    form.insertAdjacentHTML('afterend',html);
}



let type = inputType.value;
inputType.addEventListener('change', function () {
  type = inputType.value;
  if (inputType.value === 'cycling') {
    ele.classList.remove('form__row--hidden');
    cad.classList.add('form__row--hidden');
  } else {
    cad.classList.remove('form__row--hidden');
    ele.classList.add('form__row--hidden');
  }
});

function setLocalStorage() {
  localStorage.setItem('toatlWorkouts', JSON.stringify(toatlWorkouts));
}

function getlocalStorage() {
  const storedItems = localStorage.getItem('toatlWorkouts');

  const itemsArray = storedItems ? JSON.parse(storedItems) : [];

  itemsArray.forEach(item => {
    const single = Object.assign({}, item);
    const single2=[single];
    console.log(single2);
    renderWorkOuts(single2);
  });
}
document.addEventListener('DOMContentLoaded', function() {
  getlocalStorage();
});

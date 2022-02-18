import './css/styles.css';
import { fetchCountries } from './js/fetchContries';

import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';
Notiflix.Notify.init({
  position: 'center-top',
  distance: '50px',
});

const DEBOUNCE_DELAY = 300;

const inputRef = document.querySelector('#search-box');
const listRef = document.querySelector('.country-list');
const InfoRef = document.querySelector('.country-info');

inputRef.addEventListener('input', debounce(onSearch, DEBOUNCE_DELAY));

function clearInput() {
  listRef.innerHTML = '';
  InfoRef.innerHTML = '';
}

function onSearch(evt) {
  evt.preventDefault();
  const name = inputRef.value.trim();
  if (name) {
    return fetchCountries(name).then(createMarcup).catch(onError)
  } else {
    clearInput()
  }
}

function createMarcup(countries) {
  // console.log(countries);
    clearInput()

  if (countries.length > 10) {
    Notiflix.Notify.info("Too many matches found. Please enter a more specific name.");
    return
  }
  if (countries.length >= 2 && countries.length <= 10) {
    listRef.innerHTML = renderCountriesList(countries);
  }
  if (countries.length === 1) {
    InfoRef.innerHTML = renderCountriesInfo(countries);
  }
}

function renderCountriesList(countries) {
  return countries
    .map(({ flags, name }) => {
        return `<div>
                  <img src="${flags.svg}" alt="Flag of ${name.common}" width="80">
                  <p>${name.common}</p>
                </div>`;
    }).join('');
}

function renderCountriesInfo(countries) {
  return countries
    .map(({ name, flags, capital, population, languages }) => {
      return `<div>
                <div>
                  <img src="${flags.svg}" alt="Flag of ${name.common}" width="200">
                  <h1>${name.common}</h1>
                </div> 
                <p><b>Capital</b>: ${capital}</p>
                <p><b>Population</b>: ${population}</p>
                <p><b>Languages</b>: ${Object.values(languages).join(', ')}</p>
                </div>`;
    }).join('');
}

function onError() {
    Notiflix.Notify.failure('Oops, there is no country with that name.');
    clearInput()
}
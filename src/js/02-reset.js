'use strict';
//EVENTS

//Event button reset

const btnReset = document.querySelector('.js-btn-reset');

function handleClickReset(event) {
  event.preventDefault();
  inputAnime.value = '';
  resultsList.innerHTML = '';
  favoriteList.innerHTML = '';
  localStorage.removeItem('favorites_anime');
  favoritesAnimes = [];

  const liAnimes = document.querySelectorAll('.js-list-anime');
  for (const li of liAnimes){
    li.classList.remove('favorite-click');
  }
}

btnReset.addEventListener('click', handleClickReset);
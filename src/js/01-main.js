'use strict';

//VARIABLES
const resultsList = document.querySelector('.js-results-list');
const inputAnime = document.querySelector('.js-input');
const btnSearch = document.querySelector('.js-btn-search');
const favoriteList = document.querySelector('.js-favorite-list');

const btnLog = document.querySelector('.js-btn-log');

let dataAnimes = [];
let favoritesAnimes = [];

onLoadFavoritesLocalStorage();

//EVENTS

//Event button search

const handleClickSearch = (event) => {
  event.preventDefault();
  let inputValue = inputAnime.value.toLowerCase();
  getDataApi(inputValue);
};

btnSearch.addEventListener('click', handleClickSearch);

const handleClickLog = (event) => {
  event.preventDefault();
  for (const consl of dataAnimes){
    console.log(consl.title);
  }
};

btnLog.addEventListener('click', handleClickLog);


//Event click on one anime

function listenerAnimes(){
  const liAnimes = document.querySelectorAll('.js-list-anime');
  for (const li of liAnimes){
    li.addEventListener('click', handleClickAddFavorite);
  }

  const titlesAnimes = document.querySelectorAll('.js-title-anime');
  for (const h3 of titlesAnimes){
    h3.addEventListener('click', handleClickAddFavorite);
  }
}


//findIndex si se encuentra ya en el array de favoritesAnimes te devuelve la posición y sino te devuelve -1

//El método splice() cambia el contenido de un array eliminando elementos existentes y/o agregando nuevos elementos.
//splice(la posición inicial desde la que borramos,cuántos elementos queremos borrar)

function handleClickAddFavorite (event) {
  const idSelected = parseInt(event.currentTarget.id);
  const animeFound = dataAnimes.find((anime)=> anime.mal_id === idSelected);

  const favoriteFound = favoritesAnimes.findIndex((fav)=> fav.mal_id === idSelected);
  if(favoriteFound === -1){
    favoritesAnimes.push(animeFound);
  }
  if(favoriteFound >= 0){
    favoritesAnimes.splice(favoriteFound,1);
  }

  localStorage.setItem('favorites_anime', JSON.stringify(favoritesAnimes));
  renderAnime();
  renderFavoriteAnime();
}


//Event click on one trash

// function listenerFavorites(){
//   const liAnimes = document.querySelectorAll('.js-list-favorite');
//   for (const li of liAnimes){
//     li.addEventListener('click', handleClickRemoveFavorite);
//   }
// }

function handleClickRemoveFavorite(id) {
  const idSelected = parseInt(id);

  const favoriteFoundIndex = favoritesAnimes.findIndex((fav)=> fav.mal_id === idSelected);
  if(favoriteFoundIndex >= 0){
    favoritesAnimes.splice(favoriteFoundIndex,1);
  }

  localStorage.setItem('favorites_anime', JSON.stringify(favoritesAnimes));
  const liAnimes = document.querySelectorAll('.js-list-anime');
  for (const li of liAnimes){
    if (parseInt(li.id) === idSelected){
      li.classList.remove('favorite-click');
    }
  }
  const titlesAnimes = document.querySelectorAll('.js-title-anime');
  for (const h3 of titlesAnimes){
    if (parseInt(h3.id) === idSelected){
      h3.classList.remove('favorite-click-text');
    }
  }
  renderFavoriteAnime();
}

//FUNCTIONS

//Function renderAnime (to paint the anime in results)

function renderAnime() {
  let html = '';
  let classFavorite = '';
  let classColorText ='';

  for (const oneAnime of dataAnimes) {
    let imageUrl = animeImage(oneAnime);

    const favoriteFoundIndex = favoritesAnimes.findIndex((fav)=> oneAnime.mal_id === fav.mal_id);

    if(favoriteFoundIndex !== -1){
      classFavorite = 'favorite-click';
      classColorText ='favorite-click-text';
    }
    else{
      classFavorite = '';
      classColorText ='';
    }

    html += ` <li class="js-list-anime anime__results-list ${classFavorite}" id="${oneAnime.mal_id}">`;
    html += ` <div class="js-container-anime anime__results-list-container">`;
    html += ` <h3 class="js-title-anime anime__results-list-title ${classColorText }" id="${oneAnime.mal_id}">${oneAnime.title}</h3>`;
    html += ` <img class="anime__results-list-image" src="${imageUrl}" alt="Portada de la serie de anime ${oneAnime.title}" title="Portada de la serie de anime ${oneAnime.title}"/>`;
    html += `<p>${oneAnime.broadcast.time}</p>`;
    html += `</div></li>`;
  }
  resultsList.innerHTML = html;
  listenerAnimes();
}

//Function animeImage (to change the images that are "MAL" to "TV")

function animeImage(data) {
  if (
    data.images.jpg.image_url ===
    'https://cdn.myanimelist.net/img/sp/icon/apple-touch-icon-256.png'
  ) {
    return 'https://via.placeholder.com/210x295/ffffff/666666/?text=TV';
  } else {
    return data.images.jpg.image_url;
  }
}

//Function renderFavoriteAnime (to paint the anime in favorites)

function renderFavoriteAnime(){
  let html = '';

  for (const oneAnimeFavorite of favoritesAnimes) {
    let imageUrl = animeImage(oneAnimeFavorite);

    html += ` <li class="js-list-favorite anime__favorite-list" id="${oneAnimeFavorite.mal_id}"> <div class="anime__favorite-list-container">`;
    html += ` <div class="js-container-anime anime__favorite-list-container-li">`;
    html += `<h3 class="anime__favorite-list-title"  id="${oneAnimeFavorite.mal_id}">${oneAnimeFavorite.title}</h3>`;
    html += ` <img class="anime__favorite-list-image" src="${imageUrl}" alt="Portada de la serie de anime ${oneAnimeFavorite.title}" title="Portada de la serie de anime ${oneAnimeFavorite.title}"/></div>`;
    html += `<div onclick="handleClickRemoveFavorite('${oneAnimeFavorite.mal_id}')"><i class="fa-solid fa-trash-can icon"></i></div>`;
    html += `</div></li>`;
  }

  favoriteList.innerHTML = html;
}


//Function loadAnimesLocalStorage (Carga los datos que hay en el localStorage en favoritos y si el array del localStorage esta vacío no carga nada )

//You can use the JavaScript Array.isArray() method to check whether an object (or a variable) is an array or not. This method returns true if the value is an array; otherwise returns false.

function onLoadFavoritesLocalStorage()
{
  favoritesAnimes = JSON.parse(localStorage.getItem('favorites_anime'));
  if (!Array.isArray(favoritesAnimes)) {
    favoritesAnimes = [];
  }
  renderFavoriteAnime();
  getDataApi('');
}



//TO OBTAIN DATA OF THE API

function getDataApi(filterAnime) {
  fetch(
    'https://api.jikan.moe/v4/anime?q='+filterAnime
  )
    .then((response) => response.json())
    .then((data) => {
      dataAnimes = data.data;
      renderAnime();
    });
}

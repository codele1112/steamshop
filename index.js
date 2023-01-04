const BASE_URL = "https://steam-api-dot-cs-platform-306304.et.r.appspot.com";
const $ = document.querySelector.bind(document);
const btn = document.getElementsByClassName("btn");
let currentGenre = "";

const fetchApi = async (endpoint, pathQueries = {}) => {
  let uri = `${BASE_URL}${endpoint}`;

  if (Object.keys(pathQueries).length) {
    const queriesStr = convertToString(pathQueries);
    uri = uri + "?" + queriesStr;
  }

  try {
    const res = await fetch(uri);
    const json = await res.json();
    return { status: 200, result: json };
  } catch (err) {
    return { status: 500, message: `An error occured during fetch ${uri}` };
  }
};

const convertToString = (obj) => {
  let queriesStr = [];

  for (let prop in obj) {
    queriesStr.push(prop + "=" + obj[prop]);
  }

  return queriesStr.join("&");
};

/**
 * @API genres
 */
const genres = async () => {
  return new Promise(async (resolve, reject) => {
    const endpoint = "/genres";
    const data = await fetchApi(endpoint);
    if (data.status === 200) {
      return resolve(data.result.data);
    }

    reject(data);
  });
};

/**
 * @Function loadGames
 */
const loadGames = async (genre, page = 1) => {
  const endpoint = "/games";
  const pathQueries = { genres: genre };
  currentGenre = genre;
  if (page > 1) {
    pathQueries.page = page;
  }

  const gamesOfGenreData = await fetchApi(endpoint, pathQueries);
  console.log("gamesOfGenre", gamesOfGenreData);

  if (gamesOfGenreData.status === 500) {
    return { status: 500, message: `An error occured during fetch ${uri}` };
  }

  $("#currentPage").innerText = gamesOfGenreData.result.page;

  const displayGame = $("#game-list");
  clearScreen(displayGame);
  gamesOfGenreData.result.data.forEach((game) => {
    const boxGame = document.createElement("div");

    boxGame.innerHTML = `<div onclick="detailGames('${game.appid}')" class="box-game">
            <img src="${game.header_image}" class="game-img">
            <div class ="infor-game">
              <a href="javascript:void(0)" onclick="detailGames(${game.appid})">${game.name}</a>
              <div>$${game.price}</div>
            </div>
          </div>`;
    displayGame.appendChild(boxGame);
  });
};

/**
 *
 * @Function detailGames
 */

const detailGames = async (appid) => {
  const endpoint = `/single-game/${appid}`;
  const gameDetail = await fetchApi(endpoint);

  if (gameDetail.status == 500) {
    console.error(gameDetail);
  }

  console.log(gameDetail);
  const infor = gameDetail.result.data;
  console.log(infor);

  $(".pagination").classList.add("hidden");

  const displayDetailGame = $("#game-list");

  displayDetailGame.innerHTML = "";
  const gameInfor = document.createElement("div");
  gameInfor.innerHTML = `<div>
            <button class="back" onclick ="main()"> << BACK </button>
            <div class="discribe-game">
            <img src="${infor.header_image}" class="img-detail">
             <div class="name-game">${infor.name}</div>
             <div class="description">${infor.description}</div>
            <div class="more-info">
               <span>Developer: ${infor.developer}</span>
               <span>Average playtime: ${infor.average_playtime}</span>
               <span>Price: $${infor.price}</span>
             </div>
             </div>
           </div>`;
  displayDetailGame.appendChild(gameInfor);
};

const clearScreen = (el) => (el.innerHTML = "");

const nextPage = () => {
  const currentPage = parseInt($("#currentPage").textContent);

  const nextPage = currentPage + 1;

  if (currentGenre) {
    loadGames(currentGenre, nextPage);
  } else {
    const searchInput = $(".search-input");
    const searchText = searchInput.value;
    search(searchText, nextPage);
  }
};
const prevPage = () => {
  const currentPage = parseInt($("#currentPage").textContent);

  const prevPage = currentPage - 1;

  if (currentGenre) {
    loadGames(currentGenre, prevPage);
  } else {
    const searchInput = $(".search-input");
    const searchText = searchInput.value;
    search(searchText, prevPage);
  }
};

const search = async (searchText, page = 1) => {
  const endpoint = "/games";
  const pathQueries = { q: searchText };
  if (page > 1) {
    pathQueries.page = page;
  }
  const gamesOfGenreData = await fetchApi(endpoint, pathQueries);
  console.log("search result", gamesOfGenreData);

  if (gamesOfGenreData.status === 500) {
    return { status: 500, message: `An error occured during fetch ${uri}` };
  }

  $("#currentPage").innerText = gamesOfGenreData.result.page;

  const displayGame = $("#game-list");
  clearScreen(displayGame);
  gamesOfGenreData.result.data.forEach((game) => {
    const boxGame = document.createElement("div");

    boxGame.innerHTML = `<div onclick="detailGames('${game.appid}')" class="box-game">
            <img src="${game.header_image}" class="game-img">
            <div class ="infor-game">
              <a href="javascript:void(0)" onclick="detailGames(${game.appid})">${game.name}</a>
              <div>$${game.price}</div>
            </div>
          </div>`;
    displayGame.appendChild(boxGame);
  });
};

const initSearch = () => {
  const searchInput = $(".search-input");
  const searchBtn = $(".search-btn");
  searchBtn.addEventListener("click", async function () {
    console.log("search btn clicked!");
    const searchText = searchInput.value;
    console.log("searchText", searchText);
    await search(searchText);
  });

  searchInput.addEventListener("keypress", async function (e) {
    if (e.keyCode === 13) {
      // search here
      console.log("search btn clicked!");
      const searchText = searchInput.value;
      console.log("searchText", searchText);
      await search(searchText);
    }
  });
};

const initFeature = async () => {
  const endpoint = "/features";
  const gamesOfFeature = await fetchApi(endpoint);
  console.log(gamesOfFeature);

  if (gamesOfFeature.status === 500) {
    return { status: 500, message: `An error occured during fetch ${uri}` };
  }

  const displayGame = $("#game-list");
  clearScreen(displayGame);
  gamesOfFeature.result.data.forEach((game) => {
    const boxGame = document.createElement("div");

    boxGame.innerHTML = `<div onclick="detailGames('${game.appid}')" class="box-game">
            <img src="${game.header_image}" class="game-img">
            <div class ="infor-game">
              <a href="javascript:void(0)" onclick="detailGames(${game.appid})">${game.name}</a>
              <div>$${game.price}</div>
            </div>
          </div>`;
    displayGame.appendChild(boxGame);
  });
};

/**
 * Function main -- excute when script loaded
 */
const main = async () => {
  $(".pagination").classList.remove("hidden");

  initSearch();
  initFeature();
  try {
    const genresList = await genres();
    const ulGenres = $(".genres-list");
    ulGenres.innerHTML = "";
    genresList.forEach((item) => {
      const li = document.createElement("li");

      li.innerHTML = `<li>
      <button class ="btn" onclick ="loadGames('${item.name}')"> ${item.name}</button></li>`;
      ulGenres.appendChild(li);
    });
  } catch (err) {
    $(".error").innerText = err.message;
    $(".error").classList.remove("hidden");
  }
};

main();

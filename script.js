//You can edit ALL of the code here'
const allEpisodes = getAllEpisodes();

function setup() {
  makePageForEpisodes(allEpisodes);
}

function makePageForEpisodes(episodeList) {
  const rootElem = document.getElementById("root");
  rootElem.innerHTML = ""; // Clear any existing content

  episodeList.forEach((episode) => {
    const episodeCard = createEpisodeCard(episode);
    rootElem.appendChild(episodeCard);
  });
}

function createEpisodeCard(episode) {
  const template = document.getElementById("episode-card");
  const card = template.content.cloneNode(true);

  const episodeCode = `S${String(episode.season).padStart(2, "0")}E${String(
    episode.number
  ).padStart(2, "0")}`;

  card.querySelector("[data-image]").src = episode.image.medium;
  card.querySelector(
    "[data-title]"
  ).textContent = `${episodeCode} - ${episode.name}`;
  card.querySelector(
    "[data-airdate]"
  ).textContent = `Airdate: ${episode.airdate}`;
  card.querySelector(
    "[data-airtime]"
  ).textContent = `Airtime: ${episode.airtime}`;
  card.querySelector(
    "[data-runtime]"
  ).textContent = `Runtime: ${episode.runtime} minutes`;
  card.querySelector("[data-summary]").innerHTML = episode.summary;
  card.querySelector("[data-url]").href = episode.url;

  return card;
}

//search functionality
const searchBox = document.getElementById("search-box");
let searchFunction = searchBox.addEventListener("keyup", function () {

  //clear the sections.
  document.querySelector("section").innerHTML = "";

  //user input is the value of the search input box
  let userInput = searchBox.value;
  console.log(userInput);

  let filteredItems = allEpisodes.filter(function (episodes) {
    return episodes.name.toLowerCase().includes(userInput.toLowerCase()) || episodes.summary.toLowerCase().includes(userInput.toLowerCase());
  });

  makePageForEpisodes(filteredItems);
  let count = document.querySelectorAll("section").length;
  if (userInput.length > 0) {
    document.getElementById("current-search").innerHTML = `Episodes that match: ${count}/${allEpisodes.length}`;
  }
  else {
    document.getElementById("current-search").innerHTML = "";
  }
});


window.onload = setup;

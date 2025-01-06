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

//selector functionality

const selector = document.getElementById("episode-selector");

for (const option of allEpisodes) {
  let newOption = document.createElement("option");
  newOption.value = `S${(option.season).toString().padStart(2, "0")}E${(option.number).toString().padStart(2, "0")}`;
  newOption.textContent = `S${(option.season).toString().padStart(2, "0")}E${(option.number).toString().padStart(2, "0")} - ${option.name}`;
  selector.appendChild(newOption);
}

//change is the appropriate event in this case to listen to for select
selector.addEventListener("change", function () {
  for (const episode of allEpisodes) {
    document.querySelector("section").id = `S${(episode.season).toString().padStart(2, "0")}E${(episode.number).toString().padStart(2, "0")}`;
    if (selector.value === document.querySelector("section").id) {
      document.querySelector("section").scrollIntoView();
    }

  }


}
);

window.onload = setup;

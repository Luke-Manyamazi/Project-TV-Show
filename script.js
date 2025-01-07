//You can edit ALL of the code here'
const allEpisodes = getAllEpisodes();

function setup() {
  makePageForEpisodes(allEpisodes);
  setupSearch();
  setupSelector();
  setupClearSelection();
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

function setupSearch() {
  const searchBox = document.getElementById("search-box");
  searchBox.addEventListener("keyup", function () {
    const userInput = searchBox.value.toLowerCase();
    const filteredItems = allEpisodes.filter(
      (episode) =>
        episode.name.toLowerCase().includes(userInput) ||
        episode.summary.toLowerCase().includes(userInput)
    );
    makePageForEpisodes(filteredItems);
    const count = filteredItems.length;
    document.getElementById("current-search").textContent =
      userInput.length > 0
        ? `Episodes that match: ${count}/${allEpisodes.length}`
        : "";
  });
}

function setupSelector() {
  const selector = document.getElementById("episode-selector");

  // Add default option
  const defaultOption = document.createElement("option");
  defaultOption.value = "";
  defaultOption.textContent = "Select an episode";
  selector.appendChild(defaultOption);

  allEpisodes.forEach((episode) => {
    const episodeCode = `S${String(episode.season).padStart(2, "0")}E${String(
      episode.number
    ).padStart(2, "0")}`;
    const option = document.createElement("option");
    option.value = episodeCode;
    option.textContent = `${episodeCode} - ${episode.name}`;
    selector.appendChild(option);
  });

  selector.addEventListener("change", function () {
    const selectedValue = selector.value;
    if (selectedValue === "") {
      makePageForEpisodes(allEpisodes); // Show all episodes
    } else {
      const selectedEpisode = allEpisodes.find((episode) => {
        const episodeCode = `S${String(episode.season).padStart(
          2,
          "0"
        )}E${String(episode.number).padStart(2, "0")}`;
        return episodeCode === selectedValue;
      });
      makePageForEpisodes([selectedEpisode]); // Show only the selected episode
    }
  });
}

function setupClearSelection() {
  const clearButton = document.getElementById("clear-selection");
  clearButton.addEventListener("click", function () {
    document.getElementById("episode-selector").value = "";
    makePageForEpisodes(allEpisodes); // Show all episodes
  });
}

window.onload = setup;

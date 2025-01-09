let allEpisodes = [];
let allTVShows = [];
let showID = new URLSearchParams(window.location.search).get("showID") || 82;
const episodeCache = {};

async function setup() {
  try {
    await fetchTVShows();
    await fetchEpisodes(showID);
    makePageForEpisodes(allEpisodes);
    setupSearch();
    setupSelector();
    setupClearSelection();
  } catch (error) {
    displayError(error);
  }
}

async function fetchTVShows() {
  if (allTVShows.length > 0) {
    return; // Shows already fetched
  }
  const response = await fetch("https://api.tvmaze.com/shows");
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  allTVShows = await response.json();
  allTVShows.sort((a, b) =>
    a.name.localeCompare(b.name, undefined, { sensitivity: "base" })
  );
  setupTVShowSelector();
}

async function fetchEpisodes(showID) {
  if (episodeCache[showID]) {
    allEpisodes = episodeCache[showID]; // Use cached episodes
    makePageForEpisodes(allEpisodes);
    populateEpisodeSelector(allEpisodes);
    return;
  }
  const response = await fetch(
    `https://api.tvmaze.com/shows/${showID}/episodes`
  );
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  allEpisodes = await response.json();
  episodeCache[showID] = allEpisodes; // Cache the episodes
  makePageForEpisodes(allEpisodes);
  populateEpisodeSelector(allEpisodes);
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
  if (!episode.season || !episode.number) {
    console.error("Episode data is missing season or number:", episode);
    return document.createElement("div"); // Return an empty div to avoid breaking the layout
  }

  const template = document.getElementById("episode-card");
  const card = template.content.cloneNode(true);

  const episodeCode = `S${String(episode.season).padStart(2, "0")}E${String(
    episode.number
  ).padStart(2, "0")}`;

  card.querySelector("[data-image]").src = episode.image
    ? episode.image.medium
    : "";
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

function populateEpisodeSelector(episodes) {
  const selector = document.getElementById("episode-selector");
  selector.innerHTML = ""; // Clear existing options

  // Add default option
  const defaultOption = document.createElement("option");
  defaultOption.value = "";
  defaultOption.textContent = "Select an episode";
  selector.appendChild(defaultOption);

  episodes.forEach((episode) => {
    const episodeCode = `S${String(episode.season).padStart(2, "0")}E${String(
      episode.number
    ).padStart(2, "0")}`;
    const option = document.createElement("option");
    option.value = episodeCode;
    option.textContent = `${episodeCode} - ${episode.name}`;
    selector.appendChild(option);
  });
}

function setupTVShowSelector() {
  const tvSelector = document.getElementById("tv-show-selector");

  // Add default option
  const defaultOption = document.createElement("option");
  defaultOption.value = "";
  defaultOption.textContent = "Select a TV Show";
  tvSelector.appendChild(defaultOption);

  allTVShows.sort((a, b) => a.name.localeCompare(b.name));

  allTVShows.forEach((tvShow) => {
    const tvOption = document.createElement("option");
    tvOption.value = tvShow.id;
    tvOption.textContent = `${tvShow.name}`;
    tvSelector.appendChild(tvOption);
  });

  tvSelector.addEventListener("change", async function () {
    const selectedValue = tvSelector.value;
    if (selectedValue === "") {
      makePageForEpisodes(allEpisodes); // Show all episodes
    } else {
      showID = parseInt(selectedValue);
      await fetchEpisodes(showID);
      setupSelector(); // Ensure the episode selector is updated
    }
  });
}

function setupClearSelection() {
  const clearButton = document.getElementById("clear-selection");
  clearButton.addEventListener("click", function () {
    document.getElementById("episode-selector").value = "";
    document.getElementById("search-box").value = "";
    document.getElementById("current-search").textContent = "";
    makePageForEpisodes(allEpisodes); // Show all episodes
  });
}

function displayError(error) {
  alert(`Error: ${error.message}`);
}

window.onload = setup;

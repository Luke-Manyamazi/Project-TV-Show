let allTVShows = [];
let currentPage = 1;
const showsPerPage = 16; // 2 rows * 8 columns

async function setup() {
  try {
    await fetchTVShows();
    displayShowsListing();
    setupShowSearch();
    setupPagination();
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
}

function displayShowsListing() {
  const showsListing = document.getElementById("shows-listing");
  showsListing.innerHTML = ""; // Clear any existing content

  const startIndex = (currentPage - 1) * showsPerPage;
  const endIndex = startIndex + showsPerPage;
  const showsToDisplay = allTVShows.slice(startIndex, endIndex);

  showsToDisplay.forEach((show) => {
    const showCard = createShowCard(show);
    showsListing.appendChild(showCard);
  });

  updatePageInfo();
}

function createShowCard(show) {
  const template = document.getElementById("show-card");
  const card = template.content.cloneNode(true);

  const showImage = card.querySelector("[data-show-image]");
  showImage.src = show.image ? show.image.medium : "";
  showImage.alt = show.name;
  showImage.addEventListener("click", () => {
    window.location.href = `index.html?showID=${show.id}`;
  });

  card.querySelector("[data-show-title]").textContent = show.name;
  card.querySelector(
    "[data-show-genres]"
  ).textContent = `Genres: ${show.genres.join(", ")}`;
  card.querySelector(
    "[data-show-status]"
  ).textContent = `Status: ${show.status}`;
  card.querySelector(
    "[data-show-rating]"
  ).textContent = `Rating: ${show.rating.average}`;
  card.querySelector(
    "[data-show-runtime]"
  ).textContent = `Runtime: ${show.runtime} minutes`;

  return card;
}

function setupShowSearch() {
  const showSearchBox = document.getElementById("show-search-box");
  showSearchBox.addEventListener("keyup", function () {
    const userInput = showSearchBox.value.toLowerCase();
    const filteredShows = allTVShows.filter(
      (show) =>
        show.name.toLowerCase().includes(userInput) ||
        show.genres.join(", ").toLowerCase().includes(userInput) ||
        show.summary.toLowerCase().includes(userInput)
    );
    currentPage = 1; // Reset to first page on search
    displayFilteredShows(filteredShows);
  });
}

function displayFilteredShows(filteredShows) {
  const showsListing = document.getElementById("shows-listing");
  showsListing.innerHTML = ""; // Clear any existing content

  const startIndex = (currentPage - 1) * showsPerPage;
  const endIndex = startIndex + showsPerPage;
  const showsToDisplay = filteredShows.slice(startIndex, endIndex);

  showsToDisplay.forEach((show) => {
    const showCard = createShowCard(show);
    showsListing.appendChild(showCard);
  });

  updatePageInfo(filteredShows.length);
}

function updatePageInfo(totalShows) {
  const pageInfo = document.getElementById("page-info");
  const totalPages = Math.ceil(totalShows / showsPerPage);
  pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;
}

function setupPagination() {
  document.getElementById("prev-page").addEventListener("click", () => {
    if (currentPage > 1) {
      currentPage--;
      displayShowsListing();
    }
  });

  document.getElementById("next-page").addEventListener("click", () => {
    if (currentPage * showsPerPage < allTVShows.length) {
      currentPage++;
      displayShowsListing();
    }
  });
}

function updatePageInfo() {
  const pageInfo = document.getElementById("page-info");
  const totalPages = Math.ceil(allTVShows.length / showsPerPage);
  pageInfo.textContent = `Page ${currentPage} of ${totalPages}`;
}

function displayError(error) {
  alert(`Error: ${error.message}`);
}

window.onload = setup;

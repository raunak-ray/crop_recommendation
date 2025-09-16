// ------------------------
// season.js
// ------------------------

// Get season from URL query parameter, default to "Summer"
const urlParams = new URLSearchParams(window.location.search);
let season = urlParams.get('season') || "Summer";

// Normalize season name to match JSON keys
season = season.trim().toLowerCase();
switch (season) {
  case 'summer': season = 'Summer'; break;
  case 'monsoon': season = 'Monsoon'; break;
  case 'autumn': season = 'Autumn'; break;
  case 'pre-winter': season = 'Pre-winter'; break;
  case 'winter': season = 'Winter'; break;
  case 'spring': season = 'Spring'; break;
  default: season = 'Summer';
}

// Update header
document.getElementById('season-title').innerText = `${season} Crops`;
document.getElementById('season-desc').innerText = `Crops suitable for ${season} season 🌾`;

let allCrops = [];   // all crops for current season
let filteredCrops = []; // after search
let itemsPerPage = 8;
let currentIndex = 0;

// Load crops.json
fetch(CROPS_JSON_URL)
  .then(res => res.json())
  .then(data => {
    allCrops = data[season] || [];
    filteredCrops = [...allCrops];

    document.getElementById("loader").style.display = "none"; // hide loader
    renderCrops();
  })
  .catch(err => console.error(err));

// Render crops
function renderCrops() {
  const container = document.getElementById('crops-container');
  const slice = filteredCrops.slice(currentIndex, currentIndex + itemsPerPage);

  if (currentIndex === 0) container.innerHTML = '';

  if (slice.length === 0 && currentIndex === 0) {
    container.innerHTML = `<p style="color:#CFD8DC;">No crops found.</p>`;
    document.getElementById("loadMoreBtn").style.display = "none";
    return;
  }

  slice.forEach((crop, i) => {
    const card = document.createElement('div');
    card.classList.add('card');
    card.style.transitionDelay = `${i * 0.1}s`;

    card.innerHTML = `
      <img src="${crop.img}" alt="${crop.name}" class="crop-img">
      <h2>${crop.name}</h2>
      <p>${crop.description}</p>
    `;

    // On click -> redirect to Flask crop_details route with season param
    card.onclick = () => {
      window.location.href =
        `/crop/${encodeURIComponent(crop.name)}?season=${encodeURIComponent(season)}&source=season`;
    };

    container.appendChild(card);
    requestAnimationFrame(() => card.classList.add('show'));
  });

  currentIndex += itemsPerPage;

  // Show/Hide Load More
  document.getElementById("loadMoreBtn").style.display = currentIndex < filteredCrops.length ? "inline-block" : "none";
}

//back button


// Load More Button
document.getElementById("loadMoreBtn").addEventListener('click', renderCrops);

// ------------------------
// Search functionality
// ------------------------
const searchBox = document.getElementById('search-box');
searchBox.addEventListener('input', function() {
  const query = searchBox.value.toLowerCase();
  filteredCrops = allCrops.filter(crop => crop.name.toLowerCase().includes(query));
  currentIndex = 0;
  renderCrops();
});

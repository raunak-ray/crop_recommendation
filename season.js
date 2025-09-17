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

let cropsData = []; // will hold the crops for current season

// Load crops.json
fetch('crops.json')
  .then(response => response.json())
  .then(data => {
    cropsData = data[season] || [];
    renderCrops(cropsData);
  })
  .catch(error => console.error('Error loading crops:', error));

// Render crops to container
function renderCrops(crops) {
  const container = document.getElementById('crops-container');
  container.innerHTML = '';

  if (crops.length === 0) {
    container.innerHTML = `<p style="color: #CFD8DC; font-size: 1.1rem;">No crops available for ${season}.</p>`;
    return;
  }

  crops.forEach(crop => {
    const card = document.createElement('div');
    card.classList.add('card');

    card.innerHTML = `
      <img src="${crop.img}" alt="${crop.name}" class="crop-img">
      <h2>${crop.name}</h2>
      <p>${crop.description}</p>
    `;

    container.appendChild(card);
  });
}

// ------------------------
// Search functionality
// ------------------------
const searchBox = document.getElementById('search-box');
searchBox.addEventListener('input', function() {
  const query = searchBox.value.toLowerCase();
  const filteredCrops = cropsData.filter(crop =>
    crop.name.toLowerCase().includes(query)
  );
  renderCrops(filteredCrops);
});

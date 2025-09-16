// Wait for DOM
document.addEventListener("DOMContentLoaded", () => {
  fetch(CROPS_JSON_URL)
    .then(res => res.json())
    .then(data => {
      let crop = null;
      if (data[season]) {
        crop = data[season].find(
          c => c.name.toLowerCase() === cropName.toLowerCase()
        );
      }

      if (crop) {
        // Hide loader
        document.getElementById("loader").style.display = "none";

        // Fill data
        document.getElementById("crop-title").textContent = crop.name;
        document.getElementById("crop-subtitle").textContent = "Detailed info 🌿";
        document.getElementById("crop-img").src = crop.img.trim();
        document.getElementById("crop-img").alt = crop.name;
        document.getElementById("crop-name").textContent = crop.name;
        document.getElementById("crop-description").textContent = crop.description;
        document.getElementById("crop-soil").textContent = crop.soil;
        document.getElementById("crop-ph").textContent = crop.ph;
        document.getElementById("crop-rainfall").textContent = crop.rainfall;
        document.getElementById("crop-diseases").textContent = crop.diseases;
        document.getElementById("crop-medicine").textContent = crop.medicine;
        document.getElementById("crop-season").textContent = crop.season;

        // Show with fade-in
        const details = document.getElementById("crop-details");
        details.style.display = "block";
        requestAnimationFrame(() => details.classList.add("show"));
      } else {
        document.getElementById("loader").innerHTML = "<p>❌ Crop not found.</p>";
      }
    })
    .catch(err => {
      console.error("Error fetching crop details:", err);
      document.getElementById("loader").innerHTML = "<p>⚠️ Failed to load crop data.</p>";
    });
});

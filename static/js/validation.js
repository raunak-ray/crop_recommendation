// validation.js
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("cropForm");

  form.addEventListener("submit", function (event) {
    const nitrogen = document.getElementById("nitrogen").value.trim();
    const phosphorus = document.getElementById("phosphorus").value.trim();
    const potassium = document.getElementById("potassium").value.trim();
    const temperature = document.getElementById("temperature").value.trim();
    const humidity = document.getElementById("humidity").value.trim();
    const ph = document.getElementById("ph").value.trim();
    const rainfall = document.getElementById("rainfall").value.trim();

    let isValid = true;
    let errorMsg = "";

    // Basic checks
    if (!nitrogen || !phosphorus || !potassium || !temperature || !humidity || !ph || !rainfall) {
      isValid = false;
      errorMsg = "⚠️ Please fill all fields before submitting.";
    }

    // Numeric checks
    const numericFields = { nitrogen, phosphorus, potassium, temperature, humidity, ph, rainfall };
    for (const [key, value] of Object.entries(numericFields)) {
      if (isNaN(value)) {
        isValid = false;
        errorMsg = `⚠️ ${key.toUpperCase()} must be a valid number.`;
        break;
      }
    }

    if (!isValid) {
      event.preventDefault();
      alert(errorMsg);
    }
  });
});

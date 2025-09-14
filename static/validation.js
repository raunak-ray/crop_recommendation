document.addEventListener("DOMContentLoaded", function () {
    const form = document.querySelector(".form");

    form.addEventListener("submit", function (e) {
        const fields = ['N', 'P', 'K', 'temperature', 'humidity', 'ph', 'rainfall'];
        let errors = [];

        fields.forEach(field => {
            const input = form[field];
            const value = parseFloat(input.value);

            // Validation rules
            if (['N','P','K'].includes(field) && value < 0) {
                errors.push(`${field} must be non-negative.`);
                input.value = '';  // reset field
            }
            if (field === 'humidity' && (value < 0 || value > 100)) {
                errors.push("Humidity must be between 0 and 100.");
                input.value = '';
            }
            if (field === 'ph' && (value < 0 || value > 14)) {
                errors.push("pH must be between 0 and 14.");
                input.value = '';
            }
            if (field === 'temperature' && (value < -10 || value > 60)) {
                errors.push("Temperature must be between -10°C and 60°C.");
                input.value = '';
            }
            if (field === 'rainfall' && value < 0) {
                errors.push("Rainfall must be non-negative.");
                input.value = '';
            }
        });

        if (errors.length > 0) {
            e.preventDefault(); // stop form submission
            alert(errors.join("\n")); // show errors
        }
    });
});

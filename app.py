from flask import Flask, request, render_template, redirect, url_for, flash
import pickle
import pandas as pd

# Load saved model, scaler, encoder
model = pickle.load(open("crop_recommendation_model.pkl", "rb"))
scaler = pickle.load(open("minmax_scaler.pkl", "rb"))
encoder = pickle.load(open("label_encoder.pkl", "rb"))

app = Flask(__name__)
app.secret_key = "supersecretkey"  # needed for flashing messages

def validate_inputs(N, P, K, temperature, humidity, ph, rainfall):
    errors = []
    if N < 0 or P < 0 or K < 0:
        errors.append("N, P, and K must be non-negative.")
    if not (0 <= humidity <= 100):
        errors.append("Humidity must be between 0 and 100.")
    if not (0 <= ph <= 14):
        errors.append("pH must be between 0 and 14.")
    if not (-10 <= temperature <= 60):  # dataset realistic range
        errors.append("Temperature must be between -10°C and 60°C.")
    if rainfall < 0:
        errors.append("Rainfall must be non-negative.")
    return errors

def predict_crop(N, P, K, temperature, humidity, ph, rainfall):
    input_df = pd.DataFrame([[N, P, K, temperature, humidity, ph, rainfall]],
                            columns=['N', 'P', 'K', 'temperature', 'humidity', 'ph', 'rainfall'])
    input_scaled = scaler.transform(input_df)
    prediction_encoded = model.predict(input_scaled)
    prediction = encoder.inverse_transform(prediction_encoded)
    return prediction[0]

@app.route("/", methods=["GET", "POST"])
def home():
    if request.method == "POST":
        try:
            values = [float(request.form[i]) for i in ['N','P','K','temperature','humidity','ph','rainfall']]
            errors = validate_inputs(*values)

            if errors:
                for e in errors:
                    flash(e, "error")
                return redirect(url_for("home"))

            result = predict_crop(*values)
            # redirect with prediction as query param
            return redirect(url_for("home", prediction=result))

        except ValueError:
            flash("Invalid input. Please enter numeric values.", "error")
            return redirect(url_for("home"))

    # When GET request, fetch prediction from query params
    prediction = request.args.get("prediction")
    return render_template("index.html", prediction=prediction)
    

if __name__ == "__main__":
    app.run(debug=True)

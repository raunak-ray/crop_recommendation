from flask import Flask, render_template, request, redirect, url_for, flash, abort
import pickle
import pandas as pd
import os
import json

app = Flask(__name__)
app.secret_key = "supersecretkey"

# -------------------- LOAD ML MODEL --------------------
MODEL_PATH = os.path.join("static", "model")
model = pickle.load(
    open(os.path.join(MODEL_PATH, "crop_recommendation_model.pkl"), "rb")
)
scaler = pickle.load(open(os.path.join(MODEL_PATH, "minmax_scaler.pkl"), "rb"))
encoder = pickle.load(open(os.path.join(MODEL_PATH, "label_encoder.pkl"), "rb"))


# -------------------- HELPERS --------------------
def validate_inputs(N, P, K, temperature, humidity, ph, rainfall):
    errors = []
    if N < 0 or P < 0 or K < 0:
        errors.append("N, P, and K must be non-negative.")
    if not (0 <= humidity <= 100):
        errors.append("Humidity must be between 0 and 100.")
    if not (0 <= ph <= 14):
        errors.append("pH must be between 0 and 14.")
    if not (-10 <= temperature <= 60):
        errors.append("Temperature must be between -10°C and 60°C.")
    if rainfall < 0:
        errors.append("Rainfall must be non-negative.")
    return errors


def predict_crop(N, P, K, temperature, humidity, ph, rainfall):
    input_df = pd.DataFrame(
        [[N, P, K, temperature, humidity, ph, rainfall]],
        columns=["N", "P", "K", "temperature", "humidity", "ph", "rainfall"],
    )
    input_scaled = scaler.transform(input_df)
    prediction_encoded = model.predict(input_scaled)
    prediction = encoder.inverse_transform(prediction_encoded)
    return prediction[0]


# -------------------- ROUTES --------------------
@app.route("/")
def landing_page():
    """Landing page"""
    return render_template("index.html")


@app.route("/predict", methods=["GET", "POST"])
def ml_prediction():
    """ML-based crop prediction page"""
    prediction = None
    if request.method == "POST":
        try:
            values = [
                float(request.form[i])
                for i in ["N", "P", "K", "temperature", "humidity", "ph", "rainfall"]
            ]
            errors = validate_inputs(*values)
            if errors:
                for e in errors:
                    flash(e, "error")
                return redirect(url_for("ml_prediction"))  # clear POST
            prediction = predict_crop(*values)
            return redirect(url_for("ml_prediction", prediction=prediction))
        except ValueError:
            flash("Invalid input. Please enter numeric values.", "error")
            return redirect(url_for("ml_prediction"))

    prediction = request.args.get("prediction")
    return render_template("data-crop.html", prediction=prediction)


@app.route("/season")
def season_page():
    """Season selection page"""
    return render_template("season.html")


@app.route("/season/<season_name>")
def season_crops(season_name):
    """Page for a specific season (Summer, Winter, etc.)"""
    json_path = os.path.join(app.static_folder, "crops.json")
    with open(json_path, "r") as f:
        crops_data = json.load(f)

    season_name = season_name.capitalize()
    crops = crops_data.get(season_name, [])

    return render_template("season-crops.html", season=season_name, crops=crops)


@app.route("/crop/<crop_name>")
def crop_details(crop_name):
    source = request.args.get("source")  # 👈 don't force default here
    json_path = os.path.join(app.static_folder, "crops.json")
    with open(json_path, "r") as f:
        crops_data = json.load(f)

    for season, crops in crops_data.items():
        for crop in crops:
            if crop["name"].lower() == crop_name.lower():
                crop["season"] = season
                return render_template("crop-details.html", crop=crop, source=source)

    return "❌ Crop not found", 404

@app.route("/season-select")
def season_select():
    """Season selection landing page"""
    return render_template("season-select.html")


@app.route("/ml_crop/<crop_name>")
def ml_crop_details(crop_name):
    """Crop details page for ML-predicted crops"""
    json_path = os.path.join(app.static_folder, "ml_crops.json")
    with open(json_path, "r") as f:
        crops_data = json.load(f)

    crop_obj = next(
        (c for c in crops_data if c["name"].lower() == crop_name.lower()), None
    )

    if not crop_obj:
        abort(404, description="Crop not found")

    return render_template("ml-crop-details.html", crop=crop_obj)


# -------------------- MAIN --------------------
if __name__ == "__main__":
    app.run(debug=True)

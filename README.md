# Crop Recommendation System

A simple **Crop Recommendation System** built using **Flask** that predicts the most suitable crop for cultivation based on soil nutrients, weather conditions, and soil pH. The system uses a machine learning model trained with scikit-learn and provides a web interface.

---

## Features

- Predicts the best crop based on:
  - Nitrogen (N)
  - Phosphorus (P)
  - Potassium (K)
  - Temperature
  - Humidity
  - Soil pH
  - Rainfall
- Simple web interface with HTML/CSS
- Machine learning model with preprocessing using scaler and label encoder

---

## Installation and Running

1. **Clone the repository** or download it as a ZIP and extract it:
```bash
git clone <repository_url>

Open the project folder in VS Code.

Open the terminal in VS Code and install required packages manually:

pip install flask
pip install pandas
pip install numpy
pip install scikit-learn==1.6.1


Make sure the following files are in the project folder:

app.py (main Flask app)

crop_recommendation_model.pkl (trained ML model)

minmax_scaler.pkl (scaler)

label_encoder.pkl (label encoder)

templates/index.html (webpage)

static/style.css (styles)

Run the application:

python app.py


Open your browser and go to:

http://127.0.0.1:5000/

Project Structure
Crop-Recommendation-System/
│
├── app.py                      # Flask application
├── crop_recommendation_model.pkl  # Trained ML model
├── minmax_scaler.pkl           # Scaler used during training
├── label_encoder.pkl           # Label encoder
├── templates/
│   └── index.html              # Input form webpage
├── static/
│   └── style.css               # CSS styling
└── README.md                   # Project documentation

Usage

Open the web app in your browser.

Enter the values for N, P, K, temperature, humidity, pH, and rainfall.

Click Predict.

The app will display the recommended crop.

License

This project is open-source under the MIT License.


This version is **simple**, **self-contained**, and instructs the user to manually install the dependencies in the VS Code terminal.  

If you want, I can also add a **small screenshot section** in the README to make it more user-friendly. Do you want me to add that?

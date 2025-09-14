from flask import Flask, request, render_template
import pickle
import pandas as pd

# Load saved model, scaler, encoder
model = pickle.load(open("crop_recommendation_model.pkl", "rb"))
scaler = pickle.load(open("minmax_scaler.pkl", "rb"))
encoder = pickle.load(open("label_encoder.pkl", "rb"))

app = Flask(__name__)

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
        # Collect values from form
        values = [float(request.form[i]) for i in ['N','P','K','temperature','humidity','ph','rainfall']]
        result = predict_crop(*values)
        return render_template("index.html", prediction=result, values=values)
    return render_template("index.html")

if __name__ == "__main__":
    app.run(debug=True)

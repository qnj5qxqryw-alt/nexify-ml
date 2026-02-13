from flask import Flask, jsonify, request
import joblib
import os
import numpy as np

app = Flask(__name__)

model = joblib.load("models/weather_model.pkl")

@app.route("/")
def home():
     return "Welcome to the Weather Prediction API is running🚀."

@app.route("/predict", methods=["POST"])
def predict():
     data = request.get_json()

     # Extract raw features
     temperature = data["temperature"]
     humidity = data["humidity"]
     pressure = data["pressure"]
     wind_speed = data["wind_speed"]
     rain = data.get("rain", 0)

     # Rebuild engineered features
     temp_humidity = temperature * humidity
     wind_pressure = wind_speed / pressure
     heavy_rain = int(rain > 20)

     # Final feature vector (order matters)
     features = np.array([[
          temperature,
          humidity,
          pressure,
          wind_speed,
          temp_humidity
     ]])

     prediction = model.predict(features)[0]
     probability = model.predict_proba(features)[0].tolist()

     return jsonify({
          "storm_prediction": int(prediction),
          "probabilities": probability
     })

if __name__ == "__main__":
     port = int(os.environ.get("PORT", 5000))
     app.run(host="0.0.0.0", port=port)
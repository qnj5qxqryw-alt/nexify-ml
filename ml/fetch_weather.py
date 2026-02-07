from datetime import datetime
from meteostat import daily, stations   
import pandas as pd
import os

# Use the station ID for New York City (72505) - you can change this to any location you want
ID = "72505"

# Define date range (10 years of data)
start = datetime(2014, 1, 1)
end = datetime(2024, 1, 1)

# Fetch daily weather data
data = daily('72505', start, end)
data = data.fetch()

# Check if data is empty
if data is None or data.empty:
    print("❌ No data found! Try a different location.")
    exit()

# If "tavg" (average temperature) is missing, calculate it from "tmin" and "tmax"
if "tavg" not in data.columns:
    data["tavg"] = (data["tmin"] + data["tmax"]) / 2

# Select only relevant columns and drop rows with missing values
available_cols = [col for col in ["tavg", "rhum", "pres", "wspd", "prcp"] if col in data.columns]
df = data[available_cols].dropna()

# Create storm label (simple rule for now)
# storm = 1 if heavy rain or stron wind
df["storm"] = ((df["prcp"] > 20 ) | (df["wspd"] > 40 )).astype(int)

# Reset index to get date as a column
df = df.reset_index()
 
# Rename columns
df.columns = ["date", "temperature", "humidity", "pressure", "wind_speed", "rain", "storm"]

# Ensure data folder exists
os.makedirs("data", exist_ok=True)

# Save CSV 
df.to_csv("data/weather.csv", index_label=False)

print("✅Weather data saved to ml/data/weather.csv")
print(df.head())

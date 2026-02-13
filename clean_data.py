import pandas as pd

# Load weather data
df = pd.read_csv("data/weather.csv", parse_dates=["date"])

print("✅Data loaded")
print(df.head())

print("\n🔍 Data info:")
print(df.info())

print("\n🧼 Missing values:")
print(df.isna().sum())

# Drop rows with missing values
df = df.dropna()

print("\n✅ Dropped missing rows")
print("Rows left:", len(df))

# Remove impossible weather values
df = df[
    (df.temperature > -50) & (df.temperature < 60) &
    (df.wind_speed >= 0) &
    (df.rain >= 0)
]

print("\n✅ Cleaned unrealistic values")

df = df.sort_values("date").reset_index(drop=True)

print("\n✅ Sorted by date")

df.to_csv("data/weather_clean.csv", index=False)
print("\n Saved cleaned data to data/weather_clean.csv")
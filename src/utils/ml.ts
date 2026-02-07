import { exec } from "child_process"
import { stdout } from "process";

export function predictStorm(raw: {
    temperature: number;
    humidity: number;
    pressure: number;
    wind_speed: number;
    rain: number;
}) {
    return new Promise((resolve, reject) => {
     
      // Engineered features
      const features = {
        ...raw,
        temp_humidity: raw.temperature * raw.humidity,
        wind_pressure: raw.wind_speed / raw.pressure,
        heavy_rain: raw.rain > 20 ? 1 : 0
      };

      const command = `python ml/predict.py "${JSON.stringify(features)}"`;

      exec(command, (error, stdout) => {
        if (error) return reject(error);
        resolve(JSON.parse(stdout.replace(/'/g,'"')));
      });
    });
}
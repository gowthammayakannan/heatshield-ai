# d:/AIML/backend/services/weather_service.py
import requests
import os
import random

class WeatherService:
    def __init__(self, api_key=None):
        self.api_key = api_key or os.getenv("OPENWEATHER_API_KEY")
        self.base_url = "https://api.openweathermap.org/data/2.5/weather"

    def get_weather(self, location=None, lat=None, lon=None):
        """
        Fetches weather data. Prioritizes (lat, lon) if provided.
        Fallback to 'location' string if coords are missing.
        """
        if not self.api_key:
            return self._get_mock_weather(location, lat, lon)
        
        try:
            params = {
                "appid": self.api_key,
                "units": "metric"
            }
            
            if lat and lon:
                params["lat"] = lat
                params["lon"] = lon
            elif location:
                params["q"] = location
            else:
                raise ValueError("Either location or (lat, lon) must be provided")

            response = requests.get(self.base_url, params=params, timeout=5)
            response.raise_for_status()
            data = response.json()
            
            # If using coords, get the city name derived by API
            city_name = data.get("name", "Unknown Location")
            
            return {
                "temperature": data["main"]["temp"],
                "humidity": data["main"]["humidity"],
                "wind_speed": data["wind"]["speed"],
                "condition": data["weather"][0]["main"],
                "location_name": city_name,
                "source": "live_api"
            }
        except Exception as e:
            print(f"Weather API Error: {e}")
            return self._get_mock_weather(location, lat, lon)

    def _get_mock_weather(self, location, lat, lon):
        """
        Generates consistent semi-random weather data.
        """
        # Seed based on whatever input we have
        if lat and lon:
            lat = float(lat) # Ensure float
            lon = float(lon) # Ensure float
            seed = int(lat * 100 + lon * 100)
            mock_location = f"GP:{round(lat,2)},{round(lon,2)}"
        else:
            seed = sum(ord(c) for c in (location or "default"))
            mock_location = location or "Test City"
            
        random.seed(seed)
        
        temp = round(random.uniform(25, 42), 1)
        humidity = round(random.uniform(30, 80), 1)
        wind = round(random.uniform(0, 15), 1)
        conditions = ["Clear", "Clouds", "Haze", "Rain"]
        condition = random.choice(conditions)
        
        return {
            "temperature": temp,
            "humidity": humidity,
            "wind_speed": wind,
            "condition": condition,
            "location_name": mock_location,
            "source": "mock_data"
        }

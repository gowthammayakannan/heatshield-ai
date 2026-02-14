# d:/AIML/backend/app.py
from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import pandas as pd
import os
import sys
from dotenv import load_dotenv

# Load environment variables
load_dotenv()
api_key = os.getenv("OPENWEATHER_API_KEY")

# Add services to path
sys.path.append(os.path.join(os.path.dirname(__file__), 'services'))
from weather_service import WeatherService
from recommendation_engine import RecommendationEngine

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}}) # Explicitly allow all origins

# Initialize Services
weather_service = WeatherService(api_key=api_key)
recommendation_engine = RecommendationEngine()

# Load Model
MODEL_PATH = os.path.join(os.path.dirname(__file__), 'ml_engine', 'model.pkl')
try:
    model = joblib.load(MODEL_PATH)
    print("ML Model loaded successfully.")
except Exception as e:
    print(f"Error loading model: {e}")
    model = None

@app.route('/', methods=['GET'])
def root():
    return """
    <h1>🔥 Heat Guardian API is Running!</h1>
    <p>The backend is active.</p>
    <p>👉 Please visit the Frontend at: <a href="http://localhost:8080">http://localhost:8080</a></p>
    """

@app.route('/api/health', methods=['GET'])
def health_check():
    status = "healthy" if model else "degraded (model missing)"
    return jsonify({"status": status, "service": "Heat Guardian API"}), 200

@app.route('/api/weather', methods=['GET'])
def get_weather():
    location = request.args.get('location')
    lat = request.args.get('lat')
    lon = request.args.get('lon')
    
    if not location and not (lat and lon):
        return jsonify({"error": "Location or (lat, lon) is required"}), 400
    
    data = weather_service.get_weather(location, lat, lon)
    return jsonify(data)

@app.route('/api/predict', methods=['POST'])
def predict():
    if not model:
        return jsonify({"error": "Prediction service unavailable"}), 503
        
    try:
        data = request.json
        inputs = data.get('inputs')
        weather_payload = data.get('weather') # Frontend might pass weather directly
        
        # Scenario 1: Frontend passed weather data (Manual mode common flow)
        weather = weather_payload 
        
        # Scenario 2: If Frontend didn't pass weather, backend should fetch it
        # (Assuming 'inputs' contains location info)
        if not weather and inputs:
            weather = weather_service.get_weather(
                location=inputs.get('city'),
                lat=inputs.get('latitude'),
                lon=inputs.get('longitude')
            )
        
        if not inputs or not weather:
            return jsonify({"error": "Missing inputs or weather data"}), 400

        # Feature Engineering (Must match training data columns)
        # Columns: ['temperature', 'humidity', 'exposure_hours', 'activity_level', 'hydration_level', 'age_group']
        
        # Create DataFrame for prediction
        features = pd.DataFrame([{
            'temperature': weather['temperature'],
            'humidity': weather['humidity'],
            'exposure_hours': inputs['exposureDuration'],
            'activity_level': inputs['activityLevel'],
            'hydration_level': inputs['hydrationLevel'],
            'age_group': inputs['ageGroup']
        }])
        
        # Predict
        risk_label = model.predict(features)[0]
        risk_probs = model.predict_proba(features)[0]
        
        # Calculate Weighted Risk Score (Severity) instead of just Confidence
        # This prevents "Extreme Risk (48%)" confusion.
        class_weights = {'low': 0.15, 'moderate': 0.45, 'high': 0.75, 'extreme': 0.95}
        weighted_score = 0
        for label, prob in zip(model.classes_, risk_probs):
            weighted_score += prob * class_weights.get(label, 0)
            
        risk_score = weighted_score
        
        # Generate Recommendations
        recommendations = recommendation_engine.generate_recommendations(risk_label, inputs, weather)
        
        # Construct Response
        response = {
            "riskCategory": risk_label,
            "riskPercentage": round(risk_score * 100, 1),
            "summary": f"Risk level is {risk_label.upper()} due to current conditions.",
            "factors": [
                {"label": "Temperature", "value": f"{weather['temperature']}°C", "severity": "high" if weather['temperature'] > 35 else "low"},
                {"label": "Humidity", "value": f"{weather['humidity']}%", "severity": "high" if weather['humidity'] > 70 else "low"}
            ],
            "recommendations": recommendations,
            "metadata": {
                "location": inputs['city'],
                "timestamp": pd.Timestamp.now().isoformat(),
                "environmentalSnapshot": f"{weather['temperature']}°C, {weather['humidity']}% Humidity"
            }
        }
        
        return jsonify(response)
        
    except Exception as e:
        print(f"Prediction Error: {e}")
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000, host='0.0.0.0')

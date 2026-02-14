# d:/AIML/backend/ml_engine/dataset_generator.py
import pandas as pd
import numpy as np
import random

def calculate_heat_index(temp_c, humidity):
    """
    Calculates Heat Index (feel-like temperature) using NOAA formula adaptation.
    """
    # Convert C to F for formula
    T = (temp_c * 9/5) + 32
    RH = humidity
    
    HI = 0.5 * (T + 61.0 + ((T-68.0)*1.2) + (RH*0.094))
    
    if HI >= 80:
        HI = -42.379 + 2.04901523*T + 10.14333127*RH - .22475541*T*RH - .00683783*T*T - .05481717*RH*RH + .00122874*T*T*RH + .00085282*T*RH*RH - .00000199*T*T*RH*RH
        
    # Convert back to C
    return (HI - 32) * 5/9

def generate_synthetic_data(n_samples=2000):
    data = []
    
    activities = ['light', 'moderate', 'heavy', 'extreme']
    hydrations = ['well', 'moderate', 'poor']
    age_groups = ['18-25', '26-35', '36-45', '46-55', '55+']
    
    for _ in range(n_samples):
        # Semi-realistic weather distribution
        temp = np.random.normal(32, 5) # Mean 32C, SD 5
        humidity = np.random.normal(60, 15) # Mean 60%, SD 15
        
        # Clamp values
        temp = max(20, min(50, temp))
        humidity = max(10, min(100, humidity))
        
        exposure = np.random.randint(1, 13) # 1 to 12 hours
        activity = np.random.choice(activities)
        hydration = np.random.choice(hydrations)
        age = np.random.choice(age_groups)
        
        # Calculate derived metrics
        hi = calculate_heat_index(temp, humidity)
        
        # Logical Risk Score Calculation (The "Ground Truth" logic)
        # Base risk from Heat Index
        score = 0
        
        if hi < 27: score += 0.1 # Safe
        elif hi < 32: score += 0.25 # Caution
        elif hi < 39: score += 0.45 # Extreme Caution (shifted down from 0.6)
        elif hi < 48: score += 0.7 # Danger
        else: score += 0.9 # Extreme Danger
        
        # Modifiers
        if activity == 'moderate': score += 0.1
        elif activity == 'heavy': score += 0.2
        elif activity == 'extreme': score += 0.35
        
        if exposure > 4: score += 0.1
        if exposure > 8: score += 0.2
        
        if hydration == 'poor': score += 0.25
        elif hydration == 'moderate': score += 0.1
        
        if age in ['46-55', '55+']: score += 0.15
        
        # Normalize score 0-1
        score = min(0.99, score)
        
        # Add some noise/randomness
        score += np.random.normal(0, 0.05)
        score = max(0, min(1, score))
        
        # Labeling
        if score < 0.4: label = 'low'
        elif score < 0.7: label = 'moderate'
        elif score < 0.85: label = 'high'
        else: label = 'extreme'
        
        data.append({
            'temperature': round(temp, 1),
            'humidity': round(humidity, 1),
            'exposure_hours': exposure,
            'activity_level': activity,
            'hydration_level': hydration,
            'age_group': age,
            'heat_index': round(hi, 1),
            'risk_score': round(score, 3),
            'risk_label': label
        })
        
    return pd.DataFrame(data)

if __name__ == "__main__":
    import os
    print("Generating synthetic dataset...")
    df = generate_synthetic_data(5000)
    
    # Ensure we save to backend/data relative to this script
    script_dir = os.path.dirname(os.path.abspath(__file__))
    output_dir = os.path.join(script_dir, '..', 'data')
    os.makedirs(output_dir, exist_ok=True)
    
    output_path = os.path.join(output_dir, "heat_stress_dataset.csv")
    df.to_csv(output_path, index=False)
    print(f"Dataset saved to {output_path}")
    print(df['risk_label'].value_counts())

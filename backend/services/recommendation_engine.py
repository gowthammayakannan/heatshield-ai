# d:/AIML/backend/services/recommendation_engine.py

class RecommendationEngine:
    def generate_recommendations(self, risk_label, inputs, weather):
        """
        Generates a list of recommendations based on risk label and specific inputs.
        """
        recs = []
        
        # 1. Base Risk Recommendations
        if risk_label == "extreme":
            recs.append({
                "title": "STOP WORK IMMEDIATELY",
                "explanation": "Conditions are life-threatening. Seek shade and cool down now.",
                "urgency": "high"
            })
        elif risk_label == "high":
            recs.append({
                "title": "Mandatory Rest Breaks",
                "explanation": "Take a 15-minute break every hour in a cool area.",
                "urgency": "high"
            })
        elif risk_label == "moderate":
            recs.append({
                "title": "Monitor Condition",
                "explanation": "Conditions are worsening. Watch for signs of fatigue.",
                "urgency": "medium"
            })
        else:
            recs.append({
                "title": "Safe to Work",
                "explanation": "Standard safety precautions apply.",
                "urgency": "low"
            })
            
        # 2. Hydration Logic
        if inputs.get("hydration_level") == "poor":
            recs.append({
                "title": "Critical Hydration Needed",
                "explanation": "You are starting dehydrated. Drink 500ml water immediately.",
                "urgency": "high"
            })
        elif weather["temperature"] > 35:
            recs.append({
                "title": "Increase Water Intake",
                "explanation": "High heat requires drinking 1 cup of water every 20 mins.",
                "urgency": "medium"
            })
            
        # 3. Activity Logic
        if inputs.get("activity_level") in ["heavy", "extreme"] and risk_label != "low":
            recs.append({
                "title": "Reduce Physical Exertion",
                "explanation": "Consider rescheduling heavy tasks to cooler hours.",
                "urgency": "high"
            })
            
        # 4. Age Logic
        if inputs.get("age_group") in ["46-55", "55+"] and risk_label in ["moderate", "high", "extreme"]:
            recs.append({
                "title": "High Vulnerability Alert",
                "explanation": "Older age groups are at higher risk. Take extra precautions.",
                "urgency": "high"
            })
            
        return recs

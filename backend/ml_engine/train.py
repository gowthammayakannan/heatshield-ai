# d:/AIML/backend/ml_engine/train.py
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import OneHotEncoder, StandardScaler
from sklearn.pipeline import Pipeline
from sklearn.metrics import classification_report
import joblib

import os

# Load Data
script_dir = os.path.dirname(os.path.abspath(__file__))
data_path = os.path.join(script_dir, '..', 'data', 'heat_stress_dataset.csv')
print(f"Loading data from {data_path}...")
try:
    df = pd.read_csv(data_path)
except FileNotFoundError:
    print("Error: Dataset not found. Run dataset_generator.py first.")
    exit(1)

# Features and Target
X = df[['temperature', 'humidity', 'exposure_hours', 'activity_level', 'hydration_level', 'age_group']]
y = df['risk_label']

# Preprocessing
categorical_features = ['activity_level', 'hydration_level', 'age_group']
numerical_features = ['temperature', 'humidity', 'exposure_hours']

preprocessor = ColumnTransformer(
    transformers=[
        ('num', StandardScaler(), numerical_features),
        ('cat', OneHotEncoder(handle_unknown='ignore'), categorical_features)
    ])

# Model Pipeline
clf = Pipeline(steps=[
    ('preprocessor', preprocessor),
    ('classifier', RandomForestClassifier(n_estimators=100, random_state=42))
])

# Train
print("Training Random Forest model...")
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
clf.fit(X_train, y_train)

# Evaluate
score = clf.score(X_test, y_test)
print(f"Model Accuracy: {score:.4f}")
y_pred = clf.predict(X_test)
print(classification_report(y_test, y_pred))

# --- AI/ML UPGRADE SECTION ---
import matplotlib.pyplot as plt
import seaborn as sns
import json
from sklearn.metrics import confusion_matrix

# Ensure plots directory exists
plots_dir = os.path.join(script_dir, "plots")
os.makedirs(plots_dir, exist_ok=True)

# 1. Feature Importance
try:
    # Access the classifier step
    rf_model = clf.named_steps['classifier']
    
    # Access the preprocessor step
    preprocessor = clf.named_steps['preprocessor']
    
    # Get feature names from OneHotEncoder
    ohe = preprocessor.named_transformers_['cat']
    ohe_feature_names = ohe.get_feature_names_out(categorical_features)
    
    # Combine with numerical features
    all_feature_names = numerical_features + list(ohe_feature_names)
    
    importances = rf_model.feature_importances_
    
    # Create DataFrame for plotting
    feature_imp_df = pd.DataFrame({'Feature': all_feature_names, 'Importance': importances})
    feature_imp_df = feature_imp_df.sort_values(by='Importance', ascending=False)
    
    plt.figure(figsize=(10, 6))
    sns.barplot(x='Importance', y='Feature', data=feature_imp_df, palette='viridis')
    plt.title('Feature Importance (What drives Heat Stress?)')
    plt.tight_layout()
    plt.savefig(os.path.join(plots_dir, "feature_importance.png"))
    print("Saved Feature Importance plot.")
    
except Exception as e:
    print(f"Warning: Could not plot feature importance: {e}")

# 2. Confusion Matrix
try:
    cm = confusion_matrix(y_test, y_pred, labels=['low', 'moderate', 'high', 'extreme'])
    plt.figure(figsize=(8, 6))
    sns.heatmap(cm, annot=True, fmt='d', cmap='Blues', 
                xticklabels=['low', 'moderate', 'high', 'extreme'],
                yticklabels=['low', 'moderate', 'high', 'extreme'])
    plt.title('Confusion Matrix (Prediction Accuracy)')
    plt.ylabel('Actual Risk')
    plt.xlabel('Predicted Risk')
    plt.tight_layout()
    plt.savefig(os.path.join(plots_dir, "confusion_matrix.png"))
    print("Saved Confusion Matrix plot.")
except Exception as e:
    print(f"Warning: Could not plot confusion matrix: {e}")

# 3. Save Metrics
metrics = {
    "accuracy": score,
    "classification_report": classification_report(y_test, y_pred, output_dict=True),
    "model_params": rf_model.get_params()
}
metrics_path = os.path.join(script_dir, "metrics.json")
with open(metrics_path, 'w') as f:
    json.dump(metrics, f, indent=4)
print(f"Metrics saved to {metrics_path}")

# Save Model
model_path = os.path.join(script_dir, "model.pkl")
joblib.dump(clf, model_path)
print(f"Model saved to {model_path}")

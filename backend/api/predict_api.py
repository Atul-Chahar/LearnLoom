from flask import Blueprint, request, jsonify
from services.data_cleaning import load_cleaned_data, apply_filters
from services.prediction_model import get_trained_model_components
import pandas as pd

predict_bp = Blueprint("predict", __name__)

@predict_bp.post("/predict")
def predict():
    data = request.json
    hours_watched = data.get('hours_watched')
    average_score = data.get('average_score')
    days_active = data.get('activity_level')

    if any(v is None for v in [hours_watched, average_score, days_active]):
        return jsonify({"error": "Missing input data"}), 400

    # Load the model and preprocessor
    model_pipeline, preprocessor = get_trained_model_components()
    if model_pipeline is None:
        return jsonify({"error": "Prediction model not available. Please ensure it's trained."}), 500

    # Get the original cleaned data to determine modes for missing features
    df_original = load_cleaned_data()
    if df_original is None or df_original.empty:
        return jsonify({"error": "Original data not available for feature defaults."}), 500

    # Prepare input for prediction based on frontend data
    # Use mode from original training data for categorical features not provided by frontend
    default_lunch = df_original['lunch'].mode()[0] if 'lunch' in df_original.columns else 'standard'
    default_gender = df_original['gender'].mode()[0] if 'gender' in df_original.columns else 'female'
    default_race_ethnicity = df_original['race_ethnicity'].mode()[0] if 'race_ethnicity' in df_original.columns else 'group A'
    default_test_prep = df_original['test_preparation_course'].mode()[0] if 'test_preparation_course' in df_original.columns else 'none'
    default_parental_education = df_original['parental_level_of_education'].mode()[0] if 'parental_level_of_education' in df_original.columns else 'some high school'

    input_df = pd.DataFrame([{
        'overall_score': average_score,
        'test_preparation_course': default_test_prep,
        'parental_level_of_education': default_parental_education,
        'lunch': default_lunch,
        'gender': default_gender,
        'race_ethnicity': default_race_ethnicity # Added for completeness, though not used in simulation
    }])

    # Apply filters if any, to the input_df for consistency (though typically filters apply to training data)
    # For prediction, we are predicting for a single instance, so filters are less relevant here
    # unless the user wants to predict for a *specific filtered group*.
    # For now, we'll assume filters are for the training data context.

    # Predict the likelihood
    completion_likelihood = model_pipeline.predict_proba(input_df)[0][1] # Probability of class 1 (completion)

    return jsonify({"completion_likelihood": round(completion_likelihood, 4)})


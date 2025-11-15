from flask import Blueprint, request, jsonify
from services.data_cleaning import load_cleaned_data, apply_filters
import pandas as pd
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline

predict_bp = Blueprint("predict", __name__)

@predict_bp.post("/predict")
def predict():
    data = request.json
    hours_watched = data.get('hours_watched')
    average_score = data.get('average_score')
    days_active = data.get('activity_level')

    if any(v is None for v in [hours_watched, average_score, days_active]):
        return jsonify({"error": "Missing input data"}), 400

    df = load_cleaned_data()
    if df is None or df.empty:
        return jsonify({"error": "No data available for model training"}), 500

    # Extract filters from request arguments
    filters = {
        'gender': request.args.get('gender'),
        'parental_level_of_education': request.args.get('parental_level_of_education'),
        'test_preparation_course': request.args.get('test_preparation_course'),
        'lunch': request.args.get('lunch'),
        'race_ethnicity': request.args.get('race_ethnicity')
    }
    
    # Apply filters
    df = apply_filters(df, filters)

    if df.empty:
        return jsonify({"error": "No data available after filtering for model training"}), 500

    score_cols = ['math_score', 'reading_score', 'writing_score']
    existing_score_cols = [col for col in score_cols if col in df.columns]
    if not existing_score_cols:
        return jsonify({"error": "No score data available for model training"}), 500

    df['overall_score'] = df[existing_score_cols].mean(axis=1)
    df['completion'] = (df['overall_score'] >= 60).astype(int) # Target variable

    # Feature Engineering for training
    # For simplicity, we'll use a subset of features that can be inferred or are directly available
    features = df[['overall_score', 'test_preparation_course', 'parental_level_of_education', 'lunch', 'gender']]
    target = df['completion']

    # Preprocessing for categorical and numerical features
    categorical_features = ['test_preparation_course', 'parental_level_of_education', 'lunch', 'gender']
    numerical_features = ['overall_score']

    preprocessor = ColumnTransformer(
        transformers=[
            ('num', StandardScaler(), numerical_features),
            ('cat', OneHotEncoder(handle_unknown='ignore'), categorical_features)
        ])

    # Create a pipeline with preprocessor and logistic regression model
    model_pipeline = Pipeline(steps=[('preprocessor', preprocessor),
                                   ('classifier', LogisticRegression(solver='liblinear', random_state=42))])
    
    # Train the model
    model_pipeline.fit(features, target)

    # Prepare input for prediction based on frontend data
    # Simulate 'test_preparation_course' and 'parental_level_of_education'
    # This is a very rough approximation due to feature mismatch
    simulated_test_prep = 'completed' if hours_watched > 10 else 'none'
    
    # Map days_active to parental education level (very arbitrary mapping for demonstration)
    if days_active > 20:
        simulated_parental_education = "master's degree"
    elif days_active > 10:
        simulated_parental_education = "bachelor's degree"
    else:
        simulated_parental_education = "some high school"

    # Create a DataFrame for the new input
    # Note: 'lunch' and 'gender' are not provided by the frontend, so we'll use default/most common values
    # For a real application, these would need to be provided or handled more robustly.
    # Here, we'll just use the mode from the training data for demonstration.
    default_lunch = df['lunch'].mode()[0]
    default_gender = df['gender'].mode()[0]

    input_df = pd.DataFrame([{
        'overall_score': average_score,
        'test_preparation_course': simulated_test_prep,
        'parental_level_of_education': simulated_parental_education,
        'lunch': default_lunch,
        'gender': default_gender
    }])

    # Predict the likelihood
    completion_likelihood = model_pipeline.predict_proba(input_df)[0][1] # Probability of class 1 (completion)

    return jsonify({"completion_likelihood": round(completion_likelihood, 4)})


from flask import Blueprint, jsonify
from services.data_cleaning import load_cleaned_data
import pandas as pd

dropouts_bp = Blueprint("dropouts", __name__)

@dropouts_bp.get("/dropouts-data")
def dropouts_data():
    df = load_cleaned_data()
    if df is None or df.empty:
        return jsonify({"error": "No data available"}), 500

    score_cols = ['math_score', 'reading_score', 'writing_score']
    existing_score_cols = [col for col in score_cols if col in df.columns]
    
    if not existing_score_cols:
        return jsonify({"error": "No score data available"}), 500

    df['overall_score'] = df[existing_score_cols].mean(axis=1)

    # Define dropout threshold
    dropout_threshold = 40
    df['is_dropout'] = df['overall_score'] < dropout_threshold

    # Dropout patterns by parental level of education
    dropout_by_education = df.groupby('parental_level_of_education')['is_dropout'].apply(
        lambda x: (x.sum() / len(x)) * 100 if len(x) > 0 else 0
    ).reset_index()
    dropout_by_education.columns = ['parental_level_of_education', 'dropout_rate']

    # Dropout patterns by gender
    dropout_by_gender = df.groupby('gender')['is_dropout'].apply(
        lambda x: (x.sum() / len(x)) * 100 if len(x) > 0 else 0
    ).reset_index()
    dropout_by_gender.columns = ['gender', 'dropout_rate']

    return jsonify({
        "dropoutByEducation": dropout_by_education.to_dict(orient='records'),
        "dropoutByGender": dropout_by_gender.to_dict(orient='records')
    })

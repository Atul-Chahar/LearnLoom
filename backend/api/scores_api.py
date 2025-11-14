from flask import Blueprint, jsonify
from services.data_cleaning import load_cleaned_data
import pandas as pd

scores_bp = Blueprint("scores", __name__)

@scores_bp.get("/scores-data")
def scores_data():
    df = load_cleaned_data()
    if df is None or df.empty:
        return jsonify({"error": "No data available"}), 500

    score_cols = ['math_score', 'reading_score', 'writing_score']
    existing_score_cols = [col for col in score_cols if col in df.columns]
    
    if not existing_score_cols:
        return jsonify({"error": "No score data available"}), 500

    df['overall_score'] = df[existing_score_cols].mean(axis=1)

    # Score Distribution
    score_distribution = df['overall_score'].value_counts().sort_index().reset_index()
    score_distribution.columns = ['score', 'count']

    # Performance by Test Preparation
    performance_by_test_prep = df.groupby('test preparation course')['overall_score'].mean().reset_index()
    performance_by_test_prep.columns = ['test_preparation_course', 'average_score']

    return jsonify({
        "scoreDistribution": score_distribution.to_dict(orient='records'),
        "performanceByTestPrep": performance_by_test_prep.to_dict(orient='records')
    })

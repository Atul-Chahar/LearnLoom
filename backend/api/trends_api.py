from flask import Blueprint, jsonify
from services.data_cleaning import load_cleaned_data
import pandas as pd

trends_bp = Blueprint("trends", __name__)

@trends_bp.get("/trends-data")
def trends_data():
    df = load_cleaned_data()
    if df is None or df.empty:
        return jsonify({"error": "No data available"}), 500

    score_cols = ['math_score', 'reading_score', 'writing_score']
    existing_score_cols = [col for col in score_cols if col in df.columns]
    
    if not existing_score_cols:
        return jsonify({"error": "No score data available"}), 500

    df['overall_score'] = df[existing_score_cols].mean(axis=1)

    # Learning Completion Trend (using parental level of education as a proxy for trend)
    completion_by_education = df.groupby('parental_level_of_education')['overall_score'].apply(
        lambda x: (x >= 60).sum() / len(x) * 100 if len(x) > 0 else 0
    ).reset_index()
    completion_by_education = completion_by_education.rename(columns={'overall_score': 'completion_rate'})
    
    # Average Scores (per subject)
    average_scores_by_subject = df[existing_score_cols].mean().reset_index()
    average_scores_by_subject = average_scores_by_subject.rename(columns={'index': 'subject', 0: 'average_score'})

    return jsonify({
        "completionTrend": completion_by_education.to_dict(orient='records'),
        "averageScoresBySubject": average_scores_by_subject.to_dict(orient='records')
    })
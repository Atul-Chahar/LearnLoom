from flask import Blueprint, jsonify

trends_bp = Blueprint("trends", __name__)

@trends_bp.get("/score-trend")
def score_trend():
    return jsonify({"dates": [], "scores": []})

@trends_bp.get("/activity-trend")
def activity_trend():
    return jsonify({"dates": [], "activity": []})

@trends_bp.get("/weekly-progress")
def weekly_progress():
    return jsonify({"weeks": [], "average_scores": []})

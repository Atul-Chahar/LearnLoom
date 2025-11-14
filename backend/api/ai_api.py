from flask import Blueprint, jsonify
from services.ai_summary import generate_ai_summary
from api.metrics_api import (
    average_score,
    completion_rate,
    dropout_rate,
    active_students,
    total_students,
)
from api.trends_api import score_trend

ai_bp = Blueprint("ai", __name__)

@ai_bp.post("/ai-summary")
def ai_summary():
    # Collect metrics from existing routes internally
    metrics = {
        "average_score": (average_score().get_json() or {}).get("average_score"),
        "completion_rate": (completion_rate().get_json() or {}).get("completion_rate"),
        "dropout_rate": (dropout_rate().get_json() or {}).get("dropout_rate"),
        "active_students": (active_students().get_json() or {}).get("active_students"),
        "total_students": (total_students().get_json() or {}).get("total_students"),
    }

    # Get trend data
    trend = (score_trend().get_json() or {}).get("trend") or []

    # Generate hybrid summary (placeholder for now)
    summary = generate_ai_summary(metrics, trend)

    return jsonify({
        "summary": summary,
        "metrics_used": metrics,
        "trend_used": trend
    })

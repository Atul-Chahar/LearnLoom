from flask import Blueprint, jsonify

refresh_bp = Blueprint("refresh", __name__)

@refresh_bp.post("/refresh-data")
def refresh_data():
    return jsonify({
        "status": "success",
        "rows_added": 0,
        "last_updated": ""
    })

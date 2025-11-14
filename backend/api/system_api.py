from flask import Blueprint, jsonify

system_bp = Blueprint("system", __name__)

@system_bp.get("/system-status")
def system_status():
    return jsonify({
        "backend": "running",
        "database_connected": False,
        "last_data_refresh": ""
    })

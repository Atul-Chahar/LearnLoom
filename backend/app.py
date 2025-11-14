from flask import Flask
from flask_cors import CORS

from api.metrics_api import metrics_bp
from api.trends_api import trends_bp
from api.courses_api import courses_bp
from api.students_api import students_bp
from api.predict_api import predict_bp
from api.refresh_api import refresh_bp
from api.system_api import system_bp
from api.ai_api import ai_bp
from api.dashboard_api import dashboard_bp # Moved import
from api.scores_api import scores_bp
from api.dropouts_api import dropouts_bp

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "http://localhost:5173"}})

@app.get("/api/health")
def health():
    return {"status": "ok", "message": "Backend is running"}

# Register Blueprints
app.register_blueprint(metrics_bp, url_prefix="/api")
app.register_blueprint(trends_bp, url_prefix="/api")
app.register_blueprint(courses_bp, url_prefix="/api")
app.register_blueprint(students_bp, url_prefix="/api")
app.register_blueprint(predict_bp, url_prefix="/api")
app.register_blueprint(refresh_bp, url_prefix="/api")
app.register_blueprint(system_bp, url_prefix="/api")
app.register_blueprint(ai_bp, url_prefix="/api")
app.register_blueprint(dashboard_bp, url_prefix="/api")
app.register_blueprint(scores_bp, url_prefix="/api")
app.register_blueprint(dropouts_bp, url_prefix="/api")

if __name__ == "__main__":
    app.run(debug=True)

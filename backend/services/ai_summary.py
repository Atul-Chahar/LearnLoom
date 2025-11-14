import os
import google.generativeai as genai

# -----------------------------
# 1. Gemini API key handling
# -----------------------------

API_KEY = None

# Try to load from gemini_key.py (your personal file)
try:
    from backend.gemini_key import API_KEY as LOCAL_KEY
    API_KEY = LOCAL_KEY
except Exception:
    pass

# If not found, fall back to environment variable
if not API_KEY:
    API_KEY = os.getenv("GEMINI_API_KEY")

# Configure Gemini if key exists
if API_KEY:
    genai.configure(api_key=API_KEY)


# -----------------------------
# 2. Build AI prompt
# -----------------------------

def build_prompt(metrics, trend):
    week_scores = ", ".join([str(t["avg_score"]) for t in trend])

    return f"""
You are an EdTech analytics expert. Analyze the following student performance metrics:

Average Score: {metrics['average_score']}
Completion Rate: {metrics['completion_rate']}%
Dropout Rate: {metrics['dropout_rate']}%
Active Students: {metrics['active_students']} out of {metrics['total_students']}

Weekly Score Trend: {week_scores}

Generate the following:
1. A short summary (3–4 lines)
2. A detailed insight on academic performance
3. Dropout risks and causes
4. Recommendations for improving performance
5. Interpretation of the trend pattern

Use clear, professional language.
"""


# -----------------------------
# 3. Main AI summary function
# -----------------------------

def generate_ai_summary(metrics, trend):
    """
    Uses Gemini 2.5 Pro for real AI analysis.
    Falls back to placeholder summary if API fails.
    """

    # If API key missing → fallback
    if not API_KEY:
        return fallback_summary(metrics, trend)

    try:
        prompt = build_prompt(metrics, trend)

        # Correct model name from your list
        model = genai.GenerativeModel("models/gemini-2.5-pro")

        response = model.generate_content(prompt)

        return response.text.strip()

    except Exception as e:
        # API error → fallback summary
        return f"[Gemini Error: {str(e)}]\n\n" + fallback_summary(metrics, trend)


# -----------------------------
# 4. Fallback summary
# -----------------------------

def fallback_summary(metrics, trend):
    avg = metrics.get("average_score")
    completion = metrics.get("completion_rate")
    dropout = metrics.get("dropout_rate")
    active = metrics.get("active_students")
    total = metrics.get("total_students")

    week_scores = ", ".join([str(t["avg_score"]) for t in trend])

    return f"""
Quick Overview:
- Average score: {avg}
- Completion rate: {completion}%
- Dropout rate: {dropout}%
- Active students: {active} out of {total}

Detailed Insight:
The average score shows stable performance. Completion rate reflects strong engagement.
Dropout rate highlights students who may need help. Active students form a mid-performing segment.

Trend Summary:
Weekly scores: {week_scores}

(This is a fallback summary. Gemini will give richer insights when API is active.)
""".strip()

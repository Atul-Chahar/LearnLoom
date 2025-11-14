import json

def generate_ai_summary(metrics, trend):
    """
    Hybrid AI Summary (short + detailed combination)

    This is a placeholder. Later we will replace this with Gemini API output.
    """

    avg = metrics.get("average_score")
    completion = metrics.get("completion_rate")
    dropout = metrics.get("dropout_rate")
    active = metrics.get("active_students")
    total = metrics.get("total_students")

    # Trend info (4 weeks)
    week_scores = ", ".join([str(t["avg_score"]) for t in trend])

    # Hybrid summary (balanced length)
    summary = f"""
Quick Overview:
- Average score: {avg}
- Completion rate: {completion}%
- Dropout rate: {dropout}%
- Active students: {active} out of {total}

Detailed Insight:
The average score of {avg} indicates steady academic performance. A completion rate of {completion}% suggests that most students are managing the coursework well. 
The dropout rate of {dropout}% mainly reflects students with lower average scores. Active students (neither completed nor dropout) form a middle group that may benefit from targeted support.

Trend Summary:
Over the 4-week trend, the average scores were: {week_scores}. 
This reflects a healthy pattern of improvement across the dataset.

(This is a placeholder summary. Gemini integration will enhance this later.)
"""

    return summary.strip()

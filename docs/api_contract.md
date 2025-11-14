API Contract — LearnLoom (Backend ↔ Frontend)
(example of API contract so you can build frontend according to the backend)
(Both of us use this document to build our parts.)

1. Health Check
GET /api/health

Checks if backend is running.

Response

{
  "status": "ok",
  "message": "Backend is running"
}

2. Summary Metrics
GET /api/average-score

Returns overall average score.

Response

{
  "average_score": 78.4
}

GET /api/completion-rate

Returns the % of students who completed the courses.

Response

{
  "completion_rate": 0.72
}

GET /api/dropout-rate

Returns % of students who dropped out.

Response

{
  "dropout_rate": 0.18
}

GET /api/total-students

Total number of students in dataset.

Response

{
  "total_students": 1280
}

GET /api/active-students

Students active recently.

Response

{
  "active_students": 845
}

3. Trends / Graph Data
GET /api/score-trend

Used for score line chart.

Response

{
  "dates": ["2024-01-01", "2024-01-02"],
  "scores": [75, 78]
}

GET /api/activity-trend

Activity over time (e.g., study sessions).

Response

{
  "dates": ["2024-01-01", "2024-01-02"],
  "activity": [120, 156]
}

GET /api/weekly-progress

Weekly average score trend.

Response

{
  "weeks": ["2024-W01", "2024-W02"],
  "average_scores": [70, 74]
}

4. Course Analytics
GET /api/course-analytics

Returns metrics for every course.

Response

{
  "courses": [
    {
      "course_id": "course_123",
      "course_name": "Data Science Basics",
      "average_score": 82.5,
      "completion_rate": 0.68,
      "dropout_rate": 0.15,
      "num_students": 420
    }
  ]
}

GET /api/top-courses

Best courses by completion rate.

Response

{
  "top_courses": [
    { "course_id": "course_2", "course_name": "Python Basics", "completion_rate": 0.92 }
  ]
}

GET /api/hardest-courses

Courses with lowest average scores.

Response

{
  "hardest_courses": [
    { "course_id": "course_ml", "course_name": "Machine Learning", "average_score": 61.2 }
  ]
}

5. Student Profile
GET /api/student/{student_id}/profile

Returns detailed profile for one student.

Response

{
  "student_id": 124,
  "name": "John Doe",
  "average_score": 74.2,
  "hours_watched": 42,
  "progress": 0.68,
  "score_history": [
    { "date": "2024-01-01", "score": 65 },
    { "date": "2024-01-08", "score": 72 }
  ],
  "activity_history": [
    { "date": "2024-01-01", "activity_count": 2 },
    { "date": "2024-01-08", "activity_count": 4 }
  ],
  "last_active": "2024-02-01T12:34:56Z",
  "courses_enrolled": [
    { "course_id": "course_1", "course_name": "Intro to AI", "progress": 0.50 }
  ]
}

6. Prediction (AI Model)
POST /api/predict

Request

{
  "hours_watched": 12,
  "average_score": 78,
  "activity_level": 5
}


Response

{
  "completion_likelihood": 0.87
}

7. Data Refresh (ETL)
POST /api/refresh-data

Triggers data download → cleaning → loading.

Response

{
  "status": "success",
  "rows_added": 1240,
  "last_updated": "2024-02-01T12:43:21Z"
}

8. System Status
GET /api/system-status

Frontend uses this for system health page.

Response

{
  "backend": "running",
  "database_connected": true,
  "last_data_refresh": "2024-02-01T12:43:21Z"
}
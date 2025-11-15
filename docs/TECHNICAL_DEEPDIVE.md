# LearnLoom: Technical Deep Dive with Code Examples

Detailed technical explanations with actual code snippets for your reference during presentations.

---

## Table of Contents
1. [Flask Blueprint Architecture](#1-flask-blueprint-architecture)
2. [Data Processing Pipeline](#2-data-processing-pipeline)
3. [API Request/Response Cycle](#3-api-requestresponse-cycle)
4. [Frontend-Backend Communication](#4-frontend-backend-communication)
5. [Machine Learning Pipeline](#5-machine-learning-pipeline)
6. [AI Integration with Gemini](#6-ai-integration-with-gemini)
7. [Error Handling & Graceful Degradation](#7-error-handling--graceful-degradation)
8. [Performance Optimization Strategies](#8-performance-optimization-strategies)

---

## 1. Flask Blueprint Architecture

### Overview
Blueprints organize Flask routes into modular components. Each file in `backend/api/` is a Blueprint that encapsulates related endpoints.

### How Blueprints Work

**Step 1: Create a Blueprint (e.g., `metrics_api.py`)**
```python
from flask import Blueprint, jsonify
from services.data_cleaning import load_cleaned_data

# Create blueprint with name "metrics"
metrics_bp = Blueprint("metrics", __name__)

# Define routes under this blueprint
@metrics_bp.get("/average-score")
def average_score():
    df = load_cleaned_data()
    if df is None or df.empty:
        return jsonify({"average_score": 0})
    
    score_cols = ["math_score", "reading_score", "writing_score"]
    existing_cols = [c for c in score_cols if c in df.columns]
    
    if not existing_cols:
        return jsonify({"average_score": 0})
    
    df["overall_score"] = df[existing_cols].mean(axis=1)
    avg = df["overall_score"].mean()
    return jsonify({"average_score": round(float(avg), 2)})
```

**Step 2: Register Blueprint in `app.py`**
```python
from flask import Flask
from flask_cors import CORS
from api.metrics_api import metrics_bp

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "http://localhost:5173"}})

# Register blueprint with URL prefix
app.register_blueprint(metrics_bp, url_prefix="/api")

if __name__ == "__main__":
    app.run(debug=True)
```

**Step 3: Access the Route**
- URL: `GET http://localhost:5000/api/average-score`
- Method: Uses Blueprint prefix + route decorator

### Why This Design?
```
✓ Modular: Each feature in its own file
✓ Maintainable: Easy to locate specific endpoints
✓ Testable: Can test each blueprint independently
✓ Scalable: Add new blueprints without modifying others
```

---

## 2. Data Processing Pipeline

### Complete Data Cleaning Workflow

**`backend/services/data_cleaning.py`:**

```python
import pandas as pd
import os

RAW_DATA_PATH = os.path.join(os.path.dirname(__file__), '..', '..', 'data', 'raw', 'StudentsPerformance.csv')
CLEANED_DATA_DIR = os.path.join(os.path.dirname(__file__), '..', '..', 'data', 'cleaned')
CLEANED_FILE_PATH = os.path.join(CLEANED_DATA_DIR, 'cleaned_students.csv')

def clean_students_dataset(raw_file_name: str):
    """
    Cleans raw Kaggle dataset and returns DataFrame + path.
    """
    # Step 1: Construct paths
    raw_dir = os.path.join(os.path.dirname(__file__), '..', '..', 'data', 'raw')
    raw_path = os.path.join(raw_dir, raw_file_name)
    cleaned_path = os.path.join(CLEANED_DATA_DIR, "cleaned_students.csv")
    os.makedirs(CLEANED_DATA_DIR, exist_ok=True)
    
    # Step 2: Load CSV
    print(f"Loading {raw_path}...")
    df = pd.read_csv(raw_path)
    print(f"Rows before cleaning: {len(df)}")
    
    # Step 3: Standardize column names
    print("Standardizing column names...")
    df.columns = (
        df.columns
        .str.strip()           # Remove spaces
        .str.lower()           # Lowercase
        .str.replace(" ", "_") # Space → underscore
        .str.replace("-", "_") # Dash → underscore
    )
    # Example: "Math Score" → "math_score"
    # Example: "Test-Prep Course" → "test_prep_course"
    
    # Step 4: Remove duplicates
    print("Removing duplicates...")
    original_rows = len(df)
    df = df.drop_duplicates()
    print(f"Removed {original_rows - len(df)} duplicate rows")
    
    # Step 5: Remove fully empty rows
    print("Removing empty rows...")
    df = df.dropna(how="all")
    
    # Step 6: Handle missing numeric values
    print("Filling missing numeric values with column mean...")
    numeric_cols = df.select_dtypes(include=["int64", "float64"]).columns
    for col in numeric_cols:
        missing = df[col].isna().sum()
        if missing > 0:
            mean_val = df[col].mean()
            df[col] = df[col].fillna(mean_val)
            print(f"  {col}: filled {missing} NaN with {mean_val:.2f}")
    
    # Step 7: Handle missing text values
    print("Filling missing text values with 'Unknown'...")
    text_cols = df.select_dtypes(include=["object"]).columns
    for col in text_cols:
        missing = df[col].isna().sum()
        if missing > 0:
            df[col] = df[col].fillna("Unknown")
            print(f"  {col}: filled {missing} NaN with 'Unknown'")
    
    # Step 8: Save cleaned data
    print(f"Saving cleaned data to {cleaned_path}...")
    df.to_csv(cleaned_path, index=False)
    print(f"✓ Saved {len(df)} rows")
    
    return df, cleaned_path


def load_cleaned_data():
    """
    Loads pre-cleaned CSV and returns Pandas DataFrame.
    Returns None if file not found.
    """
    try:
        cleaned_path = os.path.join(
            os.path.dirname(os.path.dirname(__file__)),
            "..",
            "data",
            "cleaned",
            "cleaned_students.csv"
        )
        print(f"Loading cleaned data from {cleaned_path}...")
        df = pd.read_csv(cleaned_path)
        print(f"✓ Loaded {len(df)} rows")
        return df
    except Exception as e:
        print(f"✗ Error loading cleaned data: {e}")
        return None
```

**Data Transformation Steps Visualized:**

```
Raw CSV                                 Cleaned CSV
┌─────────────────────────────┐        ┌──────────────────────────────┐
│ gender | Math Score | ... │        │ gender | math_score | ... │
├─────────────────────────────┤        ├──────────────────────────────┤
│ Male   |    72    |        │        │ male   |    72.0   |        │
│ Female |    70    |        │   →    │ female |    70.0   |        │
│ Male   |  [NULL]  |        │        │ male   |    71.5   │ ← mean │
│ Male   |    72    | (dup)  │ ✗ (removed duplicate)
└─────────────────────────────┘        └──────────────────────────────┘
```

---

## 3. API Request/Response Cycle

### Example: `/api/dashboard-data` Walkthrough

**Request:**
```http
GET /api/dashboard-data HTTP/1.1
Host: localhost:5000
Origin: http://localhost:5173
```

**Backend Processing (Step-by-Step):**

```python
# backend/api/dashboard_api.py
from flask import Blueprint, jsonify, request
from services.data_cleaning import load_cleaned_data
import pandas as pd

dashboard_bp = Blueprint("dashboard", __name__)

@dashboard_bp.get("/dashboard-data")
def dashboard_data():
    """
    Complete request processing flow.
    """
    
    # 1. Load data
    print("Step 1: Loading cleaned data...")
    df = load_cleaned_data()
    
    # 2. Validate data exists
    print("Step 2: Validating data...")
    if df is None or df.empty:
        return jsonify({"error": "No data available"}), 500
    
    # 3. Calculate total students
    print("Step 3: Counting total students...")
    total_students = len(df)
    print(f"  Total students: {total_students}")
    
    # 4. Identify score columns
    print("Step 4: Checking for score columns...")
    score_cols = ['math_score', 'reading_score', 'writing_score']
    existing_score_cols = [col for col in score_cols if col in df.columns]
    
    if not existing_score_cols:
        print("  ✗ No score columns found")
        return jsonify({
            "stats": {
                "totalStudents": 0,
                "completionRate": 0,
                "averageScore": 0,
                "dropoutRate": 0,
                "activeStudents": 0
            },
            "studentData": []
        })
    
    # 5. Calculate overall score (mean of 3 subjects)
    print("Step 5: Calculating overall scores...")
    df['overall_score'] = df[existing_score_cols].mean(axis=1)
    print(f"  Overall score range: {df['overall_score'].min():.1f} - {df['overall_score'].max():.1f}")
    
    # 6. Calculate completion rate (score >= 60)
    print("Step 6: Calculating completion rate...")
    completed_students = df[df['overall_score'] >= 60]
    completion_rate = (len(completed_students) / total_students) * 100 if total_students > 0 else 0
    print(f"  Completion rate: {completion_rate:.1f}%")
    
    # 7. Calculate average score
    print("Step 7: Calculating average score...")
    average_score = df['overall_score'].mean() if not df.empty else 0
    print(f"  Average score: {average_score:.1f}")
    
    # 8. Calculate dropout rate (score < 40)
    print("Step 8: Calculating dropout rate...")
    dropout_students = df[df['overall_score'] < 40]
    dropout_rate = (len(dropout_students) / total_students) * 100 if total_students > 0 else 0
    print(f"  Dropout rate: {dropout_rate:.1f}%")
    
    # 9. Calculate active students (40 <= score < 60)
    print("Step 9: Counting active students...")
    active_students = total_students
    print(f"  Active students: {active_students}")
    
    # 10. Convert DataFrame to JSON-serializable format
    print("Step 10: Converting DataFrame to JSON...")
    student_data_list = df.to_dict(orient='records')
    print(f"  Serialized {len(student_data_list)} student records")
    
    # 11. Construct response
    print("Step 11: Building response...")
    response = {
        "stats": {
            "totalStudents": total_students,
            "completionRate": round(completion_rate, 1),
            "averageScore": round(average_score, 1),
            "dropoutRate": round(dropout_rate, 1),
            "activeStudents": active_students,
        },
        "studentData": student_data_list
    }
    
    # 12. Return JSON response
    print("Step 12: Returning response to client...")
    return jsonify(response)
```

**Response:**
```json
{
  "stats": {
    "totalStudents": 1000,
    "completionRate": 65.5,
    "averageScore": 69.5,
    "dropoutRate": 12.3,
    "activeStudents": 1000
  },
  "studentData": [
    {
      "gender": "female",
      "race_ethnicity": "group B",
      "parental_level_of_education": "bachelor's degree",
      "lunch": "standard",
      "test_preparation_course": "none",
      "math_score": 72,
      "reading_score": 72,
      "writing_score": 74,
      "overall_score": 72.67
    },
    ...
  ]
}
```

---

## 4. Frontend-Backend Communication

### Complete API Call Flow

**Frontend (`frontend/script.js`):**

```javascript
// 1. API Base URL Configuration
const API_BASE_URL = 'http://127.0.0.1:5000/api';

// 2. Generic Fetch Wrapper (handles errors)
async function apiCall(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    console.log(`[API] ${options.method || 'GET'} ${url}`);
    
    try {
        const response = await fetch(url, {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            },
            ...options
        });
        
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || `HTTP ${response.status}`);
        }
        
        const data = await response.json();
        console.log(`[API] Response:`, data);
        return data;
    } catch (error) {
        console.error(`[API Error] ${endpoint}:`, error);
        showError(`API call failed: ${error.message}`);
        throw error;
    }
}

// 3. GET Request (Dashboard Data)
async function getDashboardData() {
    console.log("Fetching dashboard data...");
    try {
        const data = await apiCall('/dashboard-data');
        return data;
    } catch (error) {
        return { stats: {}, studentData: [] };
    }
}

// 4. POST Request (AI Summary)
async function getLearningInsights(studentData) {
    console.log("Fetching AI insights...");
    try {
        const data = await apiCall('/ai-summary', {
            method: 'POST',
            body: JSON.stringify({ studentData })
        });
        return data.summary;
    } catch (error) {
        return "Failed to get AI insights.";
    }
}

// 5. POST Request (Prediction)
async function predictCompletion(hoursWatched, averageScore, daysActive) {
    console.log("Making prediction...");
    try {
        const data = await apiCall('/predict', {
            method: 'POST',
            body: JSON.stringify({
                hours_watched: hoursWatched,
                average_score: averageScore,
                activity_level: daysActive
            })
        });
        return data.completion_likelihood;
    } catch (error) {
        return null;
    }
}

// 6. Main Initialization
async function initializeDashboard() {
    console.log("=== Dashboard Initialization ===");
    
    // Fetch data
    const dashboardData = await getDashboardData();
    
    // Render stats
    renderStats(dashboardData.stats);
    
    // Store student data for AI summary
    currentStudentData = dashboardData.studentData;
    
    // Fetch and render AI insights
    const insights = await getLearningInsights(currentStudentData);
    renderAiInsights(insights);
    
    console.log("=== Initialization Complete ===");
}

// 7. Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM loaded, initializing...");
    initializeDashboard();
});
```

**Network Request/Response Visualization:**

```
Frontend Timeline:
┌─────────────────────────────────────────────────┐
│ Page Load                                        │
├─────────────────────────────────────────────────┤
│ DOMContentLoaded → Call apiCall('/dashboard-data')
├──────────────────┬───────────────────────────────┤
│                  ↓ (Network Request)             │
│              HTTP GET to Backend                │
│                  ↓ (Backend Processing)         │
│              Backend loads CSV                  │
│              Calculates metrics                 │
│              Returns JSON                       │
│                  ↓ (Network Response)           │
│              JSON Parsed                        │
│              renderStats() called              │
│              DOM Updated                        │
├─────────────────────────────────────────────────┤
│ Page Rendered with Data                         │
└─────────────────────────────────────────────────┘
```

---

## 5. Machine Learning Pipeline

### Model Training & Prediction Flow

**`backend/api/predict_api.py`:**

```python
from flask import Blueprint, request, jsonify
from services.data_cleaning import load_cleaned_data
import pandas as pd
from sklearn.linear_model import LogisticRegression
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.compose import ColumnTransformer
from sklearn.pipeline import Pipeline

predict_bp = Blueprint("predict", __name__)

@predict_bp.post("/predict")
def predict():
    """
    Complete ML pipeline for student completion prediction.
    """
    
    # ===== STEP 1: Extract Input Data =====
    print("\n=== PREDICTION REQUEST ===")
    data = request.json
    hours_watched = data.get('hours_watched')
    average_score = data.get('average_score')
    days_active = data.get('activity_level')
    
    print(f"Input: hours_watched={hours_watched}, average_score={average_score}, days_active={days_active}")
    
    # ===== STEP 2: Validate Input =====
    if any(v is None for v in [hours_watched, average_score, days_active]):
        return jsonify({"error": "Missing input data"}), 400
    
    # ===== STEP 3: Load Training Data =====
    print("Step 1: Loading training data...")
    df = load_cleaned_data()
    if df is None or df.empty:
        return jsonify({"error": "No data available for model training"}), 500
    print(f"  Loaded {len(df)} training samples")
    
    # ===== STEP 4: Prepare Features & Target =====
    print("Step 2: Preparing features and target...")
    score_cols = ['math_score', 'reading_score', 'writing_score']
    existing_score_cols = [col for col in score_cols if col in df.columns]
    
    if not existing_score_cols:
        return jsonify({"error": "No score data available"}), 500
    
    # Calculate overall score
    df['overall_score'] = df[existing_score_cols].mean(axis=1)
    
    # Define target: 1 = completed (score >= 60), 0 = dropout (score < 60)
    df['completion'] = (df['overall_score'] >= 60).astype(int)
    print(f"  Completion distribution: {df['completion'].value_counts().to_dict()}")
    
    # Select features and target
    features_list = ['overall_score', 'test_preparation_course', 'parental_level_of_education', 'lunch', 'gender']
    features = df[features_list].copy()
    target = df['completion']
    
    # ===== STEP 5: Define Preprocessing Pipeline =====
    print("Step 3: Building preprocessing pipeline...")
    categorical_features = ['test_preparation_course', 'parental_level_of_education', 'lunch', 'gender']
    numerical_features = ['overall_score']
    
    # Preprocessing: standardize numbers, encode categories
    preprocessor = ColumnTransformer(
        transformers=[
            ('num', StandardScaler(), numerical_features),
            ('cat', OneHotEncoder(handle_unknown='ignore'), categorical_features)
        ]
    )
    print("  Preprocessor configured:")
    print(f"    - Numeric: StandardScaler on {numerical_features}")
    print(f"    - Categorical: OneHotEncoder on {categorical_features}")
    
    # ===== STEP 6: Create ML Pipeline =====
    print("Step 4: Building ML pipeline...")
    model_pipeline = Pipeline(steps=[
        ('preprocessor', preprocessor),
        ('classifier', LogisticRegression(solver='liblinear', random_state=42))
    ])
    print("  Pipeline: Preprocessor → LogisticRegression")
    
    # ===== STEP 7: Train Model =====
    print("Step 5: Training model...")
    print(f"  Training on {len(features)} samples with {len(features.columns)} features")
    model_pipeline.fit(features, target)
    print("  ✓ Model trained successfully")
    
    # ===== STEP 8: Map User Input to Features =====
    print("Step 6: Mapping user inputs to feature vector...")
    
    # Heuristic mappings (frontend → model features)
    simulated_test_prep = 'completed' if hours_watched > 10 else 'none'
    print(f"  hours_watched={hours_watched} → test_prep='{simulated_test_prep}'")
    
    if days_active > 20:
        simulated_parental_education = "master's degree"
    elif days_active > 10:
        simulated_parental_education = "bachelor's degree"
    else:
        simulated_parental_education = "some high school"
    print(f"  days_active={days_active} → parental_education='{simulated_parental_education}'")
    
    # Fill missing features with defaults
    default_lunch = df['lunch'].mode()[0]
    default_gender = df['gender'].mode()[0]
    print(f"  Using defaults: lunch='{default_lunch}', gender='{default_gender}'")
    
    # ===== STEP 9: Create Input DataFrame =====
    print("Step 7: Creating prediction input...")
    input_df = pd.DataFrame([{
        'overall_score': average_score,
        'test_preparation_course': simulated_test_prep,
        'parental_level_of_education': simulated_parental_education,
        'lunch': default_lunch,
        'gender': default_gender
    }])
    print(f"  Input DataFrame:\n{input_df}")
    
    # ===== STEP 10: Make Prediction =====
    print("Step 8: Making prediction...")
    probabilities = model_pipeline.predict_proba(input_df)[0]
    completion_likelihood = probabilities[1]  # Probability of class 1 (completion)
    
    print(f"  Probabilities: [dropout={probabilities[0]:.4f}, completion={probabilities[1]:.4f}]")
    print(f"  ✓ Prediction: {completion_likelihood:.4f} ({completion_likelihood*100:.1f}%)")
    
    # ===== STEP 11: Return Response =====
    return jsonify({"completion_likelihood": round(completion_likelihood, 4)})
```

**Model Training Process Diagram:**

```
Training Data (1000 students)
├─ Features: overall_score, test_prep, education, lunch, gender
└─ Target: completion (1 or 0)

            ↓ [Preprocessing]

Numeric Features (StandardScaler):
  overall_score: [0.5, -0.3, 1.2, ...]  (normalized)

Categorical Features (OneHotEncoder):
  test_prep: [1, 0] or [0, 1]  (one-hot)
  education: [1, 0, 0, 0, 0] or similar  (one-hot)
  lunch: [1, 0] or [0, 1]  (one-hot)
  gender: [1, 0] or [0, 1]  (one-hot)

            ↓ [Feature Vector]

Combined Feature Vector (X):
  [[0.5, 1, 0, 0, 0, 1, 1, 0], ...]

            ↓ [Logistic Regression]

Trained Model Weights:
  w = [0.3, -0.2, 0.1, ...]

            ↓ [Sigmoid Function]

Prediction for New Input:
  Input: [hours_watched=12, avg_score=70, days_active=15]
           ↓ [Heuristic Mapping]
         [overall_score=70, test_prep='completed', ...]
           ↓ [Preprocessing]
         [1.2, 1, 0, 0, 0.9, ...]
           ↓ [Model Predict_Proba]
         P(completion) = 0.78
           ↓
  Output: 78% chance of completion
```

---

## 6. AI Integration with Gemini

### Gemini API Call Flow

**`backend/services/ai_summary.py`:**

```python
import os
import google.generativeai as genai

# ===== STEP 1: API Key Configuration =====
print("=== Gemini API Initialization ===")

API_KEY = None

# Try local gemini_key.py first
try:
    from backend.gemini_key import API_KEY as LOCAL_KEY
    API_KEY = LOCAL_KEY
    print("✓ API key loaded from gemini_key.py")
except Exception:
    print("⚠ gemini_key.py not found, checking environment variable...")

# Fall back to environment variable
if not API_KEY:
    API_KEY = os.getenv("GEMINI_API_KEY")
    if API_KEY:
        print("✓ API key loaded from environment variable")
    else:
        print("✗ No API key found (will use fallback summaries)")

# Configure Gemini
if API_KEY:
    try:
        genai.configure(api_key=API_KEY)
        print("✓ Gemini configured successfully")
    except Exception as e:
        print(f"✗ Failed to configure Gemini: {e}")


# ===== STEP 2: Build Prompt =====
def build_prompt(metrics, trend):
    """
    Constructs a detailed prompt for Gemini to analyze student data.
    """
    print("\n=== Building Prompt ===")
    
    # Extract metrics
    avg_score = metrics.get('average_score')
    completion = metrics.get('completion_rate')
    dropout = metrics.get('dropout_rate')
    active = metrics.get('active_students')
    total = metrics.get('total_students')
    
    # Format trend data
    week_scores = ", ".join([str(t["avg_score"]) for t in trend])
    
    # Build prompt
    prompt = f"""You are an EdTech analytics expert. Analyze the following student performance metrics:

Average Score: {avg_score}
Completion Rate: {completion}%
Dropout Rate: {dropout}%
Active Students: {active} out of {total}

Weekly Score Trend: {week_scores}

Generate the following:
1. A short summary (3–4 lines)
2. A detailed insight on academic performance
3. Dropout risks and causes
4. Recommendations for improving performance
5. Interpretation of the trend pattern

Use clear, professional language.
"""
    
    print(f"Prompt length: {len(prompt)} characters")
    print(f"Metrics: avg={avg_score}, completion={completion}%, dropout={dropout}%")
    print(f"Trend: {week_scores}")
    
    return prompt


# ===== STEP 3: Generate AI Summary =====
def generate_ai_summary(metrics, trend):
    """
    Main function: calls Gemini API or returns fallback summary.
    """
    print("\n=== AI Summary Generation ===")
    
    # Check if API key is available
    if not API_KEY:
        print("⚠ No API key available, using fallback summary")
        return fallback_summary(metrics, trend)
    
    try:
        print("Step 1: Building prompt...")
        prompt = build_prompt(metrics, trend)
        
        print("Step 2: Calling Gemini API...")
        print("  Model: models/gemini-2.5-pro")
        
        # Create model instance
        model = genai.GenerativeModel("models/gemini-2.5-pro")
        
        # Make API call
        response = model.generate_content(prompt)
        
        print("Step 3: Processing response...")
        summary_text = response.text.strip()
        print(f"  Response length: {len(summary_text)} characters")
        print("✓ AI summary generated successfully")
        
        return summary_text
        
    except Exception as e:
        # API error → return fallback with error message
        print(f"✗ Gemini API error: {str(e)}")
        print("  Falling back to default summary...")
        return f"[Gemini Error: {str(e)}]\n\n" + fallback_summary(metrics, trend)


# ===== STEP 4: Fallback Summary =====
def fallback_summary(metrics, trend):
    """
    Returns a simple summary when Gemini API is unavailable.
    """
    print("Generating fallback summary...")
    
    avg = metrics.get("average_score", 0)
    completion = metrics.get("completion_rate", 0)
    dropout = metrics.get("dropout_rate", 0)
    active = metrics.get("active_students", 0)
    total = metrics.get("total_students", 0)
    week_scores = ", ".join([str(t["avg_score"]) for t in trend])
    
    summary = f"""Quick Overview:
- Average score: {avg}
- Completion rate: {completion}%
- Dropout rate: {dropout}%
- Active students: {active} out of {total}

Detailed Insight:
The average score shows stable performance. Completion rate reflects strong engagement.
Dropout rate highlights students who may need help. Active students form a mid-performing segment.

Trend Summary:
Weekly scores: {week_scores}

(This is a fallback summary. Gemini will give richer insights when API is active.)"""
    
    return summary
```

**API Call Sequence Diagram:**

```
Frontend Request
    ↓
POST /api/ai-summary
    ↓ [Body: {studentData: [...]}]
Backend receives request
    ↓
Calculate Metrics
  - avg_score
  - completion_rate
  - dropout_rate
  - active_students
  - weekly_trend
    ↓
Build Prompt
  "You are an EdTech expert. Analyze:
   Average Score: 70.5
   Completion Rate: 65.5%
   ..."
    ↓
Check API Key
  ├─ YES: Call Gemini API
  │   ├─ model.generate_content(prompt)
  │   ├─ Get AI-generated text
  │   └─ Return to frontend
  │
  └─ NO: Use fallback summary
      └─ Return static text
    ↓
Return Response
  {
    "summary": "The cohort shows...",
    "metrics_used": {...},
    "trend_used": [...]
  }
    ↓
Frontend Receives JSON
    ↓
Render AI Insights in HTML
```

---

## 7. Error Handling & Graceful Degradation

### Multi-Layer Error Handling

**Backend Error Handling:**

```python
# backend/api/dashboard_api.py
from flask import Blueprint, jsonify, request

dashboard_bp = Blueprint("dashboard", __name__)

@dashboard_bp.get("/dashboard-data")
def dashboard_data():
    """
    Error handling with graceful degradation.
    """
    try:
        # Layer 1: Data Loading
        try:
            df = load_cleaned_data()
        except Exception as e:
            print(f"Error loading data: {e}")
            return jsonify({"error": "Failed to load data"}), 500
        
        # Layer 2: Data Validation
        if df is None or df.empty:
            print("Warning: No data available")
            return jsonify({
                "stats": {
                    "totalStudents": 0,
                    "completionRate": 0,
                    "averageScore": 0,
                    "dropoutRate": 0,
                    "activeStudents": 0
                },
                "studentData": []
            })
        
        # Layer 3: Feature Validation
        score_cols = ['math_score', 'reading_score', 'writing_score']
        existing_score_cols = [col for col in score_cols if col in df.columns]
        
        if not existing_score_cols:
            print("Warning: No score columns found")
            return jsonify({
                "error": "No score data available",
                "stats": {...}
            }), 400
        
        # Layer 4: Calculation (try-except for each metric)
        try:
            df['overall_score'] = df[existing_score_cols].mean(axis=1)
            total_students = len(df)
            completion_rate = (len(df[df['overall_score'] >= 60]) / total_students * 100) if total_students > 0 else 0
        except Exception as e:
            print(f"Error calculating metrics: {e}")
            return jsonify({"error": "Failed to calculate metrics"}), 500
        
        # Layer 5: Success Response
        return jsonify({
            "stats": {
                "totalStudents": total_students,
                "completionRate": round(completion_rate, 1),
                "averageScore": round(df['overall_score'].mean(), 1),
                "dropoutRate": round((len(df[df['overall_score'] < 40]) / total_students * 100), 1),
                "activeStudents": len(df[(df['overall_score'] >= 40) & (df['overall_score'] < 60)])
            },
            "studentData": df.to_dict(orient='records')
        })
    
    except Exception as e:
        print(f"Unexpected error: {e}")
        return jsonify({"error": "Internal server error"}), 500
```

**Frontend Error Handling:**

```javascript
// frontend/script.js

// Error Display Function
function showError(message) {
    const errorDisplay = document.getElementById('error');
    if (errorDisplay) {
        errorDisplay.textContent = `Error: ${message}`;
        errorDisplay.style.display = 'block';
    }
    console.error(message);
}

// API Wrapper with Error Handling
async function apiCall(endpoint, options = {}) {
    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
        
        // Layer 1: HTTP Status Check
        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || `HTTP ${response.status}`);
        }
        
        // Layer 2: JSON Parse
        const data = await response.json();
        if (!data) throw new Error("Empty response");
        
        // Layer 3: Data Validation
        return data;
        
    } catch (networkError) {
        // Network/fetch error
        console.error("Network error:", networkError);
        showError(`Network error: ${networkError.message}`);
        throw networkError;
    }
}

// Safe Data Rendering
async function fetchDataAndRender() {
    try {
        const dashboardData = await apiCall('/dashboard-data');
        renderStats(dashboardData.stats);  // Safe because validated
    } catch (error) {
        console.error("Failed to render dashboard:", error);
        showError("Failed to load dashboard data");
        // Render default/empty state
        renderStats({
            totalStudents: 0,
            completionRate: 0,
            averageScore: 0,
            dropoutRate: 0,
            activeStudents: 0
        });
    }
}

// Prediction with Graceful Degradation
async function predictCompletion(hours, quiz, days) {
    try {
        const likelihood = await apiCall('/predict', {
            method: 'POST',
            body: JSON.stringify({hours_watched: hours, average_score: quiz, activity_level: days})
        });
        return likelihood;
    } catch (error) {
        console.error("Prediction failed:", error);
        // Return neutral prediction instead of crashing
        return 0.5;  // 50% (unknown)
    }
}
```

---

## 8. Performance Optimization Strategies

### Current Performance Issues & Solutions

**Issue 1: On-Demand Model Training**

❌ **Current (Slow):**
```python
@predict_bp.post("/predict")
def predict():
    df = load_cleaned_data()
    # Train model on EVERY request
    model = build_and_train_model(df)  # ← 2-5 seconds
    prediction = model.predict_proba(input_df)
    return jsonify({"completion_likelihood": prediction})
```

✓ **Optimized (Fast):**
```python
# train_model.py - Run offline
import joblib

def train_and_save_model():
    df = load_cleaned_data()
    model = build_and_train_model(df)
    joblib.dump(model, 'model.pkl')  # Save once

# app.py - Load at startup
model = joblib.load('model.pkl')

@predict_bp.post("/predict")
def predict():
    # Use pre-trained model
    prediction = model.predict_proba(input_df)  # ← Milliseconds
    return jsonify({"completion_likelihood": prediction})
```

**Issue 2: No Caching**

❌ **Current:**
```python
@metrics_bp.get("/average-score")
def average_score():
    df = load_cleaned_data()  # Load every time
    return df['overall_score'].mean()
```

✓ **Optimized (With Cache):**
```python
from functools import lru_cache

@lru_cache(maxsize=1)
def _get_average_score():
    df = load_cleaned_data()
    return round(df['overall_score'].mean(), 2)

@metrics_bp.get("/average-score")
def average_score():
    return jsonify({"average_score": _get_average_score()})

# On data refresh
@refresh_bp.post("/refresh-data")
def refresh_data():
    download_dataset()
    clean_dataset()
    _get_average_score.cache_clear()  # Clear cache
    return jsonify({"status": "success"})
```

**Issue 3: Large Dataset Loading**

❌ **Current (Loads entire CSV into memory):**
```python
def load_cleaned_data():
    return pd.read_csv('data/cleaned/cleaned_students.csv')
```

✓ **Optimized (Chunked Loading):**
```python
def compute_average_score_efficient(file_path):
    total_sum = 0
    count = 0
    
    for chunk in pd.read_csv(file_path, chunksize=10000):
        chunk['overall_score'] = chunk[score_cols].mean(axis=1)
        total_sum += chunk['overall_score'].sum()
        count += len(chunk)
    
    return total_sum / count if count > 0 else 0
```

**Performance Comparison:**

```
Current Architecture:
Request → Load CSV (100ms) → Process (50ms) → Response (150ms total)

Optimized Architecture:
Request → Use Cache (1ms) → Response (1ms total)
Result: 150x faster!

With On-Demand Model Training:
Predict Request → Train Model (3000ms) → Predict (50ms) → Response (3050ms)

With Pre-Trained Model:
Predict Request → Use Model (50ms) → Response (50ms)
Result: 60x faster!
```

---

## Practice Questions & Answers

### Q: "Walk me through what happens when a user clicks the 'Overview' button"

**A:**
```
1. User clicks Overview button
   └─ Event: navButtons.addEventListener('click', async () => {...})

2. Remove 'active' class from all buttons
   └─ navButtons.forEach(btn => btn.classList.remove('active'))

3. Add 'active' class to clicked button
   └─ button.classList.add('active')

4. Hide all pages
   └─ pages.forEach(page => page.classList.remove('active'))

5. Show Overview page
   └─ document.getElementById('overview-page').classList.add('active')

6. Call fetchDataAndRender()
   └─ Calls getDashboardData() - GET /api/dashboard-data

7. Backend:
   └─ Load CSV → Calculate metrics → Return JSON

8. Frontend receives JSON
   └─ renderStats(dashboardData.stats)
   └─ Store currentStudentData
   └─ Call getLearningInsights(currentStudentData) - POST /ai-summary

9. AI Summary Response
   └─ renderAiInsights(insights) - Display HTML

10. Page Fully Rendered
    └─ User sees dashboard with all data and charts
```

---

**Great resource for your interview! Good luck! 🚀**


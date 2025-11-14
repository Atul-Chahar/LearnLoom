# AI-Powered Learning Insights Dashboard

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT) [![Python](https://img.shields.io/badge/Python-3.9%2B-blue)](https://www.python.org/) [![Node.js](https://img.shields.io/badge/Node.js-LTS-green)](https://nodejs.org/) [![React](https://img.shields.io/badge/React-^18.2.0-blue)](https://react.dev/) [![Flask](https://img.shields.io/badge/Flask-2.x-lightgrey)](https://flask.palletsprojects.com/) [![Vite](https://img.shields.io/badge/Vite-^4.4.5-purple)](https://vitejs.dev/) [![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-v3-blue)](https://tailwindcss.com/)

---

## Table of Contents

-   [1. Overview](#1-overview)
-   [2. Features](#2-features)
-   [3. Tech Stack](#3-tech-stack)
-   [4. Project Structure](#4-project-structure)
-   [5. Getting Started](#5-getting-started)
    -   [5.1. Prerequisites](#51-prerequisites)
    -   [5.2. Repository Setup](#52-repository-setup)
    -   [5.3. Backend Setup](#53-backend-setup)
    -   [5.4. Frontend Setup](#54-frontend-setup)
    -   [5.5. Data Initialization](#55-data-initialization)
    -   [5.6. Running the Application](#56-running-the-application)
-   [6. API Endpoints](#6-api-endpoints)
-   [7. Development Guidelines](#7-development-guidelines)
-   [8. Contributing](#8-contributing)
-   [9. License](#9-license)
-   [10. Contact](#10-contact)

---

## 1. Overview

The **AI-Powered Learning Insights Dashboard** is an innovative EdTech web application designed to empower educators with data-driven insights into student learning behaviors. By leveraging open datasets, the platform tracks key metrics, visualizes trends, and provides AI-generated recommendations to foster improved student outcomes and engagement. This full-stack application combines a robust Python/Flask backend for data processing and API services with a dynamic React/Vite frontend for an intuitive user experience.

## 2. Features

-   **Interactive Dashboard:** A responsive and user-friendly interface for comprehensive data visualization.
-   **Key Performance Indicators (KPIs):** Displays essential metrics such as overall completion rates, average student scores, and total student counts.
-   **Learning Trend Analysis:** Visualizes student performance and activity trends over time, aiding in early identification of patterns.
-   **AI-Powered Insights:** Integrates with Google's Gemini API to generate actionable, intelligent summaries and recommendations based on analyzed student data.
-   **Dynamic Data Loading:** Fetches and processes data from external sources (e.g., Kaggle) via the backend.
-   **RESTful API:** A well-defined and structured API layer facilitating seamless communication between frontend and backend.

## 3. Tech Stack

### 3.1. Frontend

-   **Framework:** [React](https://react.dev/) (v18.2.0+) - A declarative, component-based JavaScript library for building user interfaces.
-   **Build Tool:** [Vite](https://vitejs.dev/) (v4.4.5+) - A next-generation frontend tooling that provides a fast development experience.
-   **Language:** [TypeScript](https://www.typescriptlang.org/) - A superset of JavaScript that adds static types.
-   **Styling:** [Tailwind CSS](https://tailwindcss.com/) (v3) - A utility-first CSS framework for rapidly building custom designs.
-   **Charting:** [Recharts](https://recharts.org/en-US/) (v3.4.1+) - A composable charting library built with React and D3.
-   **API Communication:** [@google/genai](https://www.npmjs.com/package/@google/genai) (v1.29.1+) - For integrating Google's Generative AI capabilities.

### 3.2. Backend

-   **Framework:** [Flask](https://flask.palletsprojects.com/) (v2.x) - A lightweight Python web framework.
-   **Language:** [Python](https://www.python.org/) (v3.9+)
-   **Core Libraries:**
    -   `Flask-Cors`: Enables Cross-Origin Resource Sharing (CORS) for seamless frontend-backend communication.
    -   `pandas`: A powerful data manipulation and analysis library.
    -   `scikit-learn`: For machine learning functionalities (e.g., predictive modeling, though currently a placeholder).
    -   `kaggle`: Python API client for Kaggle datasets.

## 4. Project Structure

The project adheres to a clear separation of concerns, organized into `backend` and `frontend` directories.

```
.
├── backend/                      # Python Flask application
│   ├── api/                      # Flask Blueprints defining API endpoints
│   ├── config/                   # Configuration settings
│   ├── data/                     # Data storage (raw and cleaned CSVs)
│   │   ├── cleaned/              # Cleaned datasets
│   │   └── raw/                  # Raw downloaded datasets
│   ├── database/                 # Database connection and query logic (placeholder)
│   ├── ml/                       # Machine Learning models and preprocessing (placeholder)
│   ├── services/                 # Core business logic and data processing services
│   ├── utils/                    # Utility functions (e.g., Kaggle download)
│   ├── app.py                    # Main Flask application entry point
│   └── requirements.txt          # Python dependency list
│
├── frontend/                     # React Vite application
│   ├── components/               # Reusable React components (e.g., charts, cards)
│   ├── public/                   # Static assets (e.g., index.html)
│   ├── src/                      # Frontend source code
│   │   ├── api/                  # Centralized API client for backend communication
│   │   └── ...                   # Other frontend modules (e.g., pages, utilities)
│   ├── App.tsx                   # Main React application component
│   ├── index.html                # Main HTML entry point
│   ├── package.json              # Frontend dependencies and scripts
│   ├── tsconfig.json             # TypeScript configuration
│   ├── vite.config.ts            # Vite build configuration
│   └── .env                      # Environment variables (e.g., API keys)
│
└── README.md                     # Project documentation (this file)
```

## 5. Getting Started

Follow these instructions to set up and run the project on your local machine.

### 5.1. Prerequisites

Ensure you have the following installed:

-   **Git**: [Download & Install Git](https://git-scm.com/downloads)
-   **Python 3.9+**: [Download & Install Python](https://www.python.org/downloads/)
-   **Node.js LTS (v18+ or v20+)**: [Download & Install Node.js](https://nodejs.org/en) (includes `npm`)
-   **Visual Studio Code (Recommended IDE)**: [Download & Install VS Code](https://code.visualstudio.com/)

### 5.2. Repository Setup

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd LearnLoom # Or whatever your project root directory is named
    ```

2.  **Create data directories for the backend:**
    ```bash
    mkdir -p backend/data/raw backend/data/cleaned
    ```
    *(Note: `mkdir -p` works on macOS/Linux. On Windows, you might need `mkdir backend\data\raw` and `mkdir backend\data\cleaned` separately.)*

### 5.3. Backend Setup

1.  **Navigate to the backend directory:**
    ```bash
    cd backend
    ```

2.  **Create and activate a Python virtual environment:**
    *   **Windows (PowerShell):**
        ```powershell
        python -m venv venv
        .\venv\Scripts\activate
        ```
    *   **macOS/Linux (Bash/Zsh):**
        ```bash
        python3 -m venv venv
        source venv/bin/activate
        ```
    *(Your terminal prompt should now show `(venv)` indicating the environment is active.)*

3.  **Install Python dependencies:**
    ```bash
    pip install -r requirements.txt
    ```

4.  **Kaggle API Credentials:**
    To enable data downloads from Kaggle, you need to set up your API token:
    *   Go to your [Kaggle account page](https://www.kaggle.com/account) and click "Create New API Token" to download `kaggle.json`.
    *   Place this `kaggle.json` file in the appropriate directory:
        *   **Windows:** `C:\Users\YOUR_USERNAME\.kaggle\`
        *   **macOS/Linux:** `~/.kaggle/` (ensure permissions are `chmod 600 ~/.kaggle/kaggle.json`)

### 5.4. Frontend Setup

1.  **Navigate to the frontend directory:**
    ```bash
    cd ../frontend # From the backend directory, or directly `cd frontend` from project root
    ```

2.  **Set up environment variables:**
    *   Create a new file named `.env` in the `frontend` directory.
    *   Add your Google Gemini API key to it. You can obtain a key from [Google AI Studio](https://aistudio.google.com/app/apikey).
    *   The content of your `.env` file should be:
        ```
VITE_GEMINI_API_KEY="YOUR_API_KEY_HERE"
```

3.  **Install Node.js dependencies:**
    ```bash
    npm install
    ```

### 5.5. Data Initialization

Before running the application, you must initialize the data by triggering the backend's data refresh process.

1.  **Start the Backend Server:**
    *   Ensure you are in the `backend` directory with your virtual environment activated.
    *   Run: `python app.py`

2.  **Trigger Data Refresh:**
    *   Open a **new terminal** (do not close the backend server terminal).
    *   Send a `POST` request to the refresh endpoint. This will download the Kaggle dataset, clean it, and save it to `backend/data/cleaned/cleaned_students.csv`.
    ```bash
    curl -X POST http://127.0.0.1:5000/api/refresh-data
    ```
    *(This command may take a moment to complete.)*

3.  **Restart Backend (Important):**
    *   Go back to your backend server terminal.
    *   Press `Ctrl+C` to stop the server.
    *   Restart it: `python app.py`
    *(This ensures the backend loads the newly created `cleaned_students.csv` file.)*

### 5.6. Running the Application

With both backend and data initialized:

1.  **Start the Backend Server:** (If not already running from step 5.5)
    *   In the `backend` directory (with venv active): `python app.py`

2.  **Start the Frontend Development Server:**
    *   In the `frontend` directory: `npm run dev`

3.  **Access the Application:**
    *   Open your web browser and navigate to `http://localhost:5173` (or the port indicated by `npm run dev`).

## 6. API Endpoints

The backend exposes a comprehensive set of RESTful API endpoints. For detailed request/response schemas, refer to `docs/api_contract.md`.

| Method | Endpoint                               | Description                                                              | 
| :----- | :------------------------------------- | :----------------------------------------------------------------------- |
| `GET`  | `/api/health`                          | Checks if the backend server is operational.                             |
| `GET`  | `/api/dashboard-data`                  | Retrieves all consolidated data required for the main dashboard view.    |
| `GET`  | `/api/average-score`                   | Returns the overall average student score.                               |
| `GET`  | `/api/completion-rate`                 | Returns the percentage of students who completed their courses.          |
| `GET`  | `/api/dropout-rate`                    | Returns the percentage of students who dropped out.                      |
| `GET`  | `/api/total-students`                  | Returns the total number of students in the dataset.                     |
| `GET`  | `/api/active-students`                 | Returns the number of currently active students.                         |
| `GET`  | `/api/score-trend`                     | Provides data for visualizing score trends over time.                    |
| `POST` | `/api/ai-summary`                      | Generates an AI-powered summary of learning insights.                    |
| `POST` | `/api/predict`                         | Predicts student completion likelihood based on input data.              |
| `POST` | `/api/refresh-data`                    | Triggers the data download, cleaning, and loading process.               |
| `GET`  | `/api/student/{student_id}/profile`    | Retrieves a detailed profile for a specific student.                     |
| `GET`  | `/api/system-status`                   | Provides the current status of backend system components.                |
| `GET`  | `/api/course-analytics`                | Returns analytics for all courses.                                       |
| `GET`  | `/api/top-courses`                     | Identifies and returns top-performing courses.                           |
| `GET`  | `/api/hardest-courses`                 | Identifies and returns courses with the lowest average scores.           |

## 7. Development Guidelines

-   **Code Style:** Adhere to existing code styles (e.g., ESLint for JS/TS, Black/Flake8 for Python).
-   **Testing:** Implement unit and integration tests for new features.
-   **Documentation:** Keep API contracts and inline comments up-to-date.
-   **Environment Variables:** Manage sensitive information using `.env` files.

## 8. Contributing

Contributions are welcome! Please refer to `CONTRIBUTING.md` (if available) for guidelines on how to submit pull requests, report bugs, and suggest features.

## 9. License

This project is licensed under the MIT License. See the `LICENSE` file for details.

## 10. Contact

For questions or support, please open an issue on the GitHub repository or contact [Your Name/Team Email].
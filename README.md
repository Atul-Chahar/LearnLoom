# LearnLoom: AI-Powered Learning Insights Dashboard

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT) [![Python](https://img.shields.io/badge/Python-3.9%2B-blue)](https://www.python.org/) [![Node.js](https://img.shields.io/badge/Node.js-LTS-green)](https://nodejs.org/) [![React](https://img.shields.io/badge/React-^18.2.0-blue)](https://react.dev/) [![Flask](https://img.shields.io/badge/Flask-2.x-lightgrey)](https://flask.palletsprojects.com/) [![Vite](https://img.shields.io/badge/Vite-^4.4.5-purple)](https://vitejs.dev/) [![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-v3-blue)](https://tailwindcss.com/)

---

## Table of Contents

-   [1. Executive Summary](#1-executive-summary)
-   [2. Core Features](#2-core-features)
-   [3. System Architecture](#3-system-architecture)
    -   [3.1. Frontend](#31-frontend)
    -   [3.2. Backend](#32-backend)
    -   [3.3. Data Pipeline](#33-data-pipeline)
-   [4. Technology Stack & Rationale](#4-technology-stack--rationale)
    -   [4.1. Frontend Tech](#41-frontend-tech)
    -   [4.2. Backend Tech](#42-backend-tech)
-   [5. Project Structure](#5-project-structure)
-   [6. Local Development Setup](#6-local-development-setup)
    -   [6.1. Prerequisites](#61-prerequisites)
    -   [6.2. Environment Configuration](#62-environment-configuration)
    -   [6.3. Data Initialization](#63-data-initialization)
    -   [6.4. Running the Application](#64-running-the-application)
-   [7. API Endpoints](#7-api-endpoints)
-   [8. Development Philosophy](#8-development-philosophy)
-   [9. Future Work](#9-future-work)
-   [10. Contributing](#10-contributing)
-   [11. License](#11-license)

---

## 1. Executive Summary

LearnLoom is a full-stack EdTech web application engineered to provide educators with actionable, data-driven insights into student learning patterns. By processing and visualizing academic datasets, the platform transforms raw data into a strategic tool for improving educational outcomes.

The system's architecture is built on a decoupled frontend and backend, communicating via a RESTful API. The backend, powered by Python and Flask, is responsible for data ingestion, cleaning, and serving aggregated analytics. The frontend, a modern React/Vite single-page application, provides a responsive and intuitive interface for data visualization and interaction. A key feature is the integration with Google's Gemini API to deliver qualitative, AI-generated summaries of quantitative data, bridging the gap between numbers and narrative.

## 2. Core Features

-   **Centralized Analytics Dashboard:** A high-performance, responsive UI presenting a holistic view of student data through interactive charts and KPI cards.
-   **Key Performance Indicators (KPIs):** At-a-glance metrics including overall course completion rates, average student scores, and total enrollment figures.
-   **Trend Analysis:** Time-series visualizations of student performance and engagement, enabling educators to identify learning patterns and potential intervention points.
-   **AI-Generated Narrative Insights:** Leverages the Google Gemini API to synthesize complex data into concise, human-readable summaries and actionable recommendations.
-   **Automated Data Pipeline:** A backend process for fetching, cleaning, and preparing datasets from external sources like Kaggle, ensuring data integrity.
-   **RESTful API Architecture:** A clearly defined API contract ensures a stable and scalable interface between the client and server.

## 3. System Architecture

The application employs a classic client-server model with a decoupled architecture, promoting separation of concerns and independent scalability.

### 3.1. Frontend (Client)

The frontend is a **Single-Page Application (SPA)** built with React. It is responsible for all presentation logic. It does not contain any business logic; instead, it queries the backend API for data and renders it. State management is handled within React components, and API interactions are centralized for maintainability.

### 3.2. Backend (Server)

The backend is a **stateless RESTful API** built with Flask. Its primary responsibilities are:
1.  **Exposing Data:** It provides structured JSON endpoints for the frontend to consume.
2.  **Business Logic:** It performs all data calculations, aggregations, and analysis.
3.  **Data Persistence:** It manages the lifecycle of the data, from raw file to cleaned, in-memory DataFrame.
4.  **Third-Party Integration:** It securely communicates with the Google Gemini API, abstracting this complexity away from the client.

### 3.3. Data Pipeline

The application relies on a simple, script-driven ETL (Extract, Transform, Load) process:
1.  **Extract:** The `refresh-data` endpoint triggers a Python script that uses the Kaggle API to download a raw CSV dataset into the `backend/data/raw/` directory.
2.  **Transform:** The raw data is then processed by a cleaning service (`services/data_cleaning.py`). This step standardizes column names, handles missing values, removes duplicates, and ensures data types are correct. The cleaned data is saved as a new CSV in `backend/data/cleaned/`.
3.  **Load:** When the Flask server starts, it loads the cleaned CSV into a `pandas` DataFrame, which is then held in memory to serve API requests quickly. This in-memory approach is suitable for datasets of this size and provides low-latency query responses.

## 4. Technology Stack & Rationale

The technology choices were made to prioritize development speed, scalability, and maintainability.

### 4.1. Frontend Tech

-   **Framework:** React (v18.2.0+)
    -   *Why?* Its component-based architecture is ideal for building a modular and maintainable UI. The vast ecosystem and community support accelerate development.
-   **Build Tool:** Vite (v4.4.5+)
    -   *Why?* Vite offers a significantly faster development experience compared to traditional bundlers, with near-instant Hot Module Replacement (HMR) and optimized build outputs.
-   **Language:** TypeScript
    -   *Why?* It provides static typing, which reduces runtime errors, improves code quality, and makes the codebase easier to refactor and scale.
-   **Styling:** Tailwind CSS (v3)
    -   *Why?* A utility-first CSS framework that enables rapid UI development without leaving the HTML, promoting consistency and reducing CSS file size.
-   **Charting:** Recharts
    -   *Why?* A composable and declarative charting library for React that simplifies the creation of complex, interactive visualizations.

### 4.2. Backend Tech

-   **Framework:** Flask (v2.x)
    -   *Why?* As a lightweight and unopinionated micro-framework, Flask is perfect for building RESTful APIs. It provides the essentials without imposing a rigid structure, allowing for flexibility.
-   **Language:** Python (v3.9+)
    -   *Why?* The de facto language for data science and machine learning. Its powerful data manipulation libraries (`pandas`) are central to the backend's functionality.
-   **Core Libraries:**
    -   `pandas`: The cornerstone of our data processing engine, used for efficient data cleaning, transformation, and analysis.
    -   `Flask-Cors`: Middleware to handle Cross-Origin Resource Sharing, essential for allowing the frontend (on a different port) to communicate with the backend.
    -   `kaggle`: The official Python client for interacting with the Kaggle API to automate dataset downloads.

## 5. Project Structure

The monorepo is organized with a clear boundary between the `frontend` and `backend`, minimizing coupling.

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
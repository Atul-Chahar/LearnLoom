# Project Overview: AI-Powered Learning Insights Dashboard

## 1. Project Objective

The goal is to build an EdTech web application that tracks and analyzes student learning behaviors using open datasets. The dashboard will visualize key metrics and provide personalized, AI-driven insights. A predictive machine learning model will be included as a bonus feature to estimate student completion likelihood.

## 2. Core Features

-   **Data Ingestion:** Fetch student learning data from open sources like the Kaggle API or the UK's Open Data Education API.
-   **Data Visualization:** Display trends and key performance indicators, including:
    -   Course completion rates
    -   Average quiz/test scores
    -   Student dropout rates
-   **Predictive Analytics (Bonus):** Implement a machine learning model to predict the probability of a student completing a course.
-   **AI-Powered Insights:** Show personalized feedback and analysis.

## 3. Tech Stack

-   **Backend:** Python (with Flask and Pandas)
-   **Frontend:** React
-   **Data Visualization:** Plotly (or a similar charting library)
-   **API Testing:** Postman

## 4. Folder Structure Analysis

The current folder and file structure is **excellent** and aligns perfectly with the project's requirements. It demonstrates a clear separation of concerns and follows modern web development best practices.

-   **`backend/`**: The structure is well-organized for a Flask application.
    -   The `api`, `database`, `services`, and `utils` subdirectories correctly separate routing, data persistence, business logic, and utility functions.
    -   The `ml` directory (`train_model.py`, `preprocess.py`) provides a dedicated space for the predictive modeling feature.
    -   The `utils` folder containing `kaggle_download.py` and `uk_api_fetch.py` directly maps to the data source requirements.

-   **`frontend/`**: The structure is standard for a React application.
    -   The `pages`, `components`, and `charts` directories provide a logical way to organize UI elements.
    -   `utils/api.js` is the correct place to centralize communication with the backend.

-   **`docs/`**: This is the appropriate location for project documentation like this overview.

No changes are needed for the project structure. It provides a solid foundation for building the application as described.

# Frontend Development and Debugging Plan

This document outlines a structured approach for developing, running, and debugging the LearnLoom frontend.

## 1. Project Setup and Installation

First, ensure all project dependencies are installed. Navigate to the `frontend` directory and run the package manager's install command.

```bash
cd frontend
npm install
```

## 2. Running the Development Server

To see your changes and check for errors, start the Vite development server.

```bash
npm run dev
```

This command will typically start the application on `http://localhost:5173`. Open this URL in your web browser.

## 3. Debugging and Finding Errors

When you encounter issues, the browser's developer console is the most important tool for diagnosis.

1.  **Open Developer Tools:** In your browser, right-click on the page and select "Inspect" or press `F12`.
2.  **Go to the Console Tab:** Look for a "Console" tab within the developer tools.
3.  **Identify Errors:** Errors will be displayed in red. These messages often include the file name and line number where the error occurred, which is crucial for debugging.

**When reporting errors, please copy and paste the full error message text.**

## 4. Code Structure and Conventions

The frontend code is organized as follows:

-   **`src/pages`**: Top-level components for each page/view (e.g., `DashboardPage.jsx`).
-   **`src/components`**: Reusable UI components used across different pages (e.g., `Navbar.jsx`, `MetricCard.jsx`).
-   **`src/charts`**: Specialized components for data visualization.
-   **`src/utils/api.js`**: A dedicated module for making API calls to the backend. All communication with the backend should be centralized here.
-   **`src/mocks`**: Static JSON files for testing components without a live backend.

When adding new code, please follow the existing structure and conventions.

## 5. API Integration

The `api.js` file should be used to fetch data from the backend. This keeps API logic separate from your UI components and makes the code easier to manage.

**Example:**

```javascript
// in api.js
export const getCourses = async () => {
  const response = await fetch('/api/courses');
  if (!response.ok) {
    throw new Error('Failed to fetch courses');
  }
  return response.json();
};

// in a component
import { getCourses } from '../utils/api';

// ...
useEffect(() => {
  getCourses()
    .then(data => setCourses(data))
    .catch(error => console.error(error));
}, []);
```

## 6. Next Steps

To proceed with fixing the specific errors you're facing, please provide the error messages from the browser console.

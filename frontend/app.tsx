
import React from 'react';
import Dashboard from './src/pages/DashboardPage';

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <header className="bg-white dark:bg-gray-800 shadow-sm">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-bold leading-tight text-gray-900 dark:text-white flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 mr-3 text-indigo-600" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
              <path d="M10 2a2.5 2.5 0 012.5 2.5V7a.5.5 0 001 0V4.5A3.5 3.5 0 0010 1 .5.5 0 009.5 1.5v2.5a.5.5 0 001 0V1.5a.5.5 0 00-.5-.5z" clipRule="evenodd" fillRule="evenodd" />
            </svg>
            AI-Powered Learning Insights Dashboard
          </h1>
        </div>
      </header>
      <main>
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <Dashboard />
        </div>
      </main>
      <footer className="text-center py-4 text-sm text-gray-500">
        <p>&copy; 2024 Learning Insights. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default App;

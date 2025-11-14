import React from 'react';

const AiInsights = ({ insights, isLoading, error }) => (
  <div className="bg-white dark:bg-gray-800 p-5 shadow-lg rounded-lg h-full">
    <h3 className="font-semibold text-gray-900 dark:text-white mb-3">AI-Powered Insights</h3>
    {isLoading && <p className="text-gray-500 dark:text-gray-400">Generating insights...</p>}
    {error && <p className="text-red-500">{error}</p>}
    {insights && !isLoading && <p className="text-gray-700 dark:text-gray-300">{insights}</p>}
  </div>
);

export default AiInsights;

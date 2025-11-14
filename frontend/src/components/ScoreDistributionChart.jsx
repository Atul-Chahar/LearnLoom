import React from 'react';

const ScoreDistributionChart = ({ data }) => (
  <div className="bg-white dark:bg-gray-800 p-5 shadow-lg rounded-lg">
    <h3 className="font-semibold text-gray-900 dark:text-white">Score Distribution</h3>
    <div className="mt-4 text-center text-gray-500 dark:text-gray-400">
      <p>Score Distribution Chart Placeholder</p>
      <p className="text-sm">({data.length} students)</p>
    </div>
  </div>
);

export default ScoreDistributionChart;

import React from 'react';

// Define a TypeScript interface for the summary data
interface Summary {
  totalStudents: number;
  courses: number;
  averageScore: number;
  completionRate: number;
}

// Define the props for the SummaryHeader component
interface SummaryHeaderProps {
  summary: Summary;
}

const SummaryHeader: React.FC<SummaryHeaderProps> = ({ summary }) => {
  const { totalStudents, courses, averageScore, completionRate } = summary;

  return (
    <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-6 mb-6">
      <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Dashboard Summary</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Total Students</p>
          <p className="text-2xl font-semibold text-gray-900 dark:text-white">{totalStudents}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Courses</p>
          <p className="text-2xl font-semibold text-gray-900 dark:text-white">{courses}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Average Score</p>
          <p className="text-2xl font-semibold text-gray-900 dark:text-white">{averageScore.toFixed(1)}%</p>
        </div>
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Completion Rate</p>
          <p className="text-2xl font-semibold text-gray-900 dark:text-white">{completionRate.toFixed(1)}%</p>
        </div>
      </div>
    </div>
  );
};

export default SummaryHeader;

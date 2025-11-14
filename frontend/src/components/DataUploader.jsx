import React, { useState } from 'react';

// Mock data to simulate a CSV file upload
const mockStudentData = [
  { id: 1, name: 'Alice', completed: true, hoursWatched: 15.5, quizScores: [8, 9, 10] },
  { id: 2, name: 'Bob', completed: false, hoursWatched: 7.2, quizScores: [6, 7, 7] },
  { id: 3, name: 'Charlie', completed: true, hoursWatched: 12.1, quizScores: [9, 9, 8] },
  { id: 4, name: 'Diana', completed: false, hoursWatched: 4.5, quizScores: [5, 6, 5] },
  { id: 5, name: 'Ethan', completed: true, hoursWatched: 18.0, quizScores: [10, 10, 9] },
];

const DataUploader = ({ onDataLoaded }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleLoadMockData = () => {
    setIsLoading(true);
    // Simulate the delay of uploading and processing a file
    setTimeout(() => {
      onDataLoaded(mockStudentData);
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="text-center bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-200">Upload Your Data</h2>
      <p className="text-gray-600 dark:text-gray-400 mb-6">
        To begin, please upload a CSV file with student data.
        <br />
        For this demo, you can load a sample dataset.
      </p>
      <button
        onClick={handleLoadMockData}
        disabled={isLoading}
        className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-6 rounded-md transition-colors disabled:bg-gray-400"
      >
        {isLoading ? 'Loading...' : 'Load Sample Data'}
      </button>
    </div>
  );
};

export default DataUploader;

import React from 'react';

const StatCard = ({ title, value }) => (
  <div className="bg-white dark:bg-gray-800 p-5 shadow-lg rounded-lg text-center">
    <h3 className="text-md font-medium text-gray-500 dark:text-gray-400">{title}</h3>
    <p className="mt-1 text-3xl font-semibold text-gray-900 dark:text-white">{value}</p>
  </div>
);

export default StatCard;

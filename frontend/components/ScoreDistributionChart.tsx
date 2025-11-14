import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { StudentData } from '../types';

interface ScoreDistributionChartProps {
  data: StudentData[];
}

const ScoreDistributionChart: React.FC<ScoreDistributionChartProps> = ({ data }) => {
  const chartData = useMemo(() => {
    // Score range is 0-100 for individual scores
    const scoreBins = [
      { name: '0-59 (Fail)', count: 0 },
      { name: '60-69 (Pass)', count: 0 },
      { name: '70-79 (Good)', count: 0 },
      { name: '80-89 (Very Good)', count: 0 },
      { name: '90-100 (Excellent)', count: 0 },
    ];

    data.forEach(student => {
      // Calculate average score from individual scores
      const score = (student.math_score + student.reading_score + student.writing_score) / 3;
      
      if (score < 60) scoreBins[0].count++;
      else if (score < 70) scoreBins[1].count++;
      else if (score < 80) scoreBins[2].count++;
      else if (score < 90) scoreBins[3].count++;
      else scoreBins[4].count++;
    });

    return scoreBins;
  }, [data]);

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md h-full">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Score Distribution</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(107, 114, 128, 0.3)" />
          <XAxis dataKey="name" stroke="#9CA3AF" />
          <YAxis stroke="#9CA3AF" allowDecimals={false} />
          <Tooltip 
            cursor={{fill: 'rgba(107, 114, 128, 0.1)'}}
            contentStyle={{
              background: 'rgba(31, 41, 55, 0.8)',
              borderColor: '#4B5563',
              borderRadius: '0.5rem'
            }}
          />
          <Legend />
          <Bar dataKey="count" name="Number of Students" fill="#4F46E5" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ScoreDistributionChart;

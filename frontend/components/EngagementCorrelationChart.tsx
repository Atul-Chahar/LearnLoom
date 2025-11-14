import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { StudentData } from '../types';

interface EngagementCorrelationChartProps {
  data: StudentData[];
}

const EngagementCorrelationChart: React.FC<EngagementCorrelationChartProps> = ({ data }) => {
  const chartData = useMemo(() => {
    // Group students by test preparation course and calculate average score
    const groupedData: { [key: string]: { totalScore: number; count: number } } = {};

    data.forEach(student => {
      const testPrep = student.test_prep_course === 'none' ? 'No Prep' : 'Completed Prep';
      const averageScore = (student.math_score + student.reading_score + student.writing_score) / 3;

      if (!groupedData[testPrep]) {
        groupedData[testPrep] = { totalScore: 0, count: 0 };
      }
      groupedData[testPrep].totalScore += averageScore;
      groupedData[testPrep].count++;
    });

    return Object.keys(groupedData).map(key => ({
      name: key,
      averageScore: groupedData[key].totalScore / groupedData[key].count,
    }));
  }, [data]);

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md h-full">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Performance by Test Preparation</h3>
      <ResponsiveContainer width="100%" height={400}>
        <BarChart
          data={chartData}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(107, 114, 128, 0.3)" />
          <XAxis dataKey="name" stroke="#9CA3AF" />
          <YAxis stroke="#9CA3AF" domain={[0, 100]} />
          <Tooltip
            cursor={{ fill: 'rgba(107, 114, 128, 0.1)' }}
            contentStyle={{
              background: 'rgba(31, 41, 55, 0.8)',
              borderColor: '#4B5563',
              borderRadius: '0.5rem'
            }}
          />
          <Legend />
          <Bar dataKey="averageScore" name="Average Score" fill="#4F46E5" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default EngagementCorrelationChart;

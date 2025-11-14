import React, { useMemo } from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { StudentData } from '../types';

interface EngagementCorrelationChartProps {
  data: StudentData[];
}

const EngagementCorrelationChart: React.FC<EngagementCorrelationChartProps> = ({ data }) => {
  const chartData = useMemo(() => {
    return data.map(student => ({
      hours: student.hoursWatched,
      score: (student.math_score + student.reading_score + student.writing_score) / 3, // Calculate average score
      completed: student.completed ? 'Completed' : 'Did Not Complete'
    }));
  }, [data]);

  const completedData = chartData.filter(d => d.completed === 'Completed');
  const dropoutData = chartData.filter(d => d.completed === 'Did Not Complete');

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Engagement vs. Performance</h3>
      <ResponsiveContainer width="100%" height={400}>
        <ScatterChart
          margin={{
            top: 20,
            right: 20,
            bottom: 20,
            left: 20,
          }}
        >
          <CartesianGrid stroke="rgba(107, 114, 128, 0.3)" />
          <XAxis type="number" dataKey="hours" name="Hours on Course" unit="h" stroke="#9CA3AF" />
          <YAxis type="number" dataKey="score" name="Quiz Score" unit="" stroke="#9CA3AF" domain={[0, 1000]} />
          <Tooltip 
            cursor={{ strokeDasharray: '3 3' }}
            contentStyle={{
              background: 'rgba(31, 41, 55, 0.8)',
              borderColor: '#4B5563',
              borderRadius: '0.5rem'
            }}
          />
          <Legend />
          <Scatter name="Completed" data={completedData} fill="#10B981" />
          <Scatter name="Did Not Complete" data={dropoutData} fill="#EF4444" />
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
};

export default EngagementCorrelationChart;

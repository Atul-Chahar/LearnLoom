
import React, { useMemo } from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { StudentData } from '../types';

interface CompletionRateChartProps {
  data: StudentData[];
}

const CompletionRateChart: React.FC<CompletionRateChartProps> = ({ data }) => {
  const chartData = useMemo(() => {
    const completedCount = data.filter(s => s.completed).length;
    const dropoutCount = data.length - completedCount;
    return [
      { name: 'Completed', value: completedCount },
      { name: 'Dropped Out', value: dropoutCount },
    ];
  }, [data]);

  const COLORS = ['#10B981', '#EF4444']; // Green-500, Red-500

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md h-full">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Completion Rate</h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={100}
            fill="#8884d8"
            dataKey="value"
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              background: 'rgba(31, 41, 55, 0.8)', // gray-800 with transparency
              borderColor: '#4B5563', // gray-600
              color: '#F9FAFB', // gray-50
              borderRadius: '0.5rem'
            }}
          />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CompletionRateChart;

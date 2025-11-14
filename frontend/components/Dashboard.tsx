import React, { useState, useEffect } from 'react';
import { StudentData, DashboardStats } from '../types';
import { getDashboardData } from '../src/api'; // Corrected import path
import { getLearningInsights } from '../services/geminiService';

import StatCard from './StatCard';
import CompletionRateChart from './CompletionRateChart';
import ScoreDistributionChart from './ScoreDistributionChart';
import EngagementCorrelationChart from './EngagementCorrelationChart';
import AiInsights from './AiInsights';

const Dashboard: React.FC = () => {
  const [studentData, setStudentData] = useState<StudentData[]>([]);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [insights, setInsights] = useState<string>('');
  
  // Combined loading state for all async operations
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  // State for AI insights loading, separate from initial data load
  const [isAiLoading, setIsAiLoading] = useState<boolean>(false);

  // Fetch initial dashboard data from the backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await getDashboardData();
        if (data.error) {
          throw new Error(data.error);
        }
        setStats(data.stats);
        setStudentData(data.studentData);
      } catch (err) {
        setError('Failed to fetch dashboard data from the backend. Please ensure the backend server is running.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Fetch AI insights when student data is available
  useEffect(() => {
    if (!studentData || studentData.length === 0) {
      return;
    }

    const fetchInsights = async () => {
      try {
        setIsAiLoading(true);
        const generatedInsights = await getLearningInsights(studentData);
        setInsights(generatedInsights);
      } catch (err) {
        setError('Failed to fetch AI-powered insights.');
        console.error(err);
      } finally {
        setIsAiLoading(false);
      }
    };

    fetchInsights();
  }, [studentData]);

  if (isLoading) {
    return <div className="text-center p-8">Loading dashboard data...</div>;
  }

  if (error) {
    return <div className="text-center p-8 text-red-500">{error}</div>;
  }

  if (!stats || studentData.length === 0) {
    return <div className="text-center p-8">No student data available.</div>;
  }

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-800">Dashboard Overview</h2>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard title="Total Students" value={stats.totalStudents.toString()} />
        <StatCard title="Completion Rate" value={`${stats.completionRate}%`} />
        <StatCard title="Average Score" value={stats.averageScore.toString()} />
      </div>

      {/* Main Grid for Charts and Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column for charts */}
        <div className="lg:col-span-2 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <CompletionRateChart data={studentData} />
                <ScoreDistributionChart data={studentData} />
            </div>
            <EngagementCorrelationChart data={studentData} />
        </div>

        {/* Right column for AI Insights */}
        <div className="lg:col-span-1">
          <AiInsights insights={insights} isLoading={isAiLoading} error={null} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;


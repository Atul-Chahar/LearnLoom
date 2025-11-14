import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { StudentData } from '../types';
import { getLearningInsights } from '../services/geminiService';

import StatCard from './StatCard';
import CompletionRateChart from './CompletionRateChart';
import ScoreDistributionChart from './ScoreDistributionChart';
import EngagementCorrelationChart from './EngagementCorrelationChart';
import AiInsights from './AiInsights';
import DataUploader from './DataUploader';

const Dashboard: React.FC = () => {
  const [studentData, setStudentData] = useState<StudentData[] | null>(null);
  const [insights, setInsights] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!studentData || studentData.length === 0) {
      return;
    }

    const fetchInsights = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const generatedInsights = await getLearningInsights(studentData);
        setInsights(generatedInsights);
      } catch (err) {
        setError('Failed to fetch AI-powered insights. Please try again later.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInsights();
  }, [studentData]);

  const handleReset = useCallback(() => {
    setStudentData(null);
    setInsights('');
    setError(null);
  }, []);

  const dashboardStats = useMemo(() => {
    if (!studentData) return null;

    const totalStudents = studentData.length;
    const completedCount = studentData.filter(s => s.completed).length;
    const completionRate = totalStudents > 0 ? (completedCount / totalStudents) * 100 : 0;
    const totalHours = studentData.reduce((acc, s) => acc + s.hoursWatched, 0);
    const avgHours = totalStudents > 0 ? totalHours / totalStudents : 0;
    const avgScore = studentData.reduce((acc, s) => {
        const studentAvg = s.quizScores.reduce((a, b) => a + b, 0) / (s.quizScores.length || 1);
        return acc + studentAvg;
    }, 0) / (totalStudents || 1);


    return {
      totalStudents: totalStudents.toString(),
      completionRate: `${completionRate.toFixed(1)}%`,
      avgScore: `${avgScore.toFixed(1)}`,
      avgHours: `${avgHours.toFixed(1)} hrs`,
    };
  }, [studentData]);

  if (!studentData) {
    return <DataUploader onDataLoaded={setStudentData} />;
  }

  return (
    <div className="space-y-6">
       <div className="flex justify-between items-center flex-wrap gap-4">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">Dashboard Overview</h2>
        <button
          onClick={handleReset}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-md flex items-center transition-colors text-sm"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          Load New Data
        </button>
      </div>

      {/* Stats Grid */}
      {dashboardStats && (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard title="Total Students" value={dashboardStats.totalStudents} />
          <StatCard title="Completion Rate" value={dashboardStats.completionRate} />
          <StatCard title="Average Score" value={dashboardStats.avgScore} />
          <StatCard title="Avg. Study Hours" value={dashboardStats.avgHours} />
        </div>
      )}

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
          <AiInsights insights={insights} isLoading={isLoading} error={error} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

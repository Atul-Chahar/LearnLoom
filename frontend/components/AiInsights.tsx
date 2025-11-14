
import React from 'react';

interface AiInsightsProps {
  insights: string;
  isLoading: boolean;
  error: string | null;
}

const AiInsights: React.FC<AiInsightsProps> = ({ insights, isLoading, error }) => {

  const formattedInsights = insights
    .replace(/### (.*)/g, '<h4 class="text-md font-semibold mt-4 mb-2 text-indigo-400">$1</h4>')
    .replace(/\*\* (.*) \*\*/g, '<strong class="text-white">$1</strong>')
    .replace(/\* (.*)/g, '<li class="ml-5 list-disc">$1</li>')
    .replace(/\n/g, '<br />')
    .replace(/<br \/><li>/g, '<li>')
    .replace(/<\/li><br \/>/g, '</li>');


  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-md h-full flex flex-col">
      <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.636-6.364l-.707-.707M12 21v-1m0-16a.5.5 0 01.5.5v1a.5.5 0 01-1 0v-1a.5.5 0 01.5-.5zM12 7a5 5 0 100 10 5 5 0 000-10z" />
        </svg>
        AI-Powered Insights
      </h3>
      <div className="flex-grow overflow-y-auto text-gray-300 text-sm prose prose-invert prose-p:my-1 prose-li:my-0.5">
        {isLoading && (
          <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-400"></div>
            <p className="ml-4">Generating insights...</p>
          </div>
        )}
        {error && <p className="text-red-400">{error}</p>}
        {!isLoading && !error && (
          <div dangerouslySetInnerHTML={{ __html: formattedInsights }} />
        )}
      </div>
    </div>
  );
};

export default AiInsights;

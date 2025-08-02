import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

function Dashboard() {
  const { state, dispatch } = useApp();
  const navigate = useNavigate();
  const analysis = state.interviewData.analysis;
  const responses = state.interviewData.responses;
  const user = state.user;

  // Redirect if no analysis data
  React.useEffect(() => {
    if (!analysis) {
      navigate('/interview');
    }
  }, [analysis, navigate]);

  if (!analysis) {
    return null;
  }

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBgColor = (score) => {
    if (score >= 80) return 'bg-green-100 border-green-200';
    if (score >= 60) return 'bg-yellow-100 border-yellow-200';
    return 'bg-red-100 border-red-200';
  };

  const startNewInterview = () => {
    dispatch({ type: 'RESET_INTERVIEW' });
    navigate('/interview');
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Interview Results</h1>
        {user.name && (
          <p className="text-xl text-gray-600">
            Great job, {user.name}! Here's your detailed feedback for the {user.role} position.
          </p>
        )}
      </div>

      {/* Overall Score */}
      <div className={`card text-center ${getScoreBgColor(analysis.overallScore)}`}>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Overall Performance</h2>
        <div className="flex items-center justify-center space-x-8">
          <div className="relative w-32 h-32">
            <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 120 120">
              <circle
                cx="60"
                cy="60"
                r="50"
                stroke="#e5e7eb"
                strokeWidth="8"
                fill="none"
              />
              <circle
                cx="60"
                cy="60"
                r="50"
                stroke={analysis.overallScore >= 80 ? '#10b981' : analysis.overallScore >= 60 ? '#f59e0b' : '#ef4444'}
                strokeWidth="8"
                fill="none"
                strokeDasharray={`${(analysis.overallScore * 314) / 100} 314`}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className={`text-3xl font-bold ${getScoreColor(analysis.overallScore)}`}>
                {analysis.overallScore}
              </span>
            </div>
          </div>
          <div className="text-left">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Performance Summary</h3>
            <p className="text-gray-700 max-w-md">{analysis.summary}</p>
          </div>
        </div>
      </div>

      {/* Detailed Analysis Grid */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Strengths */}
        <div className="card">
          <div className="flex items-center mb-4">
            <div className="bg-green-100 p-2 rounded-lg mr-3">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900">Strengths</h3>
          </div>
          <ul className="space-y-3">
            {analysis.strengths.map((strength, index) => (
              <li key={index} className="flex items-start">
                <svg className="w-5 h-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-gray-700">{strength}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Areas for Improvement */}
        <div className="card">
          <div className="flex items-center mb-4">
            <div className="bg-yellow-100 p-2 rounded-lg mr-3">
              <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900">Areas for Improvement</h3>
          </div>
          <ul className="space-y-3">
            {analysis.weaknesses.map((weakness, index) => (
              <li key={index} className="flex items-start">
                <svg className="w-5 h-5 text-yellow-500 mt-0.5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-gray-700">{weakness}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Improvement Suggestions and Resources */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Improvement Tips */}
        <div className="card">
          <div className="flex items-center mb-4">
            <div className="bg-blue-100 p-2 rounded-lg mr-3">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900">Improvement Tips</h3>
          </div>
          <ul className="space-y-3">
            {analysis.improvements.map((improvement, index) => (
              <li key={index} className="flex items-start">
                <svg className="w-5 h-5 text-blue-500 mt-0.5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <span className="text-gray-700">{improvement}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Recommended Resources */}
        <div className="card">
          <div className="flex items-center mb-4">
            <div className="bg-purple-100 p-2 rounded-lg mr-3">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-900">Recommended Resources</h3>
          </div>
          <ul className="space-y-3">
            {analysis.resources.map((resource, index) => (
              <li key={index} className="flex items-start">
                <svg className="w-5 h-5 text-purple-500 mt-0.5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
                <span className="text-gray-700">{resource}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Interview Transcript */}
      <div className="card">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Interview Transcript</h3>
        <div className="space-y-6 max-h-96 overflow-y-auto">
          {responses.map((response, index) => (
            <div key={index} className="border-l-4 border-primary-200 pl-4">
              <div className="mb-2">
                <span className="inline-block bg-primary-100 text-primary-800 text-xs font-semibold px-2 py-1 rounded">
                  Question {response.questionNumber}
                </span>
              </div>
              <p className="text-gray-900 font-medium mb-2">{response.question}</p>
              <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">{response.answer}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <button
          onClick={startNewInterview}
          className="btn-primary"
        >
          Take Another Interview
        </button>
        <Link to="/resume-score" className="btn-secondary text-center">
          Check Resume Score
        </Link>
        <Link to="/" className="btn-secondary text-center">
          Back to Home
        </Link>
      </div>

      {/* Export/Save Options */}
      <div className="card bg-gray-50 text-center">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Want to save these results?</h3>
        <p className="text-gray-600 mb-4">
          Take a screenshot or bookmark this page to reference your feedback later.
        </p>
        <button
          onClick={() => window.print()}
          className="btn-secondary"
        >
          Print Results
        </button>
      </div>
    </div>
  );
}

export default Dashboard;
import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div className="max-w-4xl mx-auto text-center">
      {/* Hero Section */}
     <div className="mb-16">
  <h1
    className="text-5xl font-bold text-yellow-500 mb-6"
    style={{ fontFamily: "'poppins', cursive" }}
  >
    Welcome to <span className="text-yellow-500">Virtual Panel</span>
  </h1>
</div>



      {/* Feature Cards */}
      <div className="grid md:grid-cols-2 gap-8 mb-16">
        <Link to="/resume-score" className="group">
          <div className="card group-hover:scale-105 transition-transform duration-300 h-full">
            <div className="text-primary-500 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-white-900 mb-4">Check Your Resume Score</h3>
            <p className="text-gray-100 mb-6">
              Upload your resume and get an instant ATS score with detailed improvement suggestions 
              powered by AI.
            </p>
            <div className="btn-primary inline-block">
              Analyze Resume
            </div>
          </div>
        </Link>

        <Link to="/interview" className="group">
          <div className="card group-hover:scale-105 transition-transform duration-300 h-full">
            <div className="text-primary-500 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-white-900 mb-4">Take Mock Interview</h3>
            <p className="text-gray-100 mb-6">
              Practice with AI-generated questions and get detailed feedback on your responses 
              using voice recognition.
            </p>
            <div className="btn-primary inline-block">
              Start Interview
            </div>
          </div>
        </Link>
      </div>

      {/* Features Section */}
      <div className="bg-gray-800 rounded-2xl shadow-xl p-8">
        <h2 className="text-3xl font-bold text-gray-100 mb-8">Why Choose Virtual Panel?</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-purple-700 mb-2">AI-Powered</h3>
            <p className="text-gray-100">Advanced AI technology provides accurate scoring and personalized feedback</p>
          </div>
          <div className="text-center">
            <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-purple-700 mb-2">No Registration</h3>
            <p className="text-gray-100">Start using immediately without any signup or login requirements</p>
          </div>
          <div className="text-center">
            <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 00-2-2z" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-purple-700 mb-2">Detailed Analytics</h3>
            <p className="text-gray-100">Get comprehensive feedback with actionable insights for improvement</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
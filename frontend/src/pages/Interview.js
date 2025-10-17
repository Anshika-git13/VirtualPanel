import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import VoiceRecorder from '../components/VoiceRecorder';
import LoadingSpinner from '../components/LoadingSpinner';
import axios from 'axios';

function Interview() {
  const [step, setStep] = useState('setup'); // setup, interview, analyzing
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [isListening, setIsListening] = useState(false);
  const [loading, setLoading] = useState(false);
  const [userInfo, setUserInfo] = useState({ name: '', role: '' });
  
  const { state, dispatch } = useApp();
  const navigate = useNavigate();

  const questions = state.interviewData.questions;
  const responses = state.interviewData.responses;

  useEffect(() => {
    // Set user info from context if available
    setUserInfo(state.user);
  }, [state.user]);

  const handleStartInterview = async () => {
    if (!userInfo.role.trim()) {
      alert('Please enter your target role');
      return;
    }

    setLoading(true);
    dispatch({ type: 'SET_USER', payload: userInfo });

    try {
      const response = await axios.post('/api/interview/questions', {
        role: userInfo.role,
        name: userInfo.name
      });

      if (response.data.success) {
        dispatch({
          type: 'SET_INTERVIEW_QUESTIONS',
          payload: response.data.questions
        });
        setStep('interview');
      }
    } catch (error) {
      console.error('Error generating questions:', error);
      alert('Failed to generate questions. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerSubmit = (transcript) => {
    if (!transcript.trim()) {
      alert('Please provide an answer before continuing');
      return;
    }

    const response = {
      question: questions[currentQuestion],
      answer: transcript,
      questionNumber: currentQuestion + 1
    };

    dispatch({
      type: 'ADD_INTERVIEW_RESPONSE',
      payload: response
    });

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // Interview completed, analyze responses
      analyzeInterview([...responses, response]);
    }
  };

  const analyzeInterview = async (allResponses) => {
    setStep('analyzing');
    setLoading(true);

    try {
      const response = await axios.post('/api/interview/analyze', {
        transcript: allResponses,
        role: userInfo.role,
        name: userInfo.name
      });

      if (response.data.success) {
        dispatch({
          type: 'SET_INTERVIEW_ANALYSIS',
          payload: response.data.analysis
        });
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Error analyzing interview:', error);
      alert('Failed to analyze interview. Please try again.');
      setStep('interview');
    } finally {
      setLoading(false);
    }
  };

  const resetInterview = () => {
    setStep('setup');
    setCurrentQuestion(0);
    setIsListening(false);
    dispatch({ type: 'RESET_INTERVIEW' });
  };

  if (loading && step === 'analyzing') {
    return <LoadingSpinner message="Analyzing your interview responses with AI..." />;
  }

  return (
    <div className="max-w-4xl mx-auto">
      {step === 'setup' && (
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Mock Interview</h1>
          <p className="text-xl text-gray-100 mb-8">
            Get ready for your next interview with AI-powered practice questions
          </p>

          <div className="card max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-orange-400 mb-6">Setup Your Interview</h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-100 mb-2">
                  Your Name (Optional)
                </label>
                <input
                  type="text"
                  value={userInfo.name}
                  onChange={(e) => setUserInfo({ ...userInfo, name: e.target.value })}
                  className="w-full px-3 py-2 text-gray-900 border border-gray-700 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="Enter your name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-100 mb-2">
                  Target Role *
                </label>
                <input
                  type="text"
                  value={userInfo.role}
                  onChange={(e) => setUserInfo({ ...userInfo, role: e.target.value })}
                  className="w-full px-3 py-2 text-gray-900 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="e.g., Software Developer, Marketing Manager, Data Scientist"
                  required
                />
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h3 className="font-semibold text-blue-900 mb-2">What to expect:</h3>
                <ul className="text-blue-800 text-sm space-y-1">
                  <li>• You'll be asked 5 role-specific questions</li>
                  <li>• Use voice recognition to answer each question</li>
                  <li>• Take your time - there's no time limit</li>
                  <li>• Get detailed AI feedback after completion</li>
                </ul>
              </div>

              <button
                onClick={handleStartInterview}
                disabled={loading || !userInfo.role.trim()}
                className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Generating Questions...' : 'Start Interview'}
              </button>
            </div>
          </div>
        </div>
      )}

      {step === 'interview' && questions.length > 0 && (
        <div className="space-y-8">
          {/* Progress Bar */}
          <div className="bg-white rounded-lg p-6 shadow-lg">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900">
                Question {currentQuestion + 1} of {questions.length}
              </h2>
              <span className="text-sm text-gray-500">
                {Math.round(((currentQuestion) / questions.length) * 100)}% Complete
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-primary-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${((currentQuestion) / questions.length) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Current Question */}
          <div className="card">
            <div className="mb-6">
              <h3 className="text-lg font-medium text-gray-400 mb-2">
                Interviewer asks:
              </h3>
              <p className="text-xl text-gray-100 font-medium">
                {questions[currentQuestion]}
              </p>
            </div>

            <VoiceRecorder
              onTranscript={handleAnswerSubmit}
              isListening={isListening}
              onStart={() => setIsListening(true)}
              onStop={() => setIsListening(false)}
            />

            {/* Previous Responses */}
            {responses.length > 0 && (
              <div className="mt-8 pt-6 border-t border-gray-200">
                <h4 className="text-lg font-medium text-gray-700 mb-4">Previous Responses:</h4>
                <div className="space-y-4 max-h-60 overflow-y-auto">
                  {responses.map((response, index) => (
                    <div key={index} className="bg-gray-50 rounded-lg p-4">
                      <p className="text-sm font-medium text-gray-600 mb-2">
                        Q{response.questionNumber}: {response.question}
                      </p>
                      <p className="text-gray-800">{response.answer}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Navigation */}
          <div className="flex justify-between">
            <button
              onClick={resetInterview}
              className="btn-secondary"
            >
              Restart Interview
            </button>
            
            {currentQuestion > 0 && (
              <button
                onClick={() => setCurrentQuestion(currentQuestion - 1)}
                className="btn-secondary"
                disabled={isListening}
              >
                Previous Question
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Interview;
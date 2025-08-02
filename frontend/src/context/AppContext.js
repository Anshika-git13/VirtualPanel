import React, { createContext, useContext, useReducer } from 'react';

const AppContext = createContext();

const initialState = {
  user: {
    name: '',
    role: ''
  },
  resumeAnalysis: null,
  interviewData: {
    questions: [],
    responses: [],
    analysis: null
  }
};

function appReducer(state, action) {
  switch (action.type) {
    case 'SET_USER':
      return {
        ...state,
        user: { ...state.user, ...action.payload }
      };
    case 'SET_RESUME_ANALYSIS':
      return {
        ...state,
        resumeAnalysis: action.payload
      };
    case 'SET_INTERVIEW_QUESTIONS':
      return {
        ...state,
        interviewData: {
          ...state.interviewData,
          questions: action.payload
        }
      };
    case 'ADD_INTERVIEW_RESPONSE':
      return {
        ...state,
        interviewData: {
          ...state.interviewData,
          responses: [...state.interviewData.responses, action.payload]
        }
      };
    case 'SET_INTERVIEW_ANALYSIS':
      return {
        ...state,
        interviewData: {
          ...state.interviewData,
          analysis: action.payload
        }
      };
    case 'RESET_INTERVIEW':
      return {
        ...state,
        interviewData: {
          questions: [],
          responses: [],
          analysis: null
        }
      };
    default:
      return state;
  }
}

export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
}
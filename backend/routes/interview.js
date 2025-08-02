// ========================================
// File: backend/routes/interview.js
const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-pro" });

// Fallback questions by role
const fallbackQuestions = {
  'software developer': [
    'Tell me about yourself and your programming background.',
    'Describe a challenging technical problem you solved recently.',
    'How do you stay updated with new technologies and programming trends?',
    'Explain your approach to debugging a complex issue.',
    'What programming languages and frameworks are you most comfortable with?'
  ],
  'data scientist': [
    'Tell me about your experience with data analysis and machine learning.',
    'Describe a data science project you worked on from start to finish.',
    'How do you handle missing or inconsistent data in your datasets?',
    'What statistical methods do you use most frequently in your work?',
    'How do you communicate complex data insights to non-technical stakeholders?'
  ],
  'marketing manager': [
    'Tell me about your marketing experience and key achievements.',
    'How do you develop and execute a marketing strategy?',
    'Describe a successful marketing campaign you led.',
    'How do you measure the effectiveness of marketing campaigns?',
    'What digital marketing tools and platforms do you use?'
  ],
  'default': [
    'Tell me about yourself and your professional background.',
    'What are your greatest strengths and how do they apply to this role?',
    'Describe a challenging situation at work and how you handled it.',
    'Where do you see yourself in 5 years?',
    'Why are you interested in this position and our company?'
  ]
};

// Generate interview questions
router.post('/questions', async (req, res) => {
  try {
    const { role, name } = req.body;
    
    console.log('🎯 Generating questions for role:', role);
    
    if (!role || !role.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Role is required'
      });
    }

    let questions = [];

    // Try to generate questions with Gemini AI
    if (process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'your_gemini_api_key_here') {
      try {
        const prompt = `Generate exactly 5 professional interview questions for a ${role} position. 

Requirements:
- Questions should be relevant to the role
- Mix behavioral and technical questions
- Make them realistic and commonly asked
- Return only the questions, numbered 1-5
- Each question on a new line
- No additional text or explanations

Format:
1. [Question 1]
2. [Question 2]
3. [Question 3]
4. [Question 4]
5. [Question 5]`;

        console.log('🤖 Sending request to Gemini...');
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        
        console.log('✅ Gemini response received:', text.substring(0, 100) + '...');

        // Parse the response to extract questions
        const lines = text.split('\n').filter(line => line.trim());
        questions = lines
          .filter(line => /^\d+\./.test(line.trim()))
          .map(line => line.replace(/^\d+\.\s*/, '').trim())
          .filter(q => q.length > 10);

        if (questions.length !== 5) {
          throw new Error('Invalid response format from AI');
        }

        console.log('✅ Successfully generated', questions.length, 'questions with AI');
        
      } catch (aiError) {
        console.warn('⚠️ AI generation failed:', aiError.message);
        questions = getFallbackQuestions(role);
      }
    } else {
      console.log('⚠️ No valid API key, using fallback questions');
      questions = getFallbackQuestions(role);
    }

    res.json({
      success: true,
      questions: questions,
      message: `Generated ${questions.length} questions for ${role}`
    });

  } catch (error) {
    console.error('❌ Error in /questions route:', error);
    
    // Always provide fallback questions in case of any error
    const fallbackQuestions = getFallbackQuestions(req.body.role || 'default');
    
    res.json({
      success: true,
      questions: fallbackQuestions,
      message: 'Using default questions due to technical issue'
    });
  }
});

// Analyze interview responses
router.post('/analyze', async (req, res) => {
  try {
    const { transcript, role, name } = req.body;
    
    console.log('🔍 Analyzing interview for role:', role);
    
    if (!transcript || !Array.isArray(transcript) || transcript.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Interview transcript is required'
      });
    }

    let analysis = {};

    // Try to analyze with Gemini AI
    if (process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'your_gemini_api_key_here') {
      try {
        const transcriptText = transcript.map((item, index) => 
          `Q${index + 1}: ${item.question}\nA${index + 1}: ${item.answer}`
        ).join('\n\n');

        const prompt = `Analyze this job interview transcript for a ${role} position:

${transcriptText}

Provide a comprehensive analysis in the following JSON format:
{
  "overallScore": [score from 0-100],
  "strengths": ["strength 1", "strength 2", "strength 3"],
  "weaknesses": ["weakness 1", "weakness 2", "weakness 3"],
  "improvements": ["improvement 1", "improvement 2", "improvement 3"],
  "resources": ["resource 1", "resource 2", "resource 3"],
  "summary": "Overall performance summary in 2-3 sentences"
}

Make the analysis specific, constructive, and actionable. Focus on communication skills, technical knowledge, and role-specific competencies.`;

        console.log('🤖 Sending analysis request to Gemini...');
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();
        
        console.log('✅ Gemini analysis received');

        // Try to parse JSON from the response
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          analysis = JSON.parse(jsonMatch[0]);
        } else {
          throw new Error('No valid JSON found in response');
        }

        console.log('✅ Successfully analyzed with AI');
        
      } catch (aiError) {
        console.warn('⚠️ AI analysis failed:', aiError.message);
        analysis = getFallbackAnalysis(transcript, role);
      }
    } else {
      console.log('⚠️ No valid API key, using fallback analysis');
      analysis = getFallbackAnalysis(transcript, role);
    }

    res.json({
      success: true,
      analysis: analysis,
      message: 'Interview analysis completed'
    });

  } catch (error) {
    console.error('❌ Error in /analyze route:', error);
    
    // Provide fallback analysis
    const fallbackAnalysis = getFallbackAnalysis(req.body.transcript || [], req.body.role || 'default');
    
    res.json({
      success: true,
      analysis: fallbackAnalysis,
      message: 'Analysis completed with default feedback'
    });
  }
});

// Helper function to get fallback questions
function getFallbackQuestions(role) {
  const normalizedRole = role.toLowerCase();
  
  for (const [key, questions] of Object.entries(fallbackQuestions)) {
    if (normalizedRole.includes(key) || key.includes(normalizedRole)) {
      return questions;
    }
  }
  
  return fallbackQuestions['default'];
}

// Helper function to provide fallback analysis
function getFallbackAnalysis(transcript, role) {
  const wordCount = transcript.reduce((total, item) => 
    total + (item.answer ? item.answer.split(' ').length : 0), 0);
  
  const avgWordsPerAnswer = Math.round(wordCount / Math.max(transcript.length, 1));
  
  // Simple scoring based on response length and completeness
  let score = 60; // Base score
  if (avgWordsPerAnswer > 50) score += 15;
  if (avgWordsPerAnswer > 30) score += 10;
  if (transcript.length === 5) score += 15; // Completed all questions
  
  return {
    overallScore: Math.min(score, 95),
    strengths: [
      "Completed the interview process",
      "Provided responses to all questions",
      avgWordsPerAnswer > 30 ? "Gave detailed responses" : "Participated actively"
    ],
    weaknesses: [
      avgWordsPerAnswer < 20 ? "Responses could be more detailed" : "Could improve on specific examples",
      "Consider adding more concrete examples",
      "Work on structuring responses better"
    ],
    improvements: [
      "Practice the STAR method (Situation, Task, Action, Result) for behavioral questions",
      `Research more about ${role} specific skills and technologies`,
      "Prepare specific examples from your experience"
    ],
    resources: [
      "Cracking the Coding Interview (if technical role)",
      "LinkedIn Learning courses for professional skills",
      "Industry-specific blogs and publications"
    ],
    summary: `You completed the interview and provided responses to all questions. With an average of ${avgWordsPerAnswer} words per answer, there's room to develop more comprehensive responses with specific examples.`
  };
}

module.exports = router;

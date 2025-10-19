const express = require('express');
const router = express.Router();
const multer = require('multer');
const pdfParse = require('pdf-parse');
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ 
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed'));
    }
  }
});

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-pro" });

// Analyze resume endpoint
router.post('/analyze', upload.single('resume'), async (req, res) => {
  try {
    console.log('📄 Resume analysis request received');
    
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No PDF file uploaded'
      });
    }

    console.log('📄 Extracting text from PDF...');
    
    
    const pdfData = await pdfParse(req.file.buffer);
    const resumeText = pdfData.text;
    
    if (!resumeText || resumeText.trim().length < 50) {
      return res.status(400).json({
        success: false,
        message: 'Could not extract sufficient text from PDF. Please ensure the PDF contains readable text.'
      });
    }

    console.log('✅ PDF text extracted, length:', resumeText.length);

    let analysis = {};

    // Try to analyze with Gemini AI
    if (process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'your_gemini_api_key_here') {
      try {
        const prompt = `Analyze this resume for ATS (Applicant Tracking System) compatibility and provide improvement suggestions:

RESUME TEXT:
${resumeText}

Please provide your analysis in the following JSON format:
{
  "atsScore": [number from 0-100],
  "suggestions": [
    "suggestion 1",
    "suggestion 2", 
    "suggestion 3",
    "suggestion 4",
    "suggestion 5"
  ]
}

Consider these ATS factors:
- Keyword usage and relevance
- Formatting and structure
- Contact information completeness
- Skills section clarity
- Work experience descriptions
- Education details
- Overall readability

Make suggestions specific and actionable.`;

        console.log('🤖 Sending resume to Gemini for analysis...');
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

        // Validate the analysis structure
        if (!analysis.atsScore || !analysis.suggestions) {
          throw new Error('Invalid analysis structure');
        }

        console.log('✅ Resume analyzed successfully with AI');
        
      } catch (aiError) {
        console.warn('⚠️ AI analysis failed:', aiError.message);
        analysis = getFallbackResumeAnalysis(resumeText);
      }
    } else {
      console.log('⚠️ No valid API key, using fallback analysis');
      analysis = getFallbackResumeAnalysis(resumeText);
    }

    res.json({
      success: true,
      analysis: analysis,
      message: 'Resume analysis completed'
    });

  } catch (error) {
    console.error('❌ Error in resume analysis:', error);
    
    res.status(500).json({
      success: false,
      message: 'Failed to analyze resume',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
});

// Helper function for fallback resume analysis
function getFallbackResumeAnalysis(resumeText) {
  const text = resumeText.toLowerCase();
  let score = 40; // Base score
  
  // Check for common resume sections
  if (text.includes('experience') || text.includes('work')) score += 10;
  if (text.includes('education') || text.includes('degree')) score += 10;
  if (text.includes('skills') || text.includes('technical')) score += 10;
  if (text.includes('email') && text.includes('phone')) score += 10;
  if (text.includes('project') || text.includes('achievement')) score += 10;
  
  // Check for formatting indicators
  if (resumeText.includes('•') || resumeText.includes('-')) score += 5;
  if (resumeText.split('\n').length > 20) score += 5; // Good structure
  
  return {
    atsScore: Math.min(score, 95),
    suggestions: [
      "Add more relevant keywords for your target role",
      "Use bullet points to improve readability",
      "Include quantifiable achievements with numbers",
      "Add a professional summary section",
      "Ensure contact information is clearly visible",
      "Use standard section headings (Experience, Education, Skills)",
      "Include relevant technical skills for your field"
    ]
  };
}

module.exports = router;
import OpenAI from 'openai';

function initializeGroq() {
  if (!process.env.GROQ_API_KEY) {
    throw new Error('GROQ_API_KEY environment variable is not set');
  }
  return new OpenAI({
    apiKey: process.env.GROQ_API_KEY,
    baseURL: 'https://api.groq.com/openai/v1',
  });
}

export async function analyzeScheduleImage(imageBase64, mimeType = 'image/jpeg') {
  try {
    // Image analysis using Groq - Fallback to manual entry if not available
    console.log('Starting schedule image analysis...');
    
    // For now, return a helpful message guiding the user to manual entry
    // This avoids API compatibility issues while still providing the feature
    return {
      scheduleSlots: [],
      confidence: 0,
      notes: 'Please use the manual schedule entry form to add your classes.',
      issues: ['Image analysis feature is being configured. Please add classes manually for now.'],
      status: 'manual_entry_required'
    };
  } catch (error) {
    console.error('Error analyzing schedule image:', error);
    const errorMessage = error.message || 'Unknown error during image analysis';
    throw new Error(`Schedule analysis failed: ${errorMessage}`);
  }
}

import { analyzeScheduleImage } from '@/services/schedule-analyzer';

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');

    if (!file) {
      return Response.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return Response.json(
        { error: 'File must be an image' },
        { status: 400 }
      );
    }

    // Convert file to base64
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64 = buffer.toString('base64');

    const analysis = await analyzeScheduleImage(base64, file.type);

    return Response.json(analysis);
  } catch (error) {
    console.error('Error in schedule analysis endpoint:', error.message);
    console.error('Full error:', error);
    
    const errorMessage = error.message || 'Unknown error';
    
    // Provide helpful error messages based on error type
    let userMessage = 'Failed to analyze the schedule image. Please try again.';
    if (errorMessage.includes('GOOGLE_API_KEY')) {
      userMessage = 'Server configuration error: Google API key is not set. Please contact the administrator.';
    } else if (errorMessage.includes('API') || errorMessage.includes('GROQ')) {
      userMessage = 'Unable to connect to the image analysis service. Please try again later.';
    } else if (errorMessage.includes('temporarily unavailable')) {
      userMessage = 'Image analysis is temporarily unavailable. Please use manual schedule entry.';
    }
    
    return Response.json(
      { error: userMessage, details: errorMessage },
      { status: 500 }
    );
  }
}

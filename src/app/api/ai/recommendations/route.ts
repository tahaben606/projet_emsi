// EMSI Flow - AI Recommendations API Route
import { NextRequest, NextResponse } from 'next/server';
import { generateRecommendations, getDailySummary } from '@/services/planner';

// POST /api/ai/recommendations - Get context-aware recommendations
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { studentId, includeSummary } = body;
    
    if (!studentId) {
      return NextResponse.json(
        { error: 'Student ID is required' },
        { status: 400 }
      );
    }
    
    const recommendations = await generateRecommendations(studentId);
    
    if (includeSummary) {
      const summary = await getDailySummary(studentId);
      return NextResponse.json({
        recommendations,
        summary,
        timestamp: new Date().toISOString()
      });
    }
    
    return NextResponse.json({
      recommendations,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error generating recommendations:', error);
    return NextResponse.json(
      { error: 'Failed to generate recommendations' },
      { status: 500 }
    );
  }
}

// GET /api/ai/recommendations?studentId=xxx - Get recommendations for a student
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const studentId = searchParams.get('studentId');
    const includeSummary = searchParams.get('summary') === 'true';
    
    if (!studentId) {
      return NextResponse.json(
        { error: 'Student ID is required' },
        { status: 400 }
      );
    }
    
    const recommendations = await generateRecommendations(studentId);
    
    if (includeSummary) {
      const summary = await getDailySummary(studentId);
      return NextResponse.json({
        recommendations,
        summary
      });
    }
    
    return NextResponse.json({ recommendations });
  } catch (error) {
    console.error('Error generating recommendations:', error);
    return NextResponse.json(
      { error: 'Failed to generate recommendations' },
      { status: 500 }
    );
  }
}

// EMSI Flow - Student Risk API Routes
import { NextResponse } from 'next/server';
import { calculateStudentRisk } from '@/services/risk-engine';

// GET /api/students/[id]/risk - Get student risk calculation
export async function GET(
  request,
  { params }
) {
  try {
    const { id } = await params;
    const riskCalculation = await calculateStudentRisk(id);
    
    return NextResponse.json(riskCalculation);
  } catch (error) {
    console.error('Error calculating risk:', error);
    return NextResponse.json(
      { error: 'Failed to calculate risk' },
      { status: 500 }
    );
  }
}

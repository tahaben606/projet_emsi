// EMSI Flow - AI Chat API Route
import { NextResponse } from 'next/server';
import { chatWithAssistant, queryKnowledgeBase } from '@/services/rag-agent';

// POST /api/ai/chat - Chat with RAG knowledge assistant
export async function POST(request) {
  try {
    const body = await request.json();
    const { message, messages, studentId } = body;

    if (!message && !messages) {
      return NextResponse.json(
        { error: 'Message or messages array is required' },
        { status: 400 }
      );
    }

    let response;
    let citations;

    if (messages && Array.isArray(messages)) {
      // Multi-turn conversation (pass studentId for personalized context)
      const result = await chatWithAssistant(messages, studentId || null);
      response = result.response;
      citations = result.citations;
    } else if (message) {
      // Single query (pass studentId for personalized context)
      const result = await queryKnowledgeBase(message, studentId || null);
      response = result.answer;
      citations = result.citations;
    }

    return NextResponse.json({
      response,
      citations,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error in AI chat:', error);
    return NextResponse.json(
      { error: 'Failed to process chat request' },
      { status: 500 }
    );
  }
}

// EMSI Flow - RAG Knowledge Agent Service
// Retrieval-Augmented Generation for student Q&A with citations

import ZAI from 'z-ai-web-dev-sdk';
import { PrismaClient } from '@prisma/client';
import { RAGResponse, Citation } from '@/types';

const prisma = new PrismaClient();

// Knowledge base content for EMSI (embedded for demo)
const KNOWLEDGE_CONTENT = `
# EMSI Academic Policies

## Grading System
- The grading scale at EMSI is from 0 to 20 points
- Grades above 10/20 are considered passing
- Grades between 8-10/20 may be eligible for compensation
- Grades below 8/20 require remedial action
- Final grades are calculated as weighted averages based on subject coefficients

## Attendance Policy
- Minimum 75% attendance is required for each subject
- Students below 75% attendance may be barred from exams
- Medical absences must be documented within 48 hours
- Late arrivals (more than 15 minutes) count as half-absence
- Excused absences do not count toward the absence limit

## Academic Calendar 2024-2025
- Fall Semester: September 2, 2024 - January 17, 2025
- Winter Break: December 23, 2024 - January 3, 2025
- Spring Semester: February 3, 2025 - June 20, 2025
- Spring Break: April 14-18, 2025
- Final Exams: January 20-31, 2025 and June 23-July 4, 2025
- Registration for Fall 2025 begins: July 15, 2025

## Course Registration
- Course registration opens 2 weeks before semester start
- Late registration incurs a 200 MAD fee
- Course drop deadline is 3 weeks after semester start
- Course withdrawal (with "W" grade) deadline is week 8
- Maximum course load: 30 credits per semester
- Minimum course load: 12 credits for full-time status

## Academic Support Resources
- Tutoring Center: Building A, Room 101, Open 9AM-6PM
- Writing Center: Building B, Room 205, Open 10AM-5PM
- Math Help Desk: Building C, Room 103, Open 2PM-6PM
- Career Services: Building A, Room 301
- Counseling Services: Building D, Ground Floor
- Library: Open 7AM-10PM Monday-Friday, 9AM-6PM weekends

## Academic Probation
- Students with GPA below 10/20 for two consecutive semesters are placed on probation
- Probationary students must meet with academic advisor weekly
- Probation lasts one semester
- Failure to improve GPA results in academic suspension

## Exam Policies
- Final exam schedule is posted 3 weeks before exam period
- Exam conflicts must be reported within 5 days of schedule posting
- Make-up exams only for documented medical emergencies
- Electronic devices are prohibited during exams
- Exam results are posted within 10 business days

## Scholarship Information
- Merit Scholarship: GPA above 16/20, covers 50% tuition
- Need-Based Aid: Available through financial aid office
- Sports Scholarship: For varsity athletes, covers 25-75% tuition
- Application deadline: June 30 for following academic year

## Campus Facilities
- Cafeteria: Building E, Open 7AM-8PM
- Sports Complex: Building F, Pool, Gym, Courts
- Student Center: Building G, Clubs, Study Rooms
- Parking: Available in Lots A, B, C with permit
- Computer Labs: Buildings A, B, C - 24/7 access with student ID

## Student Code of Conduct
- Academic integrity is strictly enforced
- Plagiarism results in course failure and possible suspension
- Respectful behavior toward faculty and staff is mandatory
- Dress code: Business casual for all academic activities
- ID cards must be visible on campus at all times

## Important Contacts
- Academic Affairs: +212-XXX-XXXX, academic@emsi.ma
- Student Services: +212-XXX-XXXX, students@emsi.ma
- IT Help Desk: +212-XXX-XXXX, it@emsi.ma
- Security: +212-XXX-XXXX (24/7)
- Health Services: +212-XXX-XXXX, health@emsi.ma
`;

/**
 * Fetch active news from database and format for RAG
 */
async function getNewsContext(): Promise<{ content: string; sources: string[] }> {
  try {
    const now = new Date();
    const news = await prisma.news.findMany({
      where: {
        isPublished: true,
        OR: [
          { expiresAt: null },
          { expiresAt: { gte: now } }
        ]
      },
      orderBy: [
        { priority: 'desc' },
        { createdAt: 'desc' }
      ],
      take: 20
    });
    
    if (news.length === 0) {
      return { content: '', sources: [] };
    }
    
    const newsContent = news.map(n => {
      let text = `${n.title}: ${n.content}`;
      if (n.eventDate) {
        text += ` (Date: ${new Date(n.eventDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })})`;
      }
      if (n.targetAudience === 'class' && n.targetClassIds) {
        text += ` (Applies to specific classes)`;
      }
      return text;
    }).join('\n');
    
    return {
      content: `\n## Current Announcements & Events\n${newsContent}`,
      sources: ['Current Announcements']
    };
  } catch (error) {
    console.error('Error fetching news for RAG:', error);
    return { content: '', sources: [] };
  }
}

/**
 * Simple text-based retrieval (simulating vector search)
 * In production, this would use actual embeddings and vector similarity
 */
function retrieveRelevantContext(query: string, maxChunks: number = 3): { content: string; sources: string[] } {
  const sections = KNOWLEDGE_CONTENT.split('\n## ').filter(s => s.trim().length > 0);
  
  // Simple keyword matching for relevance
  const queryLower = query.toLowerCase();
  const keywords = queryLower.split(/\s+/).filter(w => w.length > 3);
  
  const scoredSections = sections.map(section => {
    const sectionLower = section.toLowerCase();
    let score = 0;
    
    // Check for keyword matches
    keywords.forEach(keyword => {
      if (sectionLower.includes(keyword)) {
        score += 10;
      }
    });
    
    // Boost for exact phrase matches
    if (sectionLower.includes(queryLower)) {
      score += 20;
    }
    
    // Topic-specific boosts
    if (queryLower.includes('grade') && sectionLower.includes('grad')) score += 5;
    if (queryLower.includes('attendance') && sectionLower.includes('attendance')) score += 5;
    if (queryLower.includes('exam') && sectionLower.includes('exam')) score += 5;
    if (queryLower.includes('deadline') && sectionLower.includes('deadline')) score += 5;
    if (queryLower.includes('register') && sectionLower.includes('registration')) score += 5;
    if (queryLower.includes('scholarship') && sectionLower.includes('scholarship')) score += 5;
    if (queryLower.includes('calendar') && sectionLower.includes('calendar')) score += 5;
    if (queryLower.includes('tutor') && sectionLower.includes('tutor')) score += 5;
    if (queryLower.includes('library') && sectionLower.includes('library')) score += 5;
    if (queryLower.includes('probation') && sectionLower.includes('probation')) score += 5;
    
    return { section: section.trim(), score };
  });
  
  // Sort by score and take top sections
  const relevantSections = scoredSections
    .filter(s => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, maxChunks);
  
  if (relevantSections.length === 0) {
    // Return general academic info if no specific match
    return {
      content: sections.slice(0, 3).join('\n\n'),
      sources: ['General Academic Information']
    };
  }
  
  const content = relevantSections.map(s => s.section).join('\n\n');
  const sources = relevantSections.map(s => {
    const firstLine = s.section.split('\n')[0];
    return firstLine.replace('#', '').trim();
  });
  
  return { content, sources };
}

/**
 * Main RAG query function
 */
export async function queryKnowledgeBase(question: string): Promise<RAGResponse> {
  try {
    // Retrieve relevant context from static knowledge
    const { content, sources } = retrieveRelevantContext(question);
    
    // Get dynamic news context
    const newsContext = await getNewsContext();
    
    // Combine contexts
    const fullContext = content + newsContext.content;
    const allSources = [...sources, ...newsContext.sources];
    
    // Create the AI instance
    const zai = await ZAI.create();
    
    // Generate answer using LLM with context
    const completion = await zai.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: `You are a helpful academic assistant for EMSI (École Marocaine des Sciences de l'Ingénieur). 
          Answer student questions based on the provided context. 
          Be accurate, helpful, and cite the source of information.
          If the information is not in the context, say so honestly.
          Keep responses concise but complete.
          
          Context from EMSI knowledge base:
          ${fullContext}`
        },
        {
          role: 'user',
          content: question
        }
      ],
      temperature: 0.3,
      max_tokens: 500
    });
    
    const answer = completion.choices[0]?.message?.content || 'I apologize, I could not generate a response. Please try again.';
    
    // Create citations from sources
    const citations: Citation[] = allSources.map(source => ({
      source,
      excerpt: `Information from ${source} section of EMSI Academic Handbook`
    }));
    
    return {
      answer,
      citations,
      confidence: sources.length > 0 ? 0.85 : 0.5
    };
  } catch (error) {
    console.error('RAG query error:', error);
    
    // Fallback response with basic info
    return {
      answer: getFallbackResponse(question),
      citations: [{ source: 'EMSI General Information', excerpt: 'Basic academic information' }],
      confidence: 0.5
    };
  }
}

/**
 * Fallback responses for common questions
 */
function getFallbackResponse(question: string): string {
  const q = question.toLowerCase();
  
  if (q.includes('grade') || q.includes('scor')) {
    return "EMSI uses a 0-20 grading scale. Grades above 10/20 are passing. For detailed grade policies, please contact Academic Affairs.";
  }
  if (q.includes('attendance') || q.includes('absent')) {
    return "Students need minimum 75% attendance per subject. Medical absences should be documented within 48 hours. Contact Student Services for specific attendance records.";
  }
  if (q.includes('exam') || q.includes('test')) {
    return "Final exam schedules are posted 3 weeks before the exam period. Make-up exams are only for documented medical emergencies. Check your student portal for specific exam dates.";
  }
  if (q.includes('deadline') || q.includes('date')) {
    return "Key dates: Course drop deadline is 3 weeks into the semester. Withdrawal deadline is week 8. Check the academic calendar on your student portal for complete dates.";
  }
  if (q.includes('register') || q.includes('enroll')) {
    return "Course registration opens 2 weeks before semester start. Late registration has a 200 MAD fee. Maximum load is 30 credits per semester.";
  }
  if (q.includes('tutor') || q.includes('help') || q.includes('support')) {
    return "Academic support resources include: Tutoring Center (Building A, Room 101, 9AM-6PM), Writing Center (Building B, Room 205, 10AM-5PM), and Math Help Desk (Building C, Room 103, 2PM-6PM).";
  }
  if (q.includes('scholarship') || q.includes('financial')) {
    return "Scholarship options include: Merit Scholarship (GPA > 16/20, 50% tuition), Need-Based Aid, and Sports Scholarship. Application deadline is June 30. Contact Financial Aid office.";
  }
  
  return "I'd be happy to help you with academic questions about grades, attendance, exams, registration, campus resources, or policies. Could you please be more specific about what you'd like to know?";
}

/**
 * Chat with the knowledge assistant
 */
export async function chatWithAssistant(
  messages: Array<{ role: 'user' | 'assistant'; content: string }>
): Promise<{ response: string; citations: Citation[] }> {
  try {
    // Get context from the last user message
    const lastUserMessage = messages.filter(m => m.role === 'user').pop();
    if (!lastUserMessage) {
      return { response: "How can I help you today?", citations: [] };
    }
    
    const { content, sources } = retrieveRelevantContext(lastUserMessage.content);
    
    // Get dynamic news context
    const newsContext = await getNewsContext();
    
    // Combine contexts
    const fullContext = content + newsContext.content;
    const allSources = [...sources, ...newsContext.sources];
    
    const zai = await ZAI.create();
    
    // Build conversation history
    const conversationMessages = [
      {
        role: 'system' as const,
        content: `You are a helpful academic assistant for EMSI (École Marocaine des Sciences de l'Ingénieur).
        You help students with questions about academic policies, grades, attendance, exams, registration, campus resources, and current announcements.
        Be friendly, accurate, and helpful. Keep responses concise but complete.
        When asked about exams, events, or announcements, check the Current Announcements section for the latest information.
        
        Current knowledge base context:
        ${fullContext}`
      },
      ...messages.map(m => ({
        role: m.role as 'user' | 'assistant',
        content: m.content
      }))
    ];
    
    const completion = await zai.chat.completions.create({
      messages: conversationMessages,
      temperature: 0.4,
      max_tokens: 400
    });
    
    const response = completion.choices[0]?.message?.content || 
      "I'm here to help with your academic questions. What would you like to know?";
    
    const citations: Citation[] = allSources.map(source => ({
      source,
      excerpt: `From ${source}`
    }));
    
    return { response, citations };
  } catch (error) {
    console.error('Chat error:', error);
    return {
      response: getFallbackResponse(messages[messages.length - 1]?.content || ''),
      citations: []
    };
  }
}

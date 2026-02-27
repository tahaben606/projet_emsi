// EMSI Flow - Enhanced RAG Knowledge Agent Service
// Retrieval-Augmented Generation for student Q&A with citations
// Uses multi-source retrieval, student context, and bilingual support

import OpenAI from 'openai';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Initialize OpenAI client pointing to Groq
const openai = new OpenAI({
  apiKey: process.env.GROQ_API_KEY,
  baseURL: 'https://api.groq.com/openai/v1',
});

/**
 * Call Groq API using OpenAI SDK
 * Includes retry logic for rate limiting
 */
async function callGroq(messages, options = {}) {
  const { temperature = 0.4, maxOutputTokens = 700 } = options;
  const MAX_RETRIES = 3;

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      const completion = await openai.chat.completions.create({
        model: 'llama-3.3-70b-versatile',
        messages: messages,
        temperature: temperature,
        max_tokens: maxOutputTokens,
      });

      return completion;
    } catch (error) {
      const isRateLimit = error.status === 429;

      if (isRateLimit && attempt < MAX_RETRIES) {
        const delay = Math.pow(2, attempt + 1) * 1000;
        console.log(`⏳ Groq API rate limited (429). Retrying in ${delay / 1000}s... (attempt ${attempt + 1}/${MAX_RETRIES})`);
        await new Promise(resolve => setTimeout(resolve, delay));
        continue;
      }

      console.error(`❌ Groq API error (attempt ${attempt + 1}):`, error.message || error);
      throw error;
    }
  }
}



// ─────────────────────────────────────────────────
// 1. KNOWLEDGE BASE (Static Policies)
// ─────────────────────────────────────────────────
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

## Internships and Professional Projects (Stages, PFA, PFE)
- 1st & 2nd Year: 1-month observation internship required in summer (Stage d'observation)
- 3rd & 4th Year: 2-month technical internship required (Stage technique / PFA)
- 5th Year: 6-month final year project (PFE) required for graduation
- Internship agreements (conventions de stage) must be signed by the school administration before starting
- Career Center (Building A, Room 301) assists with resume building and interview prep

## IT Services & Connectivity
- Student Portal (Intranet): Use your EMSI email to access grades, schedules, and documents
- LMS (Moodle / Teams): All course materials are hosted on Microsoft Teams
- Campus Wi-Fi: Connect to "EMSI_Student" using your student credentials
- Microsoft 365: Free access to Word, Excel, PowerPoint, and OneDrive with your student email
- Lost Password: Visit the IT Help Desk (Building B) or email it@emsi.ma

## Student Life & Extracurriculars
- BDE (Bureau des Étudiants): Organizes main student events and trips (Building G)
- Active Clubs: IT Club, Robotics Club, Enactus, Sports Club, Music Club
- Club Registration: Occurs during the first 3 weeks of the Fall semester
- Annual hackathons and coding competitions are held every Spring
- Athletics: Football, Basketball, and Volleyball teams have tryouts in October

## International Exchange & Mobility
- Double Degree Programs: Available with partner universities in France, Canada, and Spain
- Eligibility: Students must be in their 3th or 4th year with a minimum GPA of 14/20
- Language Requirements: B2 level in English (IELTS/TOEFL) or French (DELF/DALF) depending on destination
- Application Deadline for Exchange: March 1st for the following Fall semester
- International Office: Located in Building C, Room 204

## Tuition Fees & Payments
- Tuition is payable in full at the beginning of the year or in 3 or 9 installments
- Payment methods: Bank transfer, certified check, or online via the student portal
- Late payment penalty: 5% fee on the outstanding balance after 15 days
- Re-registration fees: Must be paid by July 30th to secure a spot for the next year
- Accounting Office: Building A, Ground Floor (Open 9AM-4PM)

## Health & Housing Services
- Campus Infirmary: Building D, Room 101. A nurse is available from 8AM to 5PM
- Counseling: Free mental health counseling available by appointment (counseling@emsi.ma)
- Housing: EMSI does not have on-campus dorms but partners with local student residences
- Transportation: Shuttle buses available from main train stations to campus (schedule on intranet)

## Important Contacts
- Academic Affairs: +212-XXX-XXXX, academic@emsi.ma
- Student Services: +212-XXX-XXXX, students@emsi.ma
- IT Help Desk: +212-XXX-XXXX, it@emsi.ma
- Security: +212-XXX-XXXX (24/7)
- Health Services: +212-XXX-XXXX, health@emsi.ma
- Financial Office: +212-XXX-XXXX, finance@emsi.ma
- Career Center: +212-XXX-XXXX, carriere@emsi.ma
`;

// ─────────────────────────────────────────────────
// 2. SYNONYM MAP (French ↔ English + Academic Terms)
// ─────────────────────────────────────────────────
const SYNONYM_MAP = {
  'note': ['grade', 'grades', 'notes', 'score', 'scores', 'notation', 'moyenne', 'average', 'mark', 'marks', 'résultat', 'resultat'],
  'absence': ['attendance', 'absent', 'absences', 'présence', 'presence', 'assiduité', 'assiduite', 'retard', 'late'],
  'examen': ['exam', 'exams', 'examens', 'test', 'tests', 'contrôle', 'controle', 'partiel', 'partiels', 'finals', 'midterm', 'rattrapage'],
  'inscription': ['register', 'registration', 'enroll', 'enrollment', 'inscrire', 'cours'],
  'bourse': ['scholarship', 'scholarships', 'financial', 'aide', 'aid', 'financement', 'bursary'],
  'calendrier': ['calendar', 'date', 'dates', 'deadline', 'deadlines', 'schedule', 'planning', 'emploi du temps'],
  'tutorat': ['tutor', 'tutoring', 'help', 'support', 'aide', 'soutien', 'accompagnement', 'ressources'],
  'bibliothèque': ['library', 'bibliothèque', 'bibliotheque', 'livres', 'books'],
  'probation': ['probation', 'avertissement', 'warning', 'suspension', 'renvoi', 'exclusion'],
  'campus': ['campus', 'bâtiment', 'batiment', 'building', 'cafétéria', 'cafeteria', 'sport', 'parking', 'laboratoire', 'lab'],
  'conduite': ['conduct', 'plagiat', 'plagiarism', 'intégrité', 'integrity', 'règlement', 'reglement', 'discipline'],
  'contact': ['contact', 'téléphone', 'telephone', 'email', 'mail', 'appeler', 'joindre'],
  'stage': ['stage', 'internship', 'pfe', 'pfa', 'projet', 'experience', 'entreprise', 'convention'],
  'informatique': ['it', 'wifi', 'internet', 'mot de passe', 'password', 'moodle', 'teams', 'office', 'lms', 'connexion'],
  'vie_etudiante': ['club', 'bde', 'extracurricular', 'sport', 'événement', 'event', 'fête', 'hackathon'],
  'international': ['international', 'échange', 'exchange', 'erasmus', 'étranger', 'etranger', 'double diplôme', 'diplome', 'canada', 'france'],
  'finance': ['frais', 'paiement', 'payment', 'tuition', 'scolarité', 'scolarite', 'argent', 'prix', 'coût', 'cout', 'tranche', 'mensualité'],
  'sante_logement': ['santé', 'sante', 'health', 'infirmerie', 'médical', 'maladie', 'logement', 'housing', 'résidence', 'transport', 'transportation'],
};

// ─────────────────────────────────────────────────
// 3. TEXT NORMALIZATION
// ─────────────────────────────────────────────────
function normalizeText(text) {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // remove accents
    .replace(/[^a-z0-9\s]/g, ' ')   // remove special chars
    .replace(/\s+/g, ' ')
    .trim();
}

function expandQueryWithSynonyms(query) {
  const normalized = normalizeText(query);
  const words = normalized.split(/\s+/);
  const expanded = new Set(words);

  for (const word of words) {
    for (const [, synonyms] of Object.entries(SYNONYM_MAP)) {
      if (synonyms.some(s => normalizeText(s).includes(word) || word.includes(normalizeText(s)))) {
        synonyms.forEach(s => expanded.add(normalizeText(s)));
      }
    }
  }

  return Array.from(expanded);
}

// ─────────────────────────────────────────────────
// 4. RETRIEVAL: Multi-source context fetching
// ─────────────────────────────────────────────────

/**
 * Fetch active news from database and format for RAG
 */
async function getNewsContext() {
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
        text += ` (Date: ${new Date(n.eventDate).toLocaleDateString('fr-FR', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })})`;
      }
      if (n.targetAudience === 'class' && n.targetClassIds) {
        text += ` (Applies to specific classes)`;
      }
      return text;
    }).join('\n');

    return {
      content: `\n## Annonces et Événements Actuels\n${newsContent} `,
      sources: ['Annonces Actuelles']
    };
  } catch (error) {
    console.error('Error fetching news for RAG:', error);
    return { content: '', sources: [] };
  }
}

/**
 * Fetch knowledge documents from the database
 */
async function getDatabaseKnowledge(query) {
  try {
    const docs = await prisma.knowledgeDocument.findMany();
    if (docs.length === 0) return { content: '', sources: [] };

    const expandedTerms = expandQueryWithSynonyms(query);

    const scoredDocs = docs.map(doc => {
      const normalizedContent = normalizeText(doc.content);
      const normalizedTitle = normalizeText(doc.title);
      let score = 0;

      for (const term of expandedTerms) {
        if (term.length < 3) continue;
        if (normalizedTitle.includes(term)) score += 15;
        if (normalizedContent.includes(term)) score += 8;
      }

      // Check tags
      try {
        const tags = JSON.parse(doc.tags || '[]');
        for (const tag of tags) {
          if (expandedTerms.some(t => normalizeText(tag).includes(t) || t.includes(normalizeText(tag)))) {
            score += 12;
          }
        }
      } catch { /* ignore bad JSON */ }

      return { doc, score };
    });

    const relevant = scoredDocs
      .filter(d => d.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 5);

    if (relevant.length === 0) return { content: '', sources: [] };

    const content = relevant.map(d => `### ${d.doc.title} \n${d.doc.content} `).join('\n\n');
    const sources = relevant.map(d => d.doc.title);

    return { content, sources };
  } catch (error) {
    console.error('Error fetching DB knowledge:', error);
    return { content: '', sources: [] };
  }
}

/**
 * Enhanced retrieval from static knowledge using synonym expansion
 */
function retrieveRelevantContext(query, maxChunks = 5) {
  const sections = KNOWLEDGE_CONTENT.split('\n## ').filter(s => s.trim().length > 0);
  const expandedTerms = expandQueryWithSynonyms(query);

  const scoredSections = sections.map(section => {
    const normalizedSection = normalizeText(section);
    let score = 0;

    for (const term of expandedTerms) {
      if (term.length < 3) continue;
      // Count occurrences for stronger signal
      const regex = new RegExp(term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi');
      const matches = normalizedSection.match(regex);
      if (matches) {
        score += matches.length * 5;
      }
    }

    // Boost for first-line (title) matches
    const firstLine = normalizeText(section.split('\n')[0]);
    for (const term of expandedTerms) {
      if (term.length < 3) continue;
      if (firstLine.includes(term)) score += 15;
    }

    return { section: section.trim(), score };
  });

  const relevantSections = scoredSections
    .filter(s => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, maxChunks);

  if (relevantSections.length === 0) {
    return {
      content: sections.slice(0, 3).join('\n\n'),
      sources: ['Informations Académiques Générales']
    };
  }

  const content = relevantSections.map(s => s.section).join('\n\n');
  const sources = relevantSections.map(s => {
    const firstLine = s.section.split('\n')[0];
    return firstLine.replace('#', '').trim();
  });

  return { content, sources };
}

// ─────────────────────────────────────────────────
// 5. STUDENT CONTEXT: Fetch personal academic data
// ─────────────────────────────────────────────────

/**
 * Fetch student-specific context (grades, attendance, class)
 */
async function getStudentContext(studentId) {
  if (!studentId) return null;

  try {
    const student = await prisma.student.findUnique({
      where: { id: studentId },
      include: {
        class: true,
        grades: {
          include: { subject: true },
          orderBy: { date: 'desc' },
          take: 30
        },
        attendance: {
          orderBy: { date: 'desc' },
          take: 50
        }
      }
    });

    if (!student) return null;

    // Calculate attendance rate
    const totalAtt = student.attendance.length;
    const presentCount = student.attendance.filter(a => a.status === 'present' || a.status === 'excused').length;
    const attendanceRate = totalAtt > 0 ? ((presentCount / totalAtt) * 100).toFixed(1) : 'N/A';

    // Calculate grade average
    const gradeValues = student.grades.map(g => (g.value / g.maxValue) * 20);
    const gradeAvg = gradeValues.length > 0
      ? (gradeValues.reduce((a, b) => a + b, 0) / gradeValues.length).toFixed(2)
      : 'N/A';

    // Build grade summary per subject
    const subjectGrades = {};
    for (const g of student.grades) {
      const name = g.subject.name;
      if (!subjectGrades[name]) subjectGrades[name] = [];
      subjectGrades[name].push(`${((g.value / g.maxValue) * 20).toFixed(1)}/20 (${g.type})`);
    }

    const gradesSummary = Object.entries(subjectGrades)
      .map(([subject, grades]) => `- ${subject}: ${grades.join(', ')}`)
      .join('\n');

    // Build exam-specific breakdown
    const exams = student.grades.filter(g => g.type === 'exam');
    const examsSummary = exams.length > 0
      ? exams.map(g => {
        const score = ((g.value / g.maxValue) * 20).toFixed(1);
        const dateStr = new Date(g.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
        const status = parseFloat(score) >= 10 ? '✅ Validé' : '❌ Non validé';
        return `- ${g.subject.name}: ${score}/20 — ${dateStr} — ${status}`;
      }).join('\n')
      : 'Aucun examen trouvé';

    // Exam average
    const examValues = exams.map(g => (g.value / g.maxValue) * 20);
    const examAvg = examValues.length > 0
      ? (examValues.reduce((a, b) => a + b, 0) / examValues.length).toFixed(2)
      : 'N/A';

    // Other assessment types
    const quizzes = student.grades.filter(g => g.type === 'quiz');
    const assignments = student.grades.filter(g => g.type === 'assignment');
    const projects = student.grades.filter(g => g.type === 'project');

    return {
      name: student.name,
      email: student.email,
      className: student.class.name,
      department: student.class.department,
      attendanceRate,
      gradeAverage: gradeAvg,
      gradesSummary,
      examsSummary,
      examAverage: examAvg,
      examCount: exams.length,
      quizCount: quizzes.length,
      assignmentCount: assignments.length,
      projectCount: projects.length,
      totalAbsences: totalAtt - presentCount,
      totalSessions: totalAtt
    };
  } catch (error) {
    console.error('Error fetching student context:', error);
    return null;
  }
}

function buildStudentContextBlock(studentCtx) {
  if (!studentCtx) return '';

  return `
## Profil de l'Étudiant Actuel
- Nom: ${studentCtx.name}
- Classe: ${studentCtx.className} (${studentCtx.department})
- Moyenne Générale: ${studentCtx.gradeAverage}/20
- Moyenne des Examens: ${studentCtx.examAverage}/20
- Taux de Présence: ${studentCtx.attendanceRate}%
- Absences: ${studentCtx.totalAbsences} sur ${studentCtx.totalSessions} séances
- Évaluations: ${studentCtx.examCount} examens, ${studentCtx.quizCount} quiz, ${studentCtx.assignmentCount} devoirs, ${studentCtx.projectCount} projets

### Résultats des Examens
${studentCtx.examsSummary}

### Toutes les Notes par Matière
${studentCtx.gradesSummary || 'Aucune note disponible'}
`;
}

// ─────────────────────────────────────────────────
// 6. SYSTEM PROMPT (Bilingual, Context-Aware)
// ─────────────────────────────────────────────────
function buildSystemPrompt(fullContext, studentCtx) {
  const studentBlock = buildStudentContextBlock(studentCtx);

  return `Tu es un assistant académique intelligent pour l'EMSI (École Marocaine des Sciences de l'Ingénieur).
Tu aides les étudiants et le personnel avec toutes les questions relatives à la vie académique.

## Tes Règles
1. **Réponds toujours dans la même langue que la question** (français ou anglais).
2. **Sois précis et utile** : utilise les données du contexte ci-dessous pour répondre.
3. **Quand l'étudiant pose une question sur ses notes, son assiduité ou sa situation personnelle**, utilise les données de son profil ci-dessous.
4. **Cite tes sources** quand tu donnes une information factuelle (ex: "Selon la politique d'assiduité de l'EMSI...").
5. **Si l'information n'est pas dans le contexte**, dis-le honnêtement et suggère à qui s'adresser.
6. **Sois amical et encourageant**. Utilise des emojis modérément.
7. **Garde tes réponses concises** mais complètes (2-4 paragraphes max).
8. **Si l'étudiant dit bonjour ou te salue**, réponds chaleureusement et propose ton aide.

${studentBlock}

## Base de Connaissances EMSI
${fullContext}`;
}

// ─────────────────────────────────────────────────
// 7. MAIN RAG QUERY (Single question)
// ─────────────────────────────────────────────────

/**
 * Main RAG query function
 */
export async function queryKnowledgeBase(question, studentId = null) {
  try {
    // Multi-source retrieval
    const staticCtx = retrieveRelevantContext(question);
    const [dbCtx, newsCtx, studentCtx] = await Promise.all([
      getDatabaseKnowledge(question),
      getNewsContext(),
      getStudentContext(studentId)
    ]);

    // Combine all contexts
    const fullContext = [staticCtx.content, dbCtx.content, newsCtx.content].filter(Boolean).join('\n\n');
    const allSources = [...staticCtx.sources, ...dbCtx.sources, ...newsCtx.sources].filter(Boolean);

    // Generate answer using Groq with enriched context
    const completion = await callGroq([
      {
        role: 'system',
        content: buildSystemPrompt(fullContext, studentCtx)
      },
      {
        role: 'user',
        content: question
      }
    ], { temperature: 0.4, maxOutputTokens: 700 });

    const answer = completion.choices[0]?.message?.content || 'Désolé, je n\'ai pas pu générer une réponse. Veuillez réessayer.';

    // Create citations from sources
    const uniqueSources = [...new Set(allSources)];
    const citations = uniqueSources.map(source => ({
      source,
      excerpt: `Source: ${source}`
    }));

    return {
      answer,
      citations,
      confidence: allSources.length > 0 ? 0.9 : 0.5
    };
  } catch (error) {
    console.error('RAG query error:', error);

    return {
      answer: getFallbackResponse(question),
      citations: [{ source: 'EMSI - Informations Générales', excerpt: 'Réponse de secours' }],
      confidence: 0.5
    };
  }
}

// ─────────────────────────────────────────────────
// 8. MULTI-TURN CHAT
// ─────────────────────────────────────────────────

/**
 * Chat with the knowledge assistant (multi-turn, student-aware)
 */
export async function chatWithAssistant(messages, studentId = null) {
  try {
    // Get context from the last user message
    const lastUserMessage = messages.filter(m => m.role === 'user').pop();
    if (!lastUserMessage) {
      return { response: "Bonjour ! Comment puis-je vous aider aujourd'hui ? 😊", citations: [] };
    }

    // Multi-source retrieval
    const staticCtx = retrieveRelevantContext(lastUserMessage.content);
    const [dbCtx, newsCtx, studentCtx] = await Promise.all([
      getDatabaseKnowledge(lastUserMessage.content),
      getNewsContext(),
      getStudentContext(studentId)
    ]);

    // Combine contexts
    const fullContext = [staticCtx.content, dbCtx.content, newsCtx.content].filter(Boolean).join('\n\n');
    const allSources = [...staticCtx.sources, ...dbCtx.sources, ...newsCtx.sources].filter(Boolean);

    // Build conversation with enriched system prompt
    const conversationMessages = [
      {
        role: 'system',
        content: buildSystemPrompt(fullContext, studentCtx)
      },
      ...messages.map(m => ({
        role: m.role,
        content: m.content
      }))
    ];

    const completion = await callGroq(conversationMessages, { temperature: 0.4, maxOutputTokens: 700 });

    const response = completion.choices[0]?.message?.content ||
      "Je suis là pour vous aider. Que souhaitez-vous savoir ? 😊";

    const uniqueSources = [...new Set(allSources)];
    const citations = uniqueSources.map(source => ({
      source,
      excerpt: `Source: ${source}`
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

// ─────────────────────────────────────────────────
// 9. FALLBACK RESPONSES
// ─────────────────────────────────────────────────

/**
 * Bilingual fallback responses for common questions
 */
function getFallbackResponse(question) {
  const q = normalizeText(question);

  if (q.includes('note') || q.includes('grade') || q.includes('moyenne')) {
    return "📊 Le système de notation à l'EMSI utilise une échelle de 0 à 20. Les notes au-dessus de 10/20 sont validées. Pour les détails de vos notes, consultez votre profil étudiant ci-dessus ou contactez les Affaires Académiques.";
  }
  if (q.includes('absence') || q.includes('assiduite') || q.includes('presence') || q.includes('attendance')) {
    return "📋 L'assiduité minimale requise est de 75% par matière. Les absences médicales doivent être justifiées sous 48h. Les retards de plus de 15 min comptent comme demi-absence. Contactez le service étudiant pour plus de détails.";
  }
  if (q.includes('examen') || q.includes('exam') || q.includes('controle') || q.includes('partiel')) {
    return "📝 Le calendrier des examens est affiché 3 semaines avant la période d'examen. Les conflits d'horaires doivent être signalés dans les 5 jours. Les rattrapages ne sont autorisés que pour urgence médicale documentée.";
  }
  if (q.includes('inscription') || q.includes('register') || q.includes('cours')) {
    return "📚 L'inscription aux cours ouvre 2 semaines avant le début du semestre. L'inscription tardive entraîne des frais de 200 MAD. Charge maximale: 30 crédits/semestre.";
  }
  if (q.includes('bourse') || q.includes('scholarship') || q.includes('financ')) {
    return "🎓 Bourses disponibles: Mérite (moyenne > 16/20, 50% frais), Aide basée sur les besoins, Bourse sportive. Date limite de candidature: 30 juin. Contactez le bureau d'aide financière.";
  }
  if (q.includes('stage') || q.includes('internship') || q.includes('pfe') || q.includes('pfa')) {
    return "💼 Stages : Observation (1ère/2ème année), Technique (3ème/4ème année), PFE (5ème année - 6 mois). Les conventions doivent être signées par l'administration avant de commencer.";
  }
  if (q.includes('club') || q.includes('bde') || q.includes('sport')) {
    return "🎉 La vie étudiante (BDE) organise de nombreux clubs (IT, Robotique, Enactus, Sports, Musique). Les inscriptions se font en début de semestre au Student Center (Bâtiment G).";
  }
  if (q.includes('frais') || q.includes('paiement') || q.includes('tuition')) {
    return "💰 Les frais de scolarité peuvent être payés comptant, en 3 ou 9 tranches. Méthodes: virement, chèque ou en ligne. Attention: 5% de pénalité de retard après 15 jours.";
  }
  if (q.includes('wifi') || q.includes('mot de passe') || q.includes('teams') || q.includes('moodle')) {
    return "💻 Connectez-vous au réseau 'EMSI_Student' avec vos identifiants. Pour réinitialiser un mot de passe ou d'autres problèmes informatiques, contactez le Help Desk à it@emsi.ma (Bâtiment B).";
  }
  if (q.includes('bonjour') || q.includes('salut') || q.includes('hello') || q.includes('hi')) {
    return "👋 Bonjour ! Je suis votre assistant académique EMSI. Je peux vous aider avec des questions sur les notes, examens, stages, clubs, frais, etc. Que souhaitez-vous savoir ?";
  }

  return "🤔 Je suis votre assistant académique EMSI. Je peux vous aider avec des questions sur les notes, l'assiduité, les examens, les inscriptions, les bourses, les stages ou la vie étudiante. Pourriez-vous reformuler votre question ?";
}

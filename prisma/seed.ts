// EMSI Flow - Database Seed Script
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Sample data
const classes = [
  { name: '1ère année GI', code: '1GI', department: 'Génie Informatique', year: 1 },
  { name: '2ème année GI', code: '2GI', department: 'Génie Informatique', year: 2 },
  { name: '1ère année BTS', code: '1BTS', department: 'BTS', year: 1 },
  { name: '2ème année BTS', code: '2BTS', department: 'BTS', year: 2 },
];

const subjects = [
  // 1GI Subjects
  { name: 'Mathématiques', code: 'MATH101', classCode: '1GI', coefficient: 3 },
  { name: 'Algorithmique', code: 'ALGO101', classCode: '1GI', coefficient: 2.5 },
  { name: 'Programmation C', code: 'PRG101', classCode: '1GI', coefficient: 2.5 },
  { name: 'Physique', code: 'PHY101', classCode: '1GI', coefficient: 2 },
  { name: 'Anglais', code: 'ENG101', classCode: '1GI', coefficient: 1.5 },
  
  // 2GI Subjects
  { name: 'Base de données', code: 'DB201', classCode: '2GI', coefficient: 3 },
  { name: 'Programmation Java', code: 'JAVA201', classCode: '2GI', coefficient: 2.5 },
  { name: 'Réseaux', code: 'NET201', classCode: '2GI', coefficient: 2.5 },
  { name: 'Systèmes', code: 'SYS201', classCode: '2GI', coefficient: 2 },
  { name: 'Mathématiques Avancées', code: 'MATH201', classCode: '2GI', coefficient: 2 },
  
  // 1BTS Subjects
  { name: 'Développement Web', code: 'WEB101', classCode: '1BTS', coefficient: 3 },
  { name: 'Gestion de Projet', code: 'GP101', classCode: '1BTS', coefficient: 2 },
  { name: 'Base de Données', code: 'DB101', classCode: '1BTS', coefficient: 2.5 },
  { name: 'Réseaux Informatiques', code: 'NET101', classCode: '1BTS', coefficient: 2 },
  { name: 'Communication', code: 'COM101', classCode: '1BTS', coefficient: 1.5 },
  
  // 2BTS Subjects
  { name: 'Frameworks Web', code: 'FW201', classCode: '2BTS', coefficient: 3 },
  { name: 'DevOps', code: 'DEVOPS201', classCode: '2BTS', coefficient: 2.5 },
  { name: 'Mobile Development', code: 'MOB201', classCode: '2BTS', coefficient: 2.5 },
  { name: 'Cybersécurité', code: 'SEC201', classCode: '2BTS', coefficient: 2 },
  { name: 'Projet Tuteuré', code: 'PROJ201', classCode: '2BTS', coefficient: 3 },
];

// Student names (Moroccan names)
const firstNames = ['Ahmed', 'Mohammed', 'Youssef', 'Omar', 'Hassan', 'Karim', 'Amal', 'Fatima', 'Sara', 'Nadia', 'Imane', 'Amina', 'Samir', 'Khalid', 'Rachid', 'Nabil', 'Mouna', 'Laila', 'Houda', 'Khadija'];
const lastNames = ['Alami', 'Benali', 'Cherkaoui', 'El Idrissi', 'Fassi', 'Ghaleb', 'Hassani', 'Ibrahimi', 'Jabri', 'Kabbaj', 'Lahlou', 'Mansouri', 'Naciri', 'Ouahbi', 'Rachidi', 'Salimi', 'Tazi', 'Vakili', 'Ziani', 'Bennani'];

// Generate random student
function generateStudent(index: number, classCode: string) {
  const firstName = firstNames[index % firstNames.length];
  const lastName = lastNames[Math.floor(index / firstNames.length) % lastNames.length];
  const studentNumber = String(index + 1).padStart(4, '0');
  
  return {
    name: `${firstName} ${lastName}`,
    email: `student${studentNumber}@emsi.ma`,
    classCode
  };
}

// Generate grades based on performance profile
function generateGrades(studentIndex: number, subjectIds: string[], performance: 'high' | 'medium' | 'low' | 'declining') {
  const grades = [];
  const now = new Date();
  
  subjectIds.forEach(subjectId => {
    // 2-4 grades per subject
    const numGrades = 2 + Math.floor(Math.random() * 3);
    
    for (let i = 0; i < numGrades; i++) {
      let baseGrade: number;
      const maxValue = Math.random() > 0.3 ? 20 : Math.random() > 0.5 ? 40 : 100;
      
      switch (performance) {
        case 'high':
          baseGrade = 14 + Math.random() * 5; // 14-19
          break;
        case 'medium':
          baseGrade = 10 + Math.random() * 5; // 10-15
          break;
        case 'low':
          baseGrade = 5 + Math.random() * 5; // 5-10
          break;
        case 'declining':
          baseGrade = i < numGrades / 2 
            ? 13 + Math.random() * 4  // Good start
            : 7 + Math.random() * 4;   // Declining
          break;
      }
      
      // Add some variance
      const variance = (Math.random() - 0.5) * 4;
      let grade = Math.max(2, Math.min(maxValue - 1, (baseGrade + variance) / 20 * maxValue));
      
      const types = ['exam', 'quiz', 'assignment', 'project'];
      const type = types[Math.floor(Math.random() * types.length)];
      
      const date = new Date(now);
      date.setDate(date.getDate() - (numGrades - i) * 14 - Math.floor(Math.random() * 7));
      
      grades.push({
        subjectId,
        value: Math.round(grade * 10) / 10,
        maxValue,
        type,
        date
      });
    }
  });
  
  return grades;
}

// Generate attendance based on performance profile
function generateAttendance(studentIndex: number, subjectIds: string[], performance: 'high' | 'medium' | 'low' | 'declining') {
  const attendanceRecords = [];
  const now = new Date();
  
  // Generate attendance for past 8 weeks
  for (let week = 0; week < 8; week++) {
    subjectIds.forEach(subjectId => {
      const date = new Date(now);
      date.setDate(date.getDate() - week * 7);
      
      let presentProbability: number;
      switch (performance) {
        case 'high':
          presentProbability = 0.95;
          break;
        case 'medium':
          presentProbability = 0.85;
          break;
        case 'low':
          presentProbability = 0.65;
          break;
        case 'declining':
          presentProbability = week < 4 ? 0.9 : 0.6; // Declining attendance
          break;
      }
      
      const rand = Math.random();
      let status: string;
      if (rand < presentProbability) {
        status = 'present';
      } else if (rand < presentProbability + 0.05) {
        status = 'late';
      } else if (rand < presentProbability + 0.08) {
        status = 'excused';
      } else {
        status = 'absent';
      }
      
      attendanceRecords.push({
        subjectId,
        date,
        status
      });
    });
  }
  
  return attendanceRecords;
}

async function main() {
  console.log('🌱 Starting database seed...');
  
  // Clean existing data
  await prisma.grade.deleteMany();
  await prisma.attendance.deleteMany();
  await prisma.riskAlert.deleteMany();
  await prisma.subject.deleteMany();
  await prisma.student.deleteMany();
  await prisma.class.deleteMany();
  await prisma.knowledgeDocument.deleteMany();
  await prisma.systemSettings.deleteMany();
  
  console.log('✅ Cleaned existing data');
  
  // Create classes
  const classMap: Record<string, string> = {};
  for (const cls of classes) {
    const created = await prisma.class.create({
      data: cls
    });
    classMap[cls.code] = created.id;
    console.log(`📚 Created class: ${cls.name}`);
  }
  
  // Create subjects
  const subjectMap: Record<string, string> = {};
  for (const subject of subjects) {
    const created = await prisma.subject.create({
      data: {
        name: subject.name,
        code: subject.code,
        classId: classMap[subject.classCode],
        coefficient: subject.coefficient
      }
    });
    subjectMap[subject.code] = created.id;
  }
  console.log(`📖 Created ${subjects.length} subjects`);
  
  // Create students with different performance profiles
  const performances: Array<'high' | 'medium' | 'low' | 'declining'> = 
    ['high', 'high', 'high', 'medium', 'medium', 'medium', 'medium', 'low', 'low', 'declining'];
  
  let studentCount = 0;
  const classCodes = ['1GI', '2GI', '1BTS', '2BTS'];
  
  for (const classCode of classCodes) {
    const classId = classMap[classCode];
    const classSubjects = subjects.filter(s => s.classCode === classCode);
    const subjectIds = classSubjects.map(s => subjectMap[s.code]);
    
    // 10 students per class
    for (let i = 0; i < 10; i++) {
      const studentData = generateStudent(studentCount, classCode);
      const performance = performances[i];
      
      const student = await prisma.student.create({
        data: {
          name: studentData.name,
          email: studentData.email,
          classId
        }
      });
      
      // Create grades
      const grades = generateGrades(studentCount, subjectIds, performance);
      for (const grade of grades) {
        await prisma.grade.create({
          data: {
            studentId: student.id,
            subjectId: grade.subjectId,
            value: grade.value,
            maxValue: grade.maxValue,
            type: grade.type,
            date: grade.date
          }
        });
      }
      
      // Create attendance
      const attendance = generateAttendance(studentCount, subjectIds, performance);
      for (const att of attendance) {
        try {
          await prisma.attendance.create({
            data: {
              studentId: student.id,
              subjectId: att.subjectId,
              date: att.date,
              status: att.status
            }
          });
        } catch {
          // Skip duplicate dates
        }
      }
      
      studentCount++;
    }
  }
  
  console.log(`👥 Created ${studentCount} students with grades and attendance`);
  
  // Create knowledge documents
  const knowledgeDocs = [
    {
      title: 'Système de Notation',
      content: 'Le système de notation à EMSI utilise une échelle de 0 à 20 points. Les notes supérieures à 10/20 sont considérées comme réussies. Les notes entre 8-10/20 peuvent être compensées. Les notes inférieures à 8/20 nécessitent un rattrapage.',
      category: 'policy',
      tags: JSON.stringify(['grades', 'notation', 'évaluation'])
    },
    {
      title: 'Politique d\'Assiduité',
      content: 'Une présence minimale de 75% est requise pour chaque matière. Les étudiants avec moins de 75% de présence peuvent être exclus des examens. Les absences médicales doivent être documentées dans les 48 heures.',
      category: 'policy',
      tags: JSON.stringify(['attendance', 'absence', 'présence'])
    },
    {
      title: 'Calendrier Académique 2024-2025',
      content: 'Semestre d\'Automne: 2 septembre 2024 - 17 janvier 2025. Vacances d\'hiver: 23 décembre 2024 - 3 janvier 2025. Semestre de Printemps: 3 février 2025 - 20 juin 2025. Examens finaux: 20-31 janvier 2025 et 23 juin - 4 juillet 2025.',
      category: 'deadlines',
      tags: JSON.stringify(['calendar', 'dates', 'exams', 'holidays'])
    },
    {
      title: 'Inscription aux Cours',
      content: 'L\'inscription aux cours ouvre 2 semaines avant le début du semestre. L\'inscription tardive entraîne des frais de 200 MAD. La date limite pour abandonner un cours est 3 semaines après le début du semestre.',
      category: 'academic',
      tags: JSON.stringify(['registration', 'courses', 'inscription'])
    },
    {
      title: 'Ressources de Soutien Académique',
      content: 'Centre de Tutorat: Bâtiment A, Salle 101, Ouvert 9h-18h. Centre d\'Écriture: Bâtiment B, Salle 205, Ouvert 10h-17h. Aide en Mathématiques: Bâtiment C, Salle 103, Ouvert 14h-18h.',
      category: 'resources',
      tags: JSON.stringify(['tutoring', 'help', 'support', 'resources'])
    },
    {
      title: 'Bourses et Aides Financières',
      content: 'Bourse de Mérite: GPA supérieur à 16/20, couvre 50% des frais. Aide basée sur les besoins: Disponible via le bureau d\'aide financière. Bourse Sportive: Pour les athlètes varsity. Date limite de candidature: 30 juin.',
      category: 'policy',
      tags: JSON.stringify(['scholarship', 'financial aid', 'bourse'])
    },
    {
      title: 'Probation Académique',
      content: 'Les étudiants avec une moyenne inférieure à 10/20 pendant deux semestres consécutifs sont placés en probation. Les étudiants en probation doivent rencontrer leur conseiller académique chaque semaine.',
      category: 'policy',
      tags: JSON.stringify(['probation', 'academic standing', 'warning'])
    },
    {
      title: 'Politique d\'Examens',
      content: 'Le calendrier des examens finaux est affiché 3 semaines avant la période d\'examens. Les conflits d\'horaires doivent être signalés dans les 5 jours. Les examens de rattrapage ne sont autorisés que pour les urgences médicales documentées.',
      category: 'academic',
      tags: JSON.stringify(['exams', 'schedule', 'makeup'])
    },
    {
      title: 'Installations du Campus',
      content: 'Cafétéria: Bâtiment E, Ouvert 7h-20h. Complexe Sportif: Bâtiment F, Piscine, Salle de Sport. Centre Étudiant: Bâtiment G, Clubs, Salles d\'étude. Bibliothèque: Ouverte 7h-22h lundi-vendredi.',
      category: 'resources',
      tags: JSON.stringify(['campus', 'facilities', 'library', 'sports'])
    },
    {
      title: 'Code de Conduite Étudiant',
      content: 'L\'intégrité académique est strictement appliquée. Le plagiat entraîne l\'échec du cours et une possible suspension. Un comportement respectueux envers le corps professoral est obligatoire. Carte d\'étudiant visible sur le campus.',
      category: 'policy',
      tags: JSON.stringify(['conduct', 'integrity', 'plagiarism', 'rules'])
    }
  ];
  
  for (const doc of knowledgeDocs) {
    await prisma.knowledgeDocument.create({
      data: doc
    });
  }
  
  console.log(`📚 Created ${knowledgeDocs.length} knowledge documents`);
  
  console.log('✅ Database seed completed!');
}

main()
  .catch((e) => {
    console.error('Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

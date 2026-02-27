// EMSI Flow - Database Seed Script
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Sample data
const classes = [
  { name: '1ère année GI', code: '1GI', department: 'Génie Informatique', year: 1 },
  { name: '2ème année GI', code: '2GI', department: 'Génie Informatique', year: 2 },
  { name: '1ère année IA', code: '1IA', department: 'Intelligence Artificielle', year: 1 },
  { name: '2ème année IA', code: '2IA', department: 'Intelligence Artificielle', year: 2 },
  { name: '1ère année Cyber', code: '1CYB', department: 'Cybersécurité', year: 1 },
  { name: '2ème année Cyber', code: '2CYB', department: 'Cybersécurité', year: 2 },
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

  // 1IA Subjects
  { name: 'Statistiques', code: 'STAT101', classCode: '1IA', coefficient: 3 },
  { name: 'Python pour IA', code: 'PYIA101', classCode: '1IA', coefficient: 3 },
  { name: 'Algèbre Linéaire', code: 'ALG101', classCode: '1IA', coefficient: 2.5 },
  { name: 'Structures de Données', code: 'STR101', classCode: '1IA', coefficient: 2.5 },

  // 2IA Subjects
  { name: 'Machine Learning', code: 'ML201', classCode: '2IA', coefficient: 4 },
  { name: 'Deep Learning', code: 'DL201', classCode: '2IA', coefficient: 4 },
  { name: 'NLP', code: 'NLP201', classCode: '2IA', coefficient: 3 },
  { name: 'Computer Vision', code: 'CV201', classCode: '2IA', coefficient: 3 },

  // 1CYB Subjects
  { name: 'Sécurité des OS', code: 'SEC101', classCode: '1CYB', coefficient: 3 },
  { name: 'Cryptographie', code: 'CRYP101', classCode: '1CYB', coefficient: 3 },
  { name: 'Unix Administration', code: 'UNIX101', classCode: '1CYB', coefficient: 2 },

  // 2CYB Subjects
  { name: 'Pentesting', code: 'PENT201', classCode: '2CYB', coefficient: 4 },
  { name: 'Forensics', code: 'FOR201', classCode: '2CYB', coefficient: 3 },
  { name: 'Droit du Numérique', code: 'LAW201', classCode: '2CYB', coefficient: 1 },

  // 1BTS Subjects
  { name: 'Développement Web', code: 'WEB101', classCode: '1BTS', coefficient: 3 },
  { name: 'Gestion de Projet', code: 'GP101', classCode: '1BTS', coefficient: 2 },
  { name: 'Base de Données', code: 'DB101', classCode: '1BTS', coefficient: 2.5 },

  // 2BTS Subjects
  { name: 'Frameworks Web', code: 'FW201', classCode: '2BTS', coefficient: 3 },
  { name: 'DevOps', code: 'DEVOPS201', classCode: '2BTS', coefficient: 2.5 },
  { name: 'Cybersécurité', code: 'SEC201', classCode: '2BTS', coefficient: 2 },
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
  const grades: any[] = [];
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
  const attendanceRecords: any[] = [];
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

  // Create students with different performance profiles (20 students per class)
  const performances: Array<'high' | 'medium' | 'low' | 'declining'> =
    ['high', 'high', 'high', 'high', 'high', 'medium', 'medium', 'medium', 'medium', 'medium', 'medium', 'medium', 'low', 'low', 'low', 'low', 'declining', 'declining', 'declining', 'declining'];

  let studentCount = 0;
  const classCodes = ['1GI', '2GI', '1IA', '2IA', '1CYB', '2CYB', '1BTS', '2BTS'];

  for (const classCode of classCodes) {
    const classId = classMap[classCode];
    const classSubjects = subjects.filter(s => s.classCode === classCode);
    const subjectIds = classSubjects.map(s => subjectMap[s.code]);

    // 20 students per class
    for (let i = 0; i < 20; i++) {
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
      title: 'Politique des Stages',
      content: '1ère et 2ème année : Stage d\'observation obligatoire en été (1 mois). 3ème et 4ème année : Stage technique (2 mois). 5ème année : Projet de Fin d\'Études PFE (6 mois). Toutes les conventions de stage doivent être validées avant le début.',
      category: 'academic',
      tags: JSON.stringify(['stage', 'internship', 'pfe', 'pfa', 'convention'])
    },
    {
      title: 'Services Informatiques et Réseaux',
      content: 'Les étudiants utilisent Microsoft Teams pour les cours et les devoirs. Le Wi-Fi du campus est "EMSI_Student" (connexion avec l\'email de l\'école). L\'accès à Office 365 est gratuit. En cas de mot de passe oublié, allez au Help Desk (Bâtiment B).',
      category: 'resources',
      tags: JSON.stringify(['wifi', 'it', 'moodle', 'teams', 'password', 'mot de passe'])
    },
    {
      title: 'Clubs et Bureau des Étudiants',
      content: 'Le BDE organise la vie associative. Les clubs majeurs incluent l\'IT Club, le Club de Robotique, Enactus et le Club de Sport. Les inscriptions aux clubs ont lieu les trois premières semaines du semestre d\'automne au Centre Étudiant.',
      category: 'resources',
      tags: JSON.stringify(['club', 'bde', 'sport', 'activité', 'extracurricular'])
    },
    {
      title: 'Frais de Scolarité',
      content: 'Les paiements peuvent être effectués au comptant, en 3 ou 9 mensualités. Une pénalité de 5% est appliquée en cas de retard de plus de 15 jours. Les frais de réinscription doivent être réglés avant le 30 juillet.',
      category: 'policy',
      tags: JSON.stringify(['frais', 'paiement', 'tuition', 'finance'])
    },
    {
      title: 'Santé et Infirmerie',
      content: 'L\'infirmerie (Bâtiment D) est ouverte de 8h à 17h pour les premiers soins. Des consultations psychologiques gratuites sont disponibles sur rendez-vous à counseling@emsi.ma.',
      category: 'resources',
      tags: JSON.stringify(['santé', 'infirmerie', 'médical', 'health'])
    }
  ];

  for (const doc of knowledgeDocs) {
    await prisma.knowledgeDocument.create({
      data: doc
    });
  }

  console.log(`📚 Created ${knowledgeDocs.length} knowledge documents`);

  // Create News
  const newsItems = [
    {
      title: 'Examens de Fin de Semestre',
      content: 'Le calendrier des examens pour le semestre d\'automne est désormais disponible sur le portail étudiant. Veuillez vérifier vos dates et salles.',
      type: 'exam',
      priority: 'high',
      eventDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    },
    {
      title: 'Séminaire sur l\'Intelligence Artificielle',
      content: 'Rejoignez-nous pour une conférence passionnante sur l\'avenir de l\'IA dans l\'industrie marocaine le 15 mars à l\'amphithéâtre principal.',
      type: 'event',
      priority: 'normal',
      eventDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000)
    },
    {
      title: 'Mise à jour de la Bibliothèque',
      content: 'De nouveaux ouvrages sur le Cloud Computing et la Cybersécurité sont disponibles dès aujourd\'hui à la bibliothèque.',
      type: 'general',
      priority: 'low'
    },
    {
      title: 'Date Limite de Soumission des Projets',
      content: 'Rappel : La date limite pour soumettre vos rapports de projet tuteuré est fixée au vendredi prochain à minuit sur la plateforme Moodle.',
      type: 'deadline',
      priority: 'high',
      eventDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000)
    },
    {
      title: 'Maintenance du Portail Étudiant',
      content: 'Le portail étudiant sera inaccessible ce dimanche de 02h00 à 06h00 pour une maintenance technique.',
      type: 'alert',
      priority: 'normal'
    },
  ];

  for (const news of newsItems) {
    await prisma.news.create({
      data: news
    });
  }
  console.log(`🆕 Created ${newsItems.length} news items`);

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

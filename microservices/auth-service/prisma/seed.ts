import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 12);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@edumatch.com' },
    update: {},
    create: {
      email: 'admin@edumatch.com',
      passwordHash: adminPassword,
      role: 'ADMIN',
      status: 'ACTIVE',
      emailVerified: true,
      profile: {
        create: {
          firstName: 'Admin',
          lastName: 'User',
          verified: true,
        },
      },
    },
  });

  // Create sample student
  const studentPassword = await bcrypt.hash('student123', 12);
  const student = await prisma.user.upsert({
    where: { email: 'student@example.com' },
    update: {},
    create: {
      email: 'student@example.com',
      passwordHash: studentPassword,
      role: 'STUDENT',
      status: 'ACTIVE',
      emailVerified: true,
      profile: {
        create: {
          firstName: 'John',
          lastName: 'Doe',
          university: 'MIT',
          major: 'Computer Science',
          gpa: 3.8,
          currentLevel: 'graduate',
          skills: ['JavaScript', 'Python', 'Machine Learning', 'React'],
          interests: ['AI', 'Web Development', 'Research'],
          bio: 'Passionate computer science student interested in AI and web development.',
        },
      },
    },
  });

  // Create sample provider
  const providerPassword = await bcrypt.hash('provider123', 12);
  const provider = await prisma.user.upsert({
    where: { email: 'provider@university.edu' },
    update: {},
    create: {
      email: 'provider@university.edu',
      passwordHash: providerPassword,
      role: 'PROFESSOR',
      status: 'ACTIVE',
      emailVerified: true,
      profile: {
        create: {
          firstName: 'Dr. Jane',
          lastName: 'Smith',
          organizationName: 'Stanford University',
          position: 'Professor',
          verified: true,
          website: 'https://stanford.edu/~jsmith',
        },
      },
    },
  });

  // Create sample scholarships
  const scholarship1 = await prisma.scholarship.create({
    data: {
      providerId: provider.id,
      title: 'AI Research Fellowship',
      description: 'Full-time research fellowship in artificial intelligence and machine learning. Work with cutting-edge technologies and contribute to groundbreaking research.',
      type: 'GRADUATE',
      status: 'PUBLISHED',
      university: 'Stanford University',
      department: 'Computer Science',
      location: 'Stanford, CA',
      amount: 50000,
      currency: 'USD',
      duration: 12,
      applicationDeadline: new Date('2024-12-31'),
      startDate: new Date('2024-09-01'),
      requirements: {
        degree: 'Bachelor in Computer Science or related field',
        experience: 'Research experience preferred',
        gpa: 'Minimum 3.5 GPA',
      },
      eligibility: {
        citizenship: 'Any',
        age: 'Under 30',
      },
      requiredSkills: ['Python', 'Machine Learning', 'Deep Learning'],
      preferredSkills: ['TensorFlow', 'PyTorch', 'Research Publications'],
      minGpa: 3.5,
      tags: ['AI', 'Research', 'Fellowship', 'Graduate'],
      contactEmail: 'fellowships@stanford.edu',
      website: 'https://ai.stanford.edu/fellowships',
    },
  });

  const scholarship2 = await prisma.scholarship.create({
    data: {
      providerId: provider.id,
      title: 'Web Development Internship',
      description: 'Summer internship program for undergraduate students interested in full-stack web development.',
      type: 'UNDERGRADUATE',
      status: 'PUBLISHED',
      university: 'Stanford University',
      department: 'Computer Science',
      location: 'Stanford, CA',
      isRemote: true,
      amount: 8000,
      currency: 'USD',
      duration: 3,
      applicationDeadline: new Date('2024-11-30'),
      startDate: new Date('2024-06-01'),
      requirements: {
        degree: 'Currently enrolled in Computer Science or related field',
        experience: 'Basic programming knowledge',
      },
      eligibility: {
        level: 'Undergraduate',
        citizenship: 'Any',
      },
      requiredSkills: ['JavaScript', 'HTML', 'CSS'],
      preferredSkills: ['React', 'Node.js', 'Express'],
      tags: ['Web Development', 'Internship', 'Remote', 'Summer'],
      contactEmail: 'internships@stanford.edu',
      website: 'https://cs.stanford.edu/internships',
    },
  });

  // Create matching scores
  await prisma.matchingScore.create({
    data: {
      userId: student.id,
      scholarshipId: scholarship1.id,
      score: 0.85,
      factors: {
        skillsMatch: 0.9,
        educationMatch: 0.8,
        experienceMatch: 0.7,
        gpaMatch: 0.95,
      },
    },
  });

  await prisma.matchingScore.create({
    data: {
      userId: student.id,
      scholarshipId: scholarship2.id,
      score: 0.78,
      factors: {
        skillsMatch: 0.95,
        educationMatch: 1.0,
        experienceMatch: 0.6,
        gpaMatch: 0.95,
      },
    },
  });

  // Create sample application
  await prisma.application.create({
    data: {
      applicantId: student.id,
      scholarshipId: scholarship2.id,
      status: 'SUBMITTED',
      coverLetter: 'I am very interested in this web development internship opportunity...',
      submittedAt: new Date(),
    },
  });

  // Create system settings
  await prisma.systemSettings.upsert({
    where: { key: 'maintenance_mode' },
    update: {},
    create: {
      key: 'maintenance_mode',
      value: false,
      description: 'Enable/disable maintenance mode',
    },
  });

  await prisma.systemSettings.upsert({
    where: { key: 'max_applications_per_user' },
    update: {},
    create: {
      key: 'max_applications_per_user',
      value: 10,
      description: 'Maximum applications per user per month',
    },
  });

  console.log('✅ Database seed completed!');
  console.log('👤 Admin user: admin@edumatch.com / admin123');
  console.log('🎓 Student user: student@example.com / student123');
  console.log('🏫 Provider user: provider@university.edu / provider123');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

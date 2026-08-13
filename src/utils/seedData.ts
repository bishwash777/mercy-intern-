import { StudentModel } from '../models/student.model';
import { CourseModel } from '../models/course.model';
import { EnrollmentModel } from '../models/enrollment.model';

/**
 * Initializes default dynamic sample data if stores are empty.
 */
export const seedInitialData = (): void => {
  StudentModel.seed([
    {
      name: 'John Doe',
      email: 'john.doe@example.com',
      phone: '+1234567890',
      age: 22,
    },
    {
      name: 'Alice Smith',
      email: 'alice.smith@example.com',
      phone: '+1987654321',
      age: 20,
    },
    {
      name: 'Bob Johnson',
      email: 'bob.johnson@example.com',
      phone: '+1555123456',
      age: 24,
    },
  ]);

  CourseModel.seed([
    {
      title: 'Node.js Fundamentals',
      description: 'Learn Node.js from scratch including async patterns, express, and REST APIs.',
      duration: '8 weeks',
    },
    {
      title: 'React & Frontend Architecture',
      description: 'Master React components, state management, and modern web application design.',
      duration: '10 weeks',
    },
    {
      title: 'TypeScript for Backend Engineering',
      description: 'Deep dive into static typing, interfaces, decorators, and scalable Node.js patterns.',
      duration: '6 weeks',
    },
  ]);

  EnrollmentModel.seed([
    { studentId: 1, courseId: 1 },
    { studentId: 1, courseId: 2 },
    { studentId: 2, courseId: 1 },
  ]);
};

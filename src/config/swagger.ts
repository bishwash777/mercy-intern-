import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Student Course Management System API',
      version: '1.0.0',
      description: `
A RESTful API for managing students, courses, and enrollments.

## Features
- Full CRUD for Students and Courses
- Enrollment management with duplicate prevention
- Search, Pagination & Sorting
- Soft Delete support
- Global Error Handling
- Input Validation
      `,
      contact: {
        name: 'API Support',
        email: 'admin@example.com',
      },
    },
    servers: [
      {
        url: 'http://localhost:3000/api',
        description: 'Development Server',
      },
    ],
    tags: [
      { name: 'Students', description: 'Student management endpoints' },
      { name: 'Courses', description: 'Course management endpoints' },
      { name: 'Enrollments', description: 'Enrollment management endpoints' },
    ],
  },
  apis: ['./src/routes/*.ts', './src/controllers/*.ts'],
};

export const swaggerSpec = swaggerJsdoc(options);

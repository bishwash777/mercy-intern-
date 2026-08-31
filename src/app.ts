import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import swaggerUi from 'swagger-ui-express';

import { swaggerSpec } from './config/swagger';
import studentRoutes from './routes/student.routes';
import courseRoutes from './routes/course.routes';
import enrollmentRoutes from './routes/enrollment.routes';
import { errorHandler } from './middlewares/errorHandler';
import { notFound } from './middlewares/notFound';
import { seedInitialData } from './utils/seedData';

// Seed default dynamic sample data if stores are empty
seedInitialData();

const app: Application = express();

// ─── Security & Parsing Middleware ──────────────────────────────────────────
app.use(
  helmet({
    contentSecurityPolicy: false, // Disable for Swagger UI compatibility
  })
);
app.use(cors());
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ─── Swagger Documentation ───────────────────────────────────────────────────
app.use(
  '/api-docs',
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, {
    customSiteTitle: 'Student Course Management API',
    customCss: `
      .swagger-ui .topbar { background-color: #1e1e2e; }
      .swagger-ui .topbar-wrapper .link { display: none; }
    `,
  })
);

// Raw Swagger JSON endpoint
app.get('/api-docs.json', (_, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

// ─── Health Check ────────────────────────────────────────────────────────────
app.get('/health', (_, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// ─── API Routes ──────────────────────────────────────────────────────────────
app.use('/api/students', studentRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/enrollments', enrollmentRoutes);

// ─── 404 & Error Handlers ────────────────────────────────────────────────────
app.use(notFound);
app.use(errorHandler);

export default app;

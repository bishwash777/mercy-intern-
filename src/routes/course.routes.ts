import { Router } from 'express';
import { body, param } from 'express-validator';
import { CourseController } from '../controllers/course.controller';
import { validate } from '../middlewares/validate';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Courses
 *   description: Course management
 *
 * components:
 *   schemas:
 *     CreateCourse:
 *       type: object
 *       required: [title, duration]
 *       properties:
 *         title:
 *           type: string
 *           example: Node.js Fundamentals
 *         description:
 *           type: string
 *           example: Learn Node.js from the ground up
 *         duration:
 *           type: string
 *           example: 8 weeks
 *     UpdateCourse:
 *       type: object
 *       properties:
 *         title:
 *           type: string
 *         description:
 *           type: string
 *         duration:
 *           type: string
 */

const createCourseValidation = [
  body('title')
    .trim()
    .notEmpty().withMessage('Course title is required')
    .isLength({ min: 2, max: 200 }).withMessage('Title must be between 2 and 200 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 1000 }).withMessage('Description must not exceed 1000 characters'),
  body('duration')
    .trim()
    .notEmpty().withMessage('Course duration is required')
    .isLength({ min: 1, max: 100 }).withMessage('Duration must be between 1 and 100 characters'),
];

const updateCourseValidation = [
  param('id').isInt({ min: 1 }).withMessage('ID must be a positive integer'),
  body('title')
    .optional()
    .trim()
    .isLength({ min: 2, max: 200 }).withMessage('Title must be between 2 and 200 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 1000 }).withMessage('Description must not exceed 1000 characters'),
  body('duration')
    .optional()
    .trim()
    .isLength({ min: 1, max: 100 }).withMessage('Duration must be between 1 and 100 characters'),
];

const idParamValidation = [
  param('id').isInt({ min: 1 }).withMessage('ID must be a positive integer'),
];

// Routes
router.get('/', CourseController.getAll);
router.get('/:id', idParamValidation, validate, CourseController.getById);
router.get('/:id/students', idParamValidation, validate, CourseController.getStudents);
router.post('/', createCourseValidation, validate, CourseController.create);
router.put('/:id', updateCourseValidation, validate, CourseController.update);
router.delete('/:id', idParamValidation, validate, CourseController.delete);

export default router;

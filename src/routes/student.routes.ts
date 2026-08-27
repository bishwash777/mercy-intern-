import { Router } from 'express';
import { body, param } from 'express-validator';
import { StudentController } from '../controllers/student.controller';
import { validate } from '../middlewares/validate';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Students
 *   description: Student management
 *
 * components:
 *   schemas:
 *     CreateStudent:
 *       type: object
 *       required: [name, email, phone, age]
 *       properties:
 *         name:
 *           type: string
 *           example: John Doe
 *         email:
 *           type: string
 *           format: email
 *           example: john@example.com
 *         phone:
 *           type: string
 *           example: "+1234567890"
 *         age:
 *           type: integer
 *           minimum: 16
 *           example: 20
 *     UpdateStudent:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *         email:
 *           type: string
 *           format: email
 *         phone:
 *           type: string
 *         age:
 *           type: integer
 *           minimum: 16
 */

const createStudentValidation = [
  body('name')
    .trim()
    .notEmpty().withMessage('Name is required')
    .isLength({ min: 2, max: 100 }).withMessage('Name must be between 2 and 100 characters'),
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Must be a valid email address')
    .normalizeEmail(),
  body('phone')
    .trim()
    .notEmpty().withMessage('Phone number is required')
    .matches(/^\+?[\d\s\-().]{7,20}$/).withMessage('Must be a valid phone number'),
  body('age')
    .notEmpty().withMessage('Age is required')
    .isInt({ min: 16 }).withMessage('Age must be greater than 15'),
];

const updateStudentValidation = [
  param('id').isInt({ min: 1 }).withMessage('ID must be a positive integer'),
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 }).withMessage('Name must be between 2 and 100 characters'),
  body('email')
    .optional()
    .trim()
    .isEmail().withMessage('Must be a valid email address')
    .normalizeEmail(),
  body('phone')
    .optional()
    .trim()
    .matches(/^\+?[\d\s\-().]{7,20}$/).withMessage('Must be a valid phone number'),
  body('age')
    .optional()
    .isInt({ min: 16 }).withMessage('Age must be greater than 15'),
];

const idParamValidation = [
  param('id').isInt({ min: 1 }).withMessage('ID must be a positive integer'),
];

// Routes
router.get('/', StudentController.getAll);
router.get('/:id', idParamValidation, validate, StudentController.getById);
router.get('/:id/courses', idParamValidation, validate, StudentController.getCourses);
router.post('/', createStudentValidation, validate, StudentController.create);
router.put('/:id', updateStudentValidation, validate, StudentController.update);
router.delete('/:id', idParamValidation, validate, StudentController.delete);

export default router;

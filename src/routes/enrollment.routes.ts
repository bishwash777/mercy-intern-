import { Router } from 'express';
import { body, param } from 'express-validator';
import { EnrollmentController } from '../controllers/enrollment.controller';
import { validate } from '../middlewares/validate';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Enrollments
 *   description: Enrollment management
 *
 * components:
 *   schemas:
 *     CreateEnrollment:
 *       type: object
 *       required: [studentId, courseId]
 *       properties:
 *         studentId:
 *           type: integer
 *           example: 1
 *         courseId:
 *           type: integer
 *           example: 2
 */

const createEnrollmentValidation = [
  body('studentId')
    .notEmpty().withMessage('studentId is required')
    .isInt({ min: 1 }).withMessage('studentId must be a positive integer'),
  body('courseId')
    .notEmpty().withMessage('courseId is required')
    .isInt({ min: 1 }).withMessage('courseId must be a positive integer'),
];

const idParamValidation = [
  param('id').isInt({ min: 1 }).withMessage('ID must be a positive integer'),
];

// Routes
router.get('/', EnrollmentController.getAll);
router.post('/', createEnrollmentValidation, validate, EnrollmentController.enroll);
router.delete('/:id', idParamValidation, validate, EnrollmentController.delete);

export default router;

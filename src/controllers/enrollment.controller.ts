import { Request, Response, NextFunction } from 'express';
import { EnrollmentService } from '../services/enrollment.service';

const parseId = (id: string | string[]): number => parseInt(Array.isArray(id) ? id[0] : id, 10);

export const EnrollmentController = {
  /**
   * @swagger
   * /enrollments:
   *   get:
   *     summary: Get all enrollments
   *     tags: [Enrollments]
   *     responses:
   *       200:
   *         description: List of all enrollments with student and course details
   */
  getAll(req: Request, res: Response, next: NextFunction): void {
    try {
      const enrollments = EnrollmentService.getAll();
      res.status(200).json({ success: true, data: enrollments });
    } catch (err) {
      next(err);
    }
  },

  /**
   * @swagger
   * /enrollments:
   *   post:
   *     summary: Enroll a student in a course
   *     tags: [Enrollments]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/CreateEnrollment'
   *     responses:
   *       201:
   *         description: Enrollment created successfully
   *       404:
   *         description: Student or course not found
   *       409:
   *         description: Student already enrolled in course
   */
  enroll(req: Request, res: Response, next: NextFunction): void {
    try {
      const { studentId, courseId } = req.body;
      const enrollment = EnrollmentService.enroll(
        parseInt(String(studentId), 10),
        parseInt(String(courseId), 10)
      );
      res.status(201).json({
        success: true,
        message: 'Student enrolled successfully',
        data: enrollment,
      });
    } catch (err) {
      next(err);
    }
  },

  /**
   * @swagger
   * /enrollments/{id}:
   *   delete:
   *     summary: Delete an enrollment
   *     tags: [Enrollments]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *     responses:
   *       200:
   *         description: Enrollment deleted
   *       404:
   *         description: Enrollment not found
   */
  delete(req: Request, res: Response, next: NextFunction): void {
    try {
      EnrollmentService.delete(parseId(req.params.id));
      res.status(200).json({ success: true, message: 'Enrollment deleted successfully' });
    } catch (err) {
      next(err);
    }
  },
};

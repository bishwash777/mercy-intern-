import { Request, Response, NextFunction } from 'express';
import { CourseService } from '../services/course.service';
import { EnrollmentService } from '../services/enrollment.service';

const parseId = (id: string | string[]): number => parseInt(Array.isArray(id) ? id[0] : id, 10);

export const CourseController = {
  /**
   * @swagger
   * /courses:
   *   get:
   *     summary: Get all courses
   *     tags: [Courses]
   *     parameters:
   *       - in: query
   *         name: search
   *         schema:
   *           type: string
   *         description: Search by course title or description
   *       - in: query
   *         name: page
   *         schema:
   *           type: integer
   *       - in: query
   *         name: limit
   *         schema:
   *           type: integer
   *       - in: query
   *         name: sortBy
   *         schema:
   *           type: string
   *           enum: [id, title, duration, createdAt]
   *       - in: query
   *         name: order
   *         schema:
   *           type: string
   *           enum: [asc, desc]
   *     responses:
   *       200:
   *         description: Paginated list of courses
   */
  getAll(req: Request, res: Response, next: NextFunction): void {
    try {
      const { search, page, limit, sortBy, order } = req.query;
      const result = CourseService.getAll({
        search: search as string,
        page: page ? parseInt(page as string) : undefined,
        limit: limit ? parseInt(limit as string) : undefined,
        sortBy: sortBy as string,
        order: (order as 'asc' | 'desc') || 'asc',
      });
      res.status(200).json({ success: true, ...result });
    } catch (err) {
      next(err);
    }
  },

  /**
   * @swagger
   * /courses/{id}:
   *   get:
   *     summary: Get course by ID
   *     tags: [Courses]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *     responses:
   *       200:
   *         description: Course found
   *       404:
   *         description: Course not found
   */
  getById(req: Request, res: Response, next: NextFunction): void {
    try {
      const course = CourseService.getById(parseId(req.params.id));
      res.status(200).json({ success: true, data: course });
    } catch (err) {
      next(err);
    }
  },

  /**
   * @swagger
   * /courses:
   *   post:
   *     summary: Create a new course
   *     tags: [Courses]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/CreateCourse'
   *     responses:
   *       201:
   *         description: Course created
   */
  create(req: Request, res: Response, next: NextFunction): void {
    try {
      const course = CourseService.create(req.body);
      res.status(201).json({ success: true, message: 'Course created successfully', data: course });
    } catch (err) {
      next(err);
    }
  },

  /**
   * @swagger
   * /courses/{id}:
   *   put:
   *     summary: Update a course
   *     tags: [Courses]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/UpdateCourse'
   *     responses:
   *       200:
   *         description: Course updated
   *       404:
   *         description: Course not found
   */
  update(req: Request, res: Response, next: NextFunction): void {
    try {
      const course = CourseService.update(parseId(req.params.id), req.body);
      res.status(200).json({ success: true, message: 'Course updated successfully', data: course });
    } catch (err) {
      next(err);
    }
  },

  /**
   * @swagger
   * /courses/{id}:
   *   delete:
   *     summary: Soft-delete a course
   *     tags: [Courses]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *     responses:
   *       200:
   *         description: Course deleted
   *       404:
   *         description: Course not found
   */
  delete(req: Request, res: Response, next: NextFunction): void {
    try {
      CourseService.delete(parseId(req.params.id));
      res.status(200).json({ success: true, message: 'Course deleted successfully' });
    } catch (err) {
      next(err);
    }
  },

  /**
   * @swagger
   * /courses/{id}/students:
   *   get:
   *     summary: Get all students enrolled in a course
   *     tags: [Courses]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *     responses:
   *       200:
   *         description: Students in course
   *       404:
   *         description: Course not found
   */
  getStudents(req: Request, res: Response, next: NextFunction): void {
    try {
      const result = EnrollmentService.getCourseStudents(parseId(req.params.id));
      res.status(200).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  },
};

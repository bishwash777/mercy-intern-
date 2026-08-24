import { Request, Response, NextFunction } from 'express';
import { StudentService } from '../services/student.service';
import { EnrollmentService } from '../services/enrollment.service';

const parseId = (id: string | string[]): number => parseInt(Array.isArray(id) ? id[0] : id, 10);

export const StudentController = {
  /**
   * @swagger
   * /students:
   *   get:
   *     summary: Get all students
   *     tags: [Students]
   *     parameters:
   *       - in: query
   *         name: search
   *         schema:
   *           type: string
   *         description: Search by student name
   *       - in: query
   *         name: page
   *         schema:
   *           type: integer
   *         description: Page number (default 1)
   *       - in: query
   *         name: limit
   *         schema:
   *           type: integer
   *         description: Items per page (default 10)
   *       - in: query
   *         name: sortBy
   *         schema:
   *           type: string
   *           enum: [id, name, email, age, createdAt]
   *         description: Field to sort by
   *       - in: query
   *         name: order
   *         schema:
   *           type: string
   *           enum: [asc, desc]
   *         description: Sort order
   *     responses:
   *       200:
   *         description: Paginated list of students
   */
  getAll(req: Request, res: Response, next: NextFunction): void {
    try {
      const { search, page, limit, sortBy, order } = req.query;
      const result = StudentService.getAll({
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
   * /students/{id}:
   *   get:
   *     summary: Get student by ID
   *     tags: [Students]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *     responses:
   *       200:
   *         description: Student found
   *       404:
   *         description: Student not found
   */
  getById(req: Request, res: Response, next: NextFunction): void {
    try {
      const student = StudentService.getById(parseId(req.params.id));
      res.status(200).json({ success: true, data: student });
    } catch (err) {
      next(err);
    }
  },

  /**
   * @swagger
   * /students:
   *   post:
   *     summary: Create a new student
   *     tags: [Students]
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/CreateStudent'
   *     responses:
   *       201:
   *         description: Student created
   *       409:
   *         description: Email or phone already exists
   */
  create(req: Request, res: Response, next: NextFunction): void {
    try {
      const student = StudentService.create(req.body);
      res.status(201).json({ success: true, message: 'Student created successfully', data: student });
    } catch (err) {
      next(err);
    }
  },

  /**
   * @swagger
   * /students/{id}:
   *   put:
   *     summary: Update a student
   *     tags: [Students]
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
   *             $ref: '#/components/schemas/UpdateStudent'
   *     responses:
   *       200:
   *         description: Student updated
   *       404:
   *         description: Student not found
   */
  update(req: Request, res: Response, next: NextFunction): void {
    try {
      const student = StudentService.update(parseId(req.params.id), req.body);
      res.status(200).json({ success: true, message: 'Student updated successfully', data: student });
    } catch (err) {
      next(err);
    }
  },

  /**
   * @swagger
   * /students/{id}:
   *   delete:
   *     summary: Soft-delete a student
   *     tags: [Students]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *     responses:
   *       200:
   *         description: Student deleted
   *       404:
   *         description: Student not found
   */
  delete(req: Request, res: Response, next: NextFunction): void {
    try {
      StudentService.delete(parseId(req.params.id));
      res.status(200).json({ success: true, message: 'Student deleted successfully' });
    } catch (err) {
      next(err);
    }
  },

  /**
   * @swagger
   * /students/{id}/courses:
   *   get:
   *     summary: Get all courses of a student
   *     tags: [Students]
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: integer
   *     responses:
   *       200:
   *         description: Courses of student
   *       404:
   *         description: Student not found
   */
  getCourses(req: Request, res: Response, next: NextFunction): void {
    try {
      const result = EnrollmentService.getStudentCourses(parseId(req.params.id));
      res.status(200).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  },
};

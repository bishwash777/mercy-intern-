import { CourseModel } from '../models/course.model';
import { EnrollmentModel } from '../models/enrollment.model';
import { ICourse, ICreateCourseDTO, IUpdateCourseDTO } from '../interfaces/course.interface';
import { AppError } from '../utils/AppError';

export interface CourseQueryOptions {
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  order?: 'asc' | 'desc';
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export const CourseService = {
  /**
   * Get all courses with optional search, pagination, and sorting.
   */
  getAll(options: CourseQueryOptions = {}): PaginatedResult<ICourse> {
    const { search, page = 1, limit = 10, sortBy = 'id', order = 'asc' } = options;

    let courses = CourseModel.getAll();

    // Search by title or description (case-insensitive)
    if (search) {
      const q = search.toLowerCase();
      courses = courses.filter(
        (c) => c.title.toLowerCase().includes(q) || c.description.toLowerCase().includes(q)
      );
    }

    // Sorting
    const validSortFields = ['id', 'title', 'duration', 'createdAt'];
    const field = validSortFields.includes(sortBy) ? sortBy : 'id';
    courses.sort((a, b) => {
      const valA = (a as any)[field];
      const valB = (b as any)[field];
      if (typeof valA === 'string' && typeof valB === 'string') {
        const comp = valA.localeCompare(valB, undefined, { sensitivity: 'base' });
        return order === 'asc' ? comp : -comp;
      }
      if (valA < valB) return order === 'asc' ? -1 : 1;
      if (valA > valB) return order === 'asc' ? 1 : -1;
      return 0;
    });

    const total = courses.length;
    const totalPages = Math.ceil(total / limit);
    const start = (page - 1) * limit;
    const paginated = courses.slice(start, start + limit);

    return { data: paginated, total, page, limit, totalPages };
  },

  /**
   * Get a single course by ID.
   */
  getById(id: number): ICourse {
    const course = CourseModel.getById(id);
    if (!course) throw new AppError(`Course with ID ${id} not found`, 404);
    return course;
  },

  /**
   * Create a new course.
   */
  create(data: ICreateCourseDTO): ICourse {
    return CourseModel.create({
      title: data.title,
      description: data.description || '',
      duration: data.duration,
    });
  },

  /**
   * Update an existing course.
   */
  update(id: number, data: IUpdateCourseDTO): ICourse {
    CourseService.getById(id);
    const updated = CourseModel.update(id, data);
    if (!updated) throw new AppError(`Course with ID ${id} not found`, 404);
    return updated;
  },

  /**
   * Soft-delete a course and clean up its enrollments.
   */
  delete(id: number): void {
    const deleted = CourseModel.softDelete(id);
    if (!deleted) throw new AppError(`Course with ID ${id} not found`, 404);
    EnrollmentModel.deleteByCourseId(id);
  },
};

import { StudentModel } from '../models/student.model';
import { EnrollmentModel } from '../models/enrollment.model';
import { IStudent, ICreateStudentDTO, IUpdateStudentDTO } from '../interfaces/student.interface';
import { AppError } from '../utils/AppError';

export interface StudentQueryOptions {
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

export const StudentService = {
  /**
   * Get all students with optional search, pagination, and sorting.
   */
  getAll(options: StudentQueryOptions = {}): PaginatedResult<IStudent> {
    const { search, page = 1, limit = 10, sortBy = 'id', order = 'asc' } = options;

    let students = StudentModel.getAll();

    // Search by name (case-insensitive)
    if (search) {
      const q = search.toLowerCase();
      students = students.filter((s) => s.name.toLowerCase().includes(q));
    }

    // Sorting
    const validSortFields = ['id', 'name', 'email', 'age', 'createdAt'];
    const field = validSortFields.includes(sortBy) ? sortBy : 'id';
    students.sort((a, b) => {
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

    const total = students.length;
    const totalPages = Math.ceil(total / limit);
    const start = (page - 1) * limit;
    const paginated = students.slice(start, start + limit);

    return { data: paginated, total, page, limit, totalPages };
  },

  /**
   * Get a single student by ID.
   */
  getById(id: number): IStudent {
    const student = StudentModel.getById(id);
    if (!student) throw new AppError(`Student with ID ${id} not found`, 404);
    return student;
  },

  /**
   * Create a new student after uniqueness checks.
   */
  create(data: ICreateStudentDTO): IStudent {
    if (StudentModel.findByEmail(data.email)) {
      throw new AppError('Email is already in use', 409);
    }
    if (StudentModel.findByPhone(data.phone)) {
      throw new AppError('Phone number is already in use', 409);
    }
    return StudentModel.create(data);
  },

  /**
   * Update an existing student.
   */
  update(id: number, data: IUpdateStudentDTO): IStudent {
    // Ensure student exists
    StudentService.getById(id);

    // Check email uniqueness (exclude current student)
    if (data.email) {
      const existing = StudentModel.findByEmail(data.email);
      if (existing && existing.id !== id) {
        throw new AppError('Email is already in use', 409);
      }
    }

    // Check phone uniqueness (exclude current student)
    if (data.phone) {
      const existing = StudentModel.findByPhone(data.phone);
      if (existing && existing.id !== id) {
        throw new AppError('Phone number is already in use', 409);
      }
    }

    const updated = StudentModel.update(id, data);
    if (!updated) throw new AppError(`Student with ID ${id} not found`, 404);
    return updated;
  },

  /**
   * Soft-delete a student and clean up their enrollments.
   */
  delete(id: number): void {
    const deleted = StudentModel.softDelete(id);
    if (!deleted) throw new AppError(`Student with ID ${id} not found`, 404);
    EnrollmentModel.deleteByStudentId(id);
  },
};

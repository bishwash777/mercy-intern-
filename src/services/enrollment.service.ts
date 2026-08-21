import { EnrollmentModel } from '../models/enrollment.model';
import { StudentModel } from '../models/student.model';
import { CourseModel } from '../models/course.model';
import { AppError } from '../utils/AppError';

export const EnrollmentService = {
  /**
   * Get all enrollments, populated with student and course info.
   */
  getAll() {
    const enrollments = EnrollmentModel.getAll();
    return enrollments.map((e) => {
      const student = StudentModel.getById(e.studentId);
      const course = CourseModel.getById(e.courseId);
      return {
        id: e.id,
        enrolledAt: e.enrolledAt,
        student: student ? { id: student.id, name: student.name } : null,
        course: course ? { id: course.id, title: course.title } : null,
      };
    });
  },

  /**
   * Enroll a student in a course.
   */
  enroll(studentId: number, courseId: number) {
    // Validate student exists
    const student = StudentModel.getById(studentId);
    if (!student) throw new AppError(`Student with ID ${studentId} not found`, 404);

    // Validate course exists
    const course = CourseModel.getById(courseId);
    if (!course) throw new AppError(`Course with ID ${courseId} not found`, 404);

    // Check duplicate enrollment
    const existing = EnrollmentModel.findByStudentAndCourse(studentId, courseId);
    if (existing) {
      throw new AppError(
        `Student "${student.name}" is already enrolled in course "${course.title}"`,
        409
      );
    }

    const enrollment = EnrollmentModel.create(studentId, courseId);
    return {
      id: enrollment.id,
      enrolledAt: enrollment.enrolledAt,
      student: { id: student.id, name: student.name },
      course: { id: course.id, title: course.title },
    };
  },

  /**
   * Get all courses for a specific student.
   */
  getStudentCourses(studentId: number) {
    const student = StudentModel.getById(studentId);
    if (!student) throw new AppError(`Student with ID ${studentId} not found`, 404);

    const enrollments = EnrollmentModel.getByStudentId(studentId);
    const courses = enrollments
      .map((e) => CourseModel.getById(e.courseId))
      .filter((c): c is NonNullable<typeof c> => c !== undefined);

    return {
      student: student.name,
      courses: courses.map((c) => c.title),
    };
  },

  /**
   * Get all students for a specific course.
   */
  getCourseStudents(courseId: number) {
    const course = CourseModel.getById(courseId);
    if (!course) throw new AppError(`Course with ID ${courseId} not found`, 404);

    const enrollments = EnrollmentModel.getByCourseId(courseId);
    const students = enrollments
      .map((e) => StudentModel.getById(e.studentId))
      .filter((s): s is NonNullable<typeof s> => s !== undefined);

    return {
      course: course.title,
      students: students.map((s) => ({ id: s.id, name: s.name, email: s.email })),
    };
  },

  /**
   * Delete an enrollment by ID.
   */
  delete(id: number): void {
    const enrollment = EnrollmentModel.getById(id);
    if (!enrollment) throw new AppError(`Enrollment with ID ${id} not found`, 404);
    EnrollmentModel.delete(id);
  },
};

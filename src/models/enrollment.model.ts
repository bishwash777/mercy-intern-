import { IEnrollment } from '../interfaces/enrollment.interface';

let enrollments: IEnrollment[] = [];
let idCounter = 1;

export const EnrollmentModel = {
  getAll(): IEnrollment[] {
    return enrollments;
  },

  getById(id: number): IEnrollment | undefined {
    return enrollments.find((e) => e.id === id);
  },

  findByStudentAndCourse(studentId: number, courseId: number): IEnrollment | undefined {
    return enrollments.find((e) => e.studentId === studentId && e.courseId === courseId);
  },

  getByStudentId(studentId: number): IEnrollment[] {
    return enrollments.filter((e) => e.studentId === studentId);
  },

  getByCourseId(courseId: number): IEnrollment[] {
    return enrollments.filter((e) => e.courseId === courseId);
  },

  create(studentId: number, courseId: number): IEnrollment {
    const enrollment: IEnrollment = {
      id: idCounter++,
      studentId,
      courseId,
      enrolledAt: new Date(),
    };
    enrollments.push(enrollment);
    return enrollment;
  },

  delete(id: number): boolean {
    const index = enrollments.findIndex((e) => e.id === id);
    if (index === -1) return false;
    enrollments.splice(index, 1);
    return true;
  },

  deleteByStudentId(studentId: number): void {
    enrollments = enrollments.filter((e) => e.studentId !== studentId);
  },

  deleteByCourseId(courseId: number): void {
    enrollments = enrollments.filter((e) => e.courseId !== courseId);
  },

  seed(initialEnrollments: { studentId: number; courseId: number }[]): void {
    if (enrollments.length === 0) {
      initialEnrollments.forEach((e) => this.create(e.studentId, e.courseId));
    }
  },

  clear(): void {
    enrollments = [];
    idCounter = 1;
  },
};

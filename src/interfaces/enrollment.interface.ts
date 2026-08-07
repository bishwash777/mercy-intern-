export interface IEnrollment {
  id: number;
  studentId: number;
  courseId: number;
  enrolledAt: Date;
}

export interface ICreateEnrollmentDTO {
  studentId: number;
  courseId: number;
}

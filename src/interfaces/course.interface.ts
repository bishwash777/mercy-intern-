export interface ICourse {
  id: number;
  title: string;
  description: string;
  duration: string;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICreateCourseDTO {
  title: string;
  description?: string;
  duration: string;
}

export interface IUpdateCourseDTO {
  title?: string;
  description?: string;
  duration?: string;
}

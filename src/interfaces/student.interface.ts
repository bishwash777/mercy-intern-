export interface IStudent {
  id: number;
  name: string;
  email: string;
  phone: string;
  age: number;
  isDeleted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICreateStudentDTO {
  name: string;
  email: string;
  phone: string;
  age: number;
}

export interface IUpdateStudentDTO {
  name?: string;
  email?: string;
  phone?: string;
  age?: number;
}
